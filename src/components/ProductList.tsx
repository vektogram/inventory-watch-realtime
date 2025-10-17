import { gql, useQuery, useSubscription } from '@apollo/client';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      stockCount
    }
  }
`;

const STOCK_UPDATED_SUBSCRIPTION = gql`
  subscription OnStockUpdated {
    stockUpdated {
      id
      name
      sku
      stockCount
    }
  }
`;

const ProductList = () => {
  const [updatingProducts, setUpdatingProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const { loading, error, data } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  
  const { data: subscriptionData, loading: subLoading, error: subError } = useSubscription<{ stockUpdated: Product }>(
    STOCK_UPDATED_SUBSCRIPTION
  );

  useEffect(() => {
    console.log('🔄 Subscription status:', { 
      loading: subLoading, 
      error: subError, 
      hasData: !!subscriptionData,
      data: subscriptionData
    });
  }, [subLoading, subError, subscriptionData]);

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.stockUpdated) {
      console.log('✅ Stock update received:', subscriptionData.stockUpdated);
      const updatedProduct = subscriptionData.stockUpdated;
      setProducts(prev => 
        prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
      
      // Show update animation
      setUpdatingProducts(prev => new Set(prev).add(updatedProduct.id));
      setTimeout(() => {
        setUpdatingProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(updatedProduct.id);
          return newSet;
        });
      }, 2000);
    }
  }, [subscriptionData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Unable to connect to the backend. Make sure your Elixir/Phoenix GraphQL server is running.
            <br />
            <span className="text-sm opacity-80 mt-2 block">
              Error: {error.message}
            </span>
          </AlertDescription>
        </Alert>
        <div className="mt-6 p-6 bg-accent rounded-lg">
          <h3 className="font-semibold mb-2">Expected Backend Configuration:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>GraphQL HTTP: http://localhost:4000/graphql</li>
            <li>GraphQL WebSocket: ws://localhost:4000/socket</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            You can configure these endpoints in your .env file.
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground">
          Your inventory is empty. Add some products from your backend.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isUpdating={updatingProducts.has(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;
