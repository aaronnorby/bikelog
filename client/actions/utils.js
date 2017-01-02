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

export function getPSTOffset() {
  // returns UTC offset of PST timezone ("America/Los Angeles")
  return -8;
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
