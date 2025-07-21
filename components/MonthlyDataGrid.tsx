import React from 'react';

interface MonthlyDataGridProps {
  dayInputs: string[];
  onDayInputChange: (dayIndex: number, value: string) => void;
  selectedMonth: number;
  selectedYear: number;
}

export const MonthlyDataGrid: React.FC<MonthlyDataGridProps> = ({ 
  dayInputs, 
  onDayInputChange,
}) => {
  // The number of days is determined by the length of the dayInputs array,
  // which is calculated correctly using the Shamsi calendar in the parent App.tsx component.
  // We do not recalculate it here, especially using the Gregorian-based `new Date()`.
  if (dayInputs.length === 0) {
      return <div className="text-center text-gray-500 italic p-4">Select a month and year to enter data.</div>;
  }

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {dayInputs.map((value, dayIndex) => {
        const dayNumber = dayIndex + 1;
        return (
          <div key={dayIndex} className="relative">
            <label htmlFor={`day-${dayNumber}`} className="absolute -top-2.5 left-1.5 text-xs text-gray-400 bg-gray-800 px-1">
              {dayNumber}
            </label>
            <input
              id={`day-${dayNumber}`}
              type="text" // Use text to allow for easier clearing and handling of non-numeric input before parsing
              inputMode="decimal" // Hint for mobile keyboards
              value={value || ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Allow only numbers and a single decimal point
                if (/^\d*\.?\d*$/.test(inputValue)) {
                  onDayInputChange(dayIndex, inputValue);
                }
              }}
              className="w-full h-12 text-center bg-gray-700 border border-gray-600 rounded-md shadow-sm p-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="-"
              aria-label={`QC value for day ${dayNumber}`}
            />
          </div>
        );
      })}
    </div>
  );
};
