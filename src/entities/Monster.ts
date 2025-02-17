// src/entities/Monster.ts
import { randomUUID } from 'crypto';

export default class Monster {
  constructor(
    public name: string,
    public health: number,
    public attackPower: number,
    public position: { x: number; y: number },
    public id = randomUUID(),
  ) {}

  takeDamage(amount: number) {
      this.health -= amount;
  }
}
