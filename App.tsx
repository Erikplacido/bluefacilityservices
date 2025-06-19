
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ServicesPage from './pages/ServicesPage';
import BookingPage from './pages/BookingPage';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-primary shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
            Service Booker
          </Link>
          <div>
            {/* Can add more nav links here if needed */}
             <Link to="/" className={`text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-blue-700' : ''}`}>
              Services
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ServicesPage />} />
          <Route path="/booking/:serviceId" element={<BookingPage />} />
          {/* Add other routes here, e.g., for user profile, past bookings */}
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white text-center p-6 mt-auto">
        <p>&copy; ${new Date().getFullYear()} Service Booking System. All rights reserved.</p>
        <p className="text-sm text-gray-400">Powered by Awesome Tech</p>
      </footer>
    </div>
  );
};

export default App;
