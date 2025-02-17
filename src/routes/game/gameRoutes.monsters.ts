// src/routes/gameRoutes.monsters.ts
import { DEFAULT_HEADER } from '../../utils/util';
import GameService from '../../services/gameService';
import { createGameInstance } from '../../factories/gameFactory';
import Monster from '../../entities/Monster';

const gameService: GameService = createGameInstance()

export const gameMonstersRoutes = {
    '/api/games/{gameId}/monsters/{monsterId}:post': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const game = gameService.findById(gameId);
        if (!game) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
            res.end();
            return;
        }

        const monsterId = req.url?.split('/')[5]
        const monster: Monster = gameService.findMonsterById(monsterId)
        if (monster) {
            game.monsters.push(monster)
            gameService.update(gameId, game);
            res.writeHead(200, DEFAULT_HEADER);
            res.write(JSON.stringify(game));
            res.end();
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Monster not found' }));
            res.end();
            return;
        }
    }
}
