const { buildContainer } = require("../container");
const { RawOfferSchema } = require("../schemas/offer.schema");

(async () => {
    const container = buildContainer();
    const offerService = container.resolve("offerService");

    const logger = container.resolve("logger");
    const config = container.resolve("config");
    const cache = container.resolve("cache");
    const db = container.resolve("db");

    logger.info("###### Starting updateOffers job ######");

    try {
        let response = await fetch(
            config.JOBS_API_AUTH_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials",
                    client_id: config.JOBS_API_CLIENT_ID,
                    client_secret: config.JOBS_API_SECRET_KEY,
                    scope: "api_offresdemploiv2 o2dsoffre"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`The authentication has failed: ${response.statusText}`);
        }

        const authData = await response.json();
        const accessToken = authData.access_token;

        const searchUrl = new URL(config.JOBS_API_URL);

        // Looking for offers in the cities of Paris, Rennes et Bordeaux
        const communes = ["75101", "35238", "33063"];
        for (const code of communes) {
            searchUrl.searchParams.append("commune", code);
        }

        // TODO: Ajouter une date de début pour ne pas récupérer toutes les offres à chaque fois.
        // TODO: idéalement, il faudrait appeler le repository pour séparer les responsabilités
        const lastExecution = await db.then(db => db.get(
            "SELECT MAX(last_update) as last_update FROM t_jobs_execution_history WHERE job_name = ? ORDER BY last_update DESC LIMIT 1",
            ["update-offers"]
        ));

        if (lastExecution && lastExecution["last_update"]) {
            const maxDate = new Date();
            const lastDate = new Date(lastExecution["last_update"]);

            const [formattedMinDate, formattedMaxDate] = [lastDate, maxDate].map(date => {
                // Sans millisecondes
                return date.toISOString().replace(/\.\d{3}Z$/, "Z");
            });

            searchUrl.searchParams.append("minCreationDate", formattedMinDate);
            searchUrl.searchParams.append("maxCreationDate", formattedMaxDate);
        }

        // TODO: revoir comment paramétrer les messages sans passer par la concaténation
        logger.info("Searching offers updated with URL: " + searchUrl.toString());

        response = await fetch(
            searchUrl,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`An error occured when fetching the jobs: ${data.message}`);
        }

        if (response.status === 204) {
            logger.info("No new offers since the last execution.");
            return;
        }

        const offersData = await response.json();
        const validatedOffers = [];
        const rejectedOffers = [];

        for (const offer of offersData.resultats) {
            const validated = await RawOfferSchema.safeParseAsync(offer);

            if (validated.success) {
                validatedOffers.push(validated.data);
            } else {
                const error = `
                    Issues: ${JSON.stringify(validated.error.issues)}
                    Offer: ${JSON.stringify(offer)}
                `
                logger.error("Offer validation failed:", validated.error.issues);
                logger.error(error);

                rejectedOffers.push(offer);
            }
        }

        if (validatedOffers.length) {
            // TODO: Mettre la clé dans une constante
            cache.del("all_offers");
            await offerService.importOffers(validatedOffers);
        }

        logger.info(`Fetched ${offersData.length} job offers from the API. ${rejectedOffers.length} offers were rejected during validation.`);

    } catch (error) {
        logger.error("Error in updateOffers job:", error);
    }

    logger.info("###### Ending updateOffers job ######");

})();