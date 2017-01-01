import React, { Component, PropTypes } from 'react';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.loginSubmit = this.loginSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this)

    this.state = {
      username: '',
      password: ''
    }
  }

  render() {
    return (
      <fieldset>
        <input
          type="text"
          placeholder="username"
          onChange={this.handleUsernameChange} />
        <input
          type="password"
          placeholder="password"
          onChange={this.handlePasswordChange} />
        <button className="login-btn" onClick={this.loginSubmit}>Log in</button>
      </fieldset>
    );
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  loginSubmit(e) {
    e && e.preventDefault();
    this.props.onLoginSubmit(this.state.username, this.state.password);
  }
}
