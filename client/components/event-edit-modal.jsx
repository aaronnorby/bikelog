import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default class EventEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      showDeleteConfirm: false,
    };
  }

  render() {
    const actions = [
      <RaisedButton
        label="CANCEL"
        onTouchTap={() => { this.props.onClose() }}
      />,
      <RaisedButton
        label="DELETE EVENT"
        secondary={true}
        onTouchTap={() => { this.setState({ showDeleteConfirm: true }) }}
      />
    ];

    return (
      <Dialog
        actions={actions}
        title="Edit"
        open={true}
        onRequestClose={() => { this.setState({ open: false }) }}
      >
        {this.renderDeleteConfirmModal()}
        {this.renderEventDescription()}
      </Dialog>
    );
  }

  renderEventDescription() {
    const { date, description, note } = this.props.currentEvent;
    const noteText = note ? `${note}.` : '';
    const text = `Delete "${description}". ${noteText} ${date}`;
    return (
      <span>
        {text}
      </span>
    );
  }

  renderDeleteConfirmModal() {
    const actions = [
      <RaisedButton
        label='CANCEL'
        onTouchTap={() => this.setState({ showDeleteConfirm: false }) }
      />,
      <RaisedButton
        label='YES, DELETE IT'
        secondary={true}
        onTouchTap={() => { this.onConfirmDeleteClick() }}
      />
    ];

    return (
      <Dialog
        title="Confirm"
        open={this.state.showDeleteConfirm}
        actions={actions}
        onRequestClose={() => { this.setState({ showDeleteConfirm: false }) }}
      >
        Are you sure? This cannot be undone.
      </Dialog>
    );
  }

  onConfirmDeleteClick() {
    const { bike_id, id } = this.props.currentEvent;
    this.props.deleteEvent(bike_id, id);
    this.props.onClose();
  }
}

EventEditModal.propTypes = {
  currentEvent: PropTypes.object,
  deleteEvent: PropTypes.func,
  onClose: PropTypes.func,
};
