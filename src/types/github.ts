import { Game } from "../entities/Game.ts";

export type GitHubGame = Pick<
  Game,
  "name" | "originalName" | "type" | "links" | "isFree"
>;
