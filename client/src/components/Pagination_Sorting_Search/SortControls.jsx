import React from "react";
import Icon from "@mdi/react";
import { mdiSortCalendarAscending, mdiSortCalendarDescending } from "@mdi/js";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const SortControls = ({ onSortChange, sortConfig }) => {
  const handleNameSort = () => {
    const newSort =
      sortConfig.sortBy === "name" && sortConfig.sort === "asc"
        ? "desc"
        : "asc";
    onSortChange("name", newSort);
  };

  const handleDateSort = () => {
    const newSort =
      sortConfig.sortBy === "created_at" && sortConfig.sort === "asc"
        ? "desc"
        : "asc";
    onSortChange("created_at", newSort);
  };

  return (
    <div className="flex gap-4 h-7 mt-1.5">
      <button
        onClick={handleNameSort}
        className="flex gap-2 px-2 py-1.5 bg-blue-300 rounded hover:bg-blue-400 transition-colors"
      >
        {sortConfig.sortBy === "name" && sortConfig.sort === "asc" ? (
          <FaSortAlphaDown className="text-blue-800" />
        ) : (
          <FaSortAlphaUp className="text-blue-800" />
        )}
      </button>
      <button
        onClick={handleDateSort}
        className="flex gap-2 px-2 py-0.5 bg-blue-300 rounded hover:bg-blue-400 transition-colors"
      >
        <Icon
          path={
            sortConfig.sortBy === "created_at" && sortConfig.sort === "asc"
              ? mdiSortCalendarAscending
              : mdiSortCalendarDescending
          }
          size={1}
          className="text-blue-800"
        />
      </button>
    </div>
  );
};

export default SortControls;
