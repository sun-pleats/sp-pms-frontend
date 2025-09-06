import moment from 'moment';

export function generateSimpleId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`; // same 9-char slice
}

export function format24Hour(date: any) {
  return moment(date, "HH:mm:ss").format('HH:mm');
}

export function formatDate(date: any) {
  return moment(date).format('YYYY/MM/DD');
}

export function formatDbDate(date: any) {
  return moment(date).format('YYYY-MM-DD');
}
