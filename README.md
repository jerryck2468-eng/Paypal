# Demo Name — Demo Website

A small Node.js + Express demonstration website with a blue-and-white payment-service-style interface.

## Safety

This project is intentionally a demo.

- It does not contain a password field.
- It does not request authentication codes.
- It does not request payment credentials.
- Only clearly labeled demo/test fields are submitted.
- Submissions are stored in memory only and disappear when the server restarts.
- Do not enter real credentials or sensitive information.

## Project structure

- `public/index.html` — responsive frontend
- `server.js` — Express server and API
- `package.json` — dependency and start configuration
- `README.md` — this file

## Run locally

Requires Node.js 18 or newer.

```text
npm install
npm start
```

Then open:

`http://localhost:3000`

## API

### Health

`GET /health`

Returns:

```json
{"status":"ok"}
```

### Submit demo data

`POST /api/demo-submissions`

Example JSON:

```json
{
  "demoEmail": "example@test.com",
  "demoMessage": "Test message"
}
```

### View demo submissions

`GET /api/demo-submissions`

Returns the submissions currently held in server memory.

## Deploy on Render

Create a new Web Service and connect the GitHub repository.

Use:

- Build Command: `npm install`
- Start Command: `npm start`

No environment variables are required.

Render provides the `PORT` environment variable, and the server uses `process.env.PORT || 3000`.

## GitHub upload

After extracting the ZIP, upload the complete project folder contents to a GitHub repository. Keep `server.js`, `package.json`, `README.md`, and the `public` folder at the project root.
