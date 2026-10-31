# Smart.CIT — Chilika Institute of Technology Scheduling & Venue Platform

## Structure
- `server/`: FastAPI + Google OR-Tools CP-SAT backend (`backend/app/main.py`)
- `client/`: React 19 + Vite 6 frontend (`src/`)
- `exports/`: Validator-verified `schedule.json` and `schedule_after.json`
- `CrunchWeek_StarterPack/`: Official CIT dataset and `validator.py`

## Quick Start
### 1. Start Server (Port 8000)
```bash
cd server
pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```
### 2. Start Client (Port 5173)
```bash
cd client
npm install
npm run dev
```

## Demo Accounts (All 4 Roles)
- **Admin (Dean's Office)**: `dean@cit.edu.in` / `cit@2026` (Includes **Reset Demo Data** button)
- **Department Coordinator**: `coord.cse@cit.edu.in` / `cit@2026`
- **Faculty**: `f01@cit.edu.in` / `cit@2026` (Dr. Ananya Mishra)
- **Club Representative**: `dramatics@cit.edu.in` / `cit@2026` (Dramatics Society)
