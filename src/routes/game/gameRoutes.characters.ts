// src/routes/gameRoutes.characters.ts
import { DEFAULT_HEADER } from '../../utils/util';
import GameService from '../../services/gameService';
import { createGameInstance } from '../../factories/gameFactory';
import { once } from 'node:events';
import Character from '../../entities/Character';
import { GameState } from '../../entities/Game';

const gameService: GameService = createGameInstance()

export const gameCharactersRoutes = {
    '/api/games/{gameId}/characters/{characterId}:post': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const game = gameService.findById(gameId);
        if (!game) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
            res.end();
            return;
        }

        if (game.state !== GameState.Setup) {
            res.writeHead(400, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: `Invalid game state ${game.state}` }));
            res.end();
            return;
        }

        const playerId = req.url?.split('/')[5];
        if (game.players.find(p => p.id === playerId)) {
            res.writeHead(400, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Character already in game' }));
            res.end();
            return;
        }

        const character: Character = gameService.findCharacterById(playerId)
        if (character) {
            const [data] = await once(req, 'data');
            character.move(JSON.parse(data))
            game.players.push(character)
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Character not found' }));
            res.end();
            return;
        }

        gameService.update(gameId, game);
        res.writeHead(200, DEFAULT_HEADER);
        res.write(JSON.stringify(game));
        res.end();
    },

    '/api/games/{gameId}/characters/{characterId}:put': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const game = gameService.findById(gameId);
        if (!game) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
            res.end();
            return;
        }

        const playerId = req.url?.split('/')[5];
        if (!game.players.find(p => p.id === playerId)) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Character not found' }));
            res.end();
            return;
        }

        const character: Character = gameService.findCharacterById(playerId)
        if (character) {
            const [data] = await once(req, 'data');
            character.move(JSON.parse(data))

            game.moveCharacter(playerId, character)            
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Character not found' }));
            res.end();
            return;
        }

        gameService.update(gameId, game);
        res.writeHead(200, DEFAULT_HEADER);
        res.write(JSON.stringify(game));
        res.end();
    },
};
