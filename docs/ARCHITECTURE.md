# Architecture Documentation

## System Topology

Zenith Arena follows a modern modular full-stack architecture designed for high availability, sub-50ms odds distribution, and secure third-party provider integration.

```
                      +-----------------------------+
                      |       Client Browser        |
                      |   (React 19 + TypeScript)   |
                      +--------------+--------------+
                                     |
                                     | HTTP / SSE
                                     v
                      +-----------------------------+
                      |     Express API Gateway     |
                      |      (server.ts :3000)      |
                      +--------------+--------------+
                                     |
            +------------------------+------------------------+
            |                        |                        |
            v                        v                        v
+-----------------------+ +----------------------+ +-----------------------+
|  Sports Provider Hub  | | Casino Provider Hub  | | Payment Gateway Hub   |
|  - Sportradar Adapter | |  - Spribe Adapter    | |  - Telebirr Sandbox   |
|  - Betradar Adapter   | |  - Pragmatic Adapter | |  - Mock Card & Crypto |
|  - Zenith Sandbox Feeds| | - Zenith Engine     | |  - IPN Webhooks       |
+-----------------------+ +----------------------+ +-----------------------+
            |                        |                        |
            +------------------------+------------------------+
                                     |
                                     v
                      +-----------------------------+
                      |     PostgreSQL 15 Store     |
                      | (Relational Ledger & Rules) |
                      +-----------------------------+
```

## Layer Responsibilities

### 1. Presentation Layer (Vite + React SPA)
- **Top Bar Contract**: Adheres strictly to the 3-zone contract (1-line Brand wordmark, primary navigation links, 1 main action / balance container).
- **Zero-Pill Metadata**: Clean typographic metadata without candy badges.
- **Client State**: Centralized in `AppContext`, syncing bet slips, active odds, user session, and multi-language RTL state.
- **Web Audio API**: Procedural sound synthesizer generating clicks, reels, and victory chimes without external audio assets.

### 2. Integration Layer (Provider Adapters)
- Implements strict interfaces (`ISportsDataProvider`, `ICasinoGameProvider`, `TelebirrSandboxAdapter`).
- Isolates real production credentials from test environments.
- Provides fallback to sandbox demo feeds when credentials are absent or unverified.

### 3. Backend & API Layer (Node.js + Express)
- Handles session tokens, PBKDF2 simulated password hashing, and role-based permissions.
- Hosts RESTful endpoints for game launch URL generation, odds feeds, and Telebirr IPN callback notifications.
- Exposes Server-Sent Events (SSE) on `/api/stream/odds` for real-time odds updates.

### 4. Persistence Layer (PostgreSQL)
- Schema definitions located in `database/schema.sql`.
- Enforces relational referential integrity, unique transaction references, and responsible gaming limits.
