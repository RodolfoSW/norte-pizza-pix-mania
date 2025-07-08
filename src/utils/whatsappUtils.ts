
import { CartItem, Customer } from '../types/pizza';

export const formatWhatsAppMessage = (cartItems: CartItem[], customer: Customer): string => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = customer.deliveryType === 'delivery' ? 7 : 0;
  const total = subtotal + deliveryFee;
  
  let message = `NOVO PEDIDO - Norte Pizza Mania\n\n`;
  message += `Cliente: ${customer.name}\n`;
  message += `Telefone: ${customer.phone}\n`;
  message += `Tipo: ${customer.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}\n`;
  if (customer.deliveryType === 'delivery') {
    message += `Endereco: ${customer.address}\n`;
  } else if (customer.address) {
    message += `Observacoes: ${customer.address}\n`;
  }
  message += `\n`;
  message += `Pizzas:\n`;
  
  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.pizza.name}\n`;
    message += `   Tamanho: ${item.size}\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Valor: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n\n`;
  });
  
  message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  if (customer.deliveryType === 'delivery') {
    message += `Taxa de entrega: R$ 7,00\n`;
  }
  message += `Total: R$ ${total.toFixed(2).replace('.', ',')}\n`;
  message += `Pagamento: PIX\n\n`;
  message += `Aguardando confirmacao!`;

  return message;
};

export const formatWhatsAppNumber = (phone: string): string => {
  const customerPhoneNumbers = phone.replace(/\D/g, '');
  return `55${customerPhoneNumbers}`;
};

export const createWhatsAppUrl = (customerPhone: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  const companyPhone = "5596981121594"; // Número da empresa
  return `https://wa.me/${companyPhone}?text=${encodedMessage}`;
};
