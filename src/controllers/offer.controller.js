class OfferController {
    constructor(offerService, logger) {
        this.offerService = offerService;
        this.logger = logger;
    }

    async list(req, res, next) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const city = req.query.city || null;
            const offers = await this.offerService.getAllOffers(limit, city);

            res.json(offers);
        } catch (error) {
            this.logger.error("Error in list offers:", error);
            next(error);
        }
    };

    async detail(req, res, next) {
        try {
            const code = req.params.code;
            const offer = await this.offerService.getOfferByCode(code);
            if (offer) {
                res.json(offer);
            } else {
                res.status(404).json({ message: `No offer with the code ${code} was found.` });
            }
        } catch (error) {
            this.logger.error("Error in get offer by code:", error);
            next(error);
        }
    };
}

module.exports = OfferController;
