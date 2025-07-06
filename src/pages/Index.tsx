
import Header from '../components/Header';
import PizzaCard from '../components/PizzaCard';
import PizzaSizeModal from '../components/PizzaSizeModal';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import { pizzas } from '../data/pizzas';
import { usePizzaSelection } from '../hooks/usePizzaSelection';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';

const Index = () => {
  const { selectedPizza, isSizeModalOpen, handleSelectPizza, closeSizeModal } = usePizzaSelection();
  const { cartItems, handleAddToCart, handleRemoveItem, clearCart } = useCart();
  const { isCheckoutModalOpen, handleCheckout, handleConfirmOrder, closeCheckoutModal } = useCheckout(cartItems, clearCart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu de pizzas */}
          <div className="lg:col-span-3">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                Nossas Pizzas Mais Pedidas
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubra os sabores únicos da região Norte! Pizzas feitas com ingredientes 
                frescos e receitas que celebram a cultura amazônica.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pizzas.map((pizza) => (
                <PizzaCard
                  key={pizza.id}
                  pizza={pizza}
                  onSelectPizza={handleSelectPizza}
                />
              ))}
            </div>
          </div>
          
          {/* Carrinho */}
          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Modais */}
      <PizzaSizeModal
        pizza={selectedPizza}
        isOpen={isSizeModalOpen}
        onClose={closeSizeModal}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={closeCheckoutModal}
        items={cartItems}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Footer */}
      <footer className="amazon-gradient text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-bold mb-2">Norte Pizza Mania</h3>
          <p className="text-green-100 mb-4">
            Sabores autênticos da Amazônia direto na sua mesa! 🍕
          </p>
          <div className="flex justify-center items-center space-x-4 text-sm">
            <span>💳 Pagamento via PIX</span>
            <span>•</span>
            <span>🚚 Entrega rápida</span>
            <span>•</span>
            <span>📱 Pedidos pelo WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
