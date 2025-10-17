import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Product, getStockStatus } from "@/types/product";
import StockBadge from "./StockBadge";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
  isUpdating?: boolean;
}

const ProductCard = ({ product, isUpdating = false }: ProductCardProps) => {
  const [showPulse, setShowPulse] = useState(false);
  const status = getStockStatus(product.stockCount);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isUpdating) {
      setShowPulse(true);
      timer = setTimeout(() => setShowPulse(false), 2000);
    } else {
      setShowPulse(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isUpdating]);

  return (
    <Card 
      className={`
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${showPulse ? 'animate-pulse-glow shadow-glow' : ''}
      `}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-accent p-2 rounded-lg shrink-0">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            </div>
          </div>
          <StockBadge status={status} count={product.stockCount} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {product.stockCount}
          </span>
          <span className="text-sm text-muted-foreground">units available</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
