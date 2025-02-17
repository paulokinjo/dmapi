// src/routes/gameRoutes.ts
import { once } from 'node:events';
import Game, { GameState } from '../../entities/Game';
import GameService from '../../services/gameService';
import { DEFAULT_HEADER } from '../../utils/util';
import { gameCharactersRoutes } from './gameRoutes.characters'
import { createGameInstance } from '../../factories/gameFactory';
import { gameMonstersRoutes } from './gameRoutes.monsters';
import { gameTreasuresRoutes } from './gameRoutes.treasures';
import Monster from '../../entities/Monster';

const gameService: GameService = createGameInstance();

export const gameRoutes = {
    '/api/games:post': async (req, res) => {
        const game = new Game();
        const id = gameService.create(game);
        const locationUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/games/${id}`;

        res.writeHead(201, {
            ...DEFAULT_HEADER,
            'Location': locationUrl
        });
        res.write(JSON.stringify(game));
        res.end();
    },

    '/api/games:get': async (_, res) => {
        const games = gameService.findAll();
        res.writeHead(200, DEFAULT_HEADER);
        res.write(JSON.stringify({ games }));
        res.end();
    },

    '/api/games/{gameId}:delete': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        gameService.delete(gameId);
        res.writeHead(200, DEFAULT_HEADER);
        res.end();
    },

    '/api/games/{gameId}:get': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const game = gameService.findById(gameId);
        if (game) {
            res.writeHead(200, DEFAULT_HEADER);
            res.write(JSON.stringify(game));
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
        }
        res.end();
    },

    '/api/games/{gameId}:put': async (req, res) => {
        const gameId = req.url?.split('/')[3];
        const [data] = await once(req, 'data');
        const game: Game = gameService.findById(gameId);
        if (!game) {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Game not found' }));
            res.end();
            return;
        }

        const updateData = JSON.parse(data);
        if (updateData.state) {
            if (
                (updateData.state === GameState.GameOver && game.state !== GameState.Running) ||
                (updateData.state === GameState.Running && game.state !== GameState.Setup)
            ) {
                res.writeHead(400, DEFAULT_HEADER);
                res.write(JSON.stringify({ error: `Invalid game state transition from ${game.state} to ${updateData.state}` }));
                res.end();
                return;
            }

            game.state = updateData.state;
        }

        // Handle combat (reduce monster health)
        if (updateData.combat) {
            const { monsterId, damage } = updateData.combat;
            const monster: Monster = gameService.findMonsterById(monsterId);
            if (monster) {
                monster.takeDamage(damage)

                game.updateMonsterHealth(monster)

                if (monster.health <= 0) {
                    game.monsters = game.monsters.filter(id => id !== monsterId);
                }
            }
        }

        // Handle inventory (treasure collection)
        if (updateData.inventory) {
            const { characterId, treasureId } = updateData.inventory;
            try {
                const character = game.players.find(p => p.id === characterId)
                if (!character) {
                    throw new Error("Character not found.")
                }

                const treasure = game.treasures.find(t => t.id === treasureId)
                if (!treasure) {
                    throw new Error("Treasure not found.")
                }

                if (treasure.position.x !== character.position.x && treasure.position.y !== character.position.y) {
                    throw new Error("Character it not close to the treasure")
                }

                game.collectItemForCharacter(characterId, treasureId)
            } catch (error) {
                res.writeHead(400, DEFAULT_HEADER);
                res.write(JSON.stringify(error));
                res.end();
                return;
            }

        }

        gameService.update(gameId, game);
        res.writeHead(200, DEFAULT_HEADER);
        res.write(JSON.stringify(game));
        res.end();
    },
    ...gameCharactersRoutes,
    ...gameMonstersRoutes,
    ...gameTreasuresRoutes,
};
