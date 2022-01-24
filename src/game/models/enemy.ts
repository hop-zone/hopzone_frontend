import { GameObject } from "./gameObject";

import p5Types from 'p5'


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

    show = (p5: p5Types) => {
        p5.fill(0, 0, 255)

        p5.rect(this.x, this.y, this.width, this.height)
    };


}