import React from 'react';
import { Calendar, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { User as UserType } from '../types';

interface NavbarProps {
  currentPage: 'home' | 'bookings' | 'calendar' | 'login' | 'register' | 'manage';
  onNavigate: (page: 'home' | 'bookings' | 'calendar' | 'login' | 'register' | 'manage') => void;
  user: UserType;
  isAdmin: boolean;
}

export default function Navbar({ currentPage, onNavigate, user, isAdmin }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Marjane Rooms</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-gray-700 hover:text-blue-600 ${
                currentPage === 'home' ? 'text-blue-600' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('bookings')}
              className={`text-gray-700 hover:text-blue-600 ${
                currentPage === 'bookings' ? 'text-blue-600' : ''
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => onNavigate('calendar')}
              className={`text-gray-700 hover:text-blue-600 ${
                currentPage === 'calendar' ? 'text-blue-600' : ''
              }`}
            >
              Calendar
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('manage')}
                className={`text-gray-700 hover:text-blue-600 ${
                  currentPage === 'manage' ? 'text-blue-600' : ''
                }`}
              >
                Manage Rooms
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <Menu className="h-6 w-6 text-gray-600 md:hidden" />
          </div>
        </div>
      </div>
    </nav>
  );
}