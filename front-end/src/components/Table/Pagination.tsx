import React from "react";

interface IPagination {
  totalPage: number;
  onClick: (params: { page?: number; limit?: number }) => void;
  currentPage: number;
  limit: number;
}

const Pagination: React.FC<IPagination> = ({
  totalPage = 10,
  onClick,
  currentPage = 1,
  limit = 10,
}) => {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        pages.push(2, 3, 4);
        if (totalPage > 5) pages.push("...");
      } else if (currentPage >= totalPage - 2) {
        if (totalPage > 5) pages.push("...");
        pages.push(totalPage - 3, totalPage - 2, totalPage - 1);
      } else {
        pages.push("...");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        if (currentPage + 2 < totalPage) pages.push("...");
      }

      if (pages[pages.length - 1] !== totalPage) {
        pages.push(totalPage);
      }
    }

    return pages;
  };

  const handleClick = (page: number | string): void => {
    if (onClick && typeof page === "number") {
      onClick({ page });
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    if (onClick) {
      const newLimit = parseInt(e.target.value);
      if (!isNaN(newLimit)) {
        onClick({ limit: newLimit, page: 1 });
      }
    }
  };

  return (
    <div className="w-full flex-col py-2 px-14">
      <ul className="flex w-full gap-2 justify-between items-center">
        <li className="flex items-center gap-3">
          <span className="text-sm text-navbarColor">
            Page {currentPage} of {totalPage}
          </span>
          <select
            className="text-xs bg-gray-100 border rounded-sm px-2 py-1"
            onChange={handleLimitChange}
            value={limit}
          >
            <option className="text-xs" value="">
              Select
            </option>
            <option className="text-xs" value={5}>
              5
            </option>
            <option className="text-xs" value={10}>
              10
            </option>
            <option className="text-xs" value={15}>
              15
            </option>
            <option className="text-xs" value={20}>
              20
            </option>
            <option className="text-xs" value={50}>
              50
            </option>
          </select>
        </li>

        <div className="flex gap-2">
          <li className="flex items-center">
            <button
              className="px-3 py-1 text-navbarColor rounded-md"
              onClick={() => handleClick(1)}
              disabled={currentPage === 1}
            >
              «
            </button>
          </li>

          {currentPage > 1 && (
            <li className="flex items-center">
              <button
                className="px-3 py-1 text-navbarColor rounded-md"
                onClick={() => handleClick(currentPage - 1)}
              >
                &lt;
              </button>
            </li>
          )}

          {generatePageNumbers().map((page, index) => (
            <li key={index} className="flex items-center">
              <button
                className={`px-1.5 py-0.5 text-[14px] rounded-md ${
                  currentPage === page
                    ? "bg-[#b59a01] text-white "
                    : "bg-transparent text-navbarColor"
                } ${page === "..." ? "cursor-default" : ""}`}
                onClick={() =>
                  handleClick(typeof page === "number" ? page : Number(page))
                }
                disabled={page === "..."}
              >
                {page}
              </button>
            </li>
          ))}

          {currentPage < totalPage && (
            <li className="flex items-center">
              <button
                className="px-3 py-1 text-navbarColor rounded-md"
                onClick={() => handleClick(currentPage + 1)}
              >
                &gt;
              </button>
            </li>
          )}

          <li className="flex items-center">
            <button
              className="px-3 py-1 text-navbarColor rounded-md"
              onClick={() => handleClick(totalPage)}
              disabled={currentPage === totalPage}
            >
              »
            </button>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Pagination;
