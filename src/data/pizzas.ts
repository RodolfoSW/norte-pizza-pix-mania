
import { Pizza } from '../types/pizza';

export const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Pizza de Tucumã',
    description: 'Massa artesanal, molho especial, queijo muçarela, tucumã desfiado e cebola roxa',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center',
    prices: {
      P: 28.00,
      M: 38.00,
      G: 48.00,
      GG: 58.00,
      "EX GG": 68.00
    },
    ingredients: ['Molho de tomate', 'Queijo muçarela', 'Tucumã', 'Cebola roxa', 'Orégano']
  },
  {
    id: '2',
    name: 'Pizza de Tambaqui',
    description: 'Deliciosa pizza com filé de tambaqui grelhado, queijo coalho e molho de ervas',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    prices: {
      P: 32.00,
      M: 42.00,
      G: 52.00,
      GG: 62.00,
      "EX GG": 72.00
    },
    ingredients: ['Molho de ervas', 'Queijo coalho', 'Tambaqui grelhado', 'Tomate cereja', 'Rúcula']
  },
  {
    id: '3',
    name: 'Pizza Açaí com Tapioca',
    description: 'Pizza doce com cream cheese, açaí, granola e tapioca crocante',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop',
    prices: {
      P: 26.00,
      M: 36.00,
      G: 45.00,
      GG: 55.00,
      "EX GG": 65.00
    },
    ingredients: ['Cream cheese', 'Açaí', 'Granola', 'Tapioca', 'Mel']
  },
  {
    id: '4',
    name: 'Pizza Cupuaçu com Chocolate',
    description: 'Pizza doce especial com creme de cupuaçu e gotas de chocolate belga',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    prices: {
      P: 30.00,
      M: 40.00,
      G: 50.00,
      GG: 60.00,
      "EX GG": 70.00
    },
    ingredients: ['Massa doce', 'Creme de cupuaçu', 'Chocolate belga', 'Coco ralado', 'Leite condensado']
  },
  {
    id: '5',
    name: 'Pizza de Camarão Regional',
    description: 'Pizza especial com camarão da região, queijo prato e molho de pimenta biquinho',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop',
    prices: {
      P: 35.00,
      M: 45.00,
      G: 55.00,
      GG: 65.00,
      "EX GG": 75.00
    },
    ingredients: ['Molho branco', 'Queijo prato', 'Camarão regional', 'Pimenta biquinho', 'Manjericão']
  },
  {
    id: '6',
    name: 'Pizza Nordestina',
    description: 'Pizza com carne de sol desfiada, queijo coalho, cebola caramelizada e pimenta',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    prices: {
      P: 33.00,
      M: 43.00,
      G: 53.00,
      GG: 63.00,
      "EX GG": 73.00
    },
    ingredients: ['Molho de tomate', 'Queijo coalho', 'Carne de sol', 'Cebola caramelizada', 'Pimenta dedo-de-moça']
  }
];
