import React from 'react';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { start: Date; end: Date }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    onChange({ start: newStartDate, end: endDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    onChange({ start: startDate, end: newEndDate });
  };

  // Format dates for input elements
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex space-x-2">
      <div className="flex-1">
        <input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center text-gray-500">to</div>
      <div className="flex-1">
        <input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;