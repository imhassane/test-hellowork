const Bree = require("bree");
const path = require("node:path");
const logger = require("../config/logger");

const bree = new Bree({
    root: path.join(path.dirname(__filename), ""),
    defaultExtension: "js",
    logger: logger,
    jobs: [
        { name: "update-offers", interval: "every 5 mins" }
    ]
});

logger.info("Starting job scheduler...");
bree.start();