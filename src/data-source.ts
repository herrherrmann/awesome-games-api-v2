import { DataSource } from "typeorm";
import { AuthInfo } from "./entities/AuthInfo.ts";

export const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [AuthInfo],
});
