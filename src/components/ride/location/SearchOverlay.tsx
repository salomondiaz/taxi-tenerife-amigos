
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  closeSearch: () => void;
  searchType: "origin" | "destination" | null;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  closeSearch,
  searchType,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">
          Buscar {searchType === "origin" ? "origen" : "destino"}
        </h3>
        
        <div className="flex gap-2 mb-4">
          <Input
            placeholder={`Dirección de ${searchType === "origin" ? "origen" : "destino"}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          
          <Button onClick={handleSearch}>
            <Search size={18} />
          </Button>
        </div>
        
        <div className="flex justify-between">
          <Button variant="ghost" onClick={closeSearch}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
