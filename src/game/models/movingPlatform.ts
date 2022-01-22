import { GameObject } from "./gameObject";
import p5Types from 'p5'

export class MovingPlatform extends GameObject {

    width: number = 120

    height: number = 30

    originXpos: number;

    movingRange: number

    xSpeed: number

    constructor(xPos: number, yPos: number, xSpeed: number) {
        super(xPos, yPos)

        this.originXpos = xPos
        this.movingRange = 40
        this.xSpeed = xSpeed
    }

    show = (p5: p5Types) => {
        p5.fill(255)

        p5.rect(this.x, this.y, this.width, this.height)
    }

}