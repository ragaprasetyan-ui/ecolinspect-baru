
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004d40] to-[#002e27] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="mb-6 inline-flex p-4 bg-[#e0f2f1] rounded-full text-[#004d40]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">EcoInspect <span className="text-[#D4AF37]">Pro</span></h1>
        <p className="text-gray-500 mb-8 font-medium">Sistem Pengawasan Lingkungan Digital</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wider">Nama Pengawas</label>
            <input
              autoFocus
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#004d40] focus:border-transparent transition-all outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#004d40] hover:bg-[#003d33] text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all transform active:scale-95"
          >
            Masuk ke Sistem
          </button>
        </form>
        
        <p className="mt-8 text-xs text-gray-400">
          Gunakan aplikasi ini untuk melakukan inspeksi berkala sesuai standar regulasi lingkungan hidup yang berlaku.
        </p>
      </div>
    </div>
  );
};

export default Login;
