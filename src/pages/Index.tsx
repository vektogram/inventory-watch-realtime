import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo-client';
import Header from '@/components/Header';
import ProductList from '@/components/ProductList';

const Index = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Live Inventory</h2>
            <p className="text-muted-foreground">
              Real-time product stock monitoring with GraphQL subscriptions
            </p>
          </div>
          <ProductList />
        </main>
      </div>
    </ApolloProvider>
  );
};

export default Index;
