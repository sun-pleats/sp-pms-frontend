import moment from 'moment';

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
