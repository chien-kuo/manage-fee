import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import DataTable from './components/DataTable';
import ProgressOverview from './components/ProgressOverview';
import AdminToolbar from './components/AdminToolbar';
import AdminLoginModal from './components/AdminLoginModal';
import { useAuth } from './hooks/useAuth';
import { useData } from './hooks/useData';

const App: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { errorMsg } = useData();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen pb-12 flex flex-col relative font-sans">
      {/* Error Banner */}
      {errorMsg && (
        <div className="bg-red-600 text-white px-4 py-3 text-center shadow-md animate-pulse flex items-center justify-center gap-2">
          <AlertCircle size={20} />
          {errorMsg}
        </div>
      )}

      <Header onShowLogin={() => setShowLogin(true)} />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        {isAdmin && <AdminToolbar />}

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left: Input Form (hidden for admin) */}
          {!isAdmin && (
            <div className="md:col-span-4">
              <InputForm />
            </div>
          )}

          {/* Right: Display Table */}
          <div className={isAdmin ? "md:col-span-12" : "md:col-span-8"}>
            <DataTable />
          </div>
        </div>

        <ProgressOverview />
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 mt-auto border-t bg-white/50">
        <p>App ID: <span className="font-mono bg-gray-200 px-1 rounded text-gray-600">{import.meta.env.VITE_APP_ID}</span></p>
        <p className="mt-1">
          Status: {user ? (user.isAnonymous ? '已連線 (匿名訪客)' : '已連線 (管理員)') : '連線中...'}
        </p>
      </footer>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default App;
