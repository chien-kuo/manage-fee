import React, { useState } from 'react';
import { X, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminLoginModalProps {
  onClose: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose }) => {
  const { loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAsAdmin(email, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') setError('帳號或密碼錯誤');
      else setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Lock size={20} className="mr-2 text-orange-500" />
            登入後台
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">管理者信箱</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
              placeholder="example@mail.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border rounded p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none" 
              placeholder="••••••••" 
            />
          </div>
          
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded font-bold hover:from-orange-600 hover:to-amber-600 transition flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : '安全登入'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
