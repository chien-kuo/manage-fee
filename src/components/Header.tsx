import React from 'react';
import { Building2, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onShowLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLogin }) => {
  const { isAdmin, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold flex items-center">
          <Building2 className="mr-3" />管理費匯整
        </h1>
        <button 
          onClick={() => isAdmin ? logout() : onShowLogin()}
          className={`text-sm px-4 py-2 rounded transition flex items-center ${
            isAdmin 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-orange-600 hover:bg-orange-700 border border-orange-300'
          }`}
        >
          {isAdmin ? (
            <>
              <LogOut size={16} className="mr-2" />
              登出管理
            </>
          ) : (
            <>
              <ShieldCheck size={16} className="mr-2" />
              管理者後台
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
