import React from "react";
import { MdOutlineSkipPrevious, MdOutlineSkipNext } from "react-icons/md";

const Pagination = ({ currentPage, totalPages, goToPage }) => {
  if (totalPages <= 1) return null; // No need to render if only one page

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="flex space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 border rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-black cursor-not-allowed"
              : "bg-blue-500 text-black"
          }`}
        >
          <MdOutlineSkipPrevious />
        </button>

        {/* Page Number Buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={page === currentPage}
            className={`px-4 py-2 border rounded-md ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-blue-300 hover:text-black"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 border rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 text-black cursor-not-allowed"
              : "bg-blue-500 text-black"
          }`}
        >
          <MdOutlineSkipNext />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
