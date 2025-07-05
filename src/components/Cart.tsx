
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types/pizza';

interface CartProps {
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const Cart = ({ items, onRemoveItem, onCheckout }: CartProps) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <ShoppingCart size={20} />
            <span>Seu Pedido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Nenhuma pizza selecionada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800">
          <ShoppingCart size={20} />
          <span>Seu Pedido</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 border-b">
            <div className="flex-1">
              <p className="font-medium text-sm">{item.pizza.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {item.size}
                </Badge>
                <span className="text-xs text-gray-500">
                  Qtd: {item.quantity}
                </span>
              </div>
              <p className="text-green-700 font-semibold text-sm">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveItem(index)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg text-green-800">
              R$ {total.toFixed(2)}
            </span>
          </div>
          
          <Button 
            onClick={onCheckout}
            className="w-full pizza-gradient hover:opacity-90"
            size="lg"
          >
            Finalizar Pedido
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cart;
