import React, { Component } from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Divider from 'material-ui/Divider';
import constants from '../../helper/constants';
import Styles from '../../helper/Styles';
import { renderCheckBox, renderTextField, renderSelectField } from '../../helper/reduxFormComponents';

class AddOrEditEmployee extends Component {
  constructor() {
    super();
    this.state = {
      addTitle: 'Add Employee',
      editTitle: 'Edit Employee'
    }
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  onFormSubmit(values) {
    values.dialogType = this.props.dialogType;
    values.managerUUID = values.manager;
    this.props.formSubmit(values);
  }

  closeDialog() {
    this.props.reset();
    this.props.handleCloseDialog();
  }

  componentDidMount() {
    let { initData, initialize, dialogType } = this.props;
    if (dialogType === constants.EDIT) {
      initData.isManager = initData.type === constants.MANAGER ? true : false;
      initialize(initData)
    }
  }

  render() {
    const { openDialog, handleCloseDialog, dialogType, handleSubmit, isManager, manager } = this.props;
    const { addTitle, editTitle } = this.state;
    const title = dialogType === constants.ADD ? addTitle : editTitle;

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        type="submit"
        form="addOrEditEmployeeForm"
      />,
    ];
    return (
      <Dialog
        title={`${title}`}
        actions={actions}
        // modal={true}
        open={openDialog}
        onRequestClose={handleCloseDialog}
        autoScrollBodyContent={true}
        style={Styles.dialog}
        contentStyle={Styles.customContentStyle}
        autoDetectWindowHeight={true}
      >
        <form id="addOrEditEmployeeForm" onSubmit={handleSubmit(this.onFormSubmit)}>
          <div className="margin5px">
            <Field
              name="name"
              component={renderTextField}
              label="Name"
              styles={Styles.textField.underlineStyle}
            />
          </div>
          <div className="margin5px">
            <Field
              name="email"
              component={renderTextField}
              label="Email"
              styles={Styles.textField.underlineStyle}
            />
          </div>

          <div className="margin5px">
            <Field
              name="isManager"
              component={renderCheckBox}
              label="Enable if Manager"
            />
          </div>
          {!isManager && (
            manager.length ?
              <div className="margin5px">
                <Field
                  name="manager"
                  component={renderSelectField}
                  label="Manager"
                >
                  {
                    manager.map((ele) =>
                      <MenuItem
                        key={`${ele.name}#`}
                        value={ele.managerUUID}
                        primaryText={ele.name}
                      />
                    )
                  }
                </Field>
              </div>
              :
              <p className="pd-10">No Manager Available To Assign</p>
          )
          }
        </form>
      </Dialog >
    );
  }
}


const selector = formValueSelector('addOrEditEmployee');

const mapStateToProps = (state) => ({
  isManager: selector(state, 'isManager'),
});

const emailReqExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const validate = (values) => {
  let errors = {};
  const requiredFields = ['name', 'email'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is required';
    }
  });

  if (values.email && (!emailReqExp.test(values.email))) {
    errors.email = 'Invalid Email-Id';
  }
  return errors;
}

export default reduxForm({
  validate,
  form: 'addOrEditEmployee'
})(connect(mapStateToProps)(AddOrEditEmployee));