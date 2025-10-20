const ProjectOverview = () => (
  <section className="mt-16 max-w-3xl mx-auto space-y-6">
    <div className="space-y-3">
  <h3 className="text-3xl font-semibold font-instrument-serif">What This Project Delivers</h3>
      <p className="text-muted-foreground">
        The dashboard shows a catalog of products with live stock counts. When a
        stock change happens, the matching card updates instantly and pulses
        briefly so the change is easy to spot/no page refresh required.
      </p>
    </div>
    <div className="space-y-3">
  <h3 className="text-2xl font-semibold font-instrument-serif">How the Experience Works</h3>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Products live in PostgreSQL with seed data so the UI renders right away.</li>
        <li>An Elixir/Phoenix service exposes the data through a GraphQL API.</li>
        <li>When the backend updates a product, it broadcasts the change over a WebSocket.</li>
        <li>The React frontend listens with Apollo Client, updates the card, and triggers the pulse animation.</li>
        <li>Everything is deployed on a Hetzner VPS with Dokploy handling containers, migrations, and secrets.</li>
      </ul>
    </div>
    <div className="space-y-3">
  <h3 className="text-2xl font-semibold font-instrument-serif">Why The Result Matters</h3>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Teams see inventory movements as they happen, reducing the risk of overselling.</li>
        <li>The component based frontend is ready for extra views like charts, filters, or richer product details.</li>
        <li>The backend separates data updates from presentation, which keeps the system reliable and easy to extend.</li>
        <li>Containerized services mean the stack can grow horizontally or move clouds without rewrites.</li>
      </ul>
    </div>
    <div className="space-y-3">
      <h3 className="text-3xl font-semibold font-instrument-serif">System Architecture</h3>
      <p className="text-muted-foreground">
        This diagram maps how the React client, Phoenix API, PostgreSQL database, and
        Dokploy-managed infrastructure fit together in the live deployment.
      </p>
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <img
          src="/infra.webp"
          alt="System architecture diagram showing browser, frontend, Phoenix backend, PostgreSQL, and Dokploy on Hetzner."
          className="w-full rounded-md"
          loading="lazy"
        />
      </div>
    </div>
    <div className="space-y-3">
  <h3 className="text-2xl font-semibold font-instrument-serif">Explore The Code</h3>
      <p className="text-muted-foreground">
        Frontend (React + TypeScript):{' '}
        <a
          className="text-primary underline underline-offset-4"
          href="https://github.com/vektogram/inventory-watch-realtime"
          target="_blank"
          rel="noreferrer"
        >
          github.com/vektogram/inventory-watch-realtime
        </a>
        <br />
        Backend (Elixir + Phoenix):{' '}
        <a
          className="text-primary underline underline-offset-4"
          href="https://github.com/vektogram/elixir_inventory_watcher"
          target="_blank"
          rel="noreferrer"
        >
          github.com/vektogram/elixir_inventory_watcher
        </a>
      </p>
      <p className="text-muted-foreground">
        Clone either repository to explore the implementation, or follow the README
        instructions to run the full stack locally. The live site mirrors these
        open source projects.
      </p>
    </div>
  </section>
);

export default ProjectOverview;
