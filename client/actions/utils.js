import moment from 'moment';

import routes from '../routes';

const storageKey = 'bikelock';

export function getToken() {
  const token = window.localStorage.getItem(storageKey);
  return token;
}

export function setToken(token) {
  window.localStorage.setItem(storageKey, token);
}

export function checkAuth(nextRouterState, replace) {
  const token = getToken();
  if (!token) {
    replace(routes.loginRoute);
  }
}

export function redirectWithAuth(nextRouterState, replace) {
  const token = getToken();
  if (token) {
    replace(routes.logViewRoute);
  }
}

export function getPSTOffset(isDST) {
  // returns UTC offset of PST timezone ("America/Los Angeles")
  // isDST: is daylight savings time
  return isDST ? -7 : -8;
}

export function parseDatetime(date, time) {
  const format = 'YYYY-MM-DD-HH-mm';

  if (!date || !time) {
    throw new Error('missing date or time params to parseDatetime');
  }

  if (date.constructor !== Date || time.constructor !== Date) {
    throw new TypeError('Date and time must be native JavaScript Dates')
  }

  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  let datetime = moment(date).utc();
  return datetime.format(format);
}

export function formatDateForDisplay(date) {
  const inputFormat = 'YYYY-MM-DD-HH-mm';
  const outputFormat = 'Do MMM YYYY';
  const mDate = moment(date, inputFormat);
  const formattedDate = mDate.format(outputFormat);
  return formattedDate;
}

export function formatDateTimeForDisplay(datetime) {
  const inputFormat = 'YYYY-MM-DD-HH-mm';
  const outputFormat = 'Do MMM YYYY, hh:mm a';
  let mDateTime = moment(datetime, inputFormat);
  mDateTime.add(getPSTOffset(mDateTime.isDST()), 'h');
  const formattedDateTime = mDateTime.format(outputFormat);
  return formattedDateTime;
}

export function getDefaultTime() {
  let time = new Date();
  time.setHours(0);
  time.setMinutes(0);
  return time;
}
