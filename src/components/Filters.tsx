import React from "react";

interface FiltersProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">
        Filter by month:
        <input
          type="month"
          className="form-control"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default Filters;