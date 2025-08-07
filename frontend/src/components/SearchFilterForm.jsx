import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

const SearchFilterForm = ({ searchTerm, setSearchTerm, sortOption, setSortOption }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="relative w-full md:w-1/2">
       <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
        />
      </div>
      <div className="relative w-full md:w-auto">
        <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-gray-700"
        >
          <option value="">Sort By</option>
          <option value="date-newest">Date (Newest)</option>
          <option value="date-oldest">Date (Oldest)</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
        </div>
    </div>
  );
};

export default SearchFilterForm;
