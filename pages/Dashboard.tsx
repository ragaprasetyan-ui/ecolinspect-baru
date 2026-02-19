
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FORMS } from '../constants';
import { Inspector } from '../types';

interface DashboardProps {
  inspectors: Inspector[];
  onDeleteInspector: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ inspectors }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#004d40] to-[#00695c] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">EcoInspect <span className="text-[#FFD700]">Pro</span></h2>
          <p className="text-emerald-50 mb-6 text-sm max-w-md leading-relaxed opacity-90">
            Sistem Digitalisasi Pengawasan Lingkungan Hidup sesuai amanat <strong>PP No. 22 Tahun 2021</strong> dan <strong>PermenLHK No. 14 Tahun 2024</strong>.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/history')}
              className="bg-white text-[#004d40] hover:bg-emerald-50 px-8 py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-3 transition-all transform active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Lihat Arsip Berita Acara
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#004d40] mb-6 flex items-center gap-4">
          <span className="flex-1 h-px bg-emerald-100"></span>
          Katalog Formulir Pengawasan
          <span className="flex-1 h-px bg-emerald-100"></span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FORMS.map((form) => (
            <button
              key={form.id}
              onClick={() => navigate(`/new-inspection?form=${form.id}`)}
              className="group bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-[#004d40] hover:shadow-xl transition-all text-left flex flex-col h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all">
                {form.icon}
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-[#004d40] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#004d40] group-hover:text-white transition-all shadow-sm">
                {form.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2 leading-tight group-hover:text-[#004d40]">{form.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-auto group-hover:text-[#004d40]">Mulai Checklist {form.id}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 border-l-4 border-[#004d40] p-4 rounded-r-2xl mt-12">
        <p className="text-[10px] font-bold text-[#004d40] uppercase tracking-widest mb-1">Status Database Lokal</p>
        <p className="text-xs text-[#00695c]">
          Tersimpan <strong>{inspectors.length} data pejabat pengawas</strong> di perangkat ini.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
