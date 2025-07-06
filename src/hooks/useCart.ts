
import { useState } from 'react';
import { CartItem, Pizza, PizzaSize } from '../types/pizza';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    handleAddToCart,
    handleRemoveItem,
    clearCart
  };
};
