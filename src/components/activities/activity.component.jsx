import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as activityAction from '../../actions/activityActions.js';
import PopupModal from '../../components/common/popup.component';
import * as dashboardActions from '../../actions/dashboardActions';
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class Activity extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            activityList: [],
            deleteIndex: '',
            actId: '',
            activityDetails: ''
        }
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
        }

        this
            .props
            .actActions
            .getActivityList(data);
    }

    componentDidMount() {
        var data = {
            parent: 'Activities',
            childone: '',
            childtwo: ''
        };
        this.props.breadCrumb(data);

        $('div#activity_list').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ActivityTable
                .init();
            $('div#activity_list').unblock();
        }, 2000);
        let that = this;
        $("#activity_table").on('click', '.times', function () {
            var index = $(this).attr('data');
            var actId = $(this).attr('id');
            that.handleDelete(actId, index);
        });
        $("#activity_table").on('click', '.info', function () {
            var actId = $(this).attr('id');
            var actType = $(this).attr('data');
            that.handleDetail(actId, actType);
        });
    }

    handleDelete(actId, index) {

        this.setState({ actId: actId, deleteIndex: index })
        $('#act_delete').modal('show');
    }

    handleDetail(actId, actType) {
        let modalType;
        var data = {
            activityId: actId,
            activityType: parseInt(actType)
        }

        this
            .props
            .actActions
            .getActivityDetails(data);

        if (actType == "1") {
            modalType = "#noteModal";
        } else if (actType == "2") {
            modalType = "#eventModal";
        } else if (actType == "3") {
            modalType = "#taskModal";
        } else if (actType == "4") {
            modalType = "#emailModal";
        } else if (actType == "5") {
            modalType = "#faxModal";
        } else if (actType == "6") {
            modalType = "#callModal";
        } else if (actType == "7") {
            modalType = "#letterModal";
        }

        $(modalType).modal('show');
        // browserHistory.push('/activityDetail');
    }

    deleteActHandler() {
        if (this.state.actId) {
            $('#act_delete').modal('hide');
            $('div#activity_list').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            var data = {
                activityId: this.state.actId
            }
            this
                .props
                .actActions
                .deleteActivity(data, this.state.deleteIndex, this.state.activityList);
        }
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.activityDetails) {
            this.setState({ activityDetails: nextProps.activityDetails })
        }

        if (nextProps.activityList && !nextProps.activityDetails) {
            var activityState = JSON.parse(JSON.stringify(nextProps.activityList));
            this.setState({ activityList: activityState });
            var activity_list = $('#activity_table').DataTable();
            activity_list.destroy();
            setTimeout(function () {
                datatable
                    .ActivityTable
                    .init();
            }, 3000);
            setTimeout(function () {
                $('div#activity_list').unblock();
            }, 3200);
        }
    }
    render() {
        var activityType = '';
        var modelType = '';
        var activityDetails = '';
        var activityList = this
            .state
            .activityList
            .map(function (act, index) {
                switch (act.activityType) {
                    case "1":
                        activityType = "Note";
                        modelType = "#noteModal";
                        break;
                    case "2":
                        activityType = "Event";
                        modelType = "#eventModal";
                        break;
                    case "3":
                        activityType = "Task";
                        modelType = "#taskModal";
                        break;
                    case "4":
                        activityType = "Email";
                        modelType = "#emailModal";
                        break;
                    case "5":
                        activityType = "Fax";
                        modelType = "#faxModal";
                        break;
                    case "6":
                        activityType = "Call";
                        modelType = "#callModal";
                        break;
                    case "7":
                        activityType = "Letter";
                        modelType = "#letterModal";
                        break;
                    default:
                        return activityType;
                }
                return <tr key={index}>
                    <td>{activityType}</td>
                    <td>{moment(act.createdAt).format("MM/DD/YYYY")}</td>
                    <td>{moment(act.createdAt).format("hh:mm:ss a")}</td>
                    {/*<td>{act.endDate
                        ? act.endDate
                        : '-'}</td>
                    <td>{act.endTime
                        ? act.endTime
                        : '-'}</td>*/}
                    <td>{act.subject
                        ? act.subject
                        : '-'}</td>
                    {/*<td>{act.assignee
                        ? act.assignee
                        : '-'}</td>*/}
                    {/*<td>-</td>*/}
                    <td>
                        <span className="btn btn-icon-only red times" data={index} id={act._id}><i className="fa fa-times"></i></span> &nbsp;&nbsp;&nbsp;
                        <span className="btn btn-icon-only blue info" data={act.activityType} id={act._id}><i className="fa fa-info"></i></span>
                    </td>
                </tr>;
            }.bind(this));
        var contactList = [];
        var oppsList = [];
        var projectList = [];
        var priority = '-';
        if (this.state.activityDetails) {
            activityDetails = this.state.activityDetails;
            var contacts = activityDetails.ContactActivity.map(function (contact) {
                contactList.push(contact.contactId.firstname + ' ' + contact.contactId.lastname)
            });
            var opportunities = activityDetails.OpportunityActivity.map(function (opportunity) {
                oppsList.push(opportunity.opportunitiesId.title)
            });
            var projects = activityDetails.ProjectActivity.map(function (project) {
                projectList.push(project.projectId.title)
            });
            if (activityDetails.activitydetails.priority == 1) {
                priority = "High";
            } else if (activityDetails.activitydetails.priority == 2) {
                priority = "Normal";
            } else if (activityDetails.activitydetails.priority == 3) {
                priority = "Low";
            }
        }
        return (
            <div
                className="portlet light portlet-fit portlet-datatable bordered"
                id="activity_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Activities</span>
                    </div>
                    <div className="text-right">
                        <div className="btn-group">
                            <a
                                className="btn btn-sm btn-circle blue"
                                href="javascript:;"
                                data-toggle="dropdown">
                                <span className="hidden-xs">
                                    New Activities
                                </span>
                                <i className="fa fa-angle-down"></i>
                            </a>
                            <ul className="dropdown-menu pull-right">
                                <li >
                                    <Link to="/note/add" className="tool-action">
                                        <i className="icon-note"></i>
                                        New Note</Link>
                                </li>
                                <li >
                                    <Link to="/event/add" className="tool-action">
                                        <i className="icon-event"></i>
                                        New Event</Link>
                                </li>
                                <li >
                                    <Link to="/task/add" className="tool-action">
                                        <i className="icon-wrench"></i>
                                        New Task</Link>
                                </li>
                                <li >
                                    <Link to="/email/add" className="tool-action">
                                        <i className="icon-envelope-letter"></i>
                                        New Email</Link>
                                </li>
                                <li >
                                    <Link to="/fax/add" className="tool-action">
                                        <i className="icon-film"></i>New Fax</Link>
                                </li>
                                <li >
                                    <Link to="/call/add" className="tool-action">
                                        <i className="icon-call-end"></i>
                                        New Call</Link>
                                </li>
                                <li >
                                    <Link to="/letter/add" className="tool-action">
                                        <i className="icon-envelope-open"></i>
                                        New Letter</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table
                            className="table table-striped table-bordered table-hover"
                            id="activity_table">
                            <thead >
                                <tr>
                                    <th>Type</th>
                                    <th>Date Start</th>
                                    <th>Time Start</th>
                                    {/*<th>Date End</th>
                                    <th>Time End</th>*/}
                                    <th>Subject/Title</th>
                                    {/*<th>Assignee/Calendar</th>*/}
                                    {/*<th>Contact</th>*/}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <PopupModal modalId="noteModal" header="Note Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                </div>
                                <label htmlFor="form_control_1">Subject</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                </div>
                                <label htmlFor="form_control_1">Description</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.categoryId ? activityDetails.activitydetails.categoryId.categoryName : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Category</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails ? activityDetails.activitydetails.createdDate : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails ? activityDetails.activitydetails.createdTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Time</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails ? activityDetails.activitydetails.createdBy : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Created By</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {contactList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Contacts</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {projectList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Project</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {oppsList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Opportunity</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopupModal>
                <PopupModal modalId="eventModal" header="Event Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.eventName ? activityDetails.activitydetails.eventName : '-'}
                                </div>
                                <label htmlFor="form_control_1">Event Name</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.categoryId ? activityDetails.activitydetails.categoryId.categoryName : '-'}
                                </div>
                                <label htmlFor="form_control_1">Category</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.eventNotes ? activityDetails.activitydetails.eventNotes : '-'}
                                </div>
                                <label htmlFor="form_control_1">Notes</label>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.createdAt ? moment(activityDetails.activitydetails.createdAt).format('MM/DD/YYYY') : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Start Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.startTime ? activityDetails.activitydetails.startTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Time</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.endDate ? activityDetails.activitydetails.endDate : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">End Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.endTime ? activityDetails.activitydetails.endTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Time</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {contactList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Contact</label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {projectList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Project</label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {oppsList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Opportunity</label>
                                    </div>
                                </div>
                                {/*<div className="col-md-12">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <a className="btn btn-sm btn-circle green">
                                            Reminders
                                        </a>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="rememberme mt-checkbox mt-checkbox-outline">
                                        <input type="checkbox" name="remember" value="1" />
                                        Repeat
                                        <span></span>
                                    </label>
                                </div>*/}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="rememberme mt-checkbox mt-checkbox-outline">
                                <input type="checkbox" name="remember" value="1" checked={activityDetails.activitydetails ? activityDetails.activitydetails.isAllDay : ''} />
                                All Day Event
                                        <span></span>
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="rememberme mt-checkbox mt-checkbox-outline">
                                <input type="checkbox" name="remember" value="1" checked={activityDetails.activitydetails ? activityDetails.activitydetails.isComplete : ''} />
                                Is Complete
                                        <span></span>
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="rememberme mt-checkbox mt-checkbox-outline">
                                <input type="checkbox" name="remember" value="1" checked={activityDetails.activitydetails ? activityDetails.activitydetails.isCalendarEvent : ''} />
                                Calendar Event
                                        <span></span>
                            </label>
                        </div>
                    </div>
                </PopupModal>
                <PopupModal modalId="taskModal" header="Task Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                </div>
                                <label htmlFor="form_control_1">Subject</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                </div>
                                <label htmlFor="form_control_1">Description</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.categoryId ? activityDetails.activitydetails.categoryId.categoryName : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Category</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {priority}
                                        </div>
                                        <label htmlFor="form_control_1">Priority</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.assignedTo ? activityDetails.activitydetails.assignedTo.firstname + ' ' + activityDetails.activitydetails.assignedTo.lastname : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Assigned To</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {localStorage.userName}
                                        </div>
                                        <label htmlFor="form_control_1">Assigned By</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.startDate ? moment(activityDetails.activitydetails.startDate).format('MM/DD/YYYY') : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Start Date</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.dueDate ? moment(activityDetails.activitydetails.dueDate).format('MM/DD/YYYY') : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Due Date</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.reminderDate ? activityDetails.activitydetails.reminderDate : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Reminder Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.reminderTime ? activityDetails.activitydetails.reminderTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Reminder Time</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {contactList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Contact</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {projectList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Project</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {oppsList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Opportunity</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopupModal>
                <PopupModal modalId="emailModal" header="Email Details" addDone="">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.from ? activityDetails.activitydetails.from : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">From</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.to ? activityDetails.activitydetails.to : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">To</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.cc ? activityDetails.activitydetails.cc : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Cc</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.bcc ? activityDetails.activitydetails.bcc : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Bcc</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Subject</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Description</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.attachFileName ? activityDetails.activitydetails.attachFileName : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Attachment</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {contactList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Contact</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {projectList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Project</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {oppsList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Opportunity</label>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </PopupModal>
                <PopupModal modalId="faxModal" header="Fax Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {localStorage.userName}
                                </div>
                                <label htmlFor="form_control_1">From</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                </div>
                                <label htmlFor="form_control_1">Subject</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                </div>
                                <label htmlFor="form_control_1">Description</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.createdAt ? moment(activityDetails.activitydetails.createdAt).format('MM/DD/YYYY') : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.pages ? activityDetails.activitydetails.pages : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Pages</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group form-md-line-input form-md-floating-label">
                                    <div className="form-control form-control-static">
                                        {contactList.toString()}
                                    </div>
                                    <label htmlFor="form_control_1">Contact</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group form-md-line-input form-md-floating-label">
                                    <div className="form-control form-control-static">
                                        {projectList.toString()}
                                    </div>
                                    <label htmlFor="form_control_1">Project</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group form-md-line-input form-md-floating-label">
                                    <div className="form-control form-control-static">
                                        {oppsList.toString()}
                                    </div>
                                    <label htmlFor="form_control_1">Opportunity</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopupModal>
                <PopupModal modalId="callModal" header="Call Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {localStorage.userName}
                                </div>
                                <label htmlFor="form_control_1">From</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                </div>
                                <label htmlFor="form_control_1">Subject</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                </div>
                                <label htmlFor="form_control_1">Description</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.startTime ? activityDetails.activitydetails.startTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Start Time</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.endTime ? activityDetails.activitydetails.endTime : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">End Time</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.date ? activityDetails.activitydetails.date : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Date</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.duration ? activityDetails.activitydetails.duration : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Duration</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {activityDetails.activitydetails && activityDetails.activitydetails.result ? activityDetails.activitydetails.result : '-'}
                                        </div>
                                        <label htmlFor="form_control_1">Result</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {localStorage.userName}
                                        </div>
                                        <label htmlFor="form_control_1">Created By</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {contactList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Contact</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {projectList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Project</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <div className="form-control form-control-static">
                                            {oppsList.toString()}
                                        </div>
                                        <label htmlFor="form_control_1">Opportunity</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopupModal>
                <PopupModal modalId="letterModal" header="Letter Details" addDone="">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.subject ? activityDetails.activitydetails.subject : '-'}
                                </div>
                                <label htmlFor="form_control_1">Subject</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {activityDetails.activitydetails && activityDetails.activitydetails.description ? activityDetails.activitydetails.description : '-'}
                                </div>
                                <label htmlFor="form_control_1">Description</label>
                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {contactList.toString()}
                                </div>
                                <label htmlFor="form_control_1">Contact</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {projectList.toString()}
                                </div>
                                <label htmlFor="form_control_1">Project</label>
                            </div>
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <div className="form-control form-control-static">
                                    {oppsList.toString()}
                                </div>
                                <label htmlFor="form_control_1">Opportunity</label>
                            </div>
                        </div>
                    </div>
                </PopupModal>
                <DeleteModal
                    deleteModalId="act_delete"
                    deleteUserHandler={this.deleteActHandler} />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return { activityList: state.activityCreation.activityList, activityDetails: state.activityCreation.activityDetails };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch),
        actActions: bindActionCreators(activityAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Activity);
