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

class NewEvent extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            contactValue: '',
            projectValue: '',
            opportunitieValue: '',
            calendarValue: '',
            contactOptions: [],
            projectOptions: [],
            opportunityOptions: [],
            calendarOptions: [],
            contactids: [],
            oppids: [],
            projectids: [],
            categoryList: [],
            startDate: moment().format('MM/DD/YYYY hh:mm:ss a'),
            endDate: ''
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
            activityType: "2"
        }

        this
            .props
            .actActions
            .getActCategory(data);
    }
    handleStartDate(event, picker) {

        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY hh:mm:ss a');
        this.setState({ startDate: displayDate });
        layout
            .FloatLabel
            .init();

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

    handleEndDate(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY hh:mm:ss a');
        this.setState({ endDate: displayDate });
        layout
            .FloatLabel
            .init();

        var validator = jQuery("#createEvent").validate();
        validator.element("#endDateTime");
        jQuery('span[id^="endDateTime-error"]').remove();
    }

    saveEvent() {
        if (jQuery('#createEvent').valid()) {
            $('div#create_event').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            var startDate = this
                .state
                .startDate
                .split(' ');
            var endDate = this
                .state
                .endDate
                .split(' ');
            var details = {
                companyId: localStorage.companyId,
                contactId: this.state.contactids,
                projectId: this.state.projectids,
                opportunityId: this.state.oppids,
                categoryId: ReactDOM.findDOMNode(this.refs.category).value,
                eventNotes: ReactDOM.findDOMNode(this.refs.notes).value,
                isAllDay: ReactDOM.findDOMNode(this.refs.isAllDay).checked,
                isComplete: ReactDOM.findDOMNode(this.refs.isComplete).checked,
                isRepeat: false,
                isCalendarEvent: ReactDOM.findDOMNode(this.refs.isCalEvent).checked,
                startdate: startDate[0],
                endDate: endDate[0],
                startTime: startDate[1] + ' ' + startDate[2],
                endTime: endDate[1] + ' ' + endDate[2],
                eventName: ReactDOM.findDOMNode(this.refs.eventName).value.trim(),
                subject: ReactDOM.findDOMNode(this.refs.eventName).value.trim(),
                createdBy: localStorage.userName
            }
            this
                .props
                .actActions
                .createEvent(details);
        }
    }

    componentWillReceiveProps(nextProps) {
        var individual = [];
        var project = [];
        var opportunity = [];

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
        if (nextProps.categoryList.length > 0) {
            this.setState({ categoryList: nextProps.categoryList })
        } else {
            this.setState({ categoryList: this.state.categoryList })
        }
        this.setState({ contactOptions: individual, opportunityOptions: opportunity, projectOptions: project })

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
                if (list.activityType == "2") {
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
                            }}>New Event</span>
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
                        }} className="btn blue" onClick={this.saveEvent}>Save</button>
                    </div>
                </div>
                <div className="portlet light bordered" id="create_event">
                    <div className="portlet-body">
                        <form role="form" id="createEvent">
                            <div className="form-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input type="text" className="form-control" name="eventName" ref="eventName" defaultValue="" />
                                            <label htmlFor="form_control_1">Event Name<span className="required">*</span></label>
                                        </div>
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <select className="form-control edited" ref="category" name="category">
                                                <option value="0">Select</option>
                                                {categoryList}
                                                {/*<option value="other">Add Other</option>*/}
                                            </select>
                                            <label htmlFor="form_control_1">Category<span className="required">*</span>
                                            </label>
                                        </div>
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="form_control_1">Notes<span className="required">*</span>
                                            </label>
                                            <textarea className="form-control" placeholder="Notes" name="notes" ref="notes" rows="1"></textarea>
                                        </div>
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="startDateTime">Start</label>
                                            <DateRangePicker
                                                showDropdowns={true}
                                                minDate={moment()}
                                                timePicker={true}
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
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="endDateTime">End<span className="required">*</span></label>
                                            <DateRangePicker
                                                showDropdowns={true}
                                                minDate={moment()}
                                                timePicker={true}
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
                                    <div className="col-md-6">
                                        <div className="row">
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
                                                        onInputChange={this.onInputChangeOpp}
                                                        style={{ marginBottom: '20px' }} />
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
                                                    <input type="checkbox" name="remember" ref="isRepeat" value="" />
                                                    Repeat
                                            <span></span>
                                                </label>
                                            </div>*/}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="rememberme mt-checkbox mt-checkbox-outline">
                                            <input type="checkbox" name="remember" ref="isAllDay" value="" />
                                            All Day Event
                                            <span></span>
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="rememberme mt-checkbox mt-checkbox-outline">
                                            <input type="checkbox" name="remember" ref="isComplete" value="" />
                                            Is Complete
                                            <span></span>
                                        </label>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="rememberme mt-checkbox mt-checkbox-outline">
                                            <input type="checkbox" name="remember" ref="isCalEvent" value="1" />
                                            Calendar Event
                                            <span></span>
                                        </label>
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
export default connect(mapStateToProps, mapDispatchToProps)(NewEvent);