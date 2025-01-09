import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FilterSortProps = {
  setSortBy: (value: "price-asc" | "price-desc" | "name-asc" | "name-desc") => void;
}

const FilterSort = ({ setSortBy }: FilterSortProps) => {
  return (
    <div className="my-5">
      <p className="mb-3 font-normal text-black dark:text-white">Ordenar por:</p>
      <Select onValueChange={setSortBy}>
        <SelectTrigger className="w-[200px] bg-accent">
          <SelectValue placeholder="Seleccionar orden" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
          <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
          <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
          <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterSort;