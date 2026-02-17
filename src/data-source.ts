import { DataSource } from "typeorm";
import { AuthInfo } from "./entities/AuthInfo.ts";
import { Game } from "./entities/Game.ts";

export const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [AuthInfo, Game],
});
