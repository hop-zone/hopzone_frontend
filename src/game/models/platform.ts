import { GameObject } from './gameObject';
import p5Types from 'p5'

export class Platform extends GameObject {

    width: number = 100
    height: number = 10
    show(p5: p5Types) {
        p5.fill(255)
        
        p5.rect(this.x, this.y, this.width, this.height)
    }

    move() {
        this.x++;
    }
}