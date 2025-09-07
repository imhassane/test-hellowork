const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const config = require("../config");
const logger = require("../config/logger");

let dbPromise;

const getDb = async () => {
    if (!dbPromise) {
        dbPromise = open({ filename: config.DB_NAME, driver: sqlite3.Database })
            .then((db) => {
                logger.info("Connected to the database.");
                
                // Initialisation des tables (on passerait pas des migratiions idéalement)
                db.exec(`
                    CREATE TABLE IF NOT EXISTS t_offers_off (
                        id              INTEGER PRIMARY KEY AUTOINCREMENT,
                        code            VARCHAR(10) NOT NULL UNIQUE,
                        city_code       INTEGER NOT NULL,
                        city_name       VARCHAR(100) NOT NULL,
                        title           VARCHAR(255) NOT NULL,
                        description     TEXT NOT NULL,
                        created_at      DATETIME NOT NULL,
                        contract_type   VARCHAR(10) NOT NULL,
                        company_name    VARCHAR(50) NOT NULL
                    );

                    CREATE INDEX IF NOT EXISTS idx_city_code ON t_offers_off(city_code);
                    CREATE INDEX IF NOT EXISTS idx_city_name ON t_offers_off(city_name);
                    CREATE INDEX IF NOT EXISTS idx_contract_type ON t_offers_off(contract_type);
                `);

                return db;
            })
            .catch((err) => {
                logger.error("Failed to connect to the database:", err);
                throw err;
            });
    }
    return dbPromise;
}

module.exports = { getDb };
