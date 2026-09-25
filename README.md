# CareFlow

**Your health, organized around your life.**

CareFlow is a local-first personal healthcare organization app for appointments, medication schedules, reminders, health events and personal notes. It is deliberately an organization tool: it does not diagnose conditions, recommend treatments, or replace a healthcare professional.

## Features

- Calm editorial landing page with an interactive product preview
- Today dashboard powered by SQLite data through Flask APIs
- Appointment CRUD: create, edit, delete and view status
- Medication schedule management using user-entered information only
- Chronological health timeline combining events and notes
- Reminder creation, completion and deletion
- Private health notes with create, edit and delete
- Loading, empty, success and API error states
- Responsive desktop, tablet and mobile layouts
- Keyboard-friendly controls, visible focus states and semantic labels
- Reduced-motion support with `prefers-reduced-motion`
- No paid services, API keys or cloud database required

## Technology stack

- React + JavaScript
- Vite for the minimal React development/build workflow
- Native CSS
- Python + Flask
- SQLite
- Flask-CORS for local frontend/backend development

## Project structure

```text
careflow/
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       └── styles/main.css
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── schema.sql
│   ├── requirements.txt
│   └── database.db        # generated automatically on first backend start
├── README.md
└── .gitignore
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- npm
- A modern browser

No external database server is needed.

## Installation

Open two terminals in the project root.

### Terminal 1 — Flask backend

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Windows Command Prompt:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The Flask API runs at `http://127.0.0.1:5000`.

### Terminal 2 — React frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

Open that URL in a browser. Keep both terminals running while using the app.

## SQLite setup

SQLite is initialized automatically by `backend/database.py` when Flask starts. The database file is:

```text
backend/database.db
```

The schema is stored in:

```text
backend/schema.sql
```

The first startup creates a local demo user and sample records so the competition demo is immediately populated. User-created records are then persisted in SQLite.

## Database tables

- `users` — local demo user
- `appointments` — appointments and providers
- `medications` — user-entered medication schedules
- `health_events` — timeline events
- `reminders` — pending/completed reminders
- `health_notes` — private user notes
- `feedback` — product feedback storage

## API overview

Health check:

- `GET /api/health`

Dashboard:

- `GET /api/dashboard`

Appointments:

- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/<id>`
- `DELETE /api/appointments/<id>`

Medications:

- `GET /api/medications`
- `POST /api/medications`
- `PATCH /api/medications/<id>`
- `DELETE /api/medications/<id>`

Reminders:

- `GET /api/reminders`
- `POST /api/reminders`
- `PATCH /api/reminders/<id>`
- `DELETE /api/reminders/<id>`

Health events:

- `GET /api/health-events`
- `POST /api/health-events`
- `DELETE /api/health-events/<id>`

Health notes:

- `GET /api/health-notes`
- `POST /api/health-notes`
- `PATCH /api/health-notes/<id>`
- `DELETE /api/health-notes/<id>`

Feedback:

- `POST /api/feedback`

All write endpoints validate input and use parameterized SQLite queries. Internal database errors are not returned to the browser.

## Troubleshooting

### The dashboard says it cannot load data

1. Confirm Terminal 1 is running Flask.
2. Open `http://127.0.0.1:5000/api/health`.
3. It should return `{ "status": "ok" }`.
4. Confirm Terminal 2 is running Vite.
5. Refresh the browser.

### PowerShell blocks virtual-environment activation

Run PowerShell as your normal development shell and use:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate again with:

```powershell
.\.venv\Scripts\Activate.ps1
```

### Port 5000 is already in use

Stop the other process using port 5000, then run `python app.py` again. The frontend expects the backend at `http://127.0.0.1:5000/api`.

### Database needs a clean reset

Stop Flask, delete `backend/database.db`, then start Flask again. The schema and demo data will be recreated automatically.

### Frontend dependency problem

From `frontend/`, remove `node_modules` and `package-lock.json`, then run:

```bash
npm install
npm run dev
```

## Safety positioning

CareFlow is not a medical device or diagnostic service. It is designed to organize personal healthcare information. Information shown in the app is user-entered or locally stored demo data and should not be treated as medical advice.
