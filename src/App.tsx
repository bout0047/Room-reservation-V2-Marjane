import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageRooms from './pages/ManageRooms';

type Page = 'home' | 'bookings' | 'calendar' | 'login' | 'register' | 'manage';

function App() {
  const { user, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (!user) {
    if (currentPage === 'register') {
      return <Register onLogin={() => setCurrentPage('login')} />;
    }
    return <Login onRegister={() => setCurrentPage('register')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'bookings':
        return <MyBookings />;
      case 'calendar':
        return <Calendar />;
      case 'manage':
        return isAdmin ? <ManageRooms /> : <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        isAdmin={isAdmin}
      />
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;