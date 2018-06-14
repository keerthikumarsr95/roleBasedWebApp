import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import constants from '../components/helper/constants';

export default function (ComposedComponent) {

  class ManagerAuth extends React.Component {
    componentWillMount() {
      if (this.props.type !== constants.MANAGER) {
        this.context.router.history.push('/');
      }
    }
    componentWillUpdate(nextProps) {
      if (nextProps.type !== constants.MANAGER) {
        this.context.router.history.push('/');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      );
    }
  }

  ManagerAuth.propTypes = {
    type: PropTypes.string.isRequired,
  }

  ManagerAuth.contextTypes = {
    router: PropTypes.object.isRequired
  }

  function mapStateToProps(state) {
    return {
      type: state.user.type
    };
  }

  return connect(mapStateToProps)(ManagerAuth);

}
