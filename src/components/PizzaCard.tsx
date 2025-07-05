
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pizza } from '../types/pizza';

interface PizzaCardProps {
  pizza: Pizza;
  onSelectPizza: (pizza: Pizza) => void;
}

const PizzaCard = ({ pizza, onSelectPizza }: PizzaCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-green-600 hover:bg-green-700">
          A partir de R$ {pizza.prices.P.toFixed(2)}
        </Badge>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg text-green-800">{pizza.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {pizza.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Ingredientes:</p>
          <div className="flex flex-wrap gap-1">
            {pizza.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={() => onSelectPizza(pizza)}
          className="w-full pizza-gradient hover:opacity-90 transition-opacity"
        >
          Escolher Tamanho
        </Button>
      </CardContent>
    </Card>
  );
};

export default PizzaCard;
