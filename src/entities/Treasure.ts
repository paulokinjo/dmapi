// src/entities/Treasure.ts
import { randomUUID } from 'crypto';

export default class Treasure {
  constructor(
    public name: string,
    public value: number,
    public position: { x: number; y: number },
    public id = randomUUID()
  ) {}
}