import FilterOrigin from "./filter-origin";
import FilterSearch from "./filter-search";
import FilterPrice from "./filter-price";
import FilterSort from "./filter-sort";

type FiltersControlsProps = {
    setFilterOrigin: (origin: string) => void;
    setFilterSearch: (text: string) => void;
    setFilterPrice: (range: {min: number, max: number}) => void;
    setSortBy: (value: "price-asc" | "price-desc" | "name-asc" | "name-desc") => void;
    maxPrice: number;
  }

const FiltersControls = (props: FiltersControlsProps) => {
    return (
        <div className="sm:w-[250px] sm:mt-5 p-6">
          <FilterSearch setFilterSearch={props.setFilterSearch} />
          <FilterOrigin setFilterOrigin={props.setFilterOrigin} />
          <FilterPrice setFilterPrice={props.setFilterPrice} maxPrice={props.maxPrice} />
          <FilterSort setSortBy={props.setSortBy} />
        </div>
    );
}

export default FiltersControls;