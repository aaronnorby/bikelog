import React, { Component, PropTypes } from 'react';

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
      <div className="logView-container">
        <div className="controls">
          <h2>{this.props.bike.name}</h2>
          <fieldset>
            <input
              type="text"
              id="event"
              onChange={e => {this.onEventChange('reqDescription', e)}} />
            <label htmlFor="event">Maintenance event</label>
            <button onClick={this.getDistance}>Get distance</button>
            <p>{this.props.distanceInfo}</p>
          </fieldset>
          <fieldset>
            <input
              onChange={e => {this.onEventChange('description', e)}}
              type="text"
              placeholder="event description" />
            <input
              onChange={e => {this.onEventChange('date', e)}}
              type="text"
              placeholder="YYYY-MM-DD-HH-mm" />
            <input
              onChange={e => {this.onEventChange('note', e)}}
              type="text"
              placeholder="note" />
            <button onClick={this.addEvent}>Add maintenance event</button>
          </fieldset>
          <fieldset>
            <button onClick={this.getAllEvents}>Get all events</button>
          </fieldset>
        </div>
        <div className="list">
          {this.renderEventTypes()}
          {this.renderEventsList()}
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
      <div>
        {this.props.maintenance.events.map(event => {
          return (
            <div key={event.id}>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.note}</p>
            </div>
          );
        })}
      </div>
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
    const date = parseDatetime(this.state.date) || '';
    const note = this.state.note || '';
    this.props.onCreateEventRequest(this.props.bike, description, date, note);
  }
}
