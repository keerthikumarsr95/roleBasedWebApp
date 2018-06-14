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
import { getLeavesListAction, addNewLeavesAction } from '../../actions/employee';
import { listenToSocket, checkIfThisNewEventIsForThisComponent } from '../helper/socketIo';


class EmployeeView extends Component {
  constructor() {
    super();
    this.state = {
      openDialog: false,
      dialogType: constants.ADD,
      employeeData: {},
      leaves: [],
      openSnackBar: false,
      alertMessage: '',
      timeOut: 0,
    };
    this.allowUpdate = false;
    this.getLeavesList = this.getLeavesList.bind(this);
    this.addLeave = this.addLeave.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSnackBarRequestClose = this.handleSnackBarRequestClose.bind(this);
    this.alertMessage = this.alertMessage.bind(this);
    this.addLeaveHelper = this.addLeaveHelper.bind(this);
    this.listenToSocketForUpdates = this.listenToSocketForUpdates.bind(this);
  }

  handleSnackBarRequestClose() {
    this.setState({ openSnackBar: false, alertMessage: '' })
  }

  alertMessage(message, timeOut = 0) {
    this.setState({ openSnackBar: true, alertMessage: message, timeOut })
  }

  addLeave(e) {
    e.preventDefault();
    const { employeeData } = this.state;
    if (employeeData.managerName) {
      this.setState({ openDialog: true, dialogType: constants.ADD });
    } else {
      this.alertMessage('No Manager assigned. Contact Admin.', 4000);
    }
  }

  handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  async addLeaveHelper(values) {
    try {

      this.alertMessage('Applying for leave...')
      const { data } = await addNewLeavesAction({ requestObject: values });

      if (data.success) {
        this.alertMessage('Successfully applied. you will be notify once approved', 4000);
        const status = this.props.match.params.status

        this.getLeavesList(status);
      } else {
        this.alertMessage(data.message, 4000);
      }
    } catch (error) {
      console.log(error);

    }
  }

  handleSubmit(values) {
    this.setState({ openDialog: false });
    this.addLeaveHelper(values)

  }

  async getLeavesList(status) {
    try {
      const { data } = await getLeavesListAction(status);
      if (data.success) {
        this.setState({ employeeData: data.employeeData, leaves: data.leaves })
      } else {
        this.setState({ employeeData: data.employeeData, leaves: [] });
      }
    } catch (error) {
      console.log(error);

    }
  }

  getTableData(employees) {
    return (
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Reason</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
        >
          {
            employees.map((employee) => (
              <TableRow
                key={employee._id}
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
      if (checkIfThisNewEventIsForThisComponent(updates, constants.SOCKET_EMPLOYEE_UPDATE_CODE)) {
        this.alertMessage('There is an update on your leave', 4000);
        const status = this.props.match.params.status
        this.getLeavesList(status)
      }
    }
  }

  componentDidMount() {
    this.allowUpdate = true;
    listenToSocket(this.props.employeeId, this.listenToSocketForUpdates)
    const status = this.props.match.params.status
    this.getLeavesList(status)
  }

  componentWillReceiveProps(nextProps) {
    const currentStatus = this.props.match.params.status;
    const newStatus = nextProps.match.params.status;
    if (currentStatus !== newStatus) {
      this.getLeavesList(newStatus);
    }
  }

  componentWillUnmount() {
    this.allowUpdate = false;
  }

  render() {
    const {
      openDialog, dialogType, employeeData, leaves, openSnackBar, alertMessage,
      timeOut
    } = this.state;;
    const status = this.props.match.params.status
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
                label="ADD"
                style={Styles.button}
                onClick={this.addLeave}
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
        </div>
        {openDialog &&
          <div>
            <AddNewLeave
              openDialog={openDialog}
              dialogType={dialogType}
              handleCloseDialog={this.handleCloseDialog}
              formSubmit={this.handleSubmit}
              employeeData={employeeData}
            />
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  employeeId: state.user.user.employeeId
})

export default connect(mapStateToProps)(EmployeeView);