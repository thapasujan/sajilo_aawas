import { ChevronLeft, ChevronRight } from "react-feather";
import { Icon } from "../icons/icons";
import React from "react";

interface paginationpropTypes {
  currentPage: number;
  handleNavigationClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    direction: string
  ) => void;
  totalPages: number;
}
export const Pagination = React.memo(
  ({ currentPage, handleNavigationClick, totalPages }: paginationpropTypes) => {
    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <nav
          aria-label="Pagination"
          className="isolate inline-flex place-items-center  gap-4 rounded-md shadow-sm"
        >
          <button
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? "hidden" : ""
            }`}
            onClick={(e) => handleNavigationClick(e, "prev")}
          >
            <span className="sr-only">Previous</span>
            <Icon name={ChevronLeft} />
          </button>

          <article>Page {currentPage}</article>

          <button
            onClick={(e) => handleNavigationClick(e, "next")}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? "hidden" : ""
            }`}
          >
            <span className="sr-only">Next</span>
            <Icon name={ChevronRight} />
          </button>
        </nav>
      </div>
    );
  }
);
