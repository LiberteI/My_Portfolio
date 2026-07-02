# YouTube Module Design

## Purpose

This module exposes YouTube-backed video data to the rest of the backend while keeping transport, application logic, third-party integration, and data mapping separate.

The current public contract is:

- Route base: `/api/youtube`
- Current endpoints:
- `GET /featured-arrangement`
- `GET /more-arrangement`
- Current response shape:

```json
{
  "videos": [
    {
      "id": "string | null",
      "title": "string",
      "description": "string",
      "publishedAt": "string | null",
      "thumbnail": "string | null"
    }
  ]
}
```

## Design Goals

- Keep each file at one abstraction level.
- Keep HTTP concerns out of YouTube API code.
- Keep YouTube API details out of route/controller code.
- Centralize configuration and integration errors.
- Make extension additive instead of forcing controller rewrites.

## Layers

### `route.js`

Responsibility:

- Bind Express paths to controller handlers.

Abstraction level:

- HTTP routing only.

Should know about:

- `express.Router`
- controller function names

Should not know about:

- YouTube URLs
- environment variables
- response mapping details

### `controller.js`

Responsibility:

- Handle `req` / `res`
- Call a service use case
- Return HTTP status codes and JSON payloads
- Translate thrown errors into API responses

Abstraction level:

- Web/API orchestration.

Should know about:

- Express request/response objects
- service functions
- public error handling behavior

Should not know about:

- raw YouTube fetch logic
- environment variable names
- thumbnail priority rules

### `service.js`

Responsibility:

- Define application use cases for YouTube data
- Coordinate config, client calls, and mapping

Abstraction level:

- Application/business flow.

Current use cases:

- `getFeaturedArrangementVideos()`
- `getMoreArrangementVideos()`

Future use cases could include:

- `getArrangementVideos()`
- `getPerformanceVideos()`
- `getLatestUploads()`
- `getPlaylistVideos(playlistId)`

Should know about:

- what the app wants to retrieve
- which configured IDs or sources to use

Should not know about:

- Express
- `fetch`
- raw response status handling

### `client.js`

Responsibility:

- Talk to the YouTube API
- Build request URLs
- Send requests
- Parse raw API responses
- Raise integration-level errors

Abstraction level:

- Low-level external I/O.

Should know about:

- YouTube endpoint structure
- query params
- HTTP failures

Should not know about:

- Express response objects
- frontend DTO shape
- route structure

### `mapper.js`

Responsibility:

- Convert raw YouTube items into the module's normalized video shape

Abstraction level:

- Pure data transformation.

Should know about:

- YouTube payload structure
- local DTO shape

Should not know about:

- Express
- env vars
- network calls

### `config.js`

Responsibility:

- Read YouTube-related configuration from environment variables
- Validate required config

Abstraction level:

- Application configuration.

Should know about:

- `process.env`
- configured video ID lists

Should not know about:

- Express
- response mapping
- route behavior

### `errors.js`

Responsibility:

- Define module-specific errors with stable metadata for higher layers

Abstraction level:

- Cross-layer error contract.

Current error types:

- `YoutubeConfigError`
- `YoutubeApiError`

## Dependency Direction

Expected dependency flow:

`route -> controller -> service -> client/config/mapper`

Rules:

- Lower layers must not import higher layers.
- `client` must not import `controller`.
- `mapper` must stay pure and side-effect free.
- `config` should be the only place that directly reads YouTube-specific env vars.

## Current Data Flow

1. `route.js` receives `GET /featured-arrangement` or `GET /more-arrangement`
2. `controller.js` calls the matching service use case
3. `service.js` asks `config.js` for the configured arrangement IDs
4. `service.js` calls `client.js` to fetch raw YouTube items
5. `service.js` maps those items through `mapper.js`
6. `controller.js` returns `{ videos }`

## Extension Guidelines

When adding a new capability, follow this order:

1. Add or update config only if a new configurable source is needed.
2. Add a client function if a new YouTube API endpoint or query pattern is needed.
3. Add or reuse a mapper if the payload shape differs.
4. Add a new service use case that expresses the app intent.
5. Expose it through the controller and route only if it needs a public API endpoint.

Examples:

- New page needs arrangement-only videos:
  Add `getArrangementVideos()` in `service.js`.

- Need playlist support:
  Add `fetchPlaylistItems()` in `client.js`, plus a service use case.

- Need a different frontend payload:
  Add a new mapper or mapper variant instead of expanding the controller.

## Non-Goals

This module currently does not handle:

- persistence/caching
- authentication with YouTube beyond API key access
- pagination
- rate-limit backoff
- retries
- test doubles or dependency injection containers

Those can be added later without breaking the current layer split.

## Practical Review Checklist

Before merging future changes, check:

- Does this file stay within one abstraction level?
- Is the controller still free of YouTube URL logic?
- Is `process.env` access still centralized?
- Is mapping logic still outside the controller/client boundary?
- Did the extension add a use case in `service.js` rather than branching the controller further?
