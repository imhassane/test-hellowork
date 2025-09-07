class OfferService {
    constructor(offerRepository, logger) {
        this.offerRepository = offerRepository;
        this.logger = logger;
    }

    /**
     * Inserts multiple offers into the database.
     * @param {Array<RawOfferSchema>} offers - List of offers fetched from API to insert in DB
     * @return void
     */
    async importOffers(offers) {
        this.logger.info(`Importing ${offers.length} offers...`);
        await this.offerRepository.bulkCreate(offers);
        this.logger.info(`Importing offers done.`);
    }

    /**
     * Gets all offers from db with a limit
     * @param {number} limit - Maximum number of offers to return
     * @returns OfferSchema[] - List of offers
     */
    async getAllOffers(limit) {
        return this.offerRepository.findAll(limit);
    }

    /**
     * Gets a single offer by its code
     * @param {string} code - Code of the offer to retrieve
     * @returns OfferSchema | null - The offer with the given code
     */
    async getOfferByCode(code) {
        return this.offerRepository.findByCode(code);
    }
}

module.exports = OfferService;