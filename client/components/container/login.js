import React, { Component } from 'react';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import PropTypes from 'prop-types';

import { renderTextField } from '../helper/reduxFormComponents';
import { loginAction } from '../../actions/login';
import { ViewLink } from '../../util/helperFunctions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      openSnackBar: false,
      alertMessage: '',
      timeOut: 0
    }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleSnackBarRequestClose = this.handleSnackBarRequestClose.bind(this);

  }

  async onFormSubmit(values) {
    try {
      const { data } = await this.props.loginAction({ ...values });

      if (data.success) {
        this.context.router.history.push(ViewLink[data.employeeInfo.type])
      } else {
        this.setState({ openSnackBar: true, alertMessage: data.message, timeOut: 4000 });
      }
    } catch (error) {
      console.log(error);
      
      this.setState({ openSnackBar: true, alertMessage: error.response.data.message, timeOut: 4000 });
    }
  };

  handleSnackBarRequestClose() {
    this.setState({ openSnackBar: false, alertMessage: '', timeOut: 0 });
  }

  render() {
    const { handleSubmit } = this.props;
    const { openSnackBar, alertMessage, timeOut } = this.state;

    return (
      <div className="loginPage">
        <Card>
          <form onSubmit={handleSubmit(this.onFormSubmit)}>
            <CardTitle title="Login" />
            <CardText>
              <Field
                type="text"
                name="userName"
                component={renderTextField}
                label="User Name"
              // styles={styles.textField}
              />
              <Field
                type="password"
                name="password"
                component={renderTextField}
                label="Password"
              // styles={styles.textField}
              />
            </CardText>
            <CardActions>
              <RaisedButton type="submit" label="Login" primary={true} />
              {/* <FlatButton label="Action2" /> */}
            </CardActions>
          </form>
        </Card>
        <div>
          <Snackbar
            open={openSnackBar}
            message={alertMessage}
            autoHideDuration={timeOut}
            onRequestClose={this.handleSnackBarRequestClose}
          />
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
  router: PropTypes.object.isRequired
}

const validate = (values) => {
  let errors = {};
  let requiredFields = ['userName', 'password'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is Required'
    }
  });

  return errors;
}

export default
  reduxForm({
    validate,
    form: 'login'
  })(connect(null, { loginAction })(Login));