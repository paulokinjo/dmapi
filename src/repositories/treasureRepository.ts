// src/repositories/treasureRepository.ts
import Treasure from '../entities/Treasure';
import BaseRepository from './baseRepository';

export default class TreasureRepository extends BaseRepository<Treasure> {
  constructor() {
    super('treasures.json');
  }
}
