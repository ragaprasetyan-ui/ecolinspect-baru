import React from 'react';

export interface User {
  name: string;
}

export interface Inspector {
  id: string;
  name: string;
  nip: string;
  pangkatGol: string;
  jabatan: string;
  noPejabat: string;
  instansi: string;
  suratTugas: string;
}

export interface BusinessData {
  name: string;
  type: string;
  kbli: string;
  operatingYear: string;
  capitalStatus: 'PMDN' | 'PMA' | 'BUMN' | string;
  responsiblePerson: string;
  responsibleTitle: string;
  phone: string;
  address: string;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  date: string;
  time: string;
}

export interface ChecklistField {
  id: string;
  label: string;
  type: 'boolean' | 'text' | 'textarea' | 'table' | 'header';
  columns?: string[];
  rows?: string[];
}

export interface FormDefinition {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fields: ChecklistField[];
}

export interface InspectionRecord {
  id: string;
  inspector: Inspector;
  business: BusinessData;
  formId: string;
  formTitle: string;
  responses: Record<string, any>;
  notes: string;
  photos: string[];
  signatures: {
    inspector: string;
    responsible: string;
  };
  createdAt: string;
}
