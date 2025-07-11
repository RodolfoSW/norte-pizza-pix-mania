
import { Pizza, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="amazon-gradient text-white py-6 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center space-x-3 flex-1">
            <Pizza size={32} className="text-yellow-300" />
            <div className="text-center">
              <h1 className="text-3xl font-bold">Norte Pizza Mania</h1>
              <p className="text-green-100 text-sm">Sabores autênticos da Amazônia</p>
            </div>
          </div>
          <Link 
            to="/admin/login" 
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Área Administrativa"
          >
            <Settings size={20} />
            <span className="hidden sm:inline text-sm">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
