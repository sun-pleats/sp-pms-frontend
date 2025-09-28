import moment from 'moment';
import { subYears, format } from 'date-fns';
import { SelectItem } from 'primereact/selectitem';

export function generateSimpleId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`; // same 9-char slice
}

export function format24Hour(date: any) {
  return moment(date, 'HH:mm:ss').format('HH:mm');
}

export function formatDate(date: any) {
  return moment(date).format('YYYY/MM/DD');
}

export function formatDateTime(date: any) {
  return moment(date).format('YYYY/MM/DD HH:mm');
}

export function formatDbDate(date: any) {
  return moment(date).format('YYYY-MM-DD');
}

export function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1); // JS months are 0-based
  return date.toLocaleString('default', { month: 'long' });
}

export function currentMonthDates(): Date[] {
  const now = new Date();
  // Start of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // End of this month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [startOfMonth, endOfMonth];
}

export function getListOfYears() {
  const currentYear = new Date();
  return Array.from({ length: 10 }, (_, i) => format(subYears(currentYear, i), 'yyyy'));
}

export function getListOfYearOptions(): SelectItem[] {
  return getListOfYears().map((year) => ({
    label: year,
    value: Number(year)
  }));
}
