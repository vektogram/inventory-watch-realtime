import { Badge } from "@/components/ui/badge";
import { StockStatus } from "@/types/product";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

interface StockBadgeProps {
  status: StockStatus;
  count: number;
}

const StockBadge = ({ status, count }: StockBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case 'in-stock':
        return 'default';
      case 'low-stock':
        return 'secondary';
      case 'out-of-stock':
        return 'destructive';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'in-stock':
        return <CheckCircle className="h-3 w-3" />;
      case 'low-stock':
        return <AlertTriangle className="h-3 w-3" />;
      case 'out-of-stock':
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'in-stock':
        return 'In Stock';
      case 'low-stock':
        return 'Low Stock';
      case 'out-of-stock':
        return 'Out of Stock';
    }
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1">
      {getIcon()}
      <span>{getLabel()}</span>
    </Badge>
  );
};

export default StockBadge;
