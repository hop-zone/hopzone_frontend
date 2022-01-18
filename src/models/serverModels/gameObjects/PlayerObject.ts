import { GameObject } from "./GameObject"

export class PlayerObject extends GameObject {

    width: number
    height: number
    xSpeed: number
    ySpeed: number
    maxSpeed: number
    movementSpeed: number
    uid: string
    displayName: string

    constructor(xPos: number, yPos: number, uid: string, displayName: string) {

        super(xPos, yPos)
        this.maxSpeed = 15
        this.movementSpeed = 10
        this.width = 50
        this.height = 50
        this.xSpeed = 0
        this.ySpeed = 0
        this.uid = uid
        this.displayName = displayName

    }
}