export default class OfferRepository {
    constructor(db, logger) {
        this.db = db;
        this.logger = logger;
    }

    /**
     * Inserts multiple offers into the database.
     * @param {Array<RawOfferSchema>} offers - List of offers fetched from API to insert in DB
     */
    async bulkCreate(offers) {
        const db = await this.db;

        await db.exec("BEGIN TRANSACTION");
    
        try {
            const stmt = await db.prepare(`
                INSERT OR IGNORE INTO t_offers_off (
                    code,
                    city_code,
                    city_name,
                    title,
                    description,
                    created_at,
                    contract_type,
                    company_name
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            for (const offer of offers) {
                await stmt.run([
                    offer.id,
                    offer.lieuTravail?.codePostal,
                    offer.lieuTravail?.libelle,
                    offer.intitule,
                    offer.description,
                    offer.dateCreation.toISOString(),
                    offer.typeContrat,
                    offer.entreprise.nom
                ]);
            }

            await db.exec("COMMIT");

        } catch (error) {
            await db.exec("ROLLBACK");

            this.logger.error("Error during bulk insert of offers:", error);
            throw error;
        }
        finally {
            await stmt.finalize();
        }
    }

    _mapDbToSchema(row) {
        return {
            code: row.code,
            title: row.title,
            description: row.description,
            createdAt: new Date(row.created_at),
            contractType: row.contract_type,
            company: {
                name: row.company_name
            },
            city: {
                code: row.city_code,
                name: row.city_name
            }
        };
    }

    /**
     * Fetches all offers from the database, limited by the specified number.
     * @param {number} limit - Maximum number of offers to return
     * @returns OfferSchema[]
     */
    async findAll(limit = 50) {
        const db = await this.db;

        const rows = await db.all(
            `SELECT
                code,
                title,
                description,
                created_at,
                contract_type,
                company_name,
                city_code,
                city_name
             FROM t_offers_off
             ORDER BY created_at DESC
             LIMIT ?`,
            [limit]
        );

        return rows.map(this._mapDbToSchema) || [];
    }

    /**
     * Fetches a single offer by its unique code.
     * @param {string} code - The unique code of the offer
     * @returns OfferSchema or null if not found
     */
    async findByCode(code) {
        const db = await this.db;

        const row = await db.get(
            `SELECT code,
                    title,
                    description,
                    created_at,
                    contract_type,
                    company_name,
                    city_code,
                    city_name
             FROM t_offers_off
             WHERE code = ?`,
            [code]
        );

        return row ? this._mapDbToSchema(row) : null;
    }

}