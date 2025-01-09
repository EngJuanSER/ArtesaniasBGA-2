import { Input } from "@/components/ui/input";

type FilterSearchProps = {
  setFilterSearch: (text: string) => void;
}

const FilterSearch = ({ setFilterSearch }: FilterSearchProps) => {
  return (
    <div className="my-5">
      <p className="mb-3 font-normal text-black dark:text-white">Buscar:</p>
      <Input 
        type="text"
        placeholder="Buscar producto..."
        onChange={(e) => setFilterSearch(e.target.value)}
        className="bg-accent"
      />
    </div>
  );
}

export default FilterSearch;