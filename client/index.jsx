import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './containers/App';
import { LoginForm, LogView } from './components';
import { checkAuth, redirectWithAuth } from './actions/utils';

require('./styles/main.scss');
injectTapEventPlugin();

// can also take an initial state object for eg server-side rendering
const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <IndexRoute component={LoginForm}/>
        <Route path='login' component={LoginForm} onEnter={redirectWithAuth}/>
        <Route path='maint' component={LogView} onEnter={checkAuth}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
