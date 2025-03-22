
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedBar: string;
  setSelectedBar: (bar: string) => void;
  categories: string[];
}

export function InventoryFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedBar,
  setSelectedBar,
  categories,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search inventory..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedBar} onValueChange={setSelectedBar}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Bar" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bars</SelectItem>
            <SelectItem value="1">Main Bar</SelectItem>
            <SelectItem value="2">Pool Bar</SelectItem>
            <SelectItem value="3">Lounge Bar</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
