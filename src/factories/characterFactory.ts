//src/factories/characterFactory.ts
import CharacterRepository from "../repositories/characterRepository.js"
import CharacterService from "../services/characterService.js"

const createCharacterInstance = () => {
    const characterRepository = new CharacterRepository()
    const characterService = new CharacterService(characterRepository)
    return characterService
}

export {
    createCharacterInstance
}