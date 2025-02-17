// src/services/MonsterService.ts
import Monster from "../entities/Monster";
import MonsterRepository from "../repositories/monsterRepository";
import BaseService from "./BaseService";

export default class MonsterService extends BaseService<Monster> {
    constructor(monsterRepository: MonsterRepository) {
        super(monsterRepository);
    }

    create(monster: Monster) {
        if (this.hasMonsterWithName(monster.name)) {
            throw new Error(`A monster with the name '${monster.name}' already exists.`);
        }
        return this.repository.create(monster);
    }

    hasMonsterWithName(name: string): boolean {
        const monsters = this.repository.findAll();
        return monsters.some(monster => monster.name === name);
    }
}
