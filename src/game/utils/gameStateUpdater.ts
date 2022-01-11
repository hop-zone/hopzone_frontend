import { GameRoom } from "../interfaces/gameState";

let gameState: GameRoom;
const worldWidth = 2000;


const move = () => {

    gameState.players.forEach((player) => {
        //apply gravity
        player.y = player.y + player.ySpeed
        player.ySpeed += player.gravity

        //Listen to player movement input
        if (gameState.pressedKeys.left && player.topLeft.x > -worldWidth/2) {
            player.xSpeed = -player.movementSpeed
        } else if (gameState.pressedKeys.right && player.topLeft.x < worldWidth/2) {
            player.xSpeed = +player.movementSpeed
        } else {
            player.xSpeed = 0
        }
        player.x += player.xSpeed;
    })
}

const collide = () => {
    gameState.platforms.forEach((platform) => {
        gameState.players.forEach((player) => {
            if (platform.intersects(player) && player.ySpeed > 0) {
                player.ySpeed = -player.maxSpeed
            }
        })
    })
}



export const updateGameState = (state: GameRoom): GameRoom => {

    gameState = state
    collide();
    move();

    return gameState
}