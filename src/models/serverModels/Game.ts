import { Platform } from "./gameObjects/Platform";
import { PlayerObject } from "./gameObjects/PlayerObject";

export interface Game {
    players: PlayerObject[]
    deadPlayers: PlayerObject[]
    platforms: Platform[]
}