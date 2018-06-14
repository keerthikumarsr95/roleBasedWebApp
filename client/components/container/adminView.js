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


class View extends Component {
  constructor() {
    super();
    this.state = {
      openDialog: false,
      dialogType: constants.ADD,
      manager: [],
      employees: [],
      openSnackBar: false,
      alertMessage: '',
      timeOut: 0,
      selectedRow: '',
      selectedRowData: {}
    };

    this.addEmployee = this.addEmployee.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSnackBarRequestClose = this.handleSnackBarRequestClose.bind(this);
    this.alertMessage = this.alertMessage.bind(this);
    this.editEmployeeData = this.editEmployeeData.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  handleSnackBarRequestClose() {
    this.setState({ openSnackBar: false, alertMessage: '' })
  }

  alertMessage(message, timeOut = 0) {
    this.setState({ openSnackBar: true, alertMessage: message, timeOut })
  }

  addEmployee(e) {
    e.preventDefault();
    this.setState({ openDialog: true, dialogType: constants.ADD });
  }

  editEmployeeData(e) {
    e.preventDefault();
    this.setState({ openDialog: true, dialogType: constants.EDIT });
  }

  handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  async addNewEmployee(values) {
    try {
      this.alertMessage('Adding new employee')
      const { data } = await addNewEmployeeAction({ requestObject: values });

      if (data.success) {
        this.alertMessage('Successfully added new employee', 4000);
        this.getEmployeesList();
      } else {
        this.alertMessage(data.message, 4000);
      }
    } catch (error) {
      console.log(error);

    }
  }

  async editEmployee(values) {
    try {
      this.alertMessage('Updating employee Details')
      const { data } = await editEmployeeAction({ requestObject: values });

      if (data.success) {
        this.alertMessage('Successfully Updated employee', 4000);
        this.getEmployeesList();
      } else {
        this.alertMessage(data.message, 4000);
      }
    } catch (error) {
      console.log(error);

    }
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
      const { data } = await getEmployeesListAction();
      if (data.success) {
        this.setState({ manager: data.managers, employees: data.employees })
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleRowSelection(selectedRows) {
    if (selectedRows.length)
      this.setState(previousState => ({ selectedRow: selectedRows[0], selectedRowData: previousState.employees[selectedRows[0]] }));
  }

  isSelected(index) {
    return this.state.selectedRow === index;
  };

  getTableData(employees) {
    return (
      <Table
        selectable={true}
        onRowSelection={this.handleRowSelection}
        multiSelectable={false}
        onCellClick={this.deleteEmployee}
      >
        <TableHeader
          adjustForCheckbox={true}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>NAME</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Email</TableHeaderColumn>
            <TableHeaderColumn>Manager</TableHeaderColumn>
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
                <TableRowColumn>
                  {employee.name}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.type}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.email}
                </TableRowColumn>
                <TableRowColumn>
                  {employee.managerName || '--'}
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

  componentDidMount() {
    this.getEmployeesList()
  }

  render() {
    const { openDialog, dialogType, manager, employees, openSnackBar, alertMessage, timeOut, selectedRowData } = this.state;
    return (
      <div className="contentArea">
        <div>
          <Paper
            style={Styles.paperStyle}
            zDepth={5}
          >
            <div>
              <Subheader>Employees</Subheader>
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
                onClick={this.addEmployee}
              />
              <RaisedButton
                label="EDIT"
                style={Styles.button}
                onClick={this.editEmployeeData}
              />
            </div>

            <div className="margin5px">
              {employees.length
                ?
                this.getTableData(employees)
                :
                'No Employee Data Available'
              }
            </div>
          </Paper>
        </div>
        {openDialog &&
          <div>
            <AddOrEditEmployee
              openDialog={openDialog}
              dialogType={dialogType}
              manager={manager}
              handleCloseDialog={this.handleCloseDialog}
              formSubmit={this.handleSubmit}
              initData={selectedRowData}
            />
          </div>
        }
      </div>
    )
  }
}

export default View;