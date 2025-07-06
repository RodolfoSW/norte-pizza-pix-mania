
import { useState } from 'react';
import Header from '../components/Header';
import PizzaCard from '../components/PizzaCard';
import PizzaSizeModal from '../components/PizzaSizeModal';
import Cart from '../components/Cart';
import CheckoutModal from '../components/CheckoutModal';
import { pizzas } from '../data/pizzas';
import { Pizza, PizzaSize, CartItem, Customer } from '../types/pizza';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleSelectPizza = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsSizeModalOpen(true);
  };

  const handleAddToCart = (pizza: Pizza, size: PizzaSize) => {
    const price = pizza.prices[size];
    
    // Verifica se já existe um item igual no carrinho
    const existingItemIndex = cartItems.findIndex(
      item => item.pizza.id === pizza.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      // Incrementa quantidade se já existe
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Adiciona novo item
      const newItem: CartItem = {
        pizza,
        size,
        quantity: 1,
        price
      };
      setCartItems([...cartItems, newItem]);
    }

    toast({
      title: "Pizza adicionada!",
      description: `${pizza.name} (${size}) foi adicionada ao carrinho.`,
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    
    toast({
      title: "Item removido",
      description: "Pizza removida do carrinho.",
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione pelo menos uma pizza ao carrinho.",
        variant: "destructive"
      });
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmOrder = (customer: Customer) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Dados do cliente:', customer); // Para debug
    
    // Monta a mensagem do pedido
    let message = `NOVO PEDIDO - Norte Pizza Mania\n\n`;
    message += `Cliente: ${customer.name}\n`;
    message += `Telefone: ${customer.phone}\n`;
    message += `Endereco: ${customer.address}\n\n`;
    message += `Pizzas:\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.pizza.name}\n`;
      message += `   Tamanho: ${item.size}\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `Total: R$ ${total.toFixed(2).replace('.', ',')}\n`;
    message += `Pagamento: PIX\n\n`;
    message += `Aguardando confirmacao!`;

    console.log('Mensagem completa:', message); // Para debug
    
    // Codifica a mensagem de forma mais simples
    const encodedMessage = encodeURIComponent(message);
    
    console.log('Mensagem codificada:', encodedMessage); // Para debug
    
    // Define o número do WhatsApp da pizzaria
    const whatsappNumber = '5585999999999';
    
    // Abre WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    console.log('URL do WhatsApp:', whatsappUrl); // Para debug
    
    window.open(whatsappUrl, '_blank');
    
    // Limpa o carrinho e fecha o modal
    setCartItems([]);
    setIsCheckoutModalOpen(false);
    
    toast({
      title: "Pedido enviado!",
      description: "Você será redirecionado para o WhatsApp. Aguarde nosso contato!",
    });
  };

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
        onClose={() => setIsSizeModalOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
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
