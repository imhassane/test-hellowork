const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    DB_NAME: process.env.DB_NAME ?? "db.sqlite",
    PORT: process.env.PORT ?? 3000,
    ENV: process.env.NODE_ENV ?? "development",
    JOBS_API_URL: process.env.JOBS_API_URL,
    JOBS_API_AUTH_URL: process.env.JOBS_API_AUTH_URL,
    JOBS_API_CLIENT_ID: process.env.JOBS_API_CLIENT_ID,
    JOBS_API_SECRET_KEY: process.env.JOBS_API_SECRET_KEY,
}