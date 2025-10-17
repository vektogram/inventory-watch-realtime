export interface Product {
  id: string;
  name: string;
  sku: string;
  stockCount: number;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export const getStockStatus = (count: number): StockStatus => {
  if (count === 0) return 'out-of-stock';
  if (count <= 10) return 'low-stock';
  return 'in-stock';
};
