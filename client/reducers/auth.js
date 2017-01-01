import {
  SIGNUP_FAILURE,
  SIGNUP_REQ_START,
  SIGNUP_REQ_FAILURE,
  SIGNUP_REQ_SUCCESS,
  TOKEN_REQ_START,
  TOKEN_REQ_SUCCESS,
  TOKEN_REQ_FAILURE,
} from '../actions/constants';

export function signup(state = { isFetching: false, error: {} }, action) {
  switch (action.type) {
    case SIGNUP_REQ_START:
      return Object.assign({}, state, { isFetching: true });
    case SIGNUP_FAILURE:
    case SIGNUP_REQ_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: action.error });
    case SIGNUP_REQ_SUCCESS:
      return Object.assign({},
        state,
        {
          isFetching: false,
          error: action.error,
          data: action.data,
        });
    default:
      return state;
  }
}

export function token(state = { isFetching: false, error: {} }, action) {
  switch (action.type) {
    case TOKEN_REQ_START:
      return Object.assign({}, state, { isFetching: true });
    case TOKEN_REQ_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: action.error });
    case TOKEN_REQ_SUCCESS:
      return Object.assign({},
        state,
        {
          isFetching: false,
          error: action.error,
        });
    default:
      return state;
  }
}
