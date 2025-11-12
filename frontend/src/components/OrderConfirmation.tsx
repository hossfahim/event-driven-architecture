import { CartItem } from '../App';
import { Button } from './ui/button';
import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useKafka } from '../hooks/useKafka';

type OrderConfirmationProps = {
  orderId: string;
  cart: CartItem[];
  onNewOrder: () => void;
};

export function OrderConfirmation({ orderId, cart, onNewOrder }: OrderConfirmationProps) {
  const { sendLog } = useKafka();

  useEffect(() => {
    sendLog('info', 'Order confirmation page loaded', { orderId });
  }, [orderId]);

  const total = cart.reduce((sum, item) => sum + item.skateboard.price * item.quantity, 0) * 1.08;

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-white rounded-lg shadow-md p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        
        <h2 className="text-3xl mb-4">Order Confirmed!</h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-gray-600 mb-1">Order Number</p>
              <p className="font-mono">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Total Amount</p>
              <p className="text-xl text-blue-600">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl mb-4">Items Ordered</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.skateboard.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <span>
                  {item.skateboard.name} × {item.quantity}
                </span>
                <span className="text-gray-600">
                  ${(item.skateboard.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            📧 A confirmation email has been sent to your inbox with tracking information.
          </p>
        </div>

        <Button onClick={onNewOrder} size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
