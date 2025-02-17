//src/routes/treasureRoutes.ts
import { once } from 'node:events';
import { DEFAULT_HEADER } from '../utils/util';
import { createTreasureInstance } from '../factories/treasureFactory';
import Treasure from '../entities/Treasure';

const treasureService = createTreasureInstance()

export const treasureRoutes = {
  '/api/treasures:get': async (_, res) => {
    const treasures = treasureService.findAll();
    res.writeHead(200, DEFAULT_HEADER);
    res.write(JSON.stringify({ treasures }));
    res.end();
  },

  '/api/treasures/{treasureId}:put': async (req, res) => {
    const treasureId = req.url?.split('/')[3];
    const [data] = await once(req, 'data');

    treasureService.update(treasureId, JSON.parse(data));
    res.writeHead(200, DEFAULT_HEADER);
    res.write(JSON.stringify({ message: 'Treasure updated successfully' }));
    res.end();
  },

  '/api/treasures:post': async (req, res) => {
    const [data] = await once(req, 'data');
    const { name, value, position } = JSON.parse(data);

    const monster = new Treasure(name, value, position);
    const id = treasureService.create(monster);

    const locationUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/treasures/${id}`;

    res.writeHead(201, {
      ...DEFAULT_HEADER,
      'Location': locationUrl
    });

    res.write(JSON.stringify(monster));
    res.end();
  },

  '/api/treasures/{treasureId}:delete': async (req, res) => {
    const treasureId = req.url?.split('/')[3];
    treasureService.delete(treasureId);
    res.writeHead(200, DEFAULT_HEADER);
    res.end();
  },
};
