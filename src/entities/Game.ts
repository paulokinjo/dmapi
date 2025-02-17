// src/entities/Game.ts
import { randomUUID } from 'crypto';
import Character from './Character';
import Monster from './Monster';
import Treasure from './Treasure';

export default class Game {
  constructor(
    public id = randomUUID(),
    public players: Character[] = [],
    public monsters: Monster[] = [],
    public treasures: Treasure[] = [],
    public state: GameState = GameState.Setup
  ) { }

  hasCharacter(characterId: string): boolean {
    return this.players.some(player => player.id === characterId);
  }

  addCharacter(character: Character): boolean {
    if (this.hasCharacter(character.id)) {
      return false; // Character already exists  
    }
    this.players.push(character);
    return true;
  }

  moveCharacter(id: string, character: Character) {
    const characterIndex = this.players.findIndex(p => p.id === id)
    this.players[characterIndex].position = character.position
  }

  updateMonsterHealth(monster: Monster) {
    const monsterIndex = this.monsters.findIndex(m => m.id === monster.id)
    this.monsters[monsterIndex].health = monster.health
  }

  collectItemForCharacter(characterId: string, treasureId: string) {
    const treasure: Treasure = this.treasures.find(t => t.id === treasureId)
    if (!treasure) {
      throw new Error("Treasure not found.")
    }

    const character: Character = this.players.find(p => p.id === characterId)
    if (!character) {
      throw new Error("character not found.")
    }

    character.inventory.push(treasure)

    this.treasures = this.treasures.filter(t => t.id !== treasureId)
  }
}

export enum GameState {
  Setup = 'setup',
  Running = 'running',
  GameOver = 'gameOver',
}  