
## 📜 **Dungeon Master API - A Fantasy RPG Backend**  
**A RESTful API for simulating a Dungeon Master-style fantasy game.**  
Supports **game creation, character management, monster encounters, treasure collection, combat mechanics, and inventory updates.**  

### 🎯 **Objective**  
This API enables clients (mobile & web apps) to:  
✔️ Start and manage game sessions  
✔️ Create and control characters  
✔️ Spawn and update monsters  
✔️ Collect treasures and track inventory  
✔️ Move characters and resolve battles  
---

## ⚙️ **Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/paulokinjo/dmapi
cd dmapi
```

### **2️⃣ Install Dependencies**  
```sh
npm install
```

### **3️⃣ Start the Server**  
```sh
npm start
```
The API runs on **`http://localhost:3000`** by default.

---

## 📌 **Endpoints Overview**  

### 🕹 **Game Management**
| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| `POST` | `/games`               | Create a new game session           |
| `GET`  | `/games/{gameId}`       | Retrieve game state                 |
| `PUT`  | `/games/{gameId}`       | Update game state (move, combat, etc.) |

#### **Example: Start a Game**
```sh
curl -X POST http://localhost:3000/games
```
#### **Response**
```json
{
  "id": "dd47257d-cd08-43ba-8f77-16fd194eb773",
  "players": [],
  "monsters": [],
  "treasures": [],
  "state": "setup"
}
```

---

### 🏹 **Character Management**
| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| `POST` | `/characters`             | Create a new character          |
| `GET`  | `/characters/{characterId}` | Retrieve character details     |

#### **Example: Create a Character**
```sh
curl -X POST http://localhost:3000/characters -d '{"name": "Aragorn", "abilities": ["sword", "leadership"]}' -H "Content-Type: application/json"
```
#### **Response**
```json
{
  "name": "Aragorn",
  "abilities": [
    "sword",
    "leadership"
  ],
  "id": "3b7e6c09-79ec-4187-b02d-a86aee6ca58a",
  "health": 100,
  "position": {
    "x": 0,
    "y": 0
  },
  "inventory": []
}
```

---

### 🐉 **Monster Management**
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| `GET`  | `/monsters`               | List all monsters              |
| `PUT`  | `/monsters/{monsterId}`    | Update monster (damage, etc.)  |

#### **Example: Update Monster Health**
```sh
curl -X PUT http://localhost:3000/monsters/xyz123 -d '{"health": 50}' -H "Content-Type: application/json"
```

---

### 💰 **Treasure Management**
| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| `GET`  | `/treasures`                | List all treasures          |
| `POST` | `/treasures/{treasureId}`    | Update treasure status      |

---

## 🎮 **Game Actions**  

### 🚶 Move Character  
```sh
curl -X PUT http://localhost:3000/games/1234-5678-90 -d '{"position": {"x": 5, "y": 3}}' -H "Content-Type: application/json"
```

### ⚔️ Attack a Monster  
```sh
curl -X PUT http://localhost:3000/games/1234-5678-90 -d '{"combat": {"monsterId": "xyz123", "damage": 20}}' -H "Content-Type: application/json"
```

### 🏆 Collect a Treasure  
```sh
curl -X PUT http://localhost:3000/games/1234-5678-90 -d '{"inventory": inventory: { treasureId: treasure1Id, characterId: character1Id }}' -H "Content-Type: application/json"
```

---

## 🛠 **Project Structure**
```
/src
  ├── entities/
  │   ├── Game.ts
  │   ├── Character.ts
  │   ├── Monster.ts
  │   ├── Treasure.ts
  ├── factories/
  │   ├── characterFactory.ts
  │   ├── gameFactory.ts
  │   ├── monsterFactory.ts
  │   ├── treasureFactory.ts
  ├── repositories/
  │   ├── baseRepository.ts
  │   ├── characterRepository.ts
  │   ├── gameRepository.ts
  │   ├── monsterRepository.ts
  │   ├── treasureRepository.ts
  ├── routes/
  │   ├── game
  │   ├──────├── gameRoutes.characters.ts
  │   ├──────├── gameRoutes.monsters.ts
  │   ├──────├── gameRoutes.treasures.ts
  │   ├── characterRoutes.ts
  │   ├── monsterRoutes.ts
  │   ├── treasureRoutes.ts
  ├── utils/
  │   ├── util.ts
  ├── handler.ts
  ├── index.ts
```

---

## 📜 **Tests**
# Dungeon Game Integration Test Suite

## Overview

The server is running at:  
[http://localhost:3000](http://localhost:3000)

This is the result of running the Dungeon Game integration test suite, which simulates the End-to-End (E2E) game flow.

## Test Summary

### Simulate E2E Game Flow

- **Create the Game**  
  ✔ it should create the game (43.9763ms)

- **Create Players**  
  ✔ it should create player1 (6.0913ms)  
  ✔ it should create player2 (3.8565ms)

- **Add Characters to the Game**  
  ✔ it should add characters to the game (7.7478ms)

- **Retrieve Game State**  
  ✔ it should retrieve the game state (2.8809ms)

- **Create Monsters**  
  ✔ it should create Orc monster (4.9816ms)  
  ✔ it should create Dragon monster (3.1494ms)  
  ✔ it should add monsters to the game (7.8784ms)

- **Create Treasures**  
  ✔ it should create Golden Sword treasure (3.8701ms)  
  ✔ it should create Healing Potion treasure (3.0002ms)  
  ✔ it should add treasures to the game (6.1313ms)

- **Start the Game**  
  ✔ it should START the game (5.5492ms)

- **Move Players and Simulate Interactions**  
  ✔ it should move player to a new position (monster position) (3.8833ms)  
  ✔ it should start a battle between player and monster (3.177ms)  
  ✔ it should move player to a new position (treasure position) (2.9012ms)  
  ✔ it should collect a treasure (2.6631ms)

- **End the Game**  
  ✔ it should END the game (3.0321ms)

### Test Summary Stats

- **Total Tests**: 17
- **Total Suites**: 2
- **Passes**: 17
- **Fails**: 0
- **Cancelled**: 0
- **Skipped**: 0
- **Todos**: 0

### Duration

- **Total Duration**: 243.4144ms
- **Simulate E2E Game Flow Duration**: 116.0813ms
- **Dungeon Game Suite Duration**: 179.0594ms

---

### **🚀 Future Improvements**
- **WebSocket Integration** for real-time gameplay  
- **More character abilities & monster AI**  
- **Multiplayer support**  
