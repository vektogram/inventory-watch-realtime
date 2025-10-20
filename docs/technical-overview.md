# Inventory Watch Realtime Frontend Architecture

## System Overview

- Stack: React 18 + TypeScript (src/main.tsx), bundled with Vite 5 (vite.config.ts) and styled via Tailwind CSS 3 (tailwind.config.ts, src/index.css).
- Runtime data layer combines Apollo Client 3.14 for GraphQL transport (src/lib/apollo-client.ts) with React Query 5 scaffolding for REST/imperative fetches (src/App.tsx) even though the current UI is Apollo-driven.
- UI is composed from shadcn/ui primitives (src/components/ui/\*) layered with lucide-react icons and Tailwind utility classes to deliver a polished, themeable interface.
- The app targets a Phoenix/Absinthe backend that exposes GraphQL HTTP and WebSocket endpoints; configuration defaults to localhost but is overrideable via Vite env variables.

## Application Entry & Routing

- `src/main.tsx` bootstraps React into `#root` and applies global styles from `src/index.css`.
- `src/App.tsx` wires the core providers: QueryClientProvider (React Query), ApolloProvider (GraphQL), TooltipProvider, and two toaster systems (`src/components/ui/toaster.tsx` and `src/components/ui/sonner.tsx`).
- React Router 6 drives navigation; today only `/` (Index.tsx) and the catch-all `*` route (NotFound.tsx) are registered, simplifying deep-link handling.

## Data Access Layer & Backend Integration

- `src/lib/apollo-client.ts` constructs a split-link ApolloClient:
  - HTTP operations use `HttpLink` pointed at `VITE_GRAPHQL_HTTP_ENDPOINT` (default `http://localhost:4000/api/graphql`).
  - Subscription operations are routed through `@absinthe/socket-apollo-link`, which wraps a Phoenix channel connection created with `phoenix.Socket` and the Absinthe protocol. The WebSocket endpoint defaults to `ws://localhost:4000/socket`.
  - `split` inspects operation definitions at runtime to choose the HTTP or WebSocket transport.
- ApolloClient is configured with an `InMemoryCache`, enabling object identity by field keys and efficient partial updates when subscription payloads arrive.
- React Query is initialized but unused; it is ready to cache REST endpoints or imperative data fetches if the product expands beyond GraphQL.
- Environment variables resolve via `import.meta.env.*` at build time. When running `vite dev`, a `.env` file in the project root can override the defaults (see README_FRONTEND.md for keys).

## Real-Time Inventory Flow

1. `src/pages/Index.tsx` renders the `ProductList` component within a layout scaffold.
2. `src/components/ProductList.tsx` orchestrates data fetching:
   - Executes the `GetProducts` query on mount to populate baseline inventory.
   - Subscribes to `stockUpdated` events using `useSubscription`, piping delta payloads from the backend.
   - Maintains a local `products` array so that subscription updates can be merged client-side without forcing a full refetch.
   - Tracks a `Set` of product IDs currently animating (`updatingProducts`). IDs are added when subscription data arrives and automatically removed via a 2 second timeout.
   - Surfaces backend connection issues with a destructively styled alert (leveraging shadcn `Alert` and lucide `AlertCircle`) and prints guidance for expected endpoints.
   - Provides UX fallbacks for empty inventories and loading states, using lucide icons and Tailwind animation classes.
3. `src/components/ProductCard.tsx` renders each product tile:
   - Derives a `StockStatus` via `getStockStatus` (src/types/product.ts) to choose badge styling and semantics.
   - Uses component state (`showPulse`) plus the `isUpdating` flag to drive a timed pulse animation (`animate-pulse-glow`), defined in `tailwind.config.ts` under `keyframes.pulse-glow`.
   - Applies drop-shadow accents and tailwind transitions to highlight updated cards.
4. `src/components/StockBadge.tsx` (not shown above but in repo) converts stock status into color-coded badges using shadcn `Badge` variants and lucide icons for quick visual cues.

## UI Composition & Design System

