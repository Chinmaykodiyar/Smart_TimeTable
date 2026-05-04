import React, { useState } from 'react';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './pages/Overview';
import Timetables from './pages/Timetables';
import LeaveManager from './pages/LeaveManager';
import Help from './pages/Help';

// Main application shell (Sidebar + TopBar + active page)
function MainApp() {
  const { activeView, setActiveView } = useApp();
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Set default view on login
  React.useEffect(() => {
    if (currentUser?.role === 'teacher' && activeView === 'overview') {
      setActiveView('dashboard');
    } else if (currentUser?.role === 'admin' && activeView === 'dashboard') {
      setActiveView('overview');
    }
  }, [currentUser]);

  const renderPage = () => {
    switch (activeView) {
      case 'dashboard':  return <TeacherDashboard />;
      case 'timetables': return <Timetables />;
      case 'leave':      return currentUser?.role === 'admin' ? <LeaveManager /> : <TeacherDashboard />;
      case 'overview':   return currentUser?.role === 'admin' ? <Overview /> : <TeacherDashboard />;
      case 'help':       return <Help />;
      default:           return currentUser?.role === 'admin' ? <Overview /> : <TeacherDashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <TopBar onHamburger={() => setMobileOpen(v => !v)} />
        <main key={activeView}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// Router: decides which shell to show based on auth state
function AppRouter() {
  const { currentUser } = useAuth();

  if (!currentUser) return <LoginPage />;
  return <MainApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </AuthProvider>
  );
}
