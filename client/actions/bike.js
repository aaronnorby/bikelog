import {
  BIKE_REQ_START,
  BIKE_REQ_FAILURE,
  BIKE_REQ_SUCCESS
} from './constants';

import { getToken } from './utils';

export function getBike() {
  const token = getToken();
  if (!token) {
    return {
      type: BIKE_REQ_FAILURE,
      error: 'token missing'
    }
  }

  return dispatch => {
    dispatch(startGetBike());
    return fetch('/api/bikes', {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function(resp) {
      if (resp.status !== 200) {
        return Promise.reject(resp.statusText);
      } else {
        return Promise.resolve(resp);
      }
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      dispatch(getBikeSuccess(data));
    })
    .catch(function(err) {
      dispatch(getBikeFailure(err));
    });
  }
}

function startGetBike() {
  return {
    type: BIKE_REQ_START
  };
}

function getBikeFailure(err) {
  return {
    type: BIKE_REQ_FAILURE,
    error: err
  };
}

function getBikeSuccess(data) {
  return {
    type: BIKE_REQ_SUCCESS,
    data: {
      bike: data
    }
  };
}

