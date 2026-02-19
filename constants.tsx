import React from 'react';
import { FormDefinition } from './types';

export const FORMS: FormDefinition[] = [
  {
    id: '6A',
    title: '6A Persetujuan Lingkungan',
    subtitle: 'Kewajiban Persetujuan Lingkungan',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    fields: [
      { id: '6a_1', label: 'Memiliki Persetujuan Lingkungan', type: 'boolean' },
      { id: '6a_2', label: 'Jenis Dokumen Lingkungan (AMDAL/UKL-UPL/SPPL)', type: 'text' },
      { id: '6a_3', label: 'Nomor Persetujuan Lingkungan', type: 'text' },
      { id: '6a_4', label: 'Kesesuaian kegiatan dengan persetujuan', type: 'boolean' },
      { id: '6a_5', label: 'Pelaporan berkala (setiap 6 bulan)', type: 'boolean' },
      { id: '6a_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6B',
    title: '6B PPMA Air Limbah',
    subtitle: 'Perlindungan & Pengelolaan Mutu Air',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    fields: [
      { id: '6b_1', label: 'Memiliki Persetujuan Teknis Air Limbah', type: 'boolean' },
      { id: '6b_2', label: 'Memiliki IPAL (Instalasi Pengolahan Air Limbah)', type: 'boolean' },
      { id: '6b_3', label: 'IPAL berfungsi dengan baik', type: 'boolean' },
      { id: '6b_4', label: 'Uji kualitas air limbah secara berkala', type: 'boolean' },
      { id: '6b_5', label: 'Kepatuhan terhadap baku mutu air limbah', type: 'boolean' },
      { id: '6b_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6C',
    title: '6C PPMU Udara',
    subtitle: 'Perlindungan & Pengelolaan Mutu Udara',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    fields: [
      { id: '6c_1', label: 'Persetujuan Teknis Emisi', type: 'boolean' },
      { id: '6c_2', label: 'Cerobong emisi tersedia dan sesuai standar', type: 'boolean' },
      { id: '6c_3', label: 'Memiliki alat pengendalian emisi', type: 'boolean' },
      { id: '6c_4', label: 'Uji emisi berkala terlaksana', type: 'boolean' },
      { id: '6c_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6D',
    title: '6D Pengelolaan B3',
    subtitle: 'Bahan Berbahaya dan Beracun',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    fields: [
      { id: '6d_1', label: 'Identifikasi B3 dilakukan', type: 'boolean' },
      { id: '6d_2', label: 'Penyimpanan B3 sesuai standar (safety)', type: 'boolean' },
      { id: '6d_3', label: 'Label dan simbol B3 terpasang jelas', type: 'boolean' },
      { id: '6d_4', label: 'Memiliki SOP pengelolaan B3', type: 'boolean' },
      { id: '6d_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6E',
    title: '6E Pengelolaan Limbah B3',
    subtitle: 'Limbah Bahan Berbahaya dan Beracun',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    fields: [
      { id: '6e_1', label: 'Menghasilkan Limbah B3', type: 'boolean' },
      { id: '6e_2', label: 'Memiliki TPS Limbah B3 berizin/terdaftar', type: 'boolean' },
      { id: '6e_3', label: 'Kondisi TPS memadai (layout, logbook, simbol)', type: 'boolean' },
      { id: '6e_4', label: 'Manifest limbah (Festronik) tersedia', type: 'boolean' },
      { id: '6e_5', label: 'Kerjasama dengan pengangkut/pengolah berizin', type: 'boolean' },
      { id: '6e_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6F',
    title: '6F Pengelolaan Limbah nonB3',
    subtitle: 'Limbah Non Bahan Berbahaya & Beracun',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fields: [
      { id: '6f_1', label: 'Pemilahan limbah nonB3 di sumber', type: 'boolean' },
      { id: '6f_2', label: 'Penyimpanan limbah nonB3 teratur', type: 'boolean' },
      { id: '6f_3', label: 'Pengangkutan oleh pihak ketiga berizin', type: 'boolean' },
      { id: '6f_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  },
  {
    id: '6G',
    title: '6G Pengelolaan Sampah',
    subtitle: 'Pengurangan dan Penanganan Sampah',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    fields: [
      { id: '6g_1', label: 'Program pengurangan sampah (3R)', type: 'boolean' },
      { id: '6g_2', label: 'Pemilahan sampah organik dan anorganik', type: 'boolean' },
      { id: '6g_3', label: 'Pengelolaan internal (komposting/bank sampah)', type: 'boolean' },
      { id: '6g_4', label: 'Kerjasama pengangkutan sampah ke TPA', type: 'boolean' },
      { id: '6g_notes', label: 'Catatan Pengawas', type: 'textarea' }
    ]
  }
];
