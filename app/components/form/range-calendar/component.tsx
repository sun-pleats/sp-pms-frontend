import { Calendar, CalendarSelectionMode } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import React, { forwardRef } from 'react';

interface FormRangeCalendarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  onChange?: any;
  value?: any;
  placeholder?: string;
  className?: string;
  selectionMode?: CalendarSelectionMode;
  readOnlyInput?: boolean;
  hideOnRangeSelection?: boolean;
  isRange?: boolean;
}

const FormRangeCalendar = forwardRef<HTMLInputElement, FormRangeCalendarProps>(
  ({ label = 'Label', value, isError, isRange, readOnlyInput, hideOnRangeSelection, onChange, errorMessage, className }, ref) => (
    <div className="field">
      <label htmlFor="name">{label}</label>

      <Calendar
        inputRef={ref}
        value={value}
        selectionMode="range"
        readOnlyInput={readOnlyInput}
        hideOnRangeSelection={hideOnRangeSelection}
        className={classNames(
          className,
          {
            'p-invalid': isError
          },
          'w-full'
        )}
        onChange={onChange}
      />
      {isError && <small className="text-red-500">{errorMessage}</small>}
    </div>
  )
);

FormRangeCalendar.displayName = 'FormRangeCalendar';

export default FormRangeCalendar;
