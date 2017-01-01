import {
  MAINT_REQ_START,
  MAINT_REQ_FAILURE,
  MAINT_REQ_SUCCESS,
  BIKE_REQ_START,
  BIKE_REQ_FAILURE,
  BIKE_REQ_SUCCESS,
  CREATE_MAINT_REQ_START,
  CREATE_MAINT_FAILURE,
  CREATE_MAINT_SUCCESS,
  GET_DISTANCE_START,
  GET_DISTANCE_FAILURE,
  GET_DISTANCE_SUCCESS,
  GET_ALL_EVENTS_START,
  GET_ALL_EVENTS_FAILURE,
  GET_ALL_EVENTS_SUCCESS,
  TOKEN_MISSING_ERROR
} from '../actions/constants';

export function maintenance(state = { isFetching: false, error: {} }, action) {
  switch (action.type) {
    case TOKEN_MISSING_ERROR:
      return Object.assign({}, state, { isFetching: false, error: action.error });
    case MAINT_REQ_START:
    case CREATE_MAINT_REQ_START:
    case GET_DISTANCE_START:
    case GET_ALL_EVENTS_START:
      return Object.assign({}, state, { isFetching: true });
    case MAINT_REQ_FAILURE:
    case CREATE_MAINT_FAILURE:
    case GET_DISTANCE_FAILURE:
    case GET_ALL_EVENTS_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: action.error });
    case MAINT_REQ_SUCCESS:
    case CREATE_MAINT_SUCCESS:
    case GET_DISTANCE_SUCCESS:
    case GET_ALL_EVENTS_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: {} }, action.data);
    default:
      return state;
  }
}

export function bike(state = { isFetching: false, error: {}, userBike: {} }, action) {
  switch (action.type) {
    case BIKE_REQ_START:
      return Object.assign({}, state, { isFetching: true });
    case BIKE_REQ_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: action.error });
    case BIKE_REQ_SUCCESS:
      return Object.assign({}, state, { isFetching: false, userBike: action.data.bike });
    default:
      return state;
  }
}

// selectors
export function getUserBike(state) {
  return state.userBike;
}
