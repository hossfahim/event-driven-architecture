import { Skateboard } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useKafka } from '../hooks/useKafka';
import { useEffect } from 'react';

const skateboards: Skateboard[] = [
  {
    id: 'skate-1',
    name: 'Pro Street Cruiser',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1634030696106-fefb06a940d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2F0ZWJvYXJkJTIwZGVja3xlbnwxfHx8fDE3NjI1OTExMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Perfect for street skating and tricks'
  },
  {
    id: 'skate-2',
    name: 'Elite Performance Deck',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1686435171260-3bff2e93ec59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBza2F0ZWJvYXJkfGVufDF8fHx8MTc2MjYyMzg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional grade for advanced riders'
  },
  {
    id: 'skate-3',
    name: 'Sunset Rider',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1566796195789-d5a59f97235b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNrYXRlYm9hcmR8ZW58MXx8fHwxNzYyNjIzODgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Vibrant design with smooth ride'
  },
  {
    id: 'skate-4',
    name: 'Park Master',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1491766646513-b763e092029c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2F0ZWJvYXJkJTIwcGFya3xlbnwxfHx8fDE3NjI2MjM4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Built for skate park sessions'
  }
];

type ProductCatalogProps = {
  onAddToCart: (skateboard: Skateboard) => void;
  onGoToCart: () => void;
  cartItemCount: number;
};

export function ProductCatalog({ onAddToCart, onGoToCart, cartItemCount }: ProductCatalogProps) {
  const { sendLog } = useKafka();

  useEffect(() => {
    sendLog('info', 'Product catalog loaded', { productCount: skateboards.length });
  }, []);

  const handleAddToCart = (skateboard: Skateboard) => {
    onAddToCart(skateboard);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Our Collection</h2>
          <p className="text-gray-600">Premium skateboards for every style</p>
        </div>
        
        {cartItemCount > 0 && (
          <Button onClick={onGoToCart} size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            View Cart ({cartItemCount})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skateboards.map((skateboard) => (
          <div
            key={skateboard.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <ImageWithFallback
                src={skateboard.image}
                alt={skateboard.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl mb-2">{skateboard.name}</h3>
              <p className="text-gray-600 mb-4">{skateboard.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl text-blue-600">${skateboard.price}</span>
                <Button onClick={() => handleAddToCart(skateboard)}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
