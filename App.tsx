
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormWizard from './pages/FormWizard';
import History from './pages/History';
import Layout from './components/Layout';
import { User, InspectionRecord, Inspector } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecoinspect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [inspectors, setInspectors] = useState<Inspector[]>(() => {
    const saved = localStorage.getItem('ecoinspect_inspectors');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<InspectionRecord[]>(() => {
    const saved = localStorage.getItem('ecoinspect_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecoinspect_user', JSON.stringify(user));
    localStorage.setItem('ecoinspect_inspectors', JSON.stringify(inspectors));
    localStorage.setItem('ecoinspect_history', JSON.stringify(history));
  }, [user, inspectors, history]);

  const handleLogin = (name: string) => setUser({ name });
  const handleLogout = () => setUser(null);
  
  const addInspector = (inspector: Inspector) => setInspectors(prev => [...prev, inspector]);
  const deleteInspector = (id: string) => setInspectors(prev => prev.filter(i => i.id !== id));
  
  const addRecord = (record: InspectionRecord) => setHistory(prev => [record, ...prev]);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard 
                inspectors={inspectors} 
                onDeleteInspector={deleteInspector}
              />
            </Layout>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/new-inspection" 
          element={user ? (
            <Layout user={user} onLogout={handleLogout}>
              <FormWizard 
                onSave={addRecord} 
                inspectors={inspectors} 
                onAddInspector={addInspector}
                onDeleteInspector={deleteInspector}
              />
            </Layout>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/history" 
          element={user ? (
            <Layout user={user} onLogout={handleLogout}>
              <History records={history} />
            </Layout>
          ) : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
