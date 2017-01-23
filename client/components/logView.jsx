import React, { Component, PropTypes } from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import { darkBlack, lightBlack } from 'material-ui/styles/colors';

import {
  parseDatetime,
  formatDateForDisplay,
  formatDateTimeForDisplay,
  getDefaultTime,
} from '../actions/utils';

export default class LogView extends Component {
  constructor(props) {
    super(props);

    this.getBike = this.getBike.bind(this);
    this.getDistance = this.getDistance.bind(this);
    this.getAllEvents = this.getAllEvents.bind(this);
    this.addEvent = this.addEvent.bind(this);

    this.state = {
      description: '',
      date: undefined,
      time: getDefaultTime(),
      note: '',
      showDistanceModal: false,
    };
  }

  // TODO: disbable buttons on fetch so multiple fetches aren't overlapping
  render() {
    const eventTypes = this.props.maintenance.event_types || [];

    return (
      <div className="logview-page-wrapper">
        { this.renderDistanceModal() }
        <h2>BikeLog</h2>
        <div className="logView-container">
          <div className="controls">
            <fieldset>
              <AutoComplete
                id="event"
                fullWidth={true}
                floatingLabelText="Maintenance description"
                onUpdateInput={text => {this.onEventChange('reqDescription', null, text)}}
                dataSource={eventTypes}
                filter={AutoComplete.fuzzyFilter}
              />
              <RaisedButton
                primary={true}
                label="Get distance"
                onClick={this.getDistance}
              />
              <p>{this.props.distanceInfo}</p>
            </fieldset>
            <fieldset>
              <AutoComplete
                id="description"
                onUpdateInput={text => {this.onEventChange('description', null, text)}}
                dataSource={eventTypes}
                filter={AutoComplete.fuzzyFilter}
                fullWidth={true}
                searchText={this.state.description}
                floatingLabelText="Event description"
              />
              <DatePicker
                hintText="Date"
                onChange={(e, date) => { this.onEventChange('date', null, date) }}
                value={this.state.date}
              />
              <TimePicker
                hintText="Time of maintenance"
                defaultTime={getDefaultTime()}
                value={this.state.time}
                onChange={(e, time) => { this.onEventChange('time', null, time) }}
              />
              <TextField
                floatingLabelText="Note (optional)"
                fullWidth={true}
                rows={1}
                rowsMax={2}
                onChange={e => {this.onEventChange('note', e)}}
                value={this.state.note}
              />
              <RaisedButton
                primary={true}
                label="Add maintenance event"
                onClick={this.addEvent}
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
    if (!this.props.maintenance.event_types) return null;

    return (
      <div>
        {this.props.maintenance.event_types.map((type, i) => {
          return <p key={i}>{type}</p>;
        })}
      </div>
    );
  }

  renderEventsList() {
    const events = this.props.maintenance.events || [];
    events.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else if (a.date > b.date) {
        return -1;
      } else {
        return 0
      }
    });

    const purchaseDate = formatDateForDisplay(this.props.bike.purchased_at);

    return (
      <Paper zDepth={2}>
        <List>
          <Subheader>
            Maintenance Log: {this.props.bike.name} (purchased {purchaseDate})
        </Subheader>
          {events.map((event, idx) => {
            return (
              <div key={idx}>
                <ListItem
                  primaryText={event.description}
                  secondaryText={
                    <p>
                      <span style={{ color: darkBlack }}>{formatDateTimeForDisplay(event.date)} PST</span>
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

  renderDistanceModal() {
    const actions = [
      <RaisedButton
        label="OK"
        onTouchTap={() => { this.setState({ showDistanceModal: false }) }}
      />
    ];

    return (
      <Dialog
        title="Distance"
        actions={actions}
        modal={false}
        open={this.state.showDistanceModal}
        onRequestClose={() => { this.setState({ showDistanceModal: false }) }}
      >
        Miles traveled since the last {this.state.reqDescription}: {this.props.maintenance.miles}
      </Dialog>
    );
  }

  componentDidMount() {
    this.getBike();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bike.id !== nextProps.bike.id && (nextProps.bike.id !== undefined)) {
      this.getAllEvents(nextProps.bike);
    }
  }

  onEventChange(eventType, e, val=e.target.value) {
    this.setState({ [eventType]: val });
  }

  getDistance() {
    const eventType = this.state.reqDescription;
    this.props.onRequestDistance(this.props.bike, eventType);
    this.setState({ showDistanceModal: true });
  }

  getAllEvents(bike) {
    bike = bike || this.props.bike;
    this.props.onRequestAllEvents(bike);
  }

  getBike() {
    this.props.onRequestBike();
  }

  addEvent() {
    const description = this.state.description || '';
    let date = '';

    try {
      date = parseDatetime(this.state.date, this.state.time);
    } catch(e) {
      //TODO: propper logging and error handling
      console.log(e);
      return;
    }

    const time = this.state.time || '';
    const note = this.state.note || '';
    this.props.onCreateEventRequest(this.props.bike, description, date, note);
    this.setState({
      description: '',
      date: undefined,
      time: getDefaultTime(),
      note: '',
    });
  }
}
