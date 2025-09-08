const NodeCache = require("node-cache");

const cache = new NodeCache();

const useCache = async (key, next) => {
    const cachedData = cache.get(key);
        if (cachedData) {
            return cachedData;
        }
        const data = await next();
        cache.set(key, data);
        return data;
}

module.exports = cache;
module.exports.useCache = useCache;