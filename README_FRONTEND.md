# Inventory Watcher - Frontend

A modern, real-time inventory monitoring system built with React, TypeScript, and GraphQL.

## 🚀 Features

- **Real-time Updates**: WebSocket-based GraphQL subscriptions for instant stock updates
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Type-Safe**: Full TypeScript support throughout the application
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Apollo Client**: Efficient GraphQL data fetching and caching

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client with subscriptions
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Vite** - Fast build tool

## 📋 Prerequisites

Your Elixir/Phoenix backend should expose:

1. **GraphQL HTTP endpoint** (queries/mutations): `http://localhost:4000/graphql`
2. **GraphQL WebSocket endpoint** (subscriptions): `ws://localhost:4000/socket`

### Expected GraphQL Schema

```graphql
type Product {
  id: ID!
  name: String!
  sku: String!
  stockCount: Int!
}

type Query {
  products: [Product!]!
}

type Subscription {
  stockUpdated: Product!
}
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure backend endpoints** (optional):
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Update the endpoints if your backend uses different URLs.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx              # App header with gradient
│   ├── ProductCard.tsx         # Individual product display
│   ├── ProductList.tsx         # GraphQL integration & product grid
│   ├── StockBadge.tsx         # Status indicators
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── apollo-client.ts        # Apollo Client configuration
│   └── utils.ts                # Utility functions
├── types/
│   └── product.ts              # TypeScript interfaces
├── pages/
│   └── Index.tsx               # Main page
└── index.css                   # Design system tokens
```

## 🎨 Design System

The app uses a professional design system with:

- **Primary Color**: Blue gradient (#3B82F6 to #6366F1)
- **Status Colors**: 
  - Green for "In Stock"
  - Amber for "Low Stock"
  - Red for "Out of Stock"
- **Animations**: Smooth transitions and pulse effects for real-time updates

All design tokens are defined in `src/index.css` and `tailwind.config.ts`.

## 🔌 Backend Integration

### Connecting to Your Elixir Backend

The frontend is configured to connect to your Phoenix GraphQL backend. Make sure:

1. Your Phoenix server is running on port 4000
2. Absinthe is configured for GraphQL
3. Phoenix.PubSub is set up for subscriptions

### Testing Without Backend

If you want to test the UI without the backend, you'll see a helpful error message with connection details. The UI is fully functional and will automatically connect once the backend is available.

## 🎯 Key Features Demonstrated

1. **GraphQL Queries**: Fetching initial product list
2. **GraphQL Subscriptions**: Real-time stock updates via WebSocket
3. **Optimistic Updates**: Smooth UX with visual feedback
4. **Error Handling**: Clear error states and messages
5. **Loading States**: Professional loading indicators
6. **Responsive Design**: Mobile-first approach

## 🔧 Customization

### Changing Backend Endpoints

Edit `.env`:
```env
VITE_GRAPHQL_HTTP_ENDPOINT=http://your-backend:4000/graphql
VITE_GRAPHQL_WS_ENDPOINT=ws://your-backend:4000/socket
```

### Updating Stock Thresholds

Edit `src/types/product.ts`:
```typescript
export const getStockStatus = (count: number): StockStatus => {
  if (count === 0) return 'out-of-stock';
  if (count <= 10) return 'low-stock';  // Change threshold here
  return 'in-stock';
};
```

## 📚 Additional Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Subscriptions Guide](https://www.apollographql.com/docs/react/data/subscriptions/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 💡 Interview Tips

This project demonstrates:

- ✅ **Modern React patterns** (hooks, component composition)
- ✅ **TypeScript best practices** (interfaces, type safety)
- ✅ **GraphQL expertise** (queries, subscriptions, Apollo Client)
- ✅ **Real-time architecture** (WebSocket integration)
- ✅ **Professional UI/UX** (loading states, error handling, animations)
- ✅ **Scalable code structure** (separation of concerns, reusable components)

## 🤝 Backend Example

Your Elixir backend should implement something like:

```elixir
# Schema
object :product do
  field :id, non_null(:id)
  field :name, non_null(:string)
  field :sku, non_null(:string)
  field :stock_count, non_null(:integer)
end

# Query
field :products, list_of(:product) do
  resolve &ProductResolver.list_products/3
end

# Subscription
subscription do
  field :stock_updated, :product do
    config fn _args, _info ->
      {:ok, topic: "stock_updates"}
    end
  end
end
```

Good luck with your interview! 🚀
