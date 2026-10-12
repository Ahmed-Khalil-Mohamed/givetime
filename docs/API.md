# GiveTime HTTP API

Base: `/api`. JSON mutation requests require `X-Requested-With: givetime`. The application-specific HttpOnly cookie authenticates browser requests.

| Method | Path                           | Request / purpose                                   |
| ------ | ------------------------------ | --------------------------------------------------- |
| GET    | `/health`                      | Process health                                      |
| POST   | `/auth/register`               | `{name,email,password}`; password 12–128 characters |
| POST   | `/auth/login`                  | `{email,password}`                                  |
| POST   | `/auth/demo`                   | Create an isolated fictional workspace              |
| POST   | `/auth/logout`                 | Revoke the session                                  |
| GET    | `/me`                          | Current account                                     |
| GET    | `/givetime/entries`            | Owner-scoped records                                |
| POST   | `/givetime/entries`            | Input validated by the domain schema                |
| PATCH  | `/givetime/entries/:id`        | `{version,input}`; safe description edits           |
| POST   | `/givetime/entries/:id/action` | `{version,action,payload}`                          |
| DELETE | `/givetime/entries/:id`        | `{version}`; retain deletion activity               |
| GET    | `/givetime/events`             | Most recent 100 activity events                     |
| POST   | `/givetime/seed`               | Populate an empty workspace with fictional data     |

Input schemas and actions are defined in `apps/givetime/domain.ts`. Edit fields are in `src/editing.ts`. Other application IDs return 404.

Errors use `{"error":"machine_code"}`: 400 invalid input or transition; 401 unauthenticated; 403 origin or disabled operation; 404 missing/inaccessible record; 409 stale version; 429 rate limit. Record envelopes include `id`, `version`, `createdAt`, `updatedAt` and `data`. No HTTP route accepts a filesystem path.
