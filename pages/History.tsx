
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InspectionRecord } from '../types';
import { FORMS } from '../constants';

interface HistoryProps { records: InspectionRecord[]; }

const History: React.FC<HistoryProps> = ({ records }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRecord, setActiveRecord] = useState<InspectionRecord | null>(null);

  const filteredRecords = records.filter(r => 
    r.business.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.inspector.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (record: InspectionRecord) => {
    setActiveRecord(record);
    setTimeout(() => { window.print(); setActiveRecord(null); }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn px-2">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <button onClick={() => navigate('/')} className="text-[#004d40] hover:text-[#00695c] flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Kembali
        </button>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Arsip Pengawasan</h2>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 print:hidden">
        <div className="relative">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Cari berdasarkan nama perusahaan atau pejabat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#004d40] transition-all text-sm font-medium" />
        </div>
      </div>

      <div className="space-y-4 print:hidden">
        {filteredRecords.length > 0 ? filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl transition-all group">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <span className="text-[9px] font-black bg-emerald-50 text-[#004d40] px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">BA Form {record.formId}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(record.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-[#004d40] transition-colors">{record.business.name}</h3>
              <p className="text-xs text-gray-500 mt-2 font-medium">Oleh: <span className="font-bold text-gray-700">{record.inspector.name}</span></p>
            </div>
            <button onClick={() => handlePrint(record)} className="bg-[#004d40] hover:bg-[#003d33] text-white px-10 py-5 rounded-[2rem] font-bold shadow-2xl shadow-emerald-200/50 flex items-center gap-3 transition-all transform active:scale-95 text-[10px] uppercase tracking-[0.2em]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Unduh BA PDF
            </button>
          </div>
        )) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-bold uppercase tracking-[0.3em] text-sm">Belum ada arsip data</p>
          </div>
        )}
      </div>

      {activeRecord && (
        <div className="hidden print:block bg-white text-black p-12 font-serif" id="printable-ba">
          {/* Regulatory Header */}
          <div className="text-center mb-10 border-b-2 border-black pb-6 uppercase font-sans">
            <p className="text-[11px] font-bold mb-1">LAMPIRAN IV PERATURAN MENTERI LINGKUNGAN HIDUP DAN KEHUTANAN REPUBLIK INDONESIA</p>
            <p className="text-[11px] font-bold mb-1">NOMOR 14 TAHUN 2024</p>
            <p className="text-[11px] italic font-bold">Tentang Tata Cara Pengawasan Lingkungan Hidup Berdasarkan PP No. 22 Tahun 2021</p>
          </div>

          <div className="text-center font-bold mb-12">
            <p className="text-2xl underline decoration-2 underline-offset-4">BERITA ACARA</p>
            <p className="text-2xl">PENGAWASAN LINGKUNGAN HIDUP</p>
            <p className="text-sm font-sans font-normal mt-2">Nomor: {activeRecord.id.toUpperCase()}/BA-PPLH/{new Date().getFullYear()}</p>
          </div>

          <p className="mb-10 text-base text-justify leading-relaxed">
            Pada hari ini, tanggal {new Date(activeRecord.business.date).getDate()} bulan {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(activeRecord.business.date))} tahun {new Date(activeRecord.business.date).getFullYear()}, 
            bertempat di lokasi PT. {activeRecord.business.name.toUpperCase()}, telah dilakukan pengawasan ketaatan lingkungan hidup sebagaimana diatur dalam Pasal 493 Peraturan Pemerintah No. 22 Tahun 2021, dengan rincian sebagai berikut:
          </p>

          <div className="mb-10">
            <p className="font-bold text-base mb-4 bg-gray-100 p-2 font-sans border-l-4 border-black">I. DATA UMUM & IDENTITAS</p>
            <table className="w-full text-sm mt-2 border-collapse">
              <tbody>
                <tr><td className="w-64 font-bold border border-black p-3">Nama Pejabat Pengawas</td><td className="border border-black p-3 font-bold">{activeRecord.inspector.name}</td></tr>
                <tr><td className="font-bold border border-black p-3">NIP / Jabatan</td><td className="border border-black p-3">{activeRecord.inspector.nip} / {activeRecord.inspector.jabatan}</td></tr>
                <tr><td className="font-bold border border-black p-3">Nama Perusahaan</td><td className="border border-black p-3">PT. {activeRecord.business.name.toUpperCase()}</td></tr>
                <tr><td className="font-bold border border-black p-3">KBLI / Sektor</td><td className="border border-black p-3">{activeRecord.business.kbli}</td></tr>
                <tr><td className="font-bold border border-black p-3">Koordinat Lokasi (GPS)</td><td className="border border-black p-3 font-mono">{activeRecord.business.coordinates.latitude ? `${activeRecord.business.coordinates.latitude}, ${activeRecord.business.coordinates.longitude}` : 'Manual Input'}</td></tr>
                <tr><td className="font-bold border border-black p-3">Alamat Lengkap</td><td className="border border-black p-3 italic">{activeRecord.business.address}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <p className="font-bold text-base bg-gray-100 p-2 font-sans border-l-4 border-black mb-4 uppercase">II. HASIL VERIFIKASI LAPANGAN (FORM {activeRecord.formId})</p>
            <table className="w-full text-[11px] border-collapse border border-black font-sans">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-3 w-10 text-center">NO</th>
                  <th className="border border-black p-3">KETENTUAN / KRITERIA PEMERIKSAAN</th>
                  <th className="border border-black p-3 w-12 text-center">YA</th>
                  <th className="border border-black p-3 w-12 text-center">TDK</th>
                  <th className="border border-black p-3">KETERANGAN / TEMUAN</th>
                </tr>
              </thead>
              <tbody>
                {FORMS.find(f => f.id === activeRecord.formId)?.fields.map((field, idx) => {
                  if (field.type === 'header') return <tr key={field.id} className="bg-gray-50 font-bold"><td colSpan={5} className="border border-black p-2 uppercase italic text-[9px]">{field.label}</td></tr>;
                  const res = activeRecord.responses[field.id];
                  return (
                    <tr key={field.id}>
                      <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                      <td className="border border-black p-2">{field.label}</td>
                      <td className="border border-black p-2 text-center font-bold">{res === true ? 'V' : ''}</td>
                      <td className="border border-black p-2 text-center font-bold">{res === false ? 'V' : ''}</td>
                      <td className="border border-black p-2 text-gray-700 italic">{typeof res === 'string' ? res : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mb-10">
            <p className="font-bold text-base bg-gray-100 p-2 font-sans border-l-4 border-black mb-4 uppercase">III. KESIMPULAN & EVALUASI PENGAWAS</p>
            <div className="p-4 border border-black bg-gray-50 italic text-sm leading-relaxed">
              {activeRecord.notes || "Pengawasan dilakukan secara menyeluruh sesuai dengan daftar periksa. Penanggung jawab usaha kooperatif dalam memberikan data dan akses lapangan."}
            </div>
          </div>

          {activeRecord.photos && activeRecord.photos.length > 0 && (
            <div className="mb-10 break-before-page">
              <p className="font-bold text-base bg-gray-100 p-2 font-sans border-l-4 border-black mb-6 uppercase text-center">LAMPIRAN FOTO DOKUMENTASI</p>
              <div className="grid grid-cols-2 gap-6">
                {activeRecord.photos.map((photo, index) => (
                  <div key={index} className="border border-black p-2 flex flex-col items-center">
                    <img src={photo} alt={`Dokumentasi ${index}`} className="w-full h-auto max-h-[350px] object-contain shadow-sm" />
                    <p className="text-[10px] font-sans font-bold mt-3 uppercase tracking-widest text-gray-500">Gambar #{index + 1}: Kondisi Lapangan</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-24 flex justify-between px-16 text-center font-sans">
            <div className="w-72 flex flex-col items-center">
              <p className="font-bold mb-1">PIHAK I (KLHK/DINAS),</p>
              <p className="text-[10px] italic mb-4">Pejabat Pengawas Lingkungan Hidup</p>
              <div className="h-32 w-52 border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                {activeRecord.signatures.inspector ? <img src={activeRecord.signatures.inspector} className="max-h-full max-w-full" alt="TTD Pengawas" /> : <div className="text-[9px] text-gray-200">BELUM TANDA TANGAN</div>}
              </div>
              <p className="font-bold underline uppercase text-sm">{activeRecord.inspector.name}</p>
              <p className="text-[10px] mt-1">NIP. {activeRecord.inspector.nip}</p>
            </div>
            <div className="w-72 flex flex-col items-center">
              <p className="font-bold mb-1">PIHAK II (USAHA),</p>
              <p className="text-[10px] italic mb-4">Penanggung Jawab Usaha/Kegiatan</p>
              <div className="h-32 w-52 border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                {activeRecord.signatures.responsible ? <img src={activeRecord.signatures.responsible} className="max-h-full max-w-full" alt="TTD Usaha" /> : <div className="text-[9px] text-gray-200">BELUM TANDA TANGAN</div>}
              </div>
              <p className="font-bold underline uppercase text-sm">{activeRecord.business.responsiblePerson || '...........................'}</p>
              <p className="text-[10px] mt-1">{activeRecord.business.responsibleTitle || 'Pihak Penanggung Jawab'}</p>
            </div>
          </div>

          <div className="mt-32 text-center text-[9px] font-sans border-t border-gray-200 pt-6 opacity-40 italic">
            Dokumen Berita Acara ini diterbitkan secara elektronik melalui EcoInspect Pro dan memiliki kekuatan hukum yang sah sesuai dengan ketentuan peraturan perundang-undangan di bidang Lingkungan Hidup.
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
