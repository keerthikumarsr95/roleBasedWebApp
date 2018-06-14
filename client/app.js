import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import Alert from 'react-s-alert';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Header from './components/container/header';
import Login from './components/container/login';
import AdminView from './components/container/adminView';
import EmployeeView from './components/container/employeeView';
import ManagerView from './components/container/managerView';

import SideNav from './components/container/sideNav';
import Authenticate from './util/loginAuth';
import employeeAuth from './util/employeeAuth';
import adminAuth from './util/adminAuth';
import { ViewLink } from './util/helperFunctions';
import managerAuth from './util/managerAuth';
import ManagerEmployeeView from './components/container/managerEmployeeView';

const supportsHistory = 'pushState' in window.history;

export default class App extends Component {
  render() {
    return (

      <BrowserRouter forceRefresh={!supportsHistory}>
        <div>
          <Alert stack={{ limit: 3 }} />


          <Route exact path="/" render={() => {

            if (localStorage.jwtToken) {

              const decodedToken = jwtDecode(localStorage.jwtToken);
              return <Redirect to={ViewLink[decodedToken.type]} />
            } else {
              return <Login />
            }
          }} />
          <div className="bodyContainer">
            <Header />
            <Route path="/home" component={Authenticate(SideNav)} />
            <Route exact path="/home/admin/view" component={adminAuth(Authenticate(AdminView))} />
            <Route exact path="/home/employee/view/:status" component={employeeAuth(Authenticate(EmployeeView))} />
            <Route exact path="/home/manager/view/pending" component={managerAuth(Authenticate(ManagerView))} />
            <Route exact path="/home/manager/view/employees" component={managerAuth(Authenticate(ManagerEmployeeView))} />
            <Route exact path="/home/manager/view/employees/:employeeId" component={managerAuth(Authenticate(ManagerView))} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
} 