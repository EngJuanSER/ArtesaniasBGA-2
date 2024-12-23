import * as React from "react";
import { useGetProductField } from "@/hooks/useGetProductField"; 
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList, CommandEmpty, CommandInput } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterTypes } from "@/types/filters";

type FilterOriginProps = {
  setFilterOrigin: (origin: string) => void;
};

const FilterOrigin = ({ setFilterOrigin }: FilterOriginProps) => {
  const { result, loading } = useGetProductField();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <div className="my-5">
      <p className="mb-3 font-normal text-black dark:text-white">Lugar:</p>
      {loading && result === null && <p>Cargando origen...</p>}

      {result !== null && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between bg-accent"
            >
              {value
                ? value === "todos"
                  ? "Todos"
                  : value
                : "Seleccionar origen"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 h-[250px] ">
            <Command>
              <CommandInput placeholder="Buscar origen..." />
              <CommandList>
                <CommandEmpty>No se encontró el origen.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="todos"
                    onSelect={() => {
                      setValue("todos");
                      setFilterOrigin("");
                      setOpen(false);
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === "todos" ? "opacity-100" : "opacity-0")} />
                    Todos
                  </CommandItem>
                  {result.schema.attributes.origin.enum.map((origin: string) => (
                    <CommandItem
                      key={origin}
                      value={origin}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setFilterOrigin(currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn("mr-2 h-4 w-4", value === origin ? "opacity-100" : "opacity-0")}
                      />
                      {origin}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default FilterOrigin;