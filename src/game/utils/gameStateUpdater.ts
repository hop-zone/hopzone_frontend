import { platform } from "os";
import { GameRoom } from "../interfaces/gameState";
import { Platform } from "../models/platform";
import { Player } from "../models/player";
import p5Types from 'p5'

let gameState: GameRoom;
let p5: p5Types;
const worldWidth = 2000;




const move = (player: Player, index: number) => {

    //apply gravity
    player.y = player.y + player.ySpeed
    player.ySpeed += player.gravity

    //Listen to player movement input
    if (gameState.pressedKeys.left && player.topLeft.x > -worldWidth / 2) {
        player.xSpeed = -player.movementSpeed
    } else if (gameState.pressedKeys.right && player.topLeft.x < worldWidth / 2) {
        player.xSpeed = +player.movementSpeed
    } else {
        player.xSpeed = 0
    }
    player.x += player.xSpeed;

}

const collide = (player: Player) => {
    gameState.platforms.forEach((platform) => {
        if (player.intersects(platform) && player.ySpeed > 0) {
            player.ySpeed = -player.maxSpeed
        }
    })
}

const updateOuterPlatforms = (platform: Platform) => {
    if (gameState.lowestPlatform) {
        if (platform.y > gameState.lowestPlatform.y) {
            gameState.lowestPlatform = platform
        }
    } else {
        gameState.lowestPlatform = platform
    }

    if (gameState.highestPlatform) {
        if (platform.y < gameState.highestPlatform.y) {
            gameState.highestPlatform = platform
        }
    } else {
        gameState.highestPlatform = platform
    }
}

const updateOuterPlayers = (player: Player) => {
    //Update highest position
    if (gameState.highestPlayer) {
        if (player.y < gameState.highestPlayer.y) {
            gameState.highestPlayer.y = player.y
        }
    } else {
        gameState.highestPlayer = player
    }

    //Update lowest position
    if (gameState.lowestPlayer) {
        if (player.y > gameState.lowestPlayer.y) {
            gameState.lowestPlayer.y = player.y
        }
    } else {
        gameState.lowestPlayer = player
    }
}

const generatePlatforms = () => {
    if (gameState.highestPlayer!.y < gameState.highestPlatform!.y + 100) {
        for (let i = 0; i < 4; i++) {
            const newPlatform: Platform = new Platform(getRandomInt(-1000, 1000), getRandomInt(gameState.highestPlatform!.y, gameState.highestPlatform!.y - 100))
            gameState.platforms.push(newPlatform)
        }

    }

    if (gameState.lowestPlayer!.y < gameState.lowestPlatform!.y + -500) {
        gameState.platforms = gameState.platforms.filter((p: Platform) => {
            return p.id != gameState.lowestPlatform?.id
        })
    }
}

const resetPositions = () => {
    gameState.lowestPlayer = undefined
    gameState.highestPlayer = undefined
    gameState.lowestPlatform = undefined
    gameState.highestPlatform = undefined
}


export const updateGameState = (state: GameRoom, ctx: p5Types): GameRoom => {

    gameState = state
    p5 = ctx

    resetPositions();


    gameState.players.forEach((player, index) => {
        move(player, index)
        collide(player)
        updateOuterPlayers(player)
    })

    gameState.platforms.forEach((platform) => {
        updateOuterPlatforms(platform)
    })
    generatePlatforms()

    return gameState
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}