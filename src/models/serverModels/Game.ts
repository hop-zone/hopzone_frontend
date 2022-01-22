import { BoostedPlatform } from "./gameObjects/BoostedPlatform";
import { MovingPlatform } from "./gameObjects/MovingPlatform";
import { Platform } from "./gameObjects/Platform";
import { PlayerObject } from "./gameObjects/PlayerObject";

export interface Game {
    players: PlayerObject[]
    platforms: Platform[]
    movingPlatforms: MovingPlatform[]
    boostedPlatforms: BoostedPlatform[]
    alivePlayers: number
    deadPlayers: number
}