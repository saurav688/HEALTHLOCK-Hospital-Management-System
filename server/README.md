# Medicare Backend (Node + Express + MongoDB)

This folder contains a simple REST API for the **Hospital Management System**.

## How to run

1. Install dependencies from project root:

```bash
npm install
```

2. Copy `.env.example` to `.env` inside the `server` folder and adjust values if needed:

```bash
cp server/.env.example server/.env
```

3. Start MongoDB locally (or point `MONGO_URI` to your cloud Mongo instance).

4. Run the backend server:

```bash
npm run server
```

The API will be available at `http://localhost:5000`.

## Available API endpoints

- `GET  /api/health` – health check
- `GET  /api/patients` – list patients
- `POST /api/patients` – create patient
- `GET  /api/doctors` / `POST /api/doctors`
- `GET  /api/departments` / `POST /api/departments`
- `GET  /api/rooms` / `POST /api/rooms`
- `GET  /api/admissions` / `POST /api/admissions`

You can now connect your React frontend pages (Patients, Doctors, Rooms, Admission, etc.) to these endpoints using `fetch` or any HTTP client.
