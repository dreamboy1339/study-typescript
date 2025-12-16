# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TypeScript learning platform monorepo with React/Vite frontend and NestJS backend. The backend serves the frontend's static build output and provides API endpoints with Swagger documentation.

**Tech Stack:**
- Frontend: React 18 + Vite + TypeScript + Tailwind + Radix UI
- Backend: NestJS + TypeScript + Swagger
- Package Manager: pnpm (required)

## Development Commands

### Frontend Development
```bash
cd frontend
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (default port 3000)
pnpm run build        # Build to frontend/build/
pnpm run preview      # Preview production build (port 4173)
pnpm run typecheck    # Type check without emitting files
```

### Backend Development
```bash
cd backend
pnpm install          # Install dependencies
pnpm run dev          # Start dev server with hot reload (port 8080, 127.0.0.1)
pnpm run build        # Compile TypeScript to dist/
pnpm start            # Run compiled production build
```

### Full Stack Workflow
```bash
# 1. Build frontend first
cd frontend && pnpm install && pnpm run build

# 2. Then run backend (serves frontend at / and API at /api)
cd ../backend && pnpm install && pnpm run dev
```

### Docker Deployment
```bash
# From repository root
./docker-build.sh     # Builds: docker build -t study-typescript-backend -f backend/Dockerfile .
./docker-run.sh       # Runs: docker run --rm -p 8080:8080 -e PORT=8080 study-typescript-backend

# Or manually:
docker build -t study-typescript-backend -f backend/Dockerfile .
docker run --rm -p 8080:8080 -e PORT=8080 -e HOST=0.0.0.0 study-typescript-backend
```

## Architecture

### Monorepo Structure
This is a monorepo with frontend and backend coexisting. The backend serves the frontend's static build output while also providing API endpoints.

```
ts-study-web/
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── main.tsx          # App entry point
│   │   ├── App.tsx           # Root component with state management
│   │   ├── components/       # UI components (Header, Sidebar, CodeEditor, etc.)
│   │   └── workers/          # Web Worker for sandboxed code execution
│   └── build/                # Build output (served by backend)
├── backend/           # NestJS server
│   ├── src/
│   │   ├── main.ts           # Bootstrap + Swagger + SPA fallback middleware
│   │   ├── app.module.ts     # Module config with ServeStaticModule
│   │   ├── app.controller.ts # API controllers
│   │   └── app.service.ts    # Business logic
│   └── Dockerfile            # Multi-stage build for both frontend + backend
└── docker-*.sh               # Docker convenience scripts
```

### Request Routing Flow
1. `/api/**` → NestJS controllers (e.g., `/api/health`, `/api/docs`)
2. `/api/docs` → Swagger UI
3. Static files (`*.js`, `*.css`, images) → ServeStaticModule serves from `frontend/build`
4. All other GET requests (no extension) → `index.html` for SPA client-side routing

### Backend Architecture
- **main.ts**: Application bootstrap with ValidationPipe, Swagger setup, and SPA fallback middleware
- **app.module.ts**: Registers ServeStaticModule to serve `frontend/build` at root (excludes `/api/*`)
- **app.controller.ts**: API endpoints with Swagger decorators
- **app.service.ts**: Business logic layer

**Environment Variables:**
- `PORT`: Server port (default: 8080)
- `HOST`: Bind address (default: 127.0.0.1 in dev, 0.0.0.0 in Docker)

### Frontend Architecture
- **Single Page Application** with no router library (state-based page switching)
- **State Management**: React useState for UI state, localStorage for persistence
- **Code Execution**: Web Worker (`workers/sandbox-worker.ts`) runs user code in isolated thread
- **UI Components**: Radix UI primitives with Tailwind styling in `components/ui/`
- **Main Components**:
  - `Header` / `Footer`: Navigation bars
  - `Sidebar`: Lesson list navigation
  - `LessonContent`: Displays lesson material
  - `CodeEditor`: Interactive code editor with Web Worker execution
  - `ProgressPage`: Shows completed lessons

### Docker Multi-Stage Build
The Dockerfile uses three stages:
1. **frontend-builder**: Builds frontend to `frontend/build/`
2. **backend-builder**: Compiles backend TypeScript and copies frontend build
3. **runner**: Minimal Node 20 Alpine image with production dependencies only

## Key Files

### Configuration
- `backend/tsconfig.json`: Backend TypeScript config
- `frontend/tsconfig.json`: Frontend TypeScript config (strict mode)
- `frontend/vite.config.ts`: Vite build config with SWC plugin, output to `build/`

### Documentation
- `README.md`: High-level project overview
- `backend/ARCHITECTURE.md`: Detailed backend architecture (Android developer friendly)
- `frontend/ARCHITECTURE.md`: Detailed frontend architecture (Android developer friendly)
- `backend/README.md`: Backend-specific setup and API docs
- `frontend/README.md`: Frontend-specific setup docs

## Important Patterns

### When Making Backend Changes
1. API endpoints should be prefixed with `/api` and registered in controllers
2. Always add Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) for documentation
3. Use DTOs with `class-validator` decorators for request validation
4. After changes, verify Swagger docs at `http://localhost:8080/api/docs`

### When Making Frontend Changes
1. Frontend build output must go to `frontend/build/` (configured in vite.config.ts)
2. Backend expects static files in `../frontend/build` relative to backend root
3. All state should be managed through React hooks (useState for UI, localStorage for persistence)
4. CPU-intensive operations should use Web Workers to avoid blocking UI

### Full Deployment Flow
1. Build frontend: `cd frontend && pnpm run build` (creates `frontend/build/`)
2. Build backend: `cd backend && pnpm run build` (creates `backend/dist/`)
3. Start backend: `cd backend && pnpm start` (serves both API and static files on port 8080)

### Docker Deployment Flow
- Single Dockerfile at `backend/Dockerfile` builds both frontend and backend
- Frontend is built first, then copied into backend build stage
- Final image runs `node dist/main.js` and serves everything on port 8080

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/docs` - Swagger API documentation UI
- `GET /` - Serves frontend SPA (index.html)
- `GET /*` - SPA fallback (any non-API route returns index.html for client-side routing)

## Notes

- This project was created for an Android developer learning TypeScript/web development
- Architecture docs use Android analogies (Activity, ViewModel, Fragment, etc.)
- No separate testing infrastructure is configured yet
- No linting tools configured (consider adding ESLint/Prettier in future)
