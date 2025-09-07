import 'dotenv/config';

export default {
    DB_NAME: process.env.DB_NAME ?? "db.sqlite",
    PORT: process.env.PORT ?? 3000,
    env: process.env.NODE_ENV ?? "development",
}