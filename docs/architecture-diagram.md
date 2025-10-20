# System Architecture Overview

The diagram below summarizes how the live inventory experience is wired together across the frontend, backend, and infrastructure layers.

```mermaid
graph TD
  subgraph Client
    Browser[User Browser]
    ViteApp[React + TypeScript App]
  end

  subgraph Delivery
    CDN[Nginx Static Delivery]
  end

  subgraph Backend
    Phoenix[Phoenix / Absinthe API]
    PubSub[Phoenix PubSub]
    Ecto[Ecto Contexts]
  end

  subgraph Data
    Postgres[(PostgreSQL Database)]
  end

  subgraph Ops
    Dokploy[Dokploy Orchestrator]
    Hetzner[Hetzner VPS]
    Docker[Docker Containers]
  end

  Browser -->|HTTPS| CDN
  CDN --> ViteApp
  ViteApp -->|GraphQL HTTP| Phoenix
  ViteApp -->|GraphQL WebSocket\nSubscriptions| Phoenix
  Phoenix -->|Queries & Mutations| Ecto
  Phoenix -->|Broadcast Updates| PubSub
  PubSub -->|Stock Update Events| Phoenix
  Ecto -->|SQL| Postgres

  Dokploy --> Docker
  Docker --> Phoenix
  Docker --> CDN
  Dokploy -->|Deploys & Env Vars| Hetzner
  Hetzner --> Dokploy
  Phoenix -.->|Migration Hooks| Postgres
```

## Flow Summary

- The React application is served as static assets by Nginx. Open-source source code lives at [github.com/vektogram/inventory-watch-realtime](https://github.com/vektogram/inventory-watch-realtime).
- Browser clients fetch product data through GraphQL queries and stay synchronized through Absinthe subscriptions over WebSockets.
- The Phoenix backend (source at [github.com/vektogram/elixir_inventory_watcher](https://github.com/vektogram/elixir_inventory_watcher)) persists inventory in PostgreSQL via Ecto and uses Phoenix PubSub to fan out stock-change events.
- Deployments run on a Hetzner VPS managed by Dokploy. Dokploy pulls container images, injects secrets, runs migrations, and restarts services as needed.

This layout keeps the system modular: the frontend, API, and data store are independently deployable while Dokploy coordinates the overall lifecycle on Hetzner."},
