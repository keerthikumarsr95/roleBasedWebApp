import React, { Component } from 'react';
import { connect } from 'react-redux';

import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import constants from '../helper/constants';
import Styles from '../helper/Styles';
import AddNewLeave from './subComponents/addNewLeave';
import Snackbar from 'material-ui/Snackbar';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { getLeavesForManagerAction, approveLeaveAction, declineLeaveAction } from '../../actions/manager';
import { checkIfThisNewEventIsForThisComponent, listenToSocket } from '../helper/socketIo';

const status = 'pending';

class ManagerView extends Component {
  constructor() {
    super();
    this.state = {
      leaves: [],
      openSnackBar: false,
      alertMessage: '',
      timeOut: 0,
      selectedRows: []
    };
    this.allowUpdate = false;
    this.getLeavesList = this.getLeavesList.bind(this);
    this.approveLeave = this.approveLeave.bind(this);
    this.declineLeave = this.declineLeave.bind(this);
    this.handleSnackBarRequestClose = this.handleSnackBarRequestClose.bind(this);
    this.alertMessage = this.alertMessage.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.listenToSocketForUpdates = this.listenToSocketForUpdates.bind(this);
  }

  handleSnackBarRequestClose() {
    this.setState({ openSnackBar: false, alertMessage: '' })
  }

  alertMessage(message, timeOut = 0) {
    this.setState({ openSnackBar: true, alertMessage: message, timeOut })
  }

  async approveLeave(e) {
    e.preventDefault();
    const { selectedRows, leaves } = this.state;
    let leavesUUIDArray = []
    selectedRows.forEach(i => { if (leaves[i].status === constants.PENDING) leavesUUIDArray.push(leaves[i].leaveId) });
    if (leavesUUIDArray.length) {
      this.alertMessage('working on leave approval...');
      const { data } = await approveLeaveAction({ requestObject: leavesUUIDArray });
      if (data.success) {
        this.alertMessage('Successfully Approved.', 4000);
        let employeeId = this.props.match.params.employeeId;
        let statusToFetch = employeeId ? 'all' : status;
        this.getLeavesList(statusToFetch, employeeId);
      } else {
        this.alertMessage(data.message, 4000);
      }
    } else {
      if (leavesUUIDArray.length === selectedRows.length) {
        this.alertMessage('Select one or more leaves to proceed', 4000);
      } else {
        this.alertMessage('Select Pending leaves to proceed', 4000);
      }
    }
  }

  async declineLeave(e) {
    e.preventDefault();
    const { selectedRows, leaves } = this.state;
    let leavesUUIDArray = []
    selectedRows.forEach(i => { if (leaves[i].status === constants.PENDING) leavesUUIDArray.push(leaves[i].leaveId) });
    if (leavesUUIDArray.length) {
      this.alertMessage('working on leave decline...');
      const { data } = await declineLeaveAction({ requestObject: leavesUUIDArray });
      if (data.success) {
        this.alertMessage('Successfully declined.', 4000);
        let employeeId = this.props.match.params.employeeId;
        let statusToFetch = employeeId ? 'all' : status;
        this.getLeavesList(statusToFetch, employeeId);
      } else {
        this.alertMessage(data.message, 4000);
      }
    } else {
      if (leavesUUIDArray.length === selectedRows.length) {
        this.alertMessage('Select one or more leaves to proceed', 4000);
      } else {
        this.alertMessage('Select Pending leaves to proceed', 4000);
      }
    }
  }

  async getLeavesList(status, employeeId) {
    try {
      const { data } = await getLeavesForManagerAction(status, employeeId);
      if (data.success) {
        this.setState({ leaves: data.leaves })
      } else {
        this.setState({ leaves: [] });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleRowSelection(selectedRows) {
    if (selectedRows.length) {
      this.setState({ selectedRows: selectedRows });
    }
  }

  isSelected(index) {
    return this.state.selectedRows.indexOf(index) !== -1;
  }

  getTableData(employees) {
    return (
      <Table
        selectable={true}
        multiSelectable={true}
        onRowSelection={this.handleRowSelection}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={true}
        >
          <TableRow>
            <TableHeaderColumn>Reason</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={true}
          showRowHover={true}
        >
          {
            employees.map((employee, index) => (
              <TableRow
                key={employee._id}
                selected={this.isSelected(index)}
              >
                <TableRowColumn title={employee.reason}>
                  {employee.reason}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.status}
                </TableRowColumn>
                <TableRowColumn>
                  {new Date(employee.createdAt).toLocaleDateString()}
                </TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
        <TableFooter
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableRowColumn>{employees.length} results</TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }

  listenToSocketForUpdates(updates) {
    if (this.allowUpdate) {
      if (checkIfThisNewEventIsForThisComponent(updates, constants.SOCKET_MANAGER_LEAVE_UPDATE_CODE)) {
        this.alertMessage('There is new leave request', 4000);
        let employeeId = this.props.match.params.employeeId;
        let statusToFetch = employeeId ? 'all' : status;
        this.getLeavesList(statusToFetch, employeeId);
      }
    }
  }

  componentDidMount() {
    this.allowUpdate = true;
    listenToSocket(this.props.employeeId, this.listenToSocketForUpdates)
    let employeeId = this.props.match.params.employeeId;
    let statusToFetch = employeeId ? 'all' : status;
    this.getLeavesList(statusToFetch, employeeId);
  }

  componentWillUnmount() {
    this.allowUpdate = false;
  }

  render() {
    const {
      leaves, openSnackBar, alertMessage, timeOut
    } = this.state;;
    return (
      <div className="contentArea">
        <div>
          <Paper
            style={Styles.paperStyle}
            zDepth={5}
          >
            <div>
              <Subheader>{status.toUpperCase()}</Subheader>
            </div>
            <div>
              <Snackbar
                open={openSnackBar}
                message={alertMessage}
                autoHideDuration={timeOut}
                onRequestClose={this.handleSnackBarRequestClose}
              />
            </div>
            <div className="flex--alignEnd">
              <RaisedButton
                label="Approve"
                style={Styles.button}
                onClick={this.approveLeave}
              />
              <RaisedButton
                label="Decline"
                style={Styles.button}
                onClick={this.declineLeave}
              />
            </div>

            <div className="margin5px">
              {leaves.length
                ?
                this.getTableData(leaves)
                :
                <span className="pd-10">
                  {status === 'pending' ? 'No pending leaves' : 'No Leaves data'}
                </span>
              }
            </div>
          </Paper>
          <div>
            <Snackbar
              open={openSnackBar}
              message={alertMessage}
              autoHideDuration={timeOut}
              onRequestClose={this.handleSnackBarRequestClose}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  employeeId: state.user.user.employeeId
})

export default connect(mapStateToProps)(ManagerView);