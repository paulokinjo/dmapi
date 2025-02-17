import { describe, test, after, before } from "node:test";
import assert from "node:assert";
import { promisify } from "node:util";

describe('Dungeon Game integration test suite', () => {
    const testPort = 3000;
    const gameEndpoint = `http://localhost:${testPort}/api/games`;
    const characterEndpoint = `http://localhost:${testPort}/api/characters`;
    const monsterEndpoint = `http://localhost:${testPort}/api/monsters`;
    const treasureEndpoint = `http://localhost:${testPort}/api/treasures`;

    let server: any;
    let gameId: string;
    let character1Id: string;
    let character2Id: string;
    let monster1Id: string;
    let monster2Id: string;
    let treasure1Id: string;
    let treasure2Id: string;

    before(async () => {
        // Import the server and start it  
        const { server: importedServer } = await import('../../dist/index.js');
        server = importedServer;
    });

    after(async () => {

        await fetch(`${gameEndpoint}/${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${characterEndpoint}/${character1Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${characterEndpoint}/${character2Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${monsterEndpoint}/${monster1Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${monsterEndpoint}/${monster2Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${treasureEndpoint}/${treasure1Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${treasureEndpoint}/${treasure2Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        await fetch(`${gameEndpoint}/${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        // Close the server after all tests are done  
        await promisify(server.close.bind(server))();
    });

    describe('Simulate E2E Game Flow', async () => {

        test('it should create the game', async () => {
            const request = await fetch(gameEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.deepStrictEqual(request.headers.get('content-type'), 'application/json');
            assert.strictEqual(request.status, 201);

            const result = await request.json();
            assert.ok(result.id.length > 30);
            gameId = result.id;
        });

        test('it should create player1', async () => {
            const request = await fetch(characterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Player1",
                    abilities: ["Archery", "Stealth"]
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            character1Id = result.id;
        });

        test('it should create player2', async () => {
            const request = await fetch(characterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Player2",
                    abilities: ["Wizard", "Magic"]
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            character2Id = result.id;
        });

        test('it should add characters to the game', async () => {
            const addCharacterEndpoint = `http://localhost:${testPort}/api/games/${gameId}/characters/${character1Id}`;
            // Add first character to the game  
            const request1 = await fetch(addCharacterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request1.status, 200);

            // Add second character to the game  
            const addCharacterEndpoint2 = `http://localhost:${testPort}/api/games/${gameId}/characters/${character2Id}`;
            const request2 = await fetch(addCharacterEndpoint2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request2.status, 200);
        });

        test('it should retrieve the game state', async () => {
            const gameStateEndpoint = `http://localhost:${testPort}/api/games/${gameId}`;

            const request = await fetch(gameStateEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.deepStrictEqual(result.state, "setup");
        });

        test('it should create Orc monster', async () => {
            const request = await fetch(monsterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Orc",
                    health: 100,
                    attackPower: 20,
                    position: { x: 5, y: 6 }
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            monster1Id = result.id; // Save the first monster ID  
        });

        test('it should create Dragon monster', async () => {
            const request = await fetch(monsterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Dragon",
                    health: 300,
                    attackPower: 50,
                    position: { x: 10, y: 15 }
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            monster2Id = result.id; // Save the second monster ID  
        });

        test('it should add monsters to the game', async () => {
            const addMonsterEndpoint = `http://localhost:${testPort}/api/games/${gameId}/monsters/${monster1Id}`;
            // Add first monster to the game  
            const request1 = await fetch(addMonsterEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request1.status, 200);

            // Add second monster to the game  
            const addMonsterEndpoint2 = `http://localhost:${testPort}/api/games/${gameId}/monsters/${monster2Id}`;
            const request2 = await fetch(addMonsterEndpoint2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request2.status, 200);
        });


        test('it should create Golden Sword treasure', async () => {
            const request = await fetch(treasureEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Golden Sword",
                    value: 500,
                    position: { x: 3, y: 3 }
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            treasure1Id = result.id;
        });

        test('it should create Healing Potion treasure', async () => {
            const request = await fetch(treasureEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "Healing Potion",
                    value: 50,
                    position: { x: 7, y: 8 }
                }),
            });

            assert.strictEqual(request.status, 201);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            treasure2Id = result.id;
        });

        test('it should add treasures to the game', async () => {
            const addTreasuresEndpoint = `http://localhost:${testPort}/api/games/${gameId}/treasures/${treasure1Id}`;
            const request1 = await fetch(addTreasuresEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request1.status, 200);

            const addTreasuresEndpoint2 = `http://localhost:${testPort}/api/games/${gameId}/treasures/${treasure2Id}`;
            const request2 = await fetch(addTreasuresEndpoint2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            assert.strictEqual(request2.status, 200);
        });

        test('it should START the game', async () => {
            const gameEndpoint = `http://localhost:${testPort}/api/games/${gameId}`;
            const body = {
                state: "running"
            }

            const request = await fetch(gameEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.deepEqual(result.state, "running")
        });

        test('it should move player to a new position (monster position)', async () => {
            const updateCharacterEndpoint = `http://localhost:${testPort}/api/games/${gameId}/characters/${character1Id}`;

            const moveTo = { x: 5, y: 6 };
            const request = await fetch(updateCharacterEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ position: moveTo }),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            assert.deepEqual(result.players[0].position, moveTo)
        });

        test('it should start a battle between player and monster', async () => {
            const gameEndpoint = `http://localhost:${testPort}/api/games/${gameId}`;

            const body = {
                combat: { monsterId: monster1Id, damage: 50 }
            }

            const request = await fetch(gameEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.deepEqual(result.monsters[0].health, 50)
        });

        test('it should move player to a new position (treasure position)', async () => {
            const updateCharacterEndpoint = `http://localhost:${testPort}/api/games/${gameId}/characters/${character1Id}`;

            const moveTo = { x: 3, y: 3 };
            const request = await fetch(updateCharacterEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ position: moveTo }),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.ok(result.id.length > 30);
            assert.deepEqual(result.players[0].position, moveTo)
        });

        test('it should collect a treasure', async () => {
            const gameEndpoint = `http://localhost:${testPort}/api/games/${gameId}`;
            const body = {
                inventory: { treasureId: treasure1Id, characterId: character1Id }
            }

            const request = await fetch(gameEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.deepEqual(result.treasures.length, 1)
            assert.deepEqual(result.players[0].inventory[0].id, body.inventory.treasureId)
        });

        test('it should END the game', async () => {
            const gameEndpoint = `http://localhost:${testPort}/api/games/${gameId}`;
            const body = {
                state: "gameOver"
            }

            const request = await fetch(gameEndpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            assert.strictEqual(request.status, 200);
            const result = await request.json();
            assert.deepEqual(result.state, "gameOver")
        });
    });
}); 
