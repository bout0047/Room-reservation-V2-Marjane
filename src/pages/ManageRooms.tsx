import React, { useState } from 'react';
import { useRooms } from '../hooks/useRooms';
import { PlusCircle, Edit2, Trash2, AlertCircle } from 'lucide-react';

export default function ManageRooms() {
  const { rooms, addRoom, editRoom, deleteRoom } = useRooms();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    location: '',
    amenities: '',
    image: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roomData = {
      name: formData.name,
      capacity: parseInt(formData.capacity),
      location: formData.location,
      amenities: formData.amenities.split(',').map(a => a.trim()),
      image: formData.image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200', // Default image
      description: formData.description
    };

    if (editingId) {
      if (!editingId.startsWith('mock-')) {
        editRoom(editingId, roomData);
        setEditingId(null);
      } else {
        alert('Mock rooms cannot be edited');
      }
    } else {
      addRoom(roomData);
      setIsAdding(false);
    }

    setFormData({
      name: '',
      capacity: '',
      location: '',
      amenities: '',
      image: '',
      description: ''
    });
  };

  const startEdit = (room: any) => {
    if (room.id.startsWith('mock-')) {
      alert('Mock rooms cannot be edited');
      return;
    }
    setEditingId(room.id);
    setFormData({
      name: room.name,
      capacity: room.capacity.toString(),
      location: room.location,
      amenities: room.amenities.join(', '),
      image: room.image,
      description: room.description
    });
  };

  const handleDelete = (id: string) => {
    if (id.startsWith('mock-')) {
      alert('Mock rooms cannot be deleted');
      return;
    }
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Rooms</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Room
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center text-blue-700">
        <AlertCircle className="h-5 w-5 mr-2" />
        <p className="text-sm">Mock rooms are read-only and cannot be edited or deleted.</p>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
              <input
                type="text"
                required
                value={formData.amenities}
                onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Projector, Whiteboard, Coffee Machine"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({ ...formData, image: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  name: '',
                  capacity: '',
                  location: '',
                  amenities: '',
                  image: '',
                  description: ''
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'} Room
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              {room.id.startsWith('mock-') && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                  Mock Room
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
              <p className="text-gray-600">{room.description}</p>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Capacity: {room.capacity}</p>
                <p className="text-sm text-gray-500">Location: {room.location}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => startEdit(room)}
                  className={`p-2 rounded-md ${
                    room.id.startsWith('mock-')
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                  disabled={room.id.startsWith('mock-')}
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className={`p-2 rounded-md ${
                    room.id.startsWith('mock-')
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                  disabled={room.id.startsWith('mock-')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}