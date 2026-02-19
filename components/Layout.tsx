
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#004d40] text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            EcoInspect <span className="text-[#FFD700]">Pro</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-[10px] leading-tight opacity-90">
              <span className="font-bold">{user.name}</span>
              <span className="text-[#a7ffeb]">Pengawas</span>
            </div>
            <button 
              onClick={() => {
                onLogout();
                navigate('/login');
              }}
              className="bg-[#00695c] hover:bg-[#00796b] px-3 py-1.5 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-2 py-4">
        {children}
      </main>

      <footer className="bg-white border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-[9px] uppercase font-bold tracking-widest">
          &copy; {new Date().getFullYear()} EcoInspect Pro - Sistem Pengawasan Digital
        </div>
      </footer>
    </div>
  );
};

export default Layout;
