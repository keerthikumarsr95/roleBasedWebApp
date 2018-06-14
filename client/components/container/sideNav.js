import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import constants from '../helper/constants';

class SideNav extends Component {
  render() {
    const { employeeType } = this.props;
    return (
      <div className="sideBar">
        <div className="sideBarElement">
          <div className="sideBarHeader">
            <span>VIEWS</span>
          </div>
        </div>
        {employeeType === constants.ADMIN &&
          < div className="sideBarElement">
            <div className="sideBarHeader">
              <NavLink
                exact
                to="/home/admin/view"
              >
                <span>Employees</span>
              </NavLink>
            </div>
          </div>
        }
        {employeeType === constants.MANAGER &&
          <div>
            <div className="sideBarElement">
              <div className="sideBarHeader">
                <NavLink
                  exact
                  to="/home/manager/view/pending"
                >
                  <span>Pending</span>
                </NavLink>
              </div>
            </div>
            <div className="sideBarElement">
              <div className="sideBarHeader">
                <NavLink
                  exact
                  to="/home/manager/view/employees"
                >
                  <span>Employees</span>
                </NavLink>
              </div>
            </div>
          </div>
        }
        {employeeType === constants.EMPLOYEE &&
          <div>
            <div className="sideBarElement">
              <div className="sideBarHeader">
                <NavLink
                  exact
                  to="/home/employee/view/pending"
                >
                  <span>Pending</span>
                </NavLink>
              </div>
            </div>
            <div className="sideBarElement">
              <div className="sideBarHeader">
                <NavLink
                  exact
                  to="/home/employee/view/all"
                >
                  <span>All</span>
                </NavLink>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    employeeType: state.user.type
  };
}

export default connect(mapStateToProps)(SideNav);