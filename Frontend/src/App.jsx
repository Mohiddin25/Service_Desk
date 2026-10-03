import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';
import { RoleGuard } from './components/layout/RoleGuard';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';

// Dashboards
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { TechnicianDashboard } from './pages/TechnicianDashboard';
import { ManagerDashboard } from './pages/ManagerDashboard';
import { AssetManagerDashboard } from './pages/AssetManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Shared / Sub-Views
import { TicketsPage } from './pages/TicketsPage';
import { CreateTicketForm } from './components/tickets/CreateTicketForm';
import { TechnicianTicketView } from './components/tickets/TechnicianTicketView';
import { KnowledgeList } from './components/knowledge/KnowledgeList';
import { AIAssistantChat } from './components/ai/AIAssistantChat';
import { AssetTable } from './components/assets/AssetTable';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { AssetFormModal } from './components/assets/AssetFormModal';
import { ReportsPage } from './pages/ReportsPage';
import { SlaMonitoringPage } from './pages/SlaMonitoringPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserTable } from './components/users/UserTable';
import { CreateUserModal } from './components/users/CreateUserModal';
import { Button } from './components/ui/Button';
import { Plus } from 'lucide-react';

// APIs
import { ticketApi } from './api/ticketApi';
import { assetApi } from './api/assetApi';
import { userApi } from './api/userApi';

