
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FORMS } from '../constants';
import { Inspector, BusinessData, InspectionRecord, FormDefinition } from '../types';

interface FormWizardProps {
  onSave: (record: InspectionRecord) => void;
  inspectors: Inspector[];
  onAddInspector: (inspector: Inspector) => void;
  onDeleteInspector: (id: string) => void;
}

const SignaturePad: React.FC<{ 
  onSave: (dataUrl: string) => void, 
  onClear: () => void,
  placeholder: string,
  initialData?: string
}> = ({ onSave, onClear, placeholder, initialData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000';
    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = initialData;
    }
  }, [initialData]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onSave(canvas.toDataURL());
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return (
    <div className="relative w-full h-44 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group shadow-inner">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full cursor-crosshair touch-none"
      />
      {!initialData && !isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em]">
          {placeholder}
        </div>
      )}
      <button 
        type="button"
        onClick={(e) => { 
          e.preventDefault(); 
          const canvas = canvasRef.current; 
          const ctx = canvas?.getContext('2d');
          if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          onClear(); 
        }}
        className="absolute top-2 right-2 p-2 bg-white text-rose-500 rounded-xl shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
};

const FormWizard: React.FC<FormWizardProps> = ({ onSave, inspectors, onAddInspector }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formIdParam = searchParams.get('form');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedInspectorId, setSelectedInspectorId] = useState('');
  const [showAddInspector, setShowAddInspector] = useState(false);
  const [newInspector, setNewInspector] = useState<Omit<Inspector, 'id'>>({ name: '', nip: '', pangkatGol: '', jabatan: '', noPejabat: '', instansi: '', suratTugas: '' });
  
  const [business, setBusiness] = useState<BusinessData>({ 
    name: '', type: '', kbli: '', operatingYear: '', capitalStatus: 'PMDN', 
    responsiblePerson: '', responsibleTitle: '', phone: '', address: '', 
    coordinates: { latitude: null, longitude: null }, 
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) 
  });

  const [locating, setLocating] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [inspectorSign, setInspectorSign] = useState('');
  const [responsibleSign, setResponsibleSign] = useState('');

  useEffect(() => {
    if (formIdParam) {
      const found = FORMS.find(f => f.id === formIdParam);
      if (found) {
        setSelectedForm(found);
      }
    }
  }, [formIdParam]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser/Perangkat tidak mendukung fitur GPS.");
      return;
    }

    setLocating(true);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setBusiness(prev => ({ 
          ...prev, 
          coordinates: { latitude, longitude } 
        }));
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        console.error("GPS Error:", err);
        alert(`Gagal mengambil koordinat: ${err.message}. Pastikan izin lokasi aktif.`);
      },
      options
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => setPhotos(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleFinalSave = () => {
    const inspector = inspectors.find(i => i.id === selectedInspectorId);
    if (!inspector || !selectedForm) return;
    setIsSaving(true);
    
    const record: InspectionRecord = { 
      id: Math.random().toString(36).substr(2, 9).toUpperCase(), 
      inspector, 
      business, 
      formId: selectedForm.id, 
      formTitle: selectedForm.title, 
      responses, 
      notes: '', 
      photos, 
      signatures: { 
        inspector: inspectorSign, 
        responsible: responsibleSign 
      }, 
      createdAt: new Date().toISOString() 
    };
    
    setTimeout(() => { 
      onSave(record); 
      setIsSaving(false); 
      navigate('/history'); 
    }, 1500);
  };

  const steps = [
    { id: 1, label: 'Pengawas', icon: '👤' },
    { id: 2, label: 'Identitas', icon: '🏢' },
    { id: 3, label: 'Formulir', icon: '📋' },
    { id: 4, label: 'Checklist', icon: '🔍' },
    { id: 5, label: 'Sahkan', icon: '🖋️' }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fadeIn px-2">
      {/* Stepper Navigation */}
      <div className="mb-10 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex justify-between items-center min-w-[500px] px-4">
          {steps.map((s, idx) => {
            // Jika form sudah dipilih dari dashboard, step 3 (Pilih Formulir) bisa dilewati
            const isSelectFormStep = s.id === 3;
            if (isSelectFormStep && formIdParam) return null;

            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2">
                  <button 
                    disabled={s.id > step && !((s.id === 4 || s.id === 5) && step >= 2 && selectedForm)}
                    onClick={() => s.id < step && setStep(s.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm border-2 ${step === s.id ? 'bg-[#004d40] border-[#004d40] text-white scale-110 shadow-emerald-100' : step > s.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-gray-100 text-gray-300'}`}
                  >
                    {step > s.id ? '✓' : s.icon}
                  </button>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#004d40]' : 'text-gray-300'}`}>{s.label}</span>
                </div>
                {idx < steps.length - 1 && !(idx === 1 && formIdParam) && (
                  <div className={`flex-1 h-1 mx-4 rounded-full ${step > s.id ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-slideIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#004d40] rounded-full"></span>
            Pilih Pejabat Pengawas
          </h2>
          {!showAddInspector ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inspectors.map(i => (
                  <button key={i.id} onClick={() => setSelectedInspectorId(i.id)} className={`w-full p-6 rounded-2xl border-2 text-left transition-all group ${selectedInspectorId === i.id ? 'border-[#004d40] bg-emerald-50/50 ring-4 ring-emerald-50' : 'border-gray-50 bg-gray-50/30 hover:border-emerald-200'}`}>
                    <p className="font-bold text-gray-900 text-base mb-1">{i.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">NIP: {i.nip}</p>
                  </button>
                ))}
                <button onClick={() => setShowAddInspector(true)} className="p-8 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-[#004d40] hover:border-[#004d40] transition-all flex flex-col items-center justify-center gap-3 bg-gray-50/30">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl">+</div>
                  <span className="font-bold uppercase text-[10px] tracking-widest">Tambah Pengawas</span>
                </button>
              </div>
              <button disabled={!selectedInspectorId} onClick={() => setStep(2)} className="w-full bg-[#004d40] disabled:bg-gray-200 text-white font-bold py-5 rounded-2xl shadow-xl mt-8 transition-all uppercase text-xs tracking-[0.2em]">Lanjut ke Data Usaha</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); const id = Math.random().toString(36).substr(2, 9); onAddInspector({ ...newInspector, id }); setSelectedInspectorId(id); setShowAddInspector(false); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="Nama Lengkap & Gelar" className="md:col-span-2 w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40]" value={newInspector.name} onChange={e => setNewInspector({...newInspector, name: e.target.value})} required />
                <input placeholder="NIP" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40]" value={newInspector.nip} onChange={e => setNewInspector({...newInspector, nip: e.target.value})} required />
                <input placeholder="Jabatan" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40]" value={newInspector.jabatan} onChange={e => setNewInspector({...newInspector, jabatan: e.target.value})} required />
              </div>
              <div className="flex gap-4 pt-4"><button type="button" onClick={() => setShowAddInspector(false)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Batal</button><button type="submit" className="flex-1 py-4 bg-[#004d40] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg">Simpan & Pilih</button></div>
            </form>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-slideIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <span className="w-1.5 h-8 bg-teal-600 rounded-full"></span>
            Identitas Usaha / Kegiatan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nama Badan Usaha</label>
              <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-600" value={business.name} onChange={e => setBusiness({...business, name: e.target.value})} placeholder="Masukkan nama PT / CV..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">KBLI / Sektor</label>
              <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-600" value={business.kbli} onChange={e => setBusiness({...business, kbli: e.target.value})} placeholder="Nomor KBLI..." />
            </div>
            
            {/* GPS Section */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Tagging GPS Lapangan</label>
              <button 
                type="button"
                onClick={handleGetLocation} 
                disabled={locating}
                className={`w-full p-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm ${business.coordinates.latitude ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-500' : 'bg-teal-50 text-teal-700 border-2 border-teal-100 hover:border-teal-300'}`}
              >
                {locating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-teal-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mencari Sinyal GPS...
                  </>
                ) : business.coordinates.latitude ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    Lokasi Terkunci
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    Ambil Koordinat Lapangan
                  </>
                )}
              </button>
              {business.coordinates.latitude && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between animate-fadeIn">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-tighter">Latitude</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700">{business.coordinates.latitude.toFixed(7)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-tighter">Longitude</span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700">{business.coordinates.longitude?.toFixed(7)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Alamat Lokasi</label>
              <textarea rows={3} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-600 resize-none" value={business.address} onChange={e => setBusiness({...business, address: e.target.value})} placeholder="Alamat lengkap operasional..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nama Penanggung Jawab</label>
              <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-600" value={business.responsiblePerson} onChange={e => setBusiness({...business, responsiblePerson: e.target.value})} placeholder="Pihak perusahaan..." />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Jabatan Pihak Usaha</label>
              <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-teal-600" value={business.responsibleTitle} onChange={e => setBusiness({...business, responsibleTitle: e.target.value})} placeholder="Jabatan di perusahaan..." />
            </div>
          </div>
          <div className="flex gap-4 mt-12">
            <button onClick={() => setStep(1)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Kembali</button>
            <button 
              onClick={() => {
                if (formIdParam) {
                  setStep(4);
                } else {
                  setStep(3);
                }
              }} 
              className="flex-1 bg-[#004d40] text-white py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl"
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-slideIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b pb-4">Katalog Formulir Pengawasan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMS.map(form => (
              <button key={form.id} onClick={() => { setSelectedForm(form); setStep(4); }} className={`p-6 rounded-3xl border-2 text-left flex items-center gap-5 group shadow-sm transition-all ${selectedForm?.id === form.id ? 'border-[#004d40] bg-emerald-50/50' : 'border-gray-50 bg-gray-50/20 hover:border-emerald-200'}`}>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-[#004d40] flex items-center justify-center group-hover:scale-110 transition-transform">{form.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#004d40]">{form.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Checklist {form.id}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && selectedForm && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-slideIn">
          <div className="bg-[#004d40] p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight">{selectedForm.title}</h2>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Berdasarkan PP 22/2021 & Permen 14/2024</p>
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center">{selectedForm.icon}</div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              {selectedForm.fields.map(field => (
                <div key={field.id} className="py-6 border-b border-gray-100 last:border-none">
                  <label className="block text-gray-800 font-bold mb-4 text-sm leading-relaxed">{field.label}</label>
                  {field.type === 'boolean' ? (
                    <div className="flex gap-4 max-w-xs">
                      <button onClick={() => setResponses({...responses, [field.id]: true})} className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm ${responses[field.id] === true ? 'bg-[#004d40] text-white ring-4 ring-emerald-50' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>YA</button>
                      <button onClick={() => setResponses({...responses, [field.id]: false})} className={`flex-1 py-4 rounded-2xl font-bold text-xs transition-all shadow-sm ${responses[field.id] === false ? 'bg-rose-600 text-white ring-4 ring-rose-50' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>TIDAK</button>
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea rows={3} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40] text-sm resize-none" placeholder="Keterangan temuan..." value={responses[field.id] || ''} onChange={e => setResponses({...responses, [field.id]: e.target.value})} />
                  ) : (
                    <input className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#004d40] text-sm" placeholder="Keterangan..." value={responses[field.id] || ''} onChange={e => setResponses({...responses, [field.id]: e.target.value})} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]">Foto Dokumentasi Lapangan</label>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase">Wajib lampiran dokumentasi visual</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-[#004d40] text-[#004d40] px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#004d40] hover:text-white transition-all shadow-sm">Ambil Foto</button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" multiple accept="image/*" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {photos.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-3xl overflow-hidden border-2 border-white group shadow-md">
                    <img src={p} className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-rose-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 shadow-lg">✕</button>
                  </div>
                ))}
                {photos.length === 0 && (
                  <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-300 text-[10px] font-bold uppercase tracking-widest">
                    Belum ada foto terlampir
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-16">
              <button onClick={() => setStep(formIdParam ? 2 : 3)} className="flex-1 py-5 border-2 border-gray-100 rounded-3xl font-bold text-xs uppercase tracking-widest">Kembali</button>
              <button onClick={() => setStep(5)} className="flex-[2] bg-[#004d40] text-white py-5 rounded-3xl font-bold text-xs uppercase tracking-widest shadow-2xl">Lanjut Pengesahan</button>
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 text-center animate-slideIn">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Penandatanganan Berita Acara</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verifikasi Lapangan Digital Sah</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6 flex flex-col items-center">
              <div className="px-5 py-2 bg-emerald-50 text-[#004d40] rounded-xl text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm">Pihak I - Pengawas</div>
              <SignaturePad onSave={setInspectorSign} onClear={() => setInspectorSign('')} placeholder="Tanda Tangan Pengawas" initialData={inspectorSign} />
              <div className="mt-4 border-b-2 border-gray-800 inline-block px-4 pb-1">
                <p className="font-bold text-gray-900 text-lg uppercase tracking-tight">{inspectors.find(i => i.id === selectedInspectorId)?.name}</p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">NIP: {inspectors.find(i => i.id === selectedInspectorId)?.nip}</p>
            </div>
            <div className="space-y-6 flex flex-col items-center">
              <div className="px-5 py-2 bg-teal-50 text-teal-700 rounded-xl text-[9px] font-black uppercase tracking-widest mb-2 shadow-sm">Pihak II - Usaha</div>
              <SignaturePad onSave={setResponsibleSign} onClear={() => setResponsibleSign('')} placeholder="Tanda Tangan Penanggung Jawab" initialData={responsibleSign} />
              <div className="mt-4 border-b-2 border-gray-800 inline-block px-4 pb-1">
                <p className="font-bold text-gray-900 text-lg uppercase tracking-tight">{business.responsiblePerson || 'PENANGGUNG JAWAB'}</p>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">{business.responsibleTitle || 'Verified Identity'}</p>
            </div>
          </div>
          <button 
            onClick={handleFinalSave} 
            disabled={!inspectorSign || !responsibleSign || isSaving} 
            className="w-full bg-[#004d40] hover:bg-[#003d33] text-white font-bold py-6 rounded-3xl mt-20 text-xs uppercase tracking-[0.3em] shadow-2xl transition-all transform active:scale-95 disabled:bg-gray-100 disabled:shadow-none"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sinkronisasi Data...
              </span>
            ) : "Sahkan & Terbitkan Berita Acara"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FormWizard;
