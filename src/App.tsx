import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import AlertsReports from './pages/AlertsReports';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import { AlertProvider } from './context/AlertContext';
import { CameraProvider } from './context/CameraContext';
import { AIProvider } from './context/AIContext';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AlertProvider>
      <CameraProvider>
        <AIProvider>
          <div className="flex h-screen bg-gray-950 text-white overflow-hidden lightning-dark">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800/50 shadow-md">
                <div className="px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">GateGuard AI</div>
                  <div className="flex items-center">
                    <div className="relative">
                      <button className="p-1 text-gray-300 hover:text-white focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto bg-gray-950">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/live-monitoring" element={<LiveMonitoring />} />
                  <Route path="/alerts-reports" element={<AlertsReports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </AIProvider>
      </CameraProvider>
    </AlertProvider>
  );
}

export default App;