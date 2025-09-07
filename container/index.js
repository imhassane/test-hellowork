import { createContainer } from "awilix";

import config from "../config/index.js";

export const buildContainer = () => {
    const container = createContainer({ injectionMode: "CLASSIC" });

    container.register({
        config: config(config),
    });

    return container;
};