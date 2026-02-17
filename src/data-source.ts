import { DataSource } from "typeorm";
import { AuthInfo } from "./entities/AuthInfo.js";
import { Game } from "./entities/Game.js";

export const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [AuthInfo, Game],
});
