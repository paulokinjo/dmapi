// src/services/GameService.ts
import Game from "../entities/Game";
import GameRepository from "../repositories/gameRepository";
import BaseService from "./BaseService";
import Character from "../entities/Character";
import CharacterRepository from "../repositories/characterRepository";
import MonsterRepository from "../repositories/monsterRepository";
import TreasureRepository from "../repositories/treasureRepository";
import Monster from "../entities/Monster";
import Treasure from "../entities/Treasure";

export default class GameService extends BaseService<Game> {
    constructor(
        public gameRepository: GameRepository,
        public characterRepository: CharacterRepository,
        public monsterRepository: MonsterRepository,
        public treasureRepository: TreasureRepository
    ) {
        super(gameRepository);
    }

    findById(gameId: string) {
        const { id, players, monsters, treasures, state } = super.findById(gameId);
        return new Game(id, players, monsters, treasures, state)
    }

    create(game: Game) {
        const uniqueCharacters = game.players.filter((character, index, self) =>
            index === self.findIndex(c => c.id === character.id)
        );
        game.players = uniqueCharacters;

        return this.repository.create(game);
    }

    update(gameId: string, data: Game) {
        const uniqueCharacters = data.players.filter((character, index, self) =>
            index === self.findIndex(c => c.id === character.id)
        );
        data.players = uniqueCharacters;

        this.repository.update(gameId, data);
    }

    findCharacterById(id: string) {
        const characterData = this.characterRepository.findById(id);
        if (characterData) {
            return new Character(
                characterData.name,
                characterData.abilities,
                characterData.id,
                characterData.health,
                characterData.position,
                characterData.inventory
            );
        }
        return undefined;
    }

    findMonsterById(monsterId: string) {
        const { id, name, health, attackPower, position } = this.monsterRepository.findById(monsterId);
        return new Monster(name, health, attackPower, position, id)
    }

    findTreasureById(treasureId: string) {
        const { name, value, position, id } = this.treasureRepository.findById(treasureId);
        return new Treasure(name, value, position, id)
    }
}
