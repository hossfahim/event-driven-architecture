import { useState, useEffect } from 'react';
import { ProductCatalog } from './components/ProductCatalog';
import { ShoppingCart } from './components/ShoppingCart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { KafkaLogViewer } from './components/KafkaLogViewer';
import { useKafka } from './hooks/useKafka';

export type Skateboard = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

export type CartItem = {
  skateboard: Skateboard;
  quantity: number;
};

export type OrderStep = 'catalog' | 'cart' | 'checkout' | 'confirmation';

export default function App() {
  const [currentStep, setCurrentStep] = useState<OrderStep>('catalog');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<string>('');
  const { sendLog } = useKafka();

  useEffect(() => {
    sendLog('info', 'Application initialized', { component: 'App' });
  }, []);

  const addToCart = (skateboard: Skateboard) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.skateboard.id === skateboard.id);
      
      if (existingItem) {
        sendLog('info', 'Updated cart quantity', {
          productId: skateboard.id,
          productName: skateboard.name,
          newQuantity: existingItem.quantity + 1
        });
        return prevCart.map(item =>
          item.skateboard.id === skateboard.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        sendLog('info', 'Product added to cart', {
          productId: skateboard.id,
          productName: skateboard.name,
          price: skateboard.price
        });
        return [...prevCart, { skateboard, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (skateboardId: string) => {
    const item = cart.find(c => c.skateboard.id === skateboardId);
    if (item) {
      sendLog('info', 'Product removed from cart', {
        productId: skateboardId,
        productName: item.skateboard.name
      });
    }
    setCart(prevCart => prevCart.filter(item => item.skateboard.id !== skateboardId));
  };

  const updateQuantity = (skateboardId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(skateboardId);
      return;
    }
    
    const item = cart.find(c => c.skateboard.id === skateboardId);
    if (item) {
      sendLog('info', 'Cart quantity updated', {
        productId: skateboardId,
        productName: item.skateboard.name,
        newQuantity: quantity
      });
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.skateboard.id === skateboardId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const goToCart = () => {
    sendLog('info', 'User navigated to cart', { itemCount: cart.length });
    setCurrentStep('cart');
  };

  const goToCheckout = () => {
    sendLog('info', 'User proceeded to checkout', {
      itemCount: cart.length,
      totalValue: cart.reduce((sum, item) => sum + item.skateboard.price * item.quantity, 0)
    });
    setCurrentStep('checkout');
  };

  const completeOrder = (customerInfo: any) => {
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    
    sendLog('info', 'Order processing started', {
      orderId: newOrderId,
      customerEmail: customerInfo.email,
      itemCount: cart.length
    });

    // Simulate Kafka events for order processing
    setTimeout(() => {
      sendLog('info', 'Payment validated', { orderId: newOrderId, method: customerInfo.paymentMethod });
    }, 500);

    setTimeout(() => {
      sendLog('info', 'Inventory reserved', {
        orderId: newOrderId,
        items: cart.map(item => ({ id: item.skateboard.id, qty: item.quantity }))
      });
    }, 1000);

    setTimeout(() => {
      sendLog('info', 'Order confirmed', {
        orderId: newOrderId,
        total: cart.reduce((sum, item) => sum + item.skateboard.price * item.quantity, 0)
      });
    }, 1500);

    setTimeout(() => {
      sendLog('success', 'Shipping label created', { orderId: newOrderId, trackingNumber: `TRK-${Date.now()}` });
    }, 2000);

    setCurrentStep('confirmation');
  };

  const resetOrder = () => {
    sendLog('info', 'New shopping session started', {});
    setCart([]);
    setCurrentStep('catalog');
    setOrderId('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl">🛹 SkateShop</h1>
          <p className="text-gray-400 mt-1">Premium Skateboards with Kafka Event Streaming</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 'catalog' && (
          <ProductCatalog
            onAddToCart={addToCart}
            onGoToCart={goToCart}
            cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        )}

        {currentStep === 'cart' && (
          <ShoppingCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onContinueShopping={() => {
              sendLog('info', 'User returned to catalog', {});
              setCurrentStep('catalog');
            }}
            onCheckout={goToCheckout}
          />
        )}

        {currentStep === 'checkout' && (
          <Checkout
            cart={cart}
            onBack={() => {
              sendLog('info', 'User returned to cart from checkout', {});
              setCurrentStep('cart');
            }}
            onComplete={completeOrder}
          />
        )}

        {currentStep === 'confirmation' && (
          <OrderConfirmation
            orderId={orderId}
            cart={cart}
            onNewOrder={resetOrder}
          />
        )}
      </main>

      <KafkaLogViewer />
    </div>
  );
}
