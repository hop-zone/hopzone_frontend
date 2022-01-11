
import { GameObject } from './gameObject';


export class Player extends GameObject {

    width: number = 50
    height: number = 50
    xSpeed: number = 0
    ySpeed: number = 0
    maxSpeed: number = 15
    movementSpeed: number = 10

    show() {
        this.p5.rect(this.x, this.y, this.width, this.height)
    }
}