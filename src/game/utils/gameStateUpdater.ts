import { GameRoom } from "../interfaces/gameState";

let gameState: GameRoom;



const move = () => {

    gameState.players.forEach((player) => {
        if (gameState.pressedKeys.left) {
            player.xSpeed = -player.movementSpeed
        } else if (gameState.pressedKeys.right) {
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
            if (platform.intersects(player)) {
                player.ySpeed = -player.maxSpeed
            }
        })
    })
}

const applyGravity = () => {
    const updatedPlayers = gameState.players.map(player => {
        player.y = player.y + player.ySpeed
        player.ySpeed += player.gravity
        return player
    });

    gameState.players = updatedPlayers
}


export const updateGameState = (state: GameRoom): GameRoom => {

    gameState = state

    applyGravity();
    collide();
    move();

    return gameState
}