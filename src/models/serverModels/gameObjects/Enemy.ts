import { GameObject } from "./GameObject";

export class Enemy extends GameObject {

    width: number = 100

    height: number = 100

    originXpos: number;

    movingRange: number

    xSpeed: number

    constructor(xPos: number, yPos: number) {
        super(xPos, yPos)

        this.originXpos = xPos
        this.movingRange = 400
        this.xSpeed = -5
    }

}