import { CartItem } from '../App';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Trash2, Plus, Minus } from 'lucide-react';

type ShoppingCartProps = {
  cart: CartItem[];
  onUpdateQuantity: (skateboardId: string, quantity: number) => void;
  onRemoveFromCart: (skateboardId: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
};

export function ShoppingCart({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onContinueShopping,
  onCheckout
}: ShoppingCartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.skateboard.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some awesome skateboards to get started!</p>
        <Button onClick={onContinueShopping} size="lg">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl mb-8">Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.skateboard.id}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4"
            >
              <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                <ImageWithFallback
                  src={item.skateboard.image}
                  alt={item.skateboard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl mb-1">{item.skateboard.name}</h3>
                <p className="text-gray-600 mb-2">{item.skateboard.description}</p>
                <p className="text-blue-600">${item.skateboard.price}</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFromCart(item.skateboard.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.skateboard.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.skateboard.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-2xl text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" size="lg" onClick={onCheckout}>
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onContinueShopping}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
