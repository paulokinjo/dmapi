// src/services/TreasureService.ts
import Treasure from "../entities/Treasure";
import TreasureRepository from "../repositories/treasureRepository";
import BaseService from "./BaseService";

export default class TreasureService extends BaseService<Treasure> {
    constructor(treasureRepository: TreasureRepository) {
        super(treasureRepository);
    }

    create(treasure: Treasure) {
        if (this.hasTreasureWithName(treasure.name)) {
            throw new Error(`A treasure with the name '${treasure.name}' already exists.`);
        }
        return this.repository.create(treasure);
    }

    hasTreasureWithName(name: string): boolean {
        const treasures = this.repository.findAll();
        return treasures.some(treasure => treasure.name === name);
    }
}
