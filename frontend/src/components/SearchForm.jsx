// src/components/SearchForm.jsx
import React from 'react';

function SearchForm({ searchTerm, setSearchTerm, sortBy, setSortBy, selectedTag, setSelectedTag }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="flex gap-4">
        <select
          className="border p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="created">Date Created</option>
          <option value="edited">Recently Edited</option>
        </select>

        <select
          className="border p-2"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">Filter by Tag</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          {/* Add dynamic tags here later if needed */}
        </select>
      </div>
    </div>
  );
}

export default SearchForm;
