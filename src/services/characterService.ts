// src/services/CharacterService.ts
import Character from "../entities/Character";
import CharacterRepository from "../repositories/characterRepository";
import BaseService from "./BaseService";

export default class CharacterService extends BaseService<Character> {
    constructor(characterRepository: CharacterRepository) {
        super(characterRepository);
    }

    create(character: Character) {
        if (this.hasCharacterWithName(character.name)) {
            throw new Error(`A character with the name '${character.name}' already exists.`);
        }
        return this.repository.create(character);
    }

    hasCharacterWithName(name: string): boolean {
        const characters = this.repository.findAll();
        return characters.some(character => character.name === name);
    }
}
