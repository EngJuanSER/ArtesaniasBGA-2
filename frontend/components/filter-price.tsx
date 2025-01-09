import { useState, useEffect } from "react";
import { Range, getTrackBackground } from "react-range";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FilterPriceProps = {
  setFilterPrice: (range: {min: number, max: number}) => void;
  maxPrice: number;
}

const FilterPrice = ({ setFilterPrice, maxPrice }: FilterPriceProps) => {
  const defaultMax = 9999999;
  const actualMaxPrice = maxPrice || defaultMax;
  const [values, setValues] = useState([0, maxPrice || actualMaxPrice]);

  useEffect(() => {
    if (maxPrice > 0 && maxPrice !== values[1]) {
      setValues([values[0], maxPrice]);
      setFilterPrice({ min: values[0], max: maxPrice });
    }
  }, [maxPrice]);

  const handleChange = (newValues: number[]) => {
    if (newValues[1] >= newValues[0]) {
      setValues(newValues);
      setFilterPrice({ min: newValues[0], max: newValues[1] });
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const newValue = parseInt(value) || 0;
    if (index === 0 && newValue >= 0 && newValue <= values[1]) {
      const newValues = [newValue, values[1]];
      handleChange(newValues);
    } else if (index === 1 && newValue >= values[0] && newValue <= maxPrice) {
      const newValues = [values[0], newValue];
      handleChange(newValues);
    }
  };

  return (
    <div className="my-5 space-y-4">
      <p className="font-normal text-black dark:text-white">Precio:</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-price" className="text-xs text-muted-foreground">
            Precio Mínimo
          </Label>
          <Input
            id="min-price"
            type="number"
            value={values[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            min={0}
            max={values[1]}
            className="bg-accent"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-price" className="text-xs text-muted-foreground">
            Precio Máximo
          </Label>
          <Input
            id="max-price"
            type="number"
            value={values[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            min={values[0]}
            max={maxPrice || 9999999}
            className="bg-accent"
          />
        </div>
      </div>

      <div className="py-4">
        <Range
          values={values}
          step={100}
          min={0}
          max={actualMaxPrice}
          onChange={handleChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-[6px] w-full rounded-full bg-accent"
              style={{
              background: getTrackBackground({
                values,
                colors: ["#E5E7EB", "hsl(var(--primary))", "#E5E7EB"],
                min: 0,
                max: actualMaxPrice
              })
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props: { key, ...thumbProps } }) => (
            <div
              key={key}
              {...thumbProps}
              className="h-[20px] w-[20px] rounded-full bg-primary shadow focus:outline-none"
            />
          )}
        />
      </div>
    </div>
  );
};

export default FilterPrice;