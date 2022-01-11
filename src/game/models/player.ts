import p5Types from 'p5'
import { GameObject } from './gameObject';


export class Player extends GameObject {

    width: number = 50
    height: number = 50

    show() {
        this.p5.rect(this.x, this.y, this.width, this.height)
    }
}