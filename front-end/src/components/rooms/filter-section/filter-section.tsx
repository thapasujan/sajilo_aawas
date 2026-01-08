import { Button, InfoText, MediumInfoText } from "../../../units";
import React from "react";
import { AreaData } from "../../../constant";
import { Icon } from "@iconify/react";

export const FilterSection = React.memo(
  ({
    filterValue,
    setFilterValue,
    sliderValue,
    setSliderValue,
    setCurrentPage,
  }: {
    filterValue: string;
    setFilterValue: React.Dispatch<React.SetStateAction<string>>;
    sliderValue: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  }) => {
    
    // Add console log to debug
    console.log("Slider value:", sliderValue);
    
    return (
      <main className="flex flex-col w-full lg:w-[80%] p-4 md:p-6 gap-4 md:gap-6 rounded-md bg-[#FBFBFB] shadow-sm">
        <header className="flex items-center gap-3">
          <MediumInfoText title="Filter" className="text-lg font-semibold" />
          <Icon icon="mage:filter" fontSize={22} />
        </header>

        <section id="price-range" className="flex flex-col gap-3">
          <InfoText title="Select a price range" className="font-medium" />
          <div className="flex justify-between items-center">
            <InfoText title="Rs. 0" className="text-sm text-gray-600" />
            <InfoText 
              title={`Rs. ${sliderValue.toLocaleString()}`} 
              className="font-semibold text-blue-600"
            />
            <InfoText title="Rs. 20,000" className="text-sm text-gray-600" />
          </div>
          
          {/* Replace with direct input range */}
          <input
            type="range"
            min="0"
            max="20000"
            step="1000"
            value={sliderValue}
            onChange={(e) => {
              console.log("Range changed:", e.target.value);
              setSliderValue(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </section>

        <section id="area" className="flex flex-col gap-3">
          <InfoText title="Select your area" className="font-medium" />
          <select
            name="area"
            className="bg-input-bg p-3 md:p-4 rounded-lg w-full outline-none border border-gray-200 focus:border-blue-400 transition-colors text-sm"
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Areas</option>
            {AreaData.map((area, i) => (
              <option value={area} key={i + area}>
                {area}
              </option>
            ))}
          </select>
        </section>

        {(filterValue || sliderValue > 0) && (
          <Button
            onClick={() => {
              setFilterValue("");
              setSliderValue(0);
              setCurrentPage(1);
            }}
            className="w-full mt-2"
            variant="outline"
          >
            Clear Filters
          </Button>
        )}
      </main>
    );
  }
);