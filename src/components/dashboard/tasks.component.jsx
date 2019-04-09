import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import autoBind from 'react-autobind';
import '../../styles/daterangepicker.css';

class Tasks extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            ranges: {
                'Today': [
                    moment(), moment()
                ],
                'Yesterday': [
                    moment().subtract(1, 'days'),
                    moment().subtract(1, 'days')
                ],
                'Two Days Ago': [
                    moment().subtract(2, 'days'),
                    moment().subtract(2, 'days')
                ],
                'Three Days Ago': [
                    moment().subtract(3, 'days'),
                    moment().subtract(3, 'days')
                ],
                'This Week': [
                    moment().startOf('week'),
                    moment().endOf('week')
                ],
                'This Week To Date': [
                    moment().startOf('week'),
                    moment()
                ],
                'Last Week': [
                    moment()
                        .subtract(1, 'week')
                        .startOf('week'),
                    moment()
                        .subtract(1, 'week')
                        .endOf('week')
                ],
                'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month')
                ],
                'This Month To Date': [
                    moment().startOf('month'),
                    moment()
                ],
                'Last Month': [
                    moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                    moment()
                        .subtract(1, 'month')
                        .endOf('month')
                ]
            },
            startDate: '',
            endDate: '',
            showDropdowns: true,
            per_page: 0,
            page: 0,
            statusId: 0,
            priorityId: 0,
            users: [],
            taskList: [],
            usersList: [],
            filteredUsers: [],
            usersFlag: true
        };
    }

    componentWillMount() {
        var companyId = {
            "companyId": localStorage.companyId
        }
        var activityType = {
            "activityType": 3
        }
        this.props.actions.getDashTaskList(companyId);
        this.props.actions.getTaksActivityContacts(companyId);

    }
    componentDidMount() {
        var data = {
            parent: 'Dashboard',
            childone: 'Tasks',
            childtwo: ''
        };
        this.props.breadCrumb(data);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.usersList.length) {
            this.setState({ usersList: nextProps.usersList });
        }
        this.setState({
            taskList: nextProps.getTaskList
        })
        $('div#dashboard_tasks_container').block({
            message: loader.GET_LOADER_IMAGE,
            css: { width: '25%' },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });
        var groupname_list = $('#dashboard_tasks').DataTable();
        groupname_list.destroy();
        setTimeout(function () {
            datatable.DashboardTasksTable.init();
            $('div#dashboard_tasks_container').unblock();
        }, 3000);
    }
    handleEvent(event, picker) {
        var start = picker
            .startDate
            .format('MM-DD-YYYY');
        var end = picker
            .endDate
            .format('MM-DD-YYYY');
        var data = {
            "filterType": "date",
            "companyId": localStorage.companyId,
            "startDate": start,
            "endDate": end
        }
        this.props.actions.getDashTaskFilteredList(data)
        this.setState({ startDate: start, endDate: end });
    }

    stateChange(type, e) {
        if (e.target.value === "0") {
            var data = {
                "companyId": localStorage.companyId
            }
            this.props.actions.getDashTaskList(data)
        }
        else {
            var data = {
                "filterType": "priority",
                "companyId": localStorage.companyId,
                "priorityId": e.target.value
            }
            this.props.actions.getDashTaskFilteredList(data)
        }
    }

    handleUsersModal(e) {
        e.preventDefault();
        $('#link-contact').modal('show');
    }

    handleUsersCheck(index, userId) {
        var currentState = this.state.users;
        var currentUsersState = this.state.usersList;
        var res = this.state.usersList[index];
        var currentFilteredList = this.state.filteredUsers;
        var existIndex = currentState.indexOf(userId);
        if (existIndex > -1) {
            currentState.splice(existIndex, 1);
            currentFilteredList.splice(existIndex, 1);
            this.setState({
                users: currentState,
                filteredUsers: currentFilteredList
            });
        }
        else {
            currentState.push(userId);
            currentFilteredList.push(res);
            this.setState({
                users: currentState,
                filteredUsers: currentFilteredList
            });
        }
    }

    handleUsersSubmit(e) {
        e.preventDefault();
        if (this.state.users.length != 0) {
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "users",
                "assignedTo": this.state.users
            }
            this
                .props
                .actions
                .getDashTaskFilteredList(data)
            setTimeout(function () {
                $('#link-contact').modal('hide');
            }, 500);
        }
        else {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashTaskList(data);
            setTimeout(function () {
                $('#link-contact').modal('hide');
            }, 500);
        }
    }

    render() {
        let priority = '';
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        var dashboardTasksList = this.state.taskList;
        var tasksList = dashboardTasksList.map(function (task, index) {
            if (task.priority === '1') {
                priority = 'High'
            }
            else if (task.priority === '2') {
                priority = 'Normal'
            }
            else if (task.priority === '3') {
                priority = 'Low'
            }
            return <tr key={index}>
                <td>{task.startDate ? moment(task.startDate).format('MM-DD-YYYY', moment.ISO_8601) : '-'}</td>
                <td>{task.dueDate ? moment(task.dueDate).format('MM-DD-YYYY', moment.ISO_8601) : '-'}</td>
                <td>{task.subject ? task.subject : '-'}</td>
                <td>{priority ? priority : '-'}</td>
                <td>{task.categoryId ? task.categoryId.categoryName : '-'}</td>
                <td>{task.assignedBy ? task.assignedBy : '-'}</td>
            </tr>;
        }.bind(this));

        var usersData = this.state.usersList
            .map(function (user, index) {
                return <tr key={index}>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>
                        <div className="md-checkbox-inline">
                            <div className="md-checkbox">
                                <input type="checkbox" id={user._id} className="md-check" onChange={this.handleUsersCheck.bind(this, index, user._id)} />
                                <label htmlFor={user._id}>
                                    <span></span>
                                    <span className="check"></span>
                                    <span className="box"></span>
                                </label>
                            </div>
                        </div>
                    </td>
                </tr>
            }.bind(this));

        var activeUsers = this.state.filteredUsers
            .map(function (user, index) {
                return <option key={index}>{user.firstname + ' ' + user.lastname}</option>
            }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "17px"
                            }}>Tasks</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_tasks_container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-floating-label">
                                <label htmlFor="status">Date Range</label>
                                <DateRangePicker
                                    ranges={this.state.ranges}
                                    showDropdowns={this.state.showDropdowns}
                                    onApply={this.handleEvent}>
                                    <div className="input-group date form_datetime">
                                        <input
                                            type="text"
                                            className="selected-date-range-btn"
                                            size="16"
                                            className="form-control"
                                            defaultValue={label
                                                ? label
                                                : "__-__-__"}
                                            key={label} />
                                        <span className="input-group-btn">
                                            <button className="btn default date-set" type="button">
                                                <i className="fa fa-calendar"></i>
                                            </button>
                                        </span>
                                    </div>
                                </DateRangePicker>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <select
                                    className="form-control edited"
                                    onChange={this
                                        .stateChange
                                        .bind(this, "priority")}
                                    ref="priority"
                                    id="priority">
                                    <option value="0">All</option>
                                    <option value="1">High</option>
                                    <option value="2">Normal</option>
                                    <option value="3">Low</option>
                                </select>
                                <label htmlFor="priority">Priority</label>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <button onClick={this.handleUsersModal}
                                        href="#link-contact"
                                        className="btn btn-sm btn-circle green"
                                        data-toggle="modal">
                                        <i className="icon-user-follow"></i>
                                        Users
                                    </button>
                                </div>
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <select className="form-control" size="3">
                                            {activeUsers}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="portlet light portlet-fit portlet-datatable bordered">
                            <div className="portlet-body">
                                <div className="table-container table-responsive">
                                    <table className="table table-striped table-bordered table-hover" id="dashboard_tasks">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Due Date</th>
                                                <th>Subject</th>
                                                <th>Priority</th>
                                                <th>Category</th>
                                                <th>Assignee</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasksList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="link-contact" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Select Users</h4>
                            </div>
                            <div className="modal-body">
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="icon-users "></i>
                                            <span className="caption-subject bold uppercase">Users</span>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="table-container table-responsive">
                                            <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                <thead>
                                                    <tr>
                                                        <th>Contact Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {usersData}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    className="btn green"
                                    id="send-invite-button" onClick={this.handleUsersSubmit}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        getTaskList: state.dashboards.tasksList,
        usersList: state.dashboards.usersList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
