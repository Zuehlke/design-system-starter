import { FilterFn } from '@tanstack/table-core';
import { isAfter, isBefore, isValid } from 'date-fns';

export interface NumericFilterBand {
  lower?: number;
  upper?: number;
  strictUpper: boolean;
  strictLower: boolean;
  not: number;
  complex: boolean;
}

export interface NumericFilterMask {
  bands: NumericFilterBand[];
}

export const numeric: FilterFn<any> = (row, columnId, filterMask: NumericFilterMask) => {
  const cellValue = row.getValue<number>(columnId);

  if (!filterMask.bands) {
    return true;
  }
  return filterMask.bands.some(band => {
    let passed = true;
    if (band.lower !== undefined) {
      passed = band.strictLower
        ? band.lower < cellValue
        : band.lower <= cellValue;
    }

    if (passed && (band.upper !== undefined)) {
      passed = band.strictUpper
        ? band.upper > cellValue
        : band.upper >= cellValue;
    }

    if (!isNaN(band.not)) {
      passed = passed && band.not !== cellValue;
    }

    return passed;
  });
};

export type DateRangeFilterMask = { from: Date, to: Date };
export const dateRange: FilterFn<any> = (row, columnId, dateRange: DateRangeFilterMask) => {
  const cellValue = row.getValue<Date>(columnId);
  if (isValid(cellValue)) {
    return isAfter(cellValue, dateRange.from) && isBefore(cellValue, dateRange.to);
  }
  return true;
};

export const select: FilterFn<any> = (row, columnId, selectedValue: string) => {
  const cellValue = row.getValue<any>(columnId);
  return selectedValue === cellValue;
};

export const multiSelect: FilterFn<any> = (row, columnId, selectedValues: string[]) => {
  if (selectedValues.length === 0) {
    return false;
  }
  const cellValue = String(row.getValue<any>(columnId));
  return selectedValues.includes(cellValue);
};
