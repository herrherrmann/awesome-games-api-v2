import { Game } from "../entities/Game.js";

export type GitHubGame = Pick<
    Game,
    "name" | "originalName" | "type" | "links" | "isFree"
>;
