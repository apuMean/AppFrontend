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

class NewCall extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            disabled: false,
            contactValue: [],
            projectValue: [],
            opportunitieValue: [],
            contactOptions: [],
            projectOptions: [],
            opportunityOptions: [],
            contactids: [],
            oppids: [],
            projectids: [],
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

    handleEndDate(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY hh:mm:ss a');
        this.setState({ endDate: displayDate });
        layout
            .FloatLabel
            .init();

        var validator = jQuery("#createCall").validate();
        validator.element("#endDateTime");
        jQuery('span[id^="endDateTime-error"]').remove();
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

    saveCall() {

        if (jQuery('#createCall').valid()) {
            var hr = this.refs.duration.value;
            if (hr <= 0 || hr == '') {
                toastr.error('Please select valid date');
                return false
            }

            $('div#create_call').block({
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
            var endDate = this.state.endDate.split(' ');
            var details = {
                companyId: localStorage.companyId,
                contactId: this.state.contactids,
                projectId: this.state.projectids,
                opportunityId: this.state.oppids,
                subject: ReactDOM
                    .findDOMNode(this.refs.call_subject)
                    .value,
                from: localStorage.userName,
                date: startDate[0],
                startTime: startDate[1] + ' ' + startDate[2],
                endTime: endDate[1] + ' ' + endDate[2],
                description: ReactDOM
                    .findDOMNode(this.refs.description)
                    .value,
                duration: parseInt(ReactDOM
                    .findDOMNode(this.refs.duration)
                    .value),
                result: ReactDOM
                    .findDOMNode(this.refs.result)
                    .value,
                createdBy: localStorage.userName
            }
            this
                .props
                .actActions
                .createCall(details);
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

        this.setState({ contactOptions: individual, opportunityOptions: opportunity, projectOptions: project })

        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    render() {
        var totalHr = '';
        if (this.state.startDate && this.state.endDate) {
            var m1 = moment(this.state.startDate, "MM/DD/YYYY hh:mm A");
            var m2 = moment(this.state.endDate, "MM/DD/YYYY hh:mm A");
            var totalHr = m2.diff(m1, "minutes");
            totalHr = totalHr / 60;
        }
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>New Call</span>
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
                        }} className="btn blue" onClick={this.saveCall}>Save</button>
                    </div>
                </div>
                <div className="portlet light bordered" id="create_call">
                    <div className="portlet-body">
                        <form role="form" id="createCall">
                            <div className="form-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input type="text" className="form-control" id="" disabled={true} defaultValue={localStorage.userName} />
                                            <label htmlFor="form_control_1">From</label>
                                        </div>
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <input type="text" className="form-control" ref="call_subject" name="subject" defaultValue="" />
                                            <label htmlFor="form_control_1">Subject<span className="required">*</span></label>
                                        </div>
                                        <div className="form-group  form-md-floating-label">
                                            <label htmlFor="form_control_1">Description<span className="required">*</span>
                                            </label>
                                            <textarea className="form-control" ref="description" name="description" placeholder="Description" rows="14"></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-12">
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
                                                                name="startDateTime"
                                                                className="form-control"
                                                                readOnly={true}
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
                                            <div className="col-md-12">
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
                                                                name="endDateTime"
                                                                id="endDateTime"
                                                                className="form-control"
                                                                readOnly={true}
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
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" disabled={true} ref="duration" defaultValue={totalHr >= 0
                                                        ? totalHr
                                                        : ''}
                                                        key={totalHr} />
                                                    <label htmlFor="form_control_1">Duration(Hour)<span className="required">*</span></label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input type="text" className="form-control" name="result" ref="result" defaultValue="" />
                                                    <label htmlFor="form_control_1">Result<span className="required">*</span></label>
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
                                                        onInputChange={this.onInputChangeContact}
                                                    />
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
                                                        onInputChange={this.onInputChangeProject}
                                                    />
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
                                                    />
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

    return { projectList: state.documentCreation.projectList, individualList: state.opportunity.individualList, oppList: state.documentCreation.oppList };
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
export default connect(mapStateToProps, mapDispatchToProps)(NewCall);