import { GameObject } from "./gameObject"
import p5Types from 'p5'


export class BoostedPlatform extends GameObject {

    width: number = 120

    height: number = 30

    boostedSpeed: number = 25

    show = (p5: p5Types) => {
        p5.fill(255, 0, 0)

        p5.rect(this.x, this.y, this.width, this.height)
    }
    
}