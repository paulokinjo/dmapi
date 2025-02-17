//src/treasures/treasureFactory.ts
import TreasureRepository from "../repositories/treasureRepository.js"
import TreasureService from "../services/treasureService.js"

const createTreasureInstance = () => {
    const treasureRepository = new TreasureRepository()
    const treasureService = new TreasureService(treasureRepository)
    return treasureService
}

export {
    createTreasureInstance
}