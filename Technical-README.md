# Technical README

Engineer-facing documentation for the portfolio codebase.

## Index

- [1. Tech Stack](#1-tech-stack)
- [2. Features](#2-features)
- [3. Project Structure Tree](#3-project-structure-tree)
- [4. Architecture Diagram](#4-architecture-diagram)
- [5. Technical Decisions (Trade-Offs)](#5-technical-decisions-trade-offs)
- [6. How To Build Locally](#6-how-to-build-locally)

## 1. Tech Stack

### Frontend

- React 19
- React Router 7
- Vite 7
- Framer Motion
- Tailwind CSS 4
- Three.js
- Page-level CSS for custom scene composition

### Backend

- Node.js
- Express 5
- `node-fetch`
- `cookie-parser`
- `cors`
- `dotenv`
- `google-auth-library`
- `jsonwebtoken`
- `resend`

### Database

- MongoDB
- Mongoose

### Infrastructure

#### Deployment

- Frontend is deployed as a Vite SPA with [frontend/vercel.json](frontend/vercel.json)
- Backend is deployed separately behind `VITE_API_BASE_URL`
- The live site is served from `liberteii.com`

#### CI/CD

- No formal CI/CD pipeline is currently checked into this repo
- Current quality gates are local build/lint workflows and manual deployment steps

### Testing

- Frontend has ESLint-based static checks
- Frontend production build is used as a verification step
- Backend does not currently contain automated test coverage
- This is a current gap rather than a hidden feature

## 2. Features

### Core Pages

#### Home

- Layered parallax skyline landing page
- Animated homepage NPC interaction
- About section with technical skill presentation
- Public testimonial display

#### Professional Pages

- `/projects` project showcase with route-aware 3D scene support
- `/experience` experience showcase with interactive stacked cards
- Shared professional scene host with route-specific overlays

#### Music Page

- Dedicated route for arrangement, practice, and performance content
- YouTube-backed content retrieval through the backend API layer

### Developer Utilities

#### Image Compression Workflow

- Offline static image optimization with Sharp via [frontend/scripts/optimize-static-images.mjs](frontend/scripts/optimize-static-images.mjs)
- Additional targeted scripts for project thumbnails, project projections, museum textures, and prebaked maps
- Preserves original files and generates sibling optimized assets in `compressed-img/`

#### Mesh CLI Tooling

- `@gltf-transform/cli` is included for asset-processing workflows
- Draco decoder assets are present under [frontend/public/draco](frontend/public/draco)
- Scene assets are stored in compressed mesh variants, including Draco and texture-compressed GLBs

### Platform Services

#### Auth

- Google OAuth integration
- LinkedIn OAuth integration
- Shared user identity handling on the backend

#### Comments

- Authenticated testimonial submission
- Moderated publishing workflow
- Public display separated from admin-facing comment management

#### Email Notification

- Contact form posts to the backend
- Backend sends email notifications through Resend

### Performance

#### Asset Compression

- Static images are compressed offline into WebP variants
- Museum textures and project imagery are pre-optimized instead of transformed at request time

#### Lazy Loading

- Route-level code splitting via `React.lazy` and `Suspense` in [frontend/src/App.jsx](frontend/src/App.jsx)
- Professional scene is initialized only when professional routes are entered

#### Scene Partitioning

- Shared scene shell is separated from route-specific scene payloads
- Experience and project routes load different scene layers instead of one monolithic payload
- See [frontend/src/Components/Scene/design/layer-architecture.md](frontend/src/Components/Scene/design/layer-architecture.md)

#### Texture Optimization

- Compressed texture assets under `compressed-img/`
- Prebaked response maps for walls and floors
- Offline texture preparation scripts reduce runtime work

#### LCP

- The repo includes explicit performance planning around reducing first render work
- See [docs/project/frontend-project-perf.md](docs/project/frontend-project-perf.md)

#### Bundle Size

- Route splitting is in place
- Heavy scene assets are kept outside the main JS bundle when possible
- Large Three.js payloads remain an active optimization area

#### Fast 4G Metrics

- The codebase and docs reflect active optimization for constrained network conditions
- A documented example in experience content references reducing image payloads from multi-megabyte assets to sub-20 KB outputs

#### Desktop FPS

- The scene design avoids loading all decorative assets on all viewports
- Mobile and lower-priority decorative loads are intentionally reduced to protect runtime cost

## 3. Project Structure Tree

```text
.
├── backend/
│   ├── Comment/              # testimonial routes and controller logic
│   ├── CRUD/                 # shared data access helpers
│   ├── DatabaseModel/        # mongoose schemas
│   ├── Middleware/           # auth middleware
│   ├── ThirdParty/           # Google + LinkedIn OAuth handlers
│   ├── Youtube/              # YouTube integration module and design doc
│   ├── contact/              # contact form email endpoint
│   ├── User/                 # current user endpoint
│   ├── .env.example
│   └── server.js             # Express entry point
├── docs/
│   ├── project/              # engineering notes and performance plans
│   ├── preview-img/          # README preview assets
│   ├── screenshots/          # site screenshots
│   └── YimingYang_CV_S.pdf
├── frontend/
│   ├── public/               # static assets and offline-optimized images
│   ├── scripts/              # asset-processing and optimization scripts
│   ├── src/
│   │   ├── Components/       # reusable UI, scene systems, and card views
│   │   ├── Pages/            # route-level screens
│   │   ├── assets/           # imported assets used by the app bundle
│   │   ├── data/             # structured project and experience content
│   │   ├── App.jsx           # route composition
│   │   └── main.jsx          # React entry point
│   ├── .env.example
│   └── vercel.json           # SPA rewrite config
├── README.md                 # recruiter-facing version
└── Technical-README.md       # engineer-facing version
```

## 4. Architecture Diagram

### Architecture

This project is a split frontend/backend web application with static asset preprocessing and third-party integrations layered around the core portfolio experience.

### System Architecture

```text
browser
  ↓
React + Vite frontend
  ↓
Express API
  ├── MongoDB
  ├── Google OAuth
  ├── LinkedIn OAuth
  ├── YouTube Data API
  └── Resend
```

### Frontend Architecture

```text
main.jsx
  ↓
App.jsx
  ├── home route
  ├── projects route
  ├── experience route
  ├── music route
  ├── contact route
  └── comment submission route

routes
  ↓
page components
  ↓
shared components / scene systems / data modules
```

### Scene Architecture

```text
professional scene
├── shared layer
│   ├── room
│   └── ambient light
└── route layer
    ├── experience
    │   ├── table / resume / spotlight
    │   └── decorative props
    └── project
        ├── pedestal / projector / screen
        └── projection lighting
```

Detailed scene notes: [frontend/src/Components/Scene/design/layer-architecture.md](frontend/src/Components/Scene/design/layer-architecture.md)

### Loading Pipeline

```text
route enter
  ↓
lazy route chunk load
  ↓
shared scene shell init
  ↓
route-specific overlay and scene payload
  ↓
decorative assets after usable state
```

YouTube backend module dependency flow:

```text
route -> controller -> service -> client/config/mapper
```

Detailed backend module notes: [backend/Youtube/DESIGN.md](backend/Youtube/DESIGN.md)

## 5. Technical Decisions (Trade-Offs)

TBD

## 6. How To Build Locally

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection string
- Google OAuth credentials
- LinkedIn OAuth credentials
- Resend API key
- YouTube Data API key

### Install

```bash
git clone https://github.com/LiberteI/My_Portfolio.git
cd My_Portfolio
npm install --prefix frontend
npm install --prefix backend
```

### Environment Files

Create:

- `frontend/.env`
- `backend/.env`

Templates:

- [frontend/.env.example](frontend/.env.example)
- [backend/.env.example](backend/.env.example)

### Run Locally

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm start
```

Default local endpoints:

- frontend: `http://localhost:5173`
- backend: `http://localhost:8080`

### Verification

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
cd frontend
npm run build
```

### Asset Workflow Notes

- Static image optimization scripts live in `frontend/scripts/`
- Optimized public assets are written into sibling `compressed-img/` directories
- Originals are intentionally preserved for higher-detail or fallback use
