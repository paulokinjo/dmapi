// src/handler.ts
import { IncomingMessage, ServerResponse } from 'node:http';
import { parse, UrlWithParsedQuery } from 'node:url';
import { DEFAULT_HEADER } from './utils/util';
import { gameRoutes } from './routes/game/gameRoutes';
import { characterRoutes } from './routes/characterRoutes';
import { monsterRoutes } from './routes/monsterRoutes';
import { treasureRoutes } from './routes/treasureRoutes';

interface ServerRoutes {
  [key: string]: (request: IncomingMessage, response: ServerResponse) => void;
}

const serverRoutes: ServerRoutes = {
  ...gameRoutes,
  ...characterRoutes,
  ...monsterRoutes,
  ...treasureRoutes,

  default: (request: IncomingMessage, response: ServerResponse): void => {
    response.writeHead(404, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: 'Not Found' }));
    response.end();
  }
};

const matchRoute = (urlPath: string, method: string): string | undefined => {
  const segments = urlPath.split('/').filter(Boolean);
  const normalizedMethod = method.toLowerCase();

  // Check for an exact match first (non-dynamic routes like /games)
  const exactMatch = serverRoutes[`${urlPath}:${normalizedMethod}`];
  if (exactMatch) return `${urlPath}:${normalizedMethod}`;

  // Filter routes by method
  const methodFilteredRoutes = Object.keys(serverRoutes).filter(route =>
    route.endsWith(`:${normalizedMethod}`)
  );

  // Find a route that matches the number of segments
  return methodFilteredRoutes.find(routeKey => {
    const routeParts = routeKey.split('/').filter(Boolean);

    if (routeParts.length !== segments.length) return false;
    if (routeParts[1] !== segments[1]) return false;
    if (routeParts.length > 3 && routeParts[3] !== segments[3]) return false;

    return routeKey
  });
};

const handler = (request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const { url, method } = request;
  const { pathname }: UrlWithParsedQuery = parse(url || '', true);

  // Match the route using the helper function
  const key = matchRoute(pathname || '', method?.toLowerCase());

  // If a route is found, use it; otherwise, use the default route
  const chosen = serverRoutes[key || 'default'];

  return Promise.resolve(chosen(request, response)).catch((error: Error) => {
    console.error('Error:', error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: 'Internal Server Error' }));
    response.end();
  });
};

export default handler;
