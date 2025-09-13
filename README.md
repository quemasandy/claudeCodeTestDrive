# React + Node.js TypeScript Full-Stack Application

## 📁 Project Structure

```
├── frontend/          # React TypeScript frontend (Vite)
├── backend/           # Node.js TypeScript backend (Express)
├── shared/            # Shared TypeScript types and utilities
└── package.json       # Root package.json with scripts
```

## 🚀 Quick Start

### Install all dependencies
```bash
npm run install:all
```

### Development (runs frontend and backend concurrently)
```bash
npm run dev
```

### Individual services

**Frontend (http://localhost:5173)**
```bash
cd frontend
npm run dev
```

**Backend (http://localhost:3001)**
```bash
cd backend
npm run dev
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development |
| `npm run build` | Build both frontend and backend for production |
| `npm run install:all` | Install dependencies for all packages |

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev` - Development server with nodemon
- `npm run build` - TypeScript compilation
- `npm run start` - Production server
- `npm run test` - Run tests

## 📊 Health Check

Backend health check endpoint: `GET http://localhost:3001/api/health`

## 🎯 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- CSS3

**Backend:**
- Node.js
- Express
- TypeScript
- CORS, Helmet (security)

**Shared:**
- TypeScript types
- Shared utilities