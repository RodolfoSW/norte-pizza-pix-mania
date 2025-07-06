
import { useState } from 'react';
import { Customer, CartItem } from '../types/pizza';
import { useToast } from '@/hooks/use-toast';
import { formatWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsappUtils';

export const useCheckout = (cartItems: CartItem[], clearCart: () => void) => {
  const { toast } = useToast();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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
    console.log('Dados do cliente:', customer);
    
    const message = formatWhatsAppMessage(cartItems, customer);
    console.log('Mensagem completa:', message);
    
    const whatsappUrl = createWhatsAppUrl(customer.phone, message);
    console.log('URL do WhatsApp:', whatsappUrl);
    
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    setIsCheckoutModalOpen(false);
    
    toast({
      title: "Pedido enviado!",
      description: "Você será redirecionado para o WhatsApp. Aguarde nosso contato!",
    });
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  return {
    isCheckoutModalOpen,
    handleCheckout,
    handleConfirmOrder,
    closeCheckoutModal
  };
};
