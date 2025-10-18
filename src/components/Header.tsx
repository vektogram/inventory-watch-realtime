import { Package } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-hero shadow-glow sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-instrument-serif">Inventory Watcher</h1>
            <p className="text-white/90 text-sm">Real-time stock monitoring system</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
