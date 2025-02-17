// src/repositories/characterRepository.ts
import Character from '../entities/Character';
import BaseRepository from './baseRepository';

export default class CharacterRepository extends BaseRepository<Character> {
  constructor() {
    super('characters.json');
  }
}
