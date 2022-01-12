import { Platform } from "../models/platform"
import p5Types from 'p5'
const amountOfPlaforms = 500

export const generateLevel = (p5: p5Types): Platform[] => {
    const platforms: Platform[] = []
    for (let i = 0; i < amountOfPlaforms; i++) {

        const platform = new Platform(p5, getRandomInt(-1000, 1000), getRandomInt(0, -10000))
        platforms.push(platform)
    }

    return platforms
}


function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}