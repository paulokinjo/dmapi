// src/entities/Character.ts
import { randomUUID } from 'crypto';
import Treasure from './Treasure';

export default class Character {
    constructor(
        public name: string,
        public abilities: string[],
        public id: string = randomUUID(),
        public health: number = 100,
        public position: { x: number; y: number } = { x: 0, y: 0 },
        public inventory: Treasure[] = []
    ) { }

    move(moveTo: { position: { x: number; y: number } }) {
        this.position = moveTo.position
    }
} 