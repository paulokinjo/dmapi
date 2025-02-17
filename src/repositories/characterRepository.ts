// src/repositories/characterRepository.ts
import Character from '../entities/Character';
import BaseRepository from './BaseRepository';

export default class CharacterRepository extends BaseRepository<Character> {
  constructor() {
    super('characters.json');
  }
}
