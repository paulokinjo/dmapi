// src/index.ts
import http from 'node:http';
import handler from './handler';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const server = http.createServer(handler).listen(process.env.SERVER_PORT, () =>
  console.log(`Server is running at ${process.env.SERVER_URL}:${process.env.SERVER_PORT}`)
);

export {
  server
}