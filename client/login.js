const signupReq = (e) => {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  if (!username || !password) {
    console.log("missing username or password");
    return;
  }

  fetch('/signup', {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  }).then(function(resp) {
    return resp.json();
  })
  .then(function(data) {
    console.log("Success: ", data);
    window.location.pathname = '/login';
  })
  .catch(function(err) {
    console.log("err signing up: ", err);
  });
}

const tokenReq = (e) => {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  if (!username || !password) {
    console.log("missing username or password");
    return;
  }

  fetch('/token', {
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
      return Promise.reject(new Error("missing token"));
    }
    window.localStorage.setItem('bikelock', token);
    window.location.pathname = '/';
  })
  .catch(function(err) {
    console.log("error getting token: ", err);
  });
}

const loginBtn = document.getElementsByClassName('login-btn')[0];
if (loginBtn) {
  loginBtn.addEventListener('click', tokenReq);
}

const signupBtn = document.getElementsByClassName('signup-btn')[0];
if (signupBtn) {
  signupBtn.addEventListener('click', signupReq);
}
