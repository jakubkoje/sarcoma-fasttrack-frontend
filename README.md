# Sarcoma FastTrack Frontend

Minimal Web Component for the early WAC deployment points.

The component calls `GET /api/message` on the configured backend and displays the response.

## Run

```bash
npm test
npm run build
npm run preview
```

Open `http://localhost:4173` while the API runs on `http://localhost:8000`.

## Use

```html
<sarcoma-fasttrack-app api-base="/sarcoma-fasttrack-api"></sarcoma-fasttrack-app>
<script type="module" src="./sarcoma-fasttrack.js"></script>
```

## Image

```bash
docker build -t jakubkoje/sarcoma-fasttrack-frontend:1.0.0 .
```
