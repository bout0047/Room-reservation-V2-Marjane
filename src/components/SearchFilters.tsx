import React from 'react';
import { Search } from 'lucide-react';
import type { SearchFiltersState } from '../types';

interface SearchFiltersProps {
  filters: SearchFiltersState;
  onFilterChange: (filters: SearchFiltersState) => void;
}

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleChange = (key: keyof SearchFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm mb-1">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search rooms..."
            className="w-full pl-3 pr-9 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm mb-1">Location</label>
        <select
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">All Locations</option>
          <option value="Floor 1">Floor 1</option>
          <option value="Floor 2">Floor 2</option>
          <option value="Floor 3">Floor 3</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 text-sm mb-1">Minimum Capacity</label>
        <select
          value={filters.capacity}
          onChange={(e) => handleChange('capacity', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">Any Size</option>
          <option value="4">4+ People</option>
          <option value="8">8+ People</option>
          <option value="12">12+ People</option>
          <option value="20">20+ People</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 text-sm mb-1">Duration</label>
        <select
          value={filters.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
        >
          <option value="">Any Duration</option>
          <option value="1">1 Hour</option>
          <option value="2">2 Hours</option>
          <option value="4">4 Hours</option>
          <option value="8">8 Hours</option>
        </select>
      </div>
    </div>
  );
}