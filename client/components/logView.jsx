import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import { darkBlack, lightBlack } from 'material-ui/styles/colors';

import { parseDatetime } from '../actions/utils';

export default class LogView extends Component {
  constructor(props) {
    super(props);

    this.getBike = this.getBike.bind(this);
    this.getDistance = this.getDistance.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
    this.addEvent = this.addEvent.bind(this);
  }

  // TODO: disbable buttons on fetch so multiple fetches aren't overlapping
  render() {
    return (
      <div className="logview-page-wrapper">
        <h2>{this.props.bike.name}</h2>
        <div className="logView-container">
          <div className="controls">
            <fieldset>
              <TextField
                id="event"
                fullWidth={true}
                floatingLabelText="Maintenance description"
                onChange={e => {this.onEventChange('reqDescription', e)}}
              />
              <RaisedButton
                primary={true}
                label="Get distance"
                onClick={this.getDistance}
              />
              <p>{this.props.distanceInfo}</p>
            </fieldset>
            <fieldset>
              <TextField
                id="description"
                onChange={e => {this.onEventChange('description', e)}}
                fullWidth={true}
                floatingLabelText="Event description"
              />
              <DatePicker
                hintText="Date"
                onChange={(e, date) => { this.onEventChange('date', null, date) }}
              />
              <TimePicker
                hintText="Time of maintenance"
                onChange={(e, time) => { this.onEventChange('time', null, time) }}
              />
              <TextField
                floatingLabelText="Note (optional)"
                fullWidth={true}
                rows={1}
                rowsMax={2}
                onChange={e => {this.onEventChange('note', e)}}
              />
              <RaisedButton
                primary={true}
                label="Add maintenance event"
                onClick={this.addEvent}
              />
            </fieldset>
            <fieldset>
              <RaisedButton
                label="Get all events"
                onClick={this.getAllEvents}
              />
            </fieldset>
          </div>
          <div className="list">
            {this.renderEventsList()}
          </div>
        </div>
      </div>
    );
  }

  renderEventTypes() {
    if (!this.props.maintenance.types) return null;

    return (
      <div>
        {this.props.maintenance.types.map((type, i) => {
          return <p key={i}>{type}</p>;
        })}
      </div>
    );
  }

  renderEventsList() {
    if (!this.props.maintenance.events) return null;

    return (
      <Paper zDepth={2}>
        <List>
          <Subheader>Maintenance Log</Subheader>
          {this.props.maintenance.events.map(event => {
            return (
              <div key={event.id}>
                <ListItem
                  primaryText={event.description}
                  secondaryText={
                    <p>
                      <span style={{ color: darkBlack }}>{event.date}</span>
                        <br /><span style={{color: lightBlack }}>{event.note}</span>
                      </p>
                    }
                    secondaryTextLines={2}
                  />
                <Divider />
              </div>
            );
          })}
        </List>
      </Paper>
    );
  }

  componentDidMount() {
    this.getBike();
  }

  onEventChange(eventType, e, val=e.target.value) {
    this.setState({ [eventType]: val });
  }

  getDistance() {
    const eventType = this.state.reqDescription;
    this.props.onRequestDistance(this.props.bike, eventType);
  }

  getAllEvents() {
    this.props.onRequestAllEvents(this.props.bike);
  }

  getBike() {
    this.props.onRequestBike();
  }

  addEvent() {
    const description = this.state.description || '';

    try {
      const date = parseDatetime(this.state.date, this.state.time) || '';
    } catch(e) {
      //TODO: propper logging and error handling
      console.log(e);
      return;
    }
    return;

    const time = this.state.time || '';
    const note = this.state.note || '';
    this.props.onCreateEventRequest(this.props.bike, description, date, note);
  }
}
