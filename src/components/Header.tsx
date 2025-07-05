
import { Pizza } from 'lucide-react';

const Header = () => {
  return (
    <header className="amazon-gradient text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <Pizza size={32} className="text-yellow-300" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Norte Pizza Mania</h1>
            <p className="text-green-100 text-sm">Sabores autênticos da Amazônia</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
