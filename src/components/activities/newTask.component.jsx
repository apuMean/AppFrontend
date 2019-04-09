import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as appValid from '../../scripts/app';
import jQuery from 'jquery';
import * as layout from '../../scripts/app';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as opportunityAction from '../../actions/opportunityAction';
import * as documentAction from '../../actions/documentActions';
import * as activityAction from '../../actions/activityActions.js';
import Select from 'react-select';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class NewTask extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            contactValue: [],
            assignValue: '',
            contactids: [],
            oppids: [],
            projectids: [],
            projectValue: [],
            opportunitieValue: [],
            contactOptions: [],
            assignOptions: [],
            projectOptions: [],
            opportunityOptions: [],
            startDate: moment().format('MM/DD/YYYY'),
            endDate: '',
            reminderDate: '',
            categoryList: []
        }
    }
    componentDidMount() {
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
            appValid
                .FormValidationMd
                .init();
        }, 400);

        var data = {
            companyId: localStorage.companyId,
            activityType: "3"
        }

        this
            .props
            .actActions
            .getActCategory(data);
    }
    handleStartDate(event, picker) {

        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY');

        this.setState({ startDate: displayDate });

        layout
            .FloatLabel
            .init();

    }

    handleEndDate(event, picker) {

        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY');

        this.setState({ endDate: displayDate });

        layout
            .FloatLabel
            .init();

        var validator = jQuery("#createTask").validate();
        validator.element("#endDateTime");
        jQuery('span[id^="endDateTime-error"]').remove();
    }

    handleReminderDate(event, picker) {

        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY hh:mm:ss a');

        this.setState({ reminderDate: displayDate });

        layout
            .FloatLabel
            .init();

        var validator = jQuery("#createTask").validate();
        validator.element("#reminderDateTime");
        jQuery('span[id^="reminderDateTime-error"]').remove();
    }

    handleContactChange(value) {
        this.state.contactids = [];
        this.setState({ contactValue: value })
        var val = value.map(function (res, index) {
            this
                .state
                .contactids
                .push(res.value);
        }.bind(this));

    }

    handleProjectChange(value) {
        this.state.projectids = [];
        this.setState({ projectValue: value })
        var val = value.map(function (res, index) {
            this
                .state
                .projectids
                .push(res.value);
        }.bind(this));
    }

    handleOppChange(value) {
        this.state.oppids = [];
        this.setState({ opportunityValue: value });
        var val = value.map(function (res, index) {
            this
                .state
                .oppids
                .push(res.value);
        }.bind(this));
    }

    handleAssignChange(value) {
        this.setState({ assignValue: value })
    }

    onInputChangeContact(value) {
        var data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .oppActions
            .getIndividualData(data);
    }

    onInputChangeProject(value) {
        if (this.state.contactids.length > 0) {
            var data = {
                title: value,
                companyId: localStorage.companyId,
                contactArr: this.state.contactids
            }
            this
                .props
                .actions
                .getProjectData(data);
        }
    }

    onInputChangeOpp(value) {
        if (this.state.contactids.length > 0) {
            var data = {
                title: value,
                companyId: localStorage.companyId,
                contactId: this.state.contactids
            }
            this
                .props
                .actions
                .getOpportunityData(data);
        }
    }

    onInputChangeAssign(value) {
        var data = {
            firstname: value,
            companyId: localStorage.companyId
        }
        this
            .props
            .oppActions
            .getIndividualData(data);
    }

    saveTask() {

        if (jQuery('#createTask').valid()) {
            $('div#create_task').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            var reminderDate = this
                .state
                .reminderDate
                .split(' ');
            var details = {
                companyId: localStorage.companyId,
                contactId: this.state.contactids,
                projectId: this.state.projectids,
                opportunityId: this.state.oppids,
                subject: ReactDOM.findDOMNode(this.refs.task_subject).value.trim(),
                categoryId: ReactDOM.findDOMNode(this.refs.category).value,
                startdate: this.state.startDate,
                duedate: this.state.endDate,
                assignedTo: this.state.assignValue.value,
                assignedBy: localStorage.userName,
                priority: ReactDOM.findDOMNode(this.refs.priority).value,
                description: ReactDOM.findDOMNode(this.refs.description).value,
                reminderDate: reminderDate[0],
                reminderTime: reminderDate[1] + ' ' + reminderDate[2],
                createdBy: localStorage.userName
            }
            this
                .props
                .actActions
                .createTask(details);
        }
    }

    componentWillReceiveProps(nextProps) {
        var individual = [];
        var project = [];
        var opportunity = [];
        var assignTo = [];

        var individualList = nextProps
            .individualList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.firstname + ' ' + list.lastname
                }
                individual.push(obj)
            }.bind(this));

        var projectList = nextProps
            .projectList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.title
                }
                project.push(obj)
            }.bind(this));

        var opportunityList = nextProps
            .oppList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.title
                }
                opportunity.push(obj)
            }.bind(this));

        var assignList = nextProps
            .individualList
            .map(function (list, index) {
                var obj = {
                    value: list._id,
                    label: list.firstname + ' ' + list.lastname
                }
                assignTo.push(obj)
            }.bind(this));

        if (nextProps.categoryList.length > 0) {
            this.setState({ categoryList: nextProps.categoryList })
        } else {
            this.setState({ categoryList: this.state.categoryList })
        }
        this.setState({ assignOptions: assignTo, contactOptions: individual, opportunityOptions: opportunity, projectOptions: project })

        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }
    render() {

        var categoryList = this
            .state
            .categoryList
            .map(function (list, index) {
                if (list.activityType == "1") {
                    return <option key={index} value={list._id}>{list.categoryName}</option>
                }
            })

        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>New Task</span>
                    </div>
                    <hr></hr>
                    <div className="form-actions noborder text-right">
                        <Link to="/activity" style={{
                            "marginBottom": "5px"
                        }} className="btn red">
                            Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" style={{
                            "marginBottom": "5px"
                        }} className="btn blue" onClick={this.saveTask}>Save</button>
                    </div>
                </div>
                <div className="portlet light bordered" id="create_task">
                    <div className="portlet-body">
                        <form role="form" id="createTask">
                            <div className="form-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="taskSubject"
                                                ref="task_subject"
                                                defaultValue="" />
                                            <label htmlFor="form_control_1">Subject<span className="required">*</span>
                                            </label>
                                        </div>
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="form_control_1">Description<span className="required">*</span>
                                            </label>
                                            <textarea className="form-control" name="description"
                                                ref="description" placeholder="Description" rows="23"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="category" name="category">
                                                        <option value="0">Select</option>
                                                        {categoryList}
                                                        {/*<option value="other">Add Other</option>*/}
                                                    </select>
                                                    <label htmlFor="form_control_1">Category<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="priority" name="priority">
                                                        <option value="1">High</option>
                                                        <option value="2">Normal</option>
                                                        <option value="3">Low</option>
                                                    </select>
                                                    <label htmlFor="form_control_1">Priority</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="Contact">Assigned To<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.assignValue}
                                                        placeholder="Select Assigned To"
                                                        options={this.state.assignOptions}
                                                        onChange={this.handleAssignChange}
                                                        onInputChange={this.onInputChangeAssign} />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" id="" disabled={true} defaultValue={localStorage.userName} />
                                                    <label htmlFor="form_control_1">Assigned By</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group  form-md-floating-label">
                                                    <label htmlFor="startDateTime">Start Date</label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        minDate={moment()}
                                                        onApply={this.handleStartDate}
                                                        singleDatePicker>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                name="startDateTime"
                                                                className="form-control"
                                                                defaultValue={this.state.startDate}
                                                                key={this.state.startDate} />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group  form-md-floating-label">
                                                    <label htmlFor="endDateTime">Due Date<span className="required">*</span></label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        minDate={moment()}
                                                        onApply={this.handleEndDate}
                                                        singleDatePicker>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                id="endDateTime"
                                                                name="endDateTime"
                                                                className="form-control"
                                                                defaultValue={this.state.endDate}
                                                                key={this.state.endDate} />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group  form-md-floating-label">
                                                    <label htmlFor="reminderDateTime">Reminder Date<span className="required">*</span></label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        minDate={moment()}
                                                        timePicker={true}
                                                        onApply={this.handleReminderDate}
                                                        singleDatePicker>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                id="reminderDateTime"
                                                                name="reminderDateTime"
                                                                className="form-control"
                                                                defaultValue={this.state.reminderDate}
                                                                key={this.state.reminderDate} />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="Contact">Contact<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        multi
                                                        disabled={this.state.disabled}
                                                        value={this.state.contactValue}
                                                        placeholder="Select Contact"
                                                        options={this.state.contactOptions}
                                                        onChange={this.handleContactChange}
                                                        onInputChange={this.onInputChangeContact} />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="Project">Project<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        multi
                                                        disabled={this.state.disabled}
                                                        value={this.state.projectValue}
                                                        placeholder="Select Project"
                                                        options={this.state.projectOptions}
                                                        onChange={this.handleProjectChange}
                                                        onInputChange={this.onInputChangeProject} />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="Opportunity">Opportunity<span className="required">*</span>
                                                    </label>
                                                    <Select
                                                        multi
                                                        disabled={this.state.disabled}
                                                        value={this.state.opportunityValue}
                                                        placeholder="Select Opportunity"
                                                        options={this.state.opportunityOptions}
                                                        onChange={this.handleOppChange}
                                                        onInputChange={this.onInputChangeOpp} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { categoryList: state.activityCreation.categoryList, projectList: state.documentCreation.projectList, individualList: state.opportunity.individualList, oppList: state.documentCreation.oppList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(documentAction, dispatch),
        oppActions: bindActionCreators(opportunityAction, dispatch),
        actActions: bindActionCreators(activityAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewTask);