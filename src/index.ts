import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import "reflect-metadata";
import { dataSource } from "./data-source.ts";

try {
  await dataSource.initialize();
} catch (e) {
  console.log(e);
}

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
