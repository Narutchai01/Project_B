import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    DB_URL: string;
    JWT_SECRET: string;
}

export const config: Config = {
    port: Number(process.env.PORT) || 3000,
    DB_URL: String(process.env.DB_URL),
    JWT_SECRET: String(process.env.JWT_SECRET)
};
