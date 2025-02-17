//src/factories/gameFactory.ts
import CharacterRepository from "../repositories/characterRepository.js"
import GameRepository from "../repositories/gameRepository.js"
import MonsterRepository from "../repositories/monsterRepository.js"
import TreasureRepository from "../repositories/treasureRepository.js"
import GameService from "../services/gameService.js"

const createGameInstance = () => {
    const gameRepository = new GameRepository()
    const characterRepository = new CharacterRepository()
    const monsterRepository = new MonsterRepository()
    const treasureRepository = new TreasureRepository()
    const gameService = new GameService(gameRepository, characterRepository, monsterRepository, treasureRepository)
    return gameService
}

export {
    createGameInstance
}