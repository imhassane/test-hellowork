import { open } from "sqlite";
import config from "../config";
import logger from "../config/logger";

let dbPromise;

export const getDb = async () => {
    if (!dbPromise) {
        dbPromise = open({ filename: config.DB_NAME, driver: sqlite3.Database })
            .then((db) => {
                logger.info("Connected to the database.");
                
                // Initialisation des tables (on passerait pas des migratiions idéalement)
                db.exec(`
                    CREATE TABLE IF NOT EXISTS t_offers_off (
                        id              NUMBER PRIMARY KEY AUTOINCREMENT,
                        code            VARCHAR(10) NOT NULL UNIQUE,
                        city_code       NUMBER NOT NULL,
                        city_name       VARCHAR(100) NOT NULL,
                        title           VARCHAR(255) NOT NULL,
                        description     TEXT NOT NULL,
                        created_at      DATETIME NOT NULL,
                        contract_type   VARCHAR(10) NOT NULL,
                        company_name    VARCHAR(50) NOT NULL,

                        INDEX idx_city_code (city_code),
                        INDEX idx_city_name (city_name),
                        INDEX idx_contract_type (contract_type)
                    );
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