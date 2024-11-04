import React from 'react';
import RoomCard from '../components/RoomCard';
import SearchFilters from '../components/SearchFilters';
import { useRooms } from '../hooks/useRooms';
import { useBookings } from '../hooks/useBookings';

export default function Home() {
  const { rooms, filters, setFilters } = useRooms();
  const { addBooking } = useBookings();

  const filteredRooms = rooms.filter((room) => {
    if (filters.location && room.location !== filters.location) return false;
    if (filters.capacity && room.capacity < parseInt(filters.capacity)) return false;
    if (filters.search && !room.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Left sidebar - Filters */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <SearchFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Main content - Rooms */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onBook={addBooking}
              />
            ))}
            {filteredRooms.length === 0 && (
              <div className="col-span-2 text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No rooms match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}