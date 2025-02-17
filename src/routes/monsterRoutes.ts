//src/routes/monsterRoutes.ts
import { once } from 'node:events';
import { createMonsterInstance } from '../factories/monsterFactory';
import { DEFAULT_HEADER } from '../utils/util';
import Monster from '../entities/Monster';

const monsterService = createMonsterInstance()

export const monsterRoutes = {
  '/api/monsters:get': async (_, res) => {
    const monsters = monsterService.findAll();
    res.writeHead(200, DEFAULT_HEADER);
    res.write(JSON.stringify({ monsters }));
    res.end();
  },

  '/api/monsters/{monsterId}:put': async (req, res) => {
    const monsterId = req.url?.split('/')[3];
    const [data] = await once(req, 'data');

    monsterService.update(monsterId, JSON.parse(data));
    res.writeHead(200, DEFAULT_HEADER);
    res.write(JSON.stringify({ message: 'Monster updated successfully' }));
    res.end();
  },

  '/api/monsters:post': async (req, res) => {
    const [data] = await once(req, 'data');
    const { name, health, attackPower, position } = JSON.parse(data);

    const monster = new Monster(name, health, attackPower, position);
    const id = monsterService.create(monster);

    const locationUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/monsters/${id}`;

    res.writeHead(201, {
      ...DEFAULT_HEADER,
      'Location': locationUrl
    });

    res.write(JSON.stringify(monster));
    res.end();
  },
  '/api/monsters/{monsterId}:delete': async (req, res) => {
    const monsterId = req.url?.split('/')[3];
    monsterService.delete(monsterId);
    res.writeHead(200, DEFAULT_HEADER);
    res.end();
  }
};
