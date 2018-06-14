import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import constants from '../helper/constants';
import Styles from '../helper/Styles';
import AddOrEditEmployee from './subComponents/addOrEditEmployee';
import { getEmployeesListAction, addNewEmployeeAction, editEmployeeAction } from '../../actions/admin';
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
import { getTeamMembersListAction } from '../../actions/manager';


class ManagerEmployeeView extends Component {
  constructor() {
    super();
    this.state = {
      teamMembers: [],
      openSnackBar: false,
      alertMessage: '',
      timeOut: 0,
    };


    this.handleSnackBarRequestClose = this.handleSnackBarRequestClose.bind(this);
    this.alertMessage = this.alertMessage.bind(this);
    this.getEmployeesList = this.getEmployeesList.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);

  }

  handleSnackBarRequestClose() {
    this.setState({ openSnackBar: false, alertMessage: '' })
  }

  alertMessage(message, timeOut = 0) {
    this.setState({ openSnackBar: true, alertMessage: message, timeOut })
  }

  handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  handleSubmit(values) {
    this.setState({ openDialog: false });
    if (values.dialogType === constants.ADD) {
      this.addNewEmployee(values)
    } else {
      this.editEmployee(values)
    }
  }

  async getEmployeesList() {
    try {
      const { data } = await getTeamMembersListAction();
      if (data.success) {
        this.setState({ teamMembers: data.teamMembers, });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleRowSelection(selectedRows) {
    const { teamMembers } = this.state;
    this.props.history.push(`/home/manager/view/employees/${teamMembers[selectedRows[0]].email}`)
  }

  isSelected(index) {
    return this.state.selectedRow === index;
  };

  getTableData(teamMembers) {
    return (
      <Table
        selectable={true}
        onRowSelection={this.handleRowSelection}
        multiSelectable={false}
      >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>NAME</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Email</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
        >
          {
            teamMembers.map((employee, index) => (
              <TableRow
                key={employee._id}
                selected={this.isSelected(index)}
              >
                <TableRowColumn>
                  {employee.name}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.type}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.email}
                </TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
        <TableFooter
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableRowColumn>{teamMembers.length} results</TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }

  componentDidMount() {
    this.getEmployeesList()
  }

  render() {
    const { openSnackBar, alertMessage, timeOut, selectedRowData, teamMembers } = this.state;
    return (
      <div className="contentArea">
        <div>
          <Paper
            style={Styles.paperStyle}
            zDepth={5}
          >
            <div>
              <Subheader>Team Members</Subheader>
            </div>
            <div>
              <Snackbar
                open={openSnackBar}
                message={alertMessage}
                autoHideDuration={timeOut}
                onRequestClose={this.handleSnackBarRequestClose}
              />
            </div>

            <div className="margin5px">
              {teamMembers.length
                ?
                this.getTableData(teamMembers)
                :
                'No Team Members Data Available.'
              }
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}

export default ManagerEmployeeView;