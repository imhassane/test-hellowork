const { scopePerRequest, makeInvoker } = require("awilix-express");
const { buildContainer } = require("./container");
const express = require("express");
const compression = require("compression");
const logger = require("./config/logger");
const helmet = require("helmet");

function createApiRoutes(container) {
    const router = express.Router();
    const offers = makeInvoker(() => container.resolve("offerController"));

    router.get("/offers", offers("list"));
    router.get("/offers/:code", offers("detail"));

    return router;
}

function createApp() {
    const app = express();

    const container = buildContainer();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Ajout d'une compression pour réduire la taille des réponses
    app.use(compression());

    // Ajout de headers de sécurité avec Helmet (CSP, HSTS, etc.)
    app.use(helmet());

    app.use(scopePerRequest(container));
    app.use("/api", createApiRoutes(container));

    return app;
}

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});