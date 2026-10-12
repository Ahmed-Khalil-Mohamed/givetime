# GiveTime deployment

## Local

Node 24 or newer is required. Install with `npm ci`, build with `npm run build`, start with `npm start`, and open http://localhost:4315. `npm run dev` enables frontend development. The default bind address is loopback.

## Hosted web process

Configure `HOST`, `PORT`, `DATA_DIR`, `ALLOW_DEMO`, `COOKIE_SECURE` and, only behind a trusted proxy, `TRUST_PROXY`. Environment variables are configured by the shell or service; `.env.example` documents them. Use HTTPS, secure cookies and a persistent writable data directory. Keep the database out of static hosting. This SQLite architecture is intended for a single application host; horizontal replicas require a different storage strategy.

Take a backup after stopping the server and copy the data directory. Restart and verify authentication and a complete workflow after restoring. JSON snapshots in the UI are exports, not automatic database restore files.

## Container

```sh
docker build -t givetime .
docker run --rm -p 4315:4315 -v givetime-data:/app/data givetime
```

The Dockerfile is provided but was not executed locally. Configure HTTPS and production secrets/settings before public hosting.

## GitHub

Source and release history: [Ahmed-Khalil-Mohamed/givetime](https://github.com/Ahmed-Khalil-Mohamed/givetime). The [Quality workflow](https://github.com/Ahmed-Khalil-Mohamed/givetime/actions/workflows/quality.yml) runs format, type, unit, build, dependency and browser checks on Windows and Linux. Refer to each run for its observed result.
