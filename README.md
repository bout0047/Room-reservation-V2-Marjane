# Marjane Room Reservation System

A modern room reservation system built with React, TypeScript, and SQL.js for managing meeting room bookings.

## Features

- 📅 Real-time room booking system
- 🔍 Advanced search and filtering
- 📊 Calendar view for bookings
- 👥 User authentication (demo accounts provided)
- ⚡ Fast in-memory SQLite database using SQL.js
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd marjane-room-reservation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Demo Accounts

You can use these demo accounts to test the application:

### Admin Account
- Email: admin@marjane.com
- Password: admin

### Regular User Account
- Email: user@marjane.com
- Password: user

## Project Structure

```
src/
├── components/     # Reusable UI components
├── db/            # Database setup and operations
├── hooks/         # Custom React hooks
├── pages/         # Main page components
└── types/         # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

### Room Management (Admin)
- Add new rooms
- Edit room details
- Delete rooms
- Manage room amenities

### Booking System (Users)
- View available rooms
- Book rooms for specific time slots
- Cancel bookings
- View booking calendar
- Filter rooms by various criteria

### Calendar View
- Week view of all bookings
- Drag-and-drop booking creation
- Visual time slot selection

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- SQL.js (SQLite in the browser)
- Vite
- Lucide Icons

## Notes

- The application uses an in-memory database with SQL.js, so data will be reset when you refresh the page
- Business hours are set from 9 AM to 5 PM by default
- Room images are loaded from Unsplash
- The project uses modern React features including hooks and context