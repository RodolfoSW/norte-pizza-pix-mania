
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pizza, PizzaSize } from '../types/pizza';

interface PizzaSizeModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (pizza: Pizza, size: PizzaSize) => void;
}

const sizeDescriptions = {
  P: '20cm - 2 fatias',
  M: '25cm - 4 fatias', 
  G: '30cm - 6 fatias',
  GG: '35cm - 8 fatias',
  'EX GG': '40cm - 10 fatias'
};

const PizzaSizeModal = ({ pizza, isOpen, onClose, onAddToCart }: PizzaSizeModalProps) => {
  if (!pizza) return null;

  const handleSizeSelect = (size: PizzaSize) => {
    onAddToCart(pizza, size);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-800">{pizza.name}</DialogTitle>
          <DialogDescription>
            Escolha o tamanho da sua pizza
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {Object.entries(pizza.prices).map(([size, price]) => (
            <div
              key={size}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {size}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {sizeDescriptions[size as PizzaSize]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-green-800">
                  R$ {price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleSizeSelect(size as PizzaSize)}
                  className="pizza-gradient hover:opacity-90"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PizzaSizeModal;
