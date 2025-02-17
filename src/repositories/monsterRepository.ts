// src/repositories/monsterRepository.ts
import Monster from '../entities/Monster';
import BaseRepository from './BaseRepository';

export default class MonsterRepository extends BaseRepository<Monster> {
  constructor() {
    super('monsters.json');
  }
}
