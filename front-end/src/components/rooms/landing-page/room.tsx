import React, { useEffect, useState } from "react";
import { Search } from "react-feather";
import {
  BreadCrumbLayout,
  BreadCrumbs,
  Button,
  HeaderInfoText,
  InputField,
  Pagination,
  LoaderSpinner,
} from "../../../units";
import { RoomDisplayCard, FilterSection } from "../../";
import { roomdispalyCardPropTypes } from "../../../constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { user } from "../../../state-management/local/auth";
import { useGetAllHostelQuery } from "../../../state-management/api/hostel-api";
import { Toaster } from "react-hot-toast";

export const RoomsLandingPage = React.memo(() => {
  const nav = useNavigate();
  const userDetails = useSelector(user);

  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sliderValue, setSlidervalue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const itemsPerPage = 5;

  // ✅ Call API with pagination + search
  const { data, isLoading } = useGetAllHostelQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchValue || "",
    price: sliderValue > 0 ? sliderValue : undefined, 
    location: filterValue || undefined, 
  });
  const hostelData = data?.data ?? [];
  const pagination = data?.pagination ?? { total: 0, pages: 0 };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValue, sliderValue]);

  const handleNavigationClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    direction: string
  ) => {
    e.preventDefault();
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < pagination.pages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <main className="flex flex-col p-4 md:p-6 gap-4 md:gap-6">
      <Toaster />
      <BreadCrumbs>
        <BreadCrumbLayout path="/rooms" title="Rooms" current />
      </BreadCrumbs>

      <header className="flex flex-col sm:flex-row justify-between gap-4">
        <HeaderInfoText title="Available Rooms" />
        {userDetails?.role === "owner" && (
          <Button className="w-full sm:w-52" onClick={() => nav("/add-room")}>
            Add Room
          </Button>
        )}
      </header>

      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <section className="flex flex-col lg:flex-row gap-6">
          {/* Filter Toggle Button for Mobile */}
          <div className="lg:hidden">
            <Button 
              className="w-full"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Sidebar Filter */}
          <div className={`
            ${isFilterOpen ? 'block' : 'hidden'} 
            lg:block lg:w-1/4 xl:w-1/5
          `}>
            <FilterSection
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              sliderValue={sliderValue}
              setSliderValue={setSlidervalue}
              setCurrentPage={setCurrentPage}
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-4 md:gap-6 flex-1 p-0 md:p-2">
            {/* Search Bar */}
            <section className="w-full md:w-3/4 lg:w-[60%]">
              <form onSubmit={(e) => e.preventDefault()}>
                <InputField
                  iconname={Search}
                  inputType="text"
                  placeholder="Search your result..."
                  inputValue={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setCurrentPage(1); // reset to first page
                  }}
                />
              </form>
            </section>

            {/* Room Cards */}
            {hostelData.length > 0 ? (
              <section className="flex flex-col gap-4 md:gap-5">
                {hostelData.map((room: roomdispalyCardPropTypes) => (
                  <RoomDisplayCard key={room.id} {...room} />
                ))}
              </section>
            ) : (
              <HeaderInfoText title="No data was found" />
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              handleNavigationClick={handleNavigationClick}
            />
          </div>
        </section>
      )}
    </main>
  );
});