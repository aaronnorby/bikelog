import {
  CREATE_MAINT_FAILURE,
  CREATE_MAINT_SUCCESS,
  CREATE_MAINT_REQ_START,
  TOKEN_MISSING_ERROR,
  GET_DISTANCE_FAILURE,
  GET_DISTANCE_START,
  GET_DISTANCE_SUCCESS,
  GET_ALL_EVENTS_START,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_SUCCESS,
} from './constants';

import { getToken } from './utils';

export function createMaintEvent(bike, eventType, date, note='') {
  // date must be sent in YYYY-MM-DD-HH-mm, UTC
  // To some timezone stuff in here
  if (!eventType) {
    return {
      type: CREATE_MAINT_FAILURE,
      error: "missing event type"
    }
  }

  const token = getToken();
  if (!token) {
    return {
      type: TOKEN_MISSING_ERROR,
      error: "auth token missing"
    }
  }

  if (!bike.id) {
    return {
      type: CREATE_MAINT_FAILURE,
      error: "must fetch bike first"
    }
  }

  let data = {
    'bike_id': bike.id,
    date: date,
    description: eventType
  };

  if (note !== '') {
    data.note = note;
  }

  return dispatch => {
    dispatch(startMaintReq());
    return fetch('/api/maintenance_events', {
      method: 'post',
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(function(resp) {
      if (resp.status > 399) {
        return Promise.reject(new Error(resp.statusText));
      }
      return resp.json();
    })
    .then(function(data) {
      dispatch(maintReqSuccess(data));
    })
    .catch(function(err) {
      console.log(err);
      dispatch(maintReqFailure(err));
    });
  }
}

export function getDistanceSince(bike, eventType) {
  if (!eventType) {
    return {
      type: GET_DISTANCE_FAILURE,
      error: 'event description missing'
    }
  }

  const token = getToken();
  if (!token) {
    return {
      type: TOKEN_MISSING_ERROR,
      error: 'auth token missing'
    }
  }

  return dispatch => {
    dispatch(getDistanceStart());
    return fetch(`/api/maintenance_event/distance/${bike.id}?type=${eventType}`, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(resp) {
      if (resp.status !== 200) {
        return Promise.reject(new Error(resp.statusText));
      } else {
        return Promise.resolve(resp);
      }
    })
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      dispatch(getDistanceSuccess(data));
    })
    .catch(function(err) {
      dispatch(getDistanceFailure(err));
    });
  }
}

export function getAllMaintenanceEvents(bike) {
  const token = getToken();
  if (!token) {
    return {
      type: TOKEN_MISSING_ERROR,
      error: 'auth token missing'
    }
  }

  if (!bike.id) {
    return {
      type: GET_ALL_EVENTS_FAILURE,
      error: 'missing bike id'
    }
  }

  return dispatch => {
    dispatch(reqAllEventsStart());
    return fetch(`api/maintenance_events/${bike.id}`, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }).then(function(resp) {
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
      dispatch(allEventsSuccess(data));
    })
    .catch(function(err) {
      dispatch(allEventsFailure(err));
    })
  }
}

function reqAllEventsStart() {
  return {
    type: GET_ALL_EVENTS_START
  };
}

function allEventsSuccess(data) {
  return {
    type: GET_ALL_EVENTS_SUCCESS,
    data: data
  };
}

function allEventsFailure(err) {
  return {
    type: GET_ALL_EVENTS_FAILURE,
    error: err
  };
}

function getDistanceStart() {
  return {
    type: GET_DISTANCE_START
  }
}

function getDistanceSuccess(data) {
  return {
    type: GET_DISTANCE_SUCCESS,
    data: data
  }
}

function getDistanceFailure(err) {
  return {
    type: GET_DISTANCE_FAILURE,
    error: err
  }
}

function startMaintReq() {
  return {
    type: CREATE_MAINT_REQ_START
  }
}

function maintReqSuccess(data) {
  return {
    type: CREATE_MAINT_SUCCESS,
    data: data,
  }
}

function maintReqFailure(err) {
  return {
    type: CREATE_MAINT_FAILURE,
    error: err
  }
}