- Global tokens live in `src/index.css`. All colors are expressed in HSL to match Tailwind expectations. Light/dark palettes, gradient tokens, success/warning hues, and shadow definitions are centralized, enabling runtime theming.
- `tailwind.config.ts` extends Tailwind with container defaults, color bindings to CSS variables, bespoke keyframes (`pulse-glow`, `slide-up`, accordion transitions), and box shadows. The `tailwindcss-animate` plugin augments animation utilities.
- Typography enhancement: `fontFamily['instrument-serif']` registers the Instrument Serif font for hero headings (used in Header.tsx).
- shadcn/ui component wrappers (src/components/ui/\*) wrap Radix primitives, injecting Tailwind classes and supporting composition via the `cn` helper (`src/lib/utils.ts`). Components cover dialogs, drawers, tooltips, pagination, charts, and more; only a subset is mounted today, but the library is preconfigured for rapid expansion.

## Feedback, Toasts & UX Enhancements

- Dual toast systems are available: the custom hook-based toaster (`src/hooks/use-toast.ts`, `src/components/ui/toaster.tsx`) and the Sonner toaster (`src/components/ui/sonner.tsx`). The app currently mounts both to accommodate shadcn notifications and Sonner-style toasts simultaneously.
- `src/components/ProductList.tsx` logs subscription lifecycle events and payloads to the console. These traces assist with backend connectivity debugging during development.
- Loading and error states rely on lucide icons (`Loader2`, `Package`, `AlertCircle`) and Tailwind utility classes for accessible messaging.

## Supporting Hooks & Utilities

- `src/hooks/use-mobile.tsx` listens to a `(max-width: 768px)` media query via `matchMedia`, updating reactively to drive responsive UI variants (e.g., sidebar behavior, not yet mounted on the main page).
- `src/lib/utils.ts` exports a `cn` helper that merges Tailwind class strings using `clsx` and `tailwind-merge`, preventing conflicting utility classes.

## Tooling & Project Configuration

- `vite.config.ts` binds the dev server to `::` (IPv6 all interfaces) on port 8080 and registers two plugins: `@vitejs/plugin-react-swc` for SWC-accelerated React transforms and `lovable-tagger` in development for component instrumentation. It also defines a path alias `@` → `./src` used throughout imports.
- TypeScript configuration is split across `tsconfig.json` (workspace), `tsconfig.app.json`, and `tsconfig.node.json`. The app tsconfig targets `ES2020` with strict type-checking, JSX factory `react-jsx`, and alias resolution matching Vite.
- Linting is handled by a flat `eslint.config.js` that layers `@eslint/js`, React Hooks rules, React Refresh rules, and `typescript-eslint`. Commands: `npm run lint` for static analysis, `npm run dev` for hot reload, `npm run build` for production bundling, `npm run preview` for static preview.

## Packaging & Deployment Pipeline

- `Dockerfile` executes a multi-stage build:
  1. `node:20-alpine` builder restores dependencies (npm ci), copies the repo, and runs `npm run build` to emit the `/dist` bundle.
  2. `nginx:1.27-alpine` runtime swaps in a custom `nginx.conf` and serves the static assets from `/usr/share/nginx/html`. Port 80 is exposed and `CMD` launches nginx in the foreground.
- `.dockerignore` excludes repo metadata, node_modules, dist, editor artifacts, and OS junk to shrink build contexts.
- `nginx.conf` (omitted in digest) typically configures SPA fallback routing to `index.html`, ensuring React Router works in production.

## Environment & Runtime Behavior

- Default backend endpoints target `http://localhost:4000/api/graphql` for queries/mutations and `ws://localhost:4000/socket` for subscriptions, consistent with a Phoenix/Absinthe stack. Developers can override via `.env` variables prefixed with `VITE_`.
- The UI assumes the GraphQL schema exposes `products` and `stockUpdated` fields that match the `Product` type from `src/types/product.ts`. Subscription payloads must include `id`, `name`, `sku`, and `stockCount` to keep the merge logic type-safe.
- Error handling: GraphQL errors bubble through Apollo and are caught by the `useQuery` instance. Connection issues display inline, and the console logging in ProductList aids diagnosing WebSocket handshake problems.

## Extensibility Considerations

- React Query is ready for hybrid data strategies (REST endpoints, optimistic mutations) without refactoring foundational providers.
- shadcn component set provides primitives for forms, tables, charts, navigation, and layout. Many wrappers are unused yet but already namespaced under `src/components/ui/`.
- Tailwind theme tokens make it straightforward to add dark mode toggles or brand variations by flipping CSS variables inside `:root` / `.dark` scopes.
- The Apollo split link pattern supports additional transports (e.g., persisted queries or batching) by extending the HTTP link chain.

This document should equip contributors with a holistic understanding of how the frontend fetches, renders, and animates real-time inventory data while staying production-ready via the Dockerized static site pipeline.
