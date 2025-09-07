import { asClass, asFunction, asValue, createContainer } from "awilix";

import { getDb } from "../db/index.js";
import logger from "../config/logger.js";
import config from "../config/index.js";
import OfferRepository from "../repositories/offer.repo.sqlite.js";
import OfferService from "../services/offer.service.js";

export const buildContainer = () => {
    const container = createContainer({ injectionMode: "CLASSIC" });

    container.register({
        config: config(config),
        logger: asValue(logger),
        db: asFunction(getDb).singleton(),

        // Repositories
        offerRepository: asClass(OfferRepository).singleton(),

        // Services
        offerService: asClass(OfferService).scoped()
    });

    return container;
};