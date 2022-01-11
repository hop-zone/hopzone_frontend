import { GameObject } from './gameObject';

export class Platform extends GameObject {

    width: number = 100
    height: number = 10
    show() {
        this.p5.fill(255)
        
        this.p5.rect(this.x, this.y, this.width, this.height)
    }

    move() {
        this.x++;
    }
}