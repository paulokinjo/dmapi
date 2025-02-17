// src/repositories/gameRepository.ts
import Game from '../entities/Game';
import BaseRepository from './baseRepository';

export default class GameRepository extends BaseRepository<Game> {
  constructor() {
    super('games.json');
  }
}
