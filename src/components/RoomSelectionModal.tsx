import React from 'react';
import { Room } from '../types';
import { X, Users, MapPin } from 'lucide-react';

interface RoomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (roomId: string) => void;
  rooms: Room[];
  startTime: Date;
  endTime: Date;
}

export default function RoomSelectionModal({
  isOpen,
  onClose,
  onSelect,
  rooms,
  startTime,
  endTime,
}: RoomSelectionModalProps) {
  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select a Room</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 font-medium">{formatDate(startTime)}</p>
          <p className="text-blue-600">
            {formatTime(startTime)} - {formatTime(endTime)}
          </p>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
              onClick={() => onSelect(room.id)}
            >
              <h3 className="font-medium text-lg mb-2">{room.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{room.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}