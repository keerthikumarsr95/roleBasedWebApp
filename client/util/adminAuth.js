import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import constants from '../components/helper/constants';

export default function (ComposedComponent) {

  class AdminAuth extends React.Component {
    componentWillMount() {
      if (this.props.type !== constants.ADMIN) {
        this.context.router.history.push('/');
      }
    }
    componentWillUpdate(nextProps) {
      if (nextProps.type !== constants.ADMIN) {
        this.context.router.history.push('/');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  AdminAuth.propTypes = {
    type: PropTypes.string.isRequired,
  }

  AdminAuth.contextTypes = {
    router: PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      type: state.user.type
    };
  }

  return connect(mapStateToProps)(AdminAuth);

}
