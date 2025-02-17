//src/factories/monsterFactory.ts
import MonsterRepository from "../repositories/monsterRepository.js"
import MonsterService from "../services/monsterService.js"

const createMonsterInstance = () => {
    const monsterRepository = new MonsterRepository()
    const monsterService = new MonsterService(monsterRepository)
    return monsterService
}

export {
    createMonsterInstance
}