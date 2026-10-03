import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppShell = ({
  currentPath,
  onNavigate,
  onOpenNotifications,
  unreadCount = 2,
  searchQuery,
  onSearchChange,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-root">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <div className="app-body">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
};
