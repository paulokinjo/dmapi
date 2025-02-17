// src/routes/gameRoutes.treasures.ts
import { DEFAULT_HEADER } from '../../utils/util';
import GameService from '../../services/gameService';
import { createGameInstance } from '../../factories/gameFactory';
import Treasure from '../../entities/Treasure';

const gameService: GameService = createGameInstance()

export const gameTreasuresRoutes = {
    '/api/games/{gameId}/treasures/{treasureId}:post': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const game = gameService.findById(gameId);
        if (!game) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
            res.end();
            return;
        }

        const treasureId = req.url?.split('/')[5]
        const treasure: Treasure = gameService.findTreasureById(treasureId)
        if (treasure) {
            game.treasures.push(treasure)
            gameService.update(gameId, game);
            res.writeHead(200, DEFAULT_HEADER);
            res.write(JSON.stringify(game));
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Treasure not found' }));
        }

        res.end();
    },
};
