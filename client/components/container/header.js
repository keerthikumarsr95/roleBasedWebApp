import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { logout } from '../../actions/login';
import PropTypes from 'prop-types';

class Header extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logout();

    this.context.router.history.push('/');
  }
  render() {
    const { isAuthenticated, employeeName } = this.props;

    return (
      isAuthenticated &&
      <div className="headerArea">
        <AppBar
          title={`Welcome ${employeeName.toUpperCase()}`}
          iconElementRight={<FlatButton label="Logout" onClick={this.logout} />}
          showMenuIconButton={false}
        />
      </div>
    );
  }
}

Header.contextTypes = {
  router: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.user.isAuthenticated,
    employeeName: state.user.user.employeeName
  };
}

export default connect(mapStateToProps, { logout })(Header);