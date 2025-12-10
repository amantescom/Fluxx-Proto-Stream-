
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context';
import { Sidebar, MobileNav } from './components/Navigation';
import { Header } from './components/Header';
import { MediaPlayer } from './components/MediaPlayer';

// Pages
import { Home } from './pages/Home';
import { Videos } from './pages/Videos';
import { Audios } from './pages/Audios';
import { Radio } from './pages/Radio';
import { News } from './pages/News';
import { Profile } from './pages/Profile';
import { Shop } from './pages/Shop';
import { Channel } from './pages/Channel';
import { AdminUsers } from './pages/AdminUsers';
import { AdminRadios } from './pages/AdminRadios';
import { Wallet } from './pages/Wallet';
import { AdminDashboard } from './pages/AdminDashboard';
// New Pages
import { Shorts } from './pages/Shorts';
import { Podcasts } from './pages/Podcasts';
import { Interviews } from './pages/Interviews';
import { About } from './pages/About';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen font-sans antialiased bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar />
      
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <MobileNav />
      </div>
      
      <MediaPlayer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/audios" element={<Audios />} />
            <Route path="/reels" element={<Shorts />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/about" element={<About />} />
            
            <Route path="/channel" element={<Channel />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Management Routes */}
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/radios" element={<AdminRadios />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
