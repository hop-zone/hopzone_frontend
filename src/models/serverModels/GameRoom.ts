import { Game } from "./Game";
import { User } from "./User";


export interface GameRoom {
    roomId: number
    game: string
    hostId: string
    players: User[]
    hasStarted: boolean
}

