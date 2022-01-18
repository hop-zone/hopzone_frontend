
import { GameObject } from './gameObject';
import p5Types from 'p5'

export class Player extends GameObject {

    width: number = 50
    height: number = 50
    xSpeed: number = 0
    ySpeed: number = 0
    maxSpeed: number = 15
    movementSpeed: number = 10
    uid: string
    highestPosition: number
    get deathBarrierYpos() {
        return this.highestPosition + 1000
    }


    constructor(xPos: number, yPos: number, uid: string, highestPosition?: number) {
        super(xPos, yPos)
        this.highestPosition = highestPosition || 0
        this.uid = uid
    }

    show(p5: p5Types) {
        p5.fill(this.color)
        p5.rect(this.x, this.y, this.width, this.height)

    }

    showBarrier(p5: p5Types) {
        p5.fill(255, 0, 0)
        p5.rect(0, this.deathBarrierYpos, 2000, 10)
    }
}