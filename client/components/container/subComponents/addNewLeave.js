import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import { Field, reduxForm } from 'redux-form';
import Styles from '../../helper/Styles';
import { renderTextAreaField } from '../../helper/reduxFormComponents';

class AddOrEditEmployee extends Component {
  constructor() {
    super();
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  onFormSubmit(values) {
    this.props.formSubmit(values);
  }

  closeDialog() {
    this.props.reset();
    this.props.handleCloseDialog();
  }

  render() {
    const { openDialog, handleCloseDialog, dialogType, handleSubmit, employeeData } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Apply"
        primary={true}
        type="submit"
        form="applyleave"
      />,
    ];
    return (
      <Dialog
        title='Apply For Leave'
        actions={actions}
        // modal={true}
        open={openDialog}
        onRequestClose={handleCloseDialog}
        autoScrollBodyContent={true}
        style={Styles.dialog}
        contentStyle={Styles.customContentStyle}
        autoDetectWindowHeight={true}
      >
        <form id="applyleave" onSubmit={handleSubmit(this.onFormSubmit)}>
          <div className="margin5px nameArea pd-10">
            <span className="width12P">From</span>: <span className="pd-l-10">{employeeData.name}</span>
          </div>
          <Divider />
          <div className="margin5px nameArea pd-10">
            <span className="width12P">To</span>: <span className="pd-l-10">{employeeData.managerName}</span>
          </div>
          <Divider />
          <div className="nameArea pd-10">
            <span className="width12P">Reason</span>&nbsp;:
          </div>
          <div className="margin5px textAreaWrap pd-10">
            <Field
              name="reason"
              component={renderTextAreaField}
              label="Reason"
              type="textArea"
              fullWidth={true}
              styles={{
                multiLine: true,
                rows: 5,
                underlineShow: false,
                floatingLabelFixed: true,
              }}
            />
          </div>
        </form>
      </Dialog >
    );
  }
}




const validate = (values) => {
  let errors = {};
  const field = 'reason';
  if (!values[field]) {
    errors[field] = 'This field is required';
  }
  return errors;
}

export default reduxForm({
  validate,
  form: 'leaveApply'
})(AddOrEditEmployee);