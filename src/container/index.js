const { asClass, asFunction, asValue, createContainer } = require("awilix");

const { getDb } = require("../db/index.js");
const logger = require("../config/logger.js");
const config = require("../config/index.js");
const OfferRepository = require("../repositories/offer.repo.sqlite.js");
const OfferService = require("../services/offer.service.js");
const OfferController = require("../controllers/offer.controller.js");
const cache = require("../config/cache.js");

const buildContainer = () => {
    const container = createContainer({ injectionMode: "CLASSIC" });

    container.register({
        config: asValue(config),
        logger: asValue(logger),
        db: asFunction(getDb).singleton(),
        cache: asValue(cache),

        // Repositories
        offerRepository: asClass(OfferRepository).singleton(),

        // Services
        offerService: asClass(OfferService).scoped(),

        // Controllers
        offerController: asClass(OfferController).scoped()
    });

    return container;
};

module.exports = { buildContainer };