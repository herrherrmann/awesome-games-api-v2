import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import "reflect-metadata";
import { dataSource } from "./data-source.ts";
import { GamesService } from "./games/service.ts";

try {
    await dataSource.initialize();
} catch (e) {
    console.log(e);
}

const app = new Hono();

const gamesService = new GamesService();

app.get("/games", async (c) => {
    const games = await gamesService.getGames();
    return c.json(games);
});

serve(
    {
        fetch: app.fetch,
        port: Number(process.env.PORT) || 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
