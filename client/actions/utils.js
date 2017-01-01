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

export function parseDatetime(datetime) {
  const format = 'YYYY-MM-DD-HH-mm';
  let parsedTime = moment(datetime, format).add(getPSTOffset(), 'h');
  return parsedTime.format(format);
}
