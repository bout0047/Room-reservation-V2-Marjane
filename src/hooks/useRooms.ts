import { useState, useEffect } from 'react';
import type { Room, SearchFiltersState } from '../types';
import { getRooms, addRoom as dbAddRoom, updateRoom as dbUpdateRoom, deleteRoom as dbDeleteRoom } from '../db/database';

const INITIAL_FILTERS: SearchFiltersState = {
  search: '',
  location: '',
  capacity: '',
  duration: ''
};

const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 17   // 5 PM
};

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filters, setFilters] = useState<SearchFiltersState>(INITIAL_FILTERS);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const loadedRooms = await getRooms();
      setRooms(loadedRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const isWithinBusinessHours = (date: Date): boolean => {
    const hours = date.getHours();
    return hours >= BUSINESS_HOURS.start && hours < BUSINESS_HOURS.end;
  };

  const adjustToBusinessHours = (date: Date): Date => {
    const adjusted = new Date(date);
    const hours = adjusted.getHours();
    
    if (hours < BUSINESS_HOURS.start) {
      adjusted.setHours(BUSINESS_HOURS.start, 0, 0, 0);
    } else if (hours >= BUSINESS_HOURS.end) {
      adjusted.setHours(BUSINESS_HOURS.end - 1, 59, 59, 999);
    }
    
    return adjusted;
  };

  const addRoom = async (roomData: Omit<Room, 'id'>) => {
    try {
      await dbAddRoom(roomData);
      await loadRooms();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const editRoom = async (id: string, updates: Partial<Room>) => {
    try {
      await dbUpdateRoom(id, updates);
      await loadRooms();
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      await dbDeleteRoom(id);
      await loadRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return {
    rooms,
    filters,
    setFilters,
    addRoom,
    editRoom,
    deleteRoom,
    businessHours: BUSINESS_HOURS
  };
}