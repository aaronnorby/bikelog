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
  })
  .catch(function(err) {
    console.log("error getting token: ", err);
  });
}

const loginBtn = document.getElementsByClassName('login-btn')[0];
loginBtn.addEventListener('click', tokenReq);
