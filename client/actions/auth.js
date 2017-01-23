import {
  SIGNUP_FAILURE,
  SIGNUP_REQ_START,
  SIGNUP_REQ_FAILURE,
  SIGNUP_REQ_SUCCESS,
  TOKEN_REQ_START,
  TOKEN_REQ_SUCCESS,
  TOKEN_REQ_FAILURE,
} from './constants';
import { setToken } from './utils';
import routes from '../routes';

export function signupReq(username='', password='') {
  if (username === '' || password === '') {
    return {
      type: SIGNUP_FAILURE,
      error: 'missing username or password'
    }
  }

  return dispatch => {
    dispatch(startSignupReq());
    return fetch('/signup', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(function(res) {
      return resp.json();
    }).then(function(data) {
      dispatch(signupSuccess(data));
    })
    .catch(function(err) {
      dispatch(signupFailure(err));
    });
  }
}

export function tokenReq(username='', password='') {
  if (username === '' || password === '') {
    return {
      type: TOKEN_REQ_FAILURE,
      error: 'username or password missing'
    }
  }

  return dispatch => {
    tokenReqStart();

    return fetch('/token', {
      method: 'get',
      headers: {
        "Authorization": "Basic " + btoa(username + ':' + password)
      }
    }).then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      let token = data.token;
      if (!token) {
        return Promise.reject(new Error("response missing token"));
      }
      setToken(token);
      dispatch(tokenReqSuccess());
      window.location.pathname = routes.logViewRoute;
    })
    .catch(function(err) {
      dispatch(tokenReqFailure(err));
    });
  }
}

function tokenReqStart() {
  return {
    type: TOKEN_REQ_START
  }
}

function tokenReqSuccess() {
  return {
    type: TOKEN_REQ_SUCCESS,
    error: {}
  }
}

function tokenReqFailure(err) {
  return {
    type: TOKEN_REQ_FAILURE,
    error: err
  }
}

function startSignupReq() {
  return {
    type: SIGNUP_REQ_START
  }
}

function signupSuccess(data) {
  return {
    type: SIGNUP_REQ_SUCCESS,
    data: data,
    error: {}
  }
}

function signupFailure(err) {
  return {
    type: SIGNUP_REQ_FAILURE,
    error: err
  }
}