const MainApp = () => {
  const { user, role, isAuthenticated } = useAuth();

  // Navigation State from Hash
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/dashboard';
  });

  // Selected Ticket for Workbench View
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Selected Asset for Modal
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isAssetAddOpen, setIsAssetAddOpen] = useState(false);
  const [isUserAddOpen, setIsUserAddOpen] = useState(false);

  // Notification Drawer
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Global Search
  const [searchQuery, setSearchQuery] = useState('');

  // Data Collections
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash.startsWith('/tickets/')) {
        const id = hash.replace('/tickets/', '');
        setSelectedTicketId(id);
      } else {
        setSelectedTicketId(null);
        setCurrentPath(hash || '/dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, role]);

  const loadData = async () => {
    try {
      const tData = await ticketApi.getAll();
      setTickets(tData || []);
      const aData = await assetApi.getAll();
      setAssets(aData || []);
      if (role === 'system_admin' || role === 'it_manager') {
        const uData = await userApi.getAll();
        setUsers(uData || []);
      }
    } catch (e) {
      console.error('Initial data load error:', e);
    }
  };

  const navigateTo = (path) => {
    setSelectedTicketId(null);
    setCurrentPath(path);
    window.location.hash = `#${path}`;
  };

  const handleSelectTicket = (t) => {
    const id = t._id || t.ticketNumber || t;
    setSelectedTicketId(id);
  };

  const handleBackToTickets = () => {
    setSelectedTicketId(null);
    const defaultTicketsPath = role === 'employee' ? '/my-tickets' : '/tickets';
    navigateTo(defaultTicketsPath);
  };

  // If not logged in, render LoginPage or RegisterPage
  if (!isAuthenticated) {
    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigateTo} />;
    }
    return <LoginPage onLoginSuccess={() => navigateTo('/dashboard')} onNavigate={navigateTo} />;
  }

  // If a ticket is selected, display the TechnicianTicketView
  if (selectedTicketId) {
    return (
      <AppShell
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <TechnicianTicketView
          ticketId={selectedTicketId}
          onBack={handleBackToTickets}
          onUpdate={loadData}
        />
        <NotificationDrawer
          isOpen={isNotificationDrawerOpen}
          onClose={() => setIsNotificationDrawerOpen(false)}
          onSelectTicket={handleSelectTicket}
        />
      </AppShell>
    );
  }

  // Main Page Content Dispatcher
  const renderContent = () => {
    // 1. Dashboard View
    if (currentPath === '/dashboard') {
      switch (role) {
        case 'employee':
          return (
            <EmployeeDashboard
              tickets={tickets}
              onNavigate={navigateTo}
              onSelectTicket={handleSelectTicket}
            />
          );
        case 'technician':
          return (
            <TechnicianDashboard
              tickets={tickets}
              onSelectTicket={handleSelectTicket}
            />
          );
        case 'it_manager':
          return (
            <ManagerDashboard
              tickets={tickets}
              onSelectTicket={handleSelectTicket}
              onNavigate={navigateTo}
            />
          );
        case 'asset_manager':
          return (
            <AssetManagerDashboard
              assets={assets}
              onUpdate={loadData}
            />
          );
        case 'system_admin':
          return (
            <AdminDashboard
              tickets={tickets}
              assets={assets}
            />
          );
        default:
          return (
            <EmployeeDashboard
              tickets={tickets}
              onNavigate={navigateTo}
              onSelectTicket={handleSelectTicket}
            />
          );
      }
    }

    // 2. Employee Specific Views
    if (currentPath === '/my-tickets') {
      return (
        <RoleGuard allowedRoles={['employee']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <TicketsPage
            title="My Tickets"
            subtitle="Support tickets submitted by you"
            tickets={tickets}
            onSelectTicket={handleSelectTicket}
            onNavigate={navigateTo}
          />
        </RoleGuard>
      );
    }

    if (currentPath === '/create-ticket') {
      return (
        <RoleGuard allowedRoles={['employee', 'technician', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <div className="view-container">
            <CreateTicketForm
              onTicketCreated={loadData}
              onNavigate={navigateTo}
            />
          </div>
        </RoleGuard>
      );
    }

    if (currentPath === '/my-assets') {
      return (
        <RoleGuard allowedRoles={['employee']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <div className="view-container">
            <div className="view-header">
              <div className="view-header-title">
                <h1 className="page-title">My Assigned Assets</h1>
                <span className="metadata-text">Company equipment and devices issued to your account</span>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <AssetTable
                assets={assets.filter(a => a.status === 'assigned')}
                onSelectAsset={setSelectedAsset}
              />
            </div>
          </div>
        </RoleGuard>
      );
    }

    // 3. Tickets View (Technician, Manager, Admin)
    if (currentPath === '/tickets' || currentPath === '/assigned-tickets') {
      return (
        <RoleGuard allowedRoles={['technician', 'it_manager', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <TicketsPage
            title={currentPath === '/assigned-tickets' ? 'Assigned Tickets' : 'All Tickets'}
            subtitle={currentPath === '/assigned-tickets' ? 'Tickets currently assigned to your workbench' : 'Comprehensive service desk ticket register'}
            tickets={currentPath === '/assigned-tickets' ? tickets.filter(t => t.assignedTo) : tickets}
            onSelectTicket={handleSelectTicket}
            onNavigate={navigateTo}
          />
        </RoleGuard>
      );
    }

    // 4. AI Assistant View (All roles)
    if (currentPath === '/ai-assistant') {
      return <AIAssistantChat />;
    }

    // 5. Knowledge Base View (All roles)
    if (currentPath === '/knowledge') {
      return <KnowledgeList />;
    }

    // 6. Assets Management View (Technician, Asset Manager, Admin)
    if (currentPath === '/assets') {
      return (
        <RoleGuard allowedRoles={['technician', 'asset_manager', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <AssetManagerDashboard
            assets={assets}
            onUpdate={loadData}
          />
        </RoleGuard>
      );
    }

    // Asset Manager sub-tabs: assignments, maintenance, vendors
    if (currentPath === '/assignments' || currentPath === '/maintenance' || currentPath === '/vendors') {
      return (
        <RoleGuard allowedRoles={['asset_manager', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <div className="view-container">
            <div className="view-header">
              <div className="view-header-title">
                <h1 className="page-title">
                  {currentPath === '/assignments' && 'Asset Assignments'}
                  {currentPath === '/maintenance' && 'Maintenance & RMA Service'}
                  {currentPath === '/vendors' && 'Hardware Vendors & Contracts'}
                </h1>
                <span className="metadata-text">Procurement and hardware allocation controls</span>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <AssetTable
                assets={
                  currentPath === '/maintenance'
                    ? assets.filter(a => a.status === 'under_repair')
                    : currentPath === '/assignments'
                    ? assets.filter(a => a.status === 'assigned')
                    : assets
                }
                onSelectAsset={setSelectedAsset}
              />
            </div>
          </div>
        </RoleGuard>
      );
    }

    // 7. SLA Monitoring View (IT Manager, Admin)
    if (currentPath === '/sla') {
      return (
        <RoleGuard allowedRoles={['it_manager', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <SlaMonitoringPage
            tickets={tickets}
            onSelectTicket={handleSelectTicket}
          />
        </RoleGuard>
      );
    }

    // 8. Reports View (IT Manager, Asset Manager, Admin)
    if (currentPath === '/reports') {
      return (
        <RoleGuard allowedRoles={['it_manager', 'asset_manager', 'system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <ReportsPage />
        </RoleGuard>
      );
    }

    // 9. Technicians View (IT Manager)
    if (currentPath === '/technicians') {
      return (
        <RoleGuard allowedRoles={['it_manager']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <div className="view-container">
            <div className="view-header">
              <div className="view-header-title">
                <h1 className="page-title">Technicians Team</h1>
                <span className="metadata-text">Staff workload capacity and ticket resolution SLA performance</span>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <UserTable
                users={users.filter(u => u.role === 'technician')}
              />
            </div>
          </div>
        </RoleGuard>
      );
    }

    // 10. Users Management View (System Admin)
    if (currentPath === '/users') {
      return (
        <RoleGuard allowedRoles={['system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <div className="view-container">
            <div className="view-header">
              <div className="view-header-title">
                <h1 className="page-title">User Directory</h1>
                <span className="metadata-text">Internal staff accounts and role authorization levels</span>
              </div>
              <div className="view-header-actions">
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setIsUserAddOpen(true)}
                >
                  Create User
                </Button>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <UserTable
                users={users}
                onToggleStatus={async (id) => {
                  await userApi.toggleStatus(id);
                  loadData();
                }}
              />
            </div>
          </div>
        </RoleGuard>
      );
    }

    // 11. Audit Logs View (System Admin)
    if (currentPath === '/audit-logs') {
      return (
        <RoleGuard allowedRoles={['system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <AuditLogsPage />
        </RoleGuard>
      );
    }

    // 12. Settings View (System Admin)
    if (currentPath === '/settings') {
      return (
        <RoleGuard allowedRoles={['system_admin']} onBackToDashboard={() => navigateTo('/dashboard')}>
          <SettingsPage />
        </RoleGuard>
      );
    }

    // 13. Notifications page
    if (currentPath === '/notifications') {
      return (
        <div className="view-container" style={{ maxWidth: 800 }}>
          <div className="view-header">
            <div className="view-header-title">
              <h1 className="page-title">Notifications</h1>
              <span className="metadata-text">Recent ticket updates, SLA alerts, and assignment dispatches</span>
            </div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: '#fafbfc' }}>
                <div style={{ fontWeight: 600 }}>Ticket INC-1024 assigned to Dave Tech</div>
                <div className="metadata-text">12 mins ago</div>
              </div>
              <div style={{ padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: '#fafbfc' }}>
                <div style={{ fontWeight: 600 }}>Ticket INC-1021 approaching SLA deadline</div>
                <div className="metadata-text">25 mins ago</div>
              </div>
              <div style={{ padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: '#fafbfc' }}>
                <div style={{ fontWeight: 600 }}>Ticket INC-1018 resolved</div>
                <div className="metadata-text">2 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default fallback to dashboard
    return (
      <EmployeeDashboard
        tickets={tickets}
        onNavigate={navigateTo}
        onSelectTicket={handleSelectTicket}
      />
    );
  };

  return (
    <AppShell
      currentPath={currentPath}
      onNavigate={navigateTo}
      onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {renderContent()}

      {/* Global Drawers & Modals */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onSelectTicket={handleSelectTicket}
      />

      <AssetDetailModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        onUpdate={loadData}
        canManage={['asset_manager', 'system_admin'].includes(role)}
      />

      <AssetFormModal
        isOpen={isAssetAddOpen}
        onClose={() => setIsAssetAddOpen(false)}
        onAssetCreated={loadData}
      />

      <CreateUserModal
        isOpen={isUserAddOpen}
        onClose={() => setIsUserAddOpen(false)}
        onUserCreated={loadData}
      />
    </AppShell>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
