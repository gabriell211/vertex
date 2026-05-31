import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// CSP Inteligente (Smart CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; connect-src 'self' ws: wss: https://api.mercadolibre.com https://*.supabase.co wss://*.supabase.co https://grymkuvfdsgptrjjqyre.supabase.co; frame-src 'self';"
  );
  next();
});

// Mock Mercado Livre Integration API
app.get('/api/mercadolivre/products', (req, res) => {
  // Simulating a response from Mercado Livre API
  res.json({
    status: 'success',
    data: [
      {
        id: 'ML-001',
        title: 'Vertex Core | Framework Premium v2.0',
        price: 299.90,
        currency_id: 'BRL',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
        permalink: 'https://mercadolivre.com.br'
      },
      {
        id: 'ML-002',
        title: 'Vertex Inventory | Inventário Avançado',
        price: 149.90,
        currency_id: 'BRL',
        thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600',
        permalink: 'https://mercadolivre.com.br'
      },
      {
        id: 'ML-003',
        title: 'Vertex Police | Sistema Policial Completo',
        price: 189.90,
        currency_id: 'BRL',
        thumbnail: 'https://images.unsplash.com/photo-1453873531674-2151bcd01707?auto=format&fit=crop&q=80&w=600',
        permalink: 'https://mercadolivre.com.br'
      },
      {
         id: 'ML-004',
         title: 'Vertex Bank | Sistema Bancário Sync',
         price: 119.90,
         currency_id: 'BRL',
         thumbnail: 'https://images.unsplash.com/photo-1616077168712-fc6c788db4af?auto=format&fit=crop&q=80&w=600',
         permalink: 'https://mercadolivre.com.br'
      }
    ]
  });
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
