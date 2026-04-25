import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  placeholder = "Search...",
  hideSort = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {!hideSort && (
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-created">Recently Added</SelectItem>
            <SelectItem value="created">Oldest First</SelectItem>
            <SelectItem value="-view_count">Most Viewed</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
            <SelectItem value="-title">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default SearchBar;