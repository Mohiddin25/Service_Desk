import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { DashboardView } from './pages/DashboardView';
import { AIAssistantView } from './pages/AIAssistantView';
import { TicketsView } from './pages/TicketsView';
import { KnowledgeBaseView } from './pages/KnowledgeBaseView';
import { AssetsView } from './pages/AssetsView';
import { NotificationsView } from './pages/NotificationsView';
import { UserManagementView } from './pages/UserManagementView';
import { ReportsView } from './pages/ReportsView';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsView } from './pages/SettingsView';

import { TicketModal } from './components/TicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { FAQFormModal } from './components/FAQFormModal';
import { BulkUploadModal } from './components/BulkUploadModal';
import { AssetModal } from './components/AssetModal';
import { UserModal } from './components/UserModal';

import { ticketApi } from './api/ticketApi';
import { assetApi } from './api/assetApi';

const MainAppLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);

  // Modals state
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAddFaqModalOpen, setIsAddFaqModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const tData = await ticketApi.getAll();
    setTickets(tData);
    const aData = await assetApi.getAll();
    setAssets(aData);
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
        isOpen={isSidebarOpen}
        onNewTicketClick={() => setIsTicketModalOpen(true)}
      />

      {isSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      <div className="main-viewport">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadNotificationsCount={2}
        />

        {activeTab === 'dashboard' && (
          <DashboardView
            tickets={tickets}
            assets={assets}
            setActiveTab={setActiveTab}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            onOpenAddFaqModal={() => setIsAddFaqModalOpen(true)}
            onSelectTicket={setSelectedTicket}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistantView
            onOpenAddFaqModal={() => setIsAddFaqModalOpen(true)}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'tickets' && (
          <TicketsView
            tickets={tickets}
            onOpenTicketModal={() => setIsTicketModalOpen(true)}
            onSelectTicket={setSelectedTicket}
          />
        )}

        {activeTab === 'kb' && (
          <KnowledgeBaseView
            onOpenAddFaqModal={() => setIsAddFaqModalOpen(true)}
            onOpenBulkModal={() => setIsBulkModalOpen(true)}
          />
        )}

        {activeTab === 'assets' && (
          <AssetsView
            onOpenAssetModal={() => setIsAssetModalOpen(true)}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView />
        )}

        {activeTab === 'users' && (
          <UserManagementView onOpenUserModal={() => setIsUserModalOpen(true)} />
        )}

        {activeTab === 'reports' && (
          <ReportsView />
        )}

        {activeTab === 'profile' && (
          <ProfilePage />
        )}

        {activeTab === 'settings' && (
          <SettingsView />
        )}
      </div>

      {/* Application Modals */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onTicketCreated={loadInitialData}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={loadInitialData}
      />

      <FAQFormModal
        isOpen={isAddFaqModalOpen}
        onClose={() => setIsAddFaqModalOpen(false)}
        onFaqAdded={loadInitialData}
      />

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onFaqsUploaded={loadInitialData}
      />

      <AssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onAssetCreated={loadInitialData}
      />

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserCreated={loadInitialData}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MainAppLayout />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
