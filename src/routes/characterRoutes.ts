import { once } from 'node:events';
import Character from '../entities/Character';
import { DEFAULT_HEADER } from '../utils/util';
import { createCharacterInstance } from '../factories/characterFactory';
import CharacterService from '../services/characterService';

const characterService: CharacterService = createCharacterInstance();

export const characterRoutes = {
    '/api/characters:post': async (req, res) => {
        const [data] = await once(req, 'data');
        const { name, abilities } = JSON.parse(data);
        const character = new Character(name, abilities);
        const id = characterService.create(character);

        const locationUrl = `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/api/characters/${id}`;

        res.writeHead(201, {
            ...DEFAULT_HEADER,
            'Location': locationUrl
        });

        res.write(JSON.stringify(character));
        res.end();
    },


    '/api/characters:get': async (_, res) => {
        const characters = characterService.findAll();
        res.writeHead(200, DEFAULT_HEADER);
        res.write(JSON.stringify({ characters }));
        res.end();
    },

    '/api/characters/{characterId}:delete': async (req, res) => {
        const characterId = req.url?.split('/')[3];
        characterService.delete(characterId);
        res.writeHead(200, DEFAULT_HEADER);
        res.end();
    },

    '/api/characters/{characterId}:get': async (req, res) => {
        const characterId = req.url?.split('/')[3];
        const character = characterService.findById(characterId);

        if (character) {
            res.writeHead(200, DEFAULT_HEADER);
            res.write(JSON.stringify(character));
        } else {
            res.writeHead(404, DEFAULT_HEADER);
            res.write(JSON.stringify({ error: 'Character not found' }));
        }
        res.end();
    }
};  