
import { useState } from 'react';
import { Pizza, PizzaSize } from '../types/pizza';

export const usePizzaSelection = () => {
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  const handleSelectPizza = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsSizeModalOpen(true);
  };

  const closeSizeModal = () => {
    setIsSizeModalOpen(false);
  };

  return {
    selectedPizza,
    isSizeModalOpen,
    handleSelectPizza,
    closeSizeModal
  };
};
