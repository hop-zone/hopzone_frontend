import { Platform } from "../models/platform";
import { Player } from "../models/player";

interface KeysPressed {
    left: boolean,
    right: boolean
}

export interface GameRoom {
    players: Player[]
    platforms: Platform[]
    pressedKeys: KeysPressed
}