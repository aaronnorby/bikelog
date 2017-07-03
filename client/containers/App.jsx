import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {
  login,
  createMaintEvent,
  getDistanceSince,
  getBike,
  getAllMaintenanceEvents,
  deleteMaintEvent,
} from '../actions';

import { getUserBike } from '../reducers';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          {this.props.children && React.cloneElement(this.props.children, this.props)}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  const { signup, token, maintenance, bike }  = state;
  return {
    signup: signup,
    login: token,
    maintenance: maintenance,
    bike: getUserBike(state.bike) || {}
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit: (username, password) => {
      dispatch(login(username, password));
    },
    onCreateEventRequest: (bike, description, date, note) => {
      dispatch(createMaintEvent(bike, description, date, note));
    },
    onRequestDistance: (bike, eventType) => {
      dispatch(getDistanceSince(bike, eventType));
    },
    onRequestBike: () => {
      dispatch(getBike());
    },
    onRequestAllEvents: bike => {
      dispatch(getAllMaintenanceEvents(bike));
    },
    deleteMaintEvent: (bike_id, event_id) => {
      dispatch(deleteMaintEvent(bike_id, event_id));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
