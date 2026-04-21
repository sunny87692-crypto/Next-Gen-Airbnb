# Auth Service

A starter Node.js Fastify auth service for the NWXT roadmap app.

## Usage

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Set `JWT_SECRET` in `.env`
4. Run in development: `npm run dev`
5. Health endpoint: `GET /health`

## Notes

- The auth service listens on port `4001` by default.
- Frontend can connect to this service using `NEXT_PUBLIC_API_BASE_URL=http://localhost:4001`.
- Protected profile endpoint: `GET /profile` requires a valid JWT in the `Authorization: Bearer <token>` header.
