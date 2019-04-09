import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import * as appValid from '../../scripts/app';
import * as estimateActions from '../../actions/expenseActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import * as layout from '../../scripts/app';
import "../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class CreateExpense extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            enteredOn: '',
            disabled: false,
            projectValue: '',
            projectOptions: [],
        }
    }

    componentWillMount() {
        var data1 = {
            parent: 'Expenses',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        appValid
            .FormValidationMd
            .init();
    }

    componentWillReceiveProps(nextProps) {
        var project = [];
        if (nextProps.projectList.length != 0) {
            var projectList = nextProps
                .projectList
                .map(function (list, index) {
                    var obj = {
                        id: list._id,
                        label: list.title
                    }
                    project.push(obj)
                }.bind(this));
        }
        this.setState({
            projectOptions: project
        })
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }

    handleProjectChange(value) {
        this.setState({ projectValue: value })
    }

    onProjectInputChange(value) {
        var companyId = localStorage.companyId;
        if (companyId) {
            var data = {
                title: value,
                companyId: localStorage.companyId
            }
            this
                .props
                .actions
                .getProjectData(data)
        }
    }

    handleEnteredOn(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM/DD/YYYY h:mm:ss a');
        this.setState({ enteredOn: displayDate });
        layout
            .FloatLabel
            .init();
    }

    expenseHandler() {
        if (jQuery('#createExpense').valid()) {
            $('div#create_expense').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });

            var expenseDetails = {
                companyId: localStorage.companyId,
                enteredOn: ReactDOM
                    .findDOMNode(this.refs.enteredOn)
                    .value,
                createdBy: ReactDOM
                    .findDOMNode(this.refs.createdBy)
                    .value,
                projectId: this.state.projectValue.id,
                type: ReactDOM
                    .findDOMNode(this.refs.type)
                    .value,
                description: ReactDOM
                    .findDOMNode(this.refs.description)
                    .value,
                purchasedAt: ReactDOM
                    .findDOMNode(this.refs.purchasedAt)
                    .value,
                ccLast: ReactDOM
                    .findDOMNode(this.refs.cclast)
                    .value,
                notes: ReactDOM
                    .findDOMNode(this.refs.notes)
                    .value,
                amount: parseInt(ReactDOM
                    .findDOMNode(this.refs.amount)
                    .value),
            }
            var picData = ReactDOM
                .findDOMNode(this.refs.expenseFileUpload)
                .files[0];
            this
                .props
                .actions
                .createExpense(expenseDetails, picData);
        }
    }

    render() {
        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#item-add" data-toggle="tab">
                                Expense
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to="/expense" className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.expenseHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_expense">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="item-add">
                                <form role="form" id="createExpense">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref="createdBy"
                                                            name="createdBy"
                                                            defaultValue={localStorage.userName ? localStorage.userName : '-'}
                                                            readOnly={true} />
                                                        <label htmlFor="createdBy">Created By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <label htmlFor="project">Project</label>
                                                        <Select
                                                            disabled={this.state.disabled}
                                                            value={this.state.projectValue}
                                                            placeholder="project"
                                                            name="project"
                                                            id="project"
                                                            options={this.state.projectOptions}
                                                            onChange={this.handleProjectChange}
                                                            onInputChange={this.onProjectInputChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div
                                                        className="form-group form-md-line-input form-md-floating-label"
                                                        id="item_category">
                                                        <select
                                                            className="form-control edited"
                                                            ref="type"
                                                            name="type"
                                                            id="form_control_1">
                                                            <option value="1">Other</option>
                                                            <option value="2">Fuel</option>
                                                            <option value="3">Material</option>
                                                        </select>
                                                        <label htmlFor="type">Type</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref="amount"
                                                            name="amount"
                                                            defaultValue="" />
                                                        <label htmlFor="amount">Amount($)</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                        <div
                                                            className="fileinput-preview thumbnail"
                                                            data-trigger="fileinput"
                                                            style={{
                                                                width: 200,
                                                                height: 150
                                                            }}>
                                                            <img
                                                                src={require('../../img/profile/avatar-default.png')}
                                                                className="img-responsive"
                                                                alt="Logo" />
                                                        </div>
                                                        <div>
                                                            <span className="btn red btn-outline btn-file">
                                                                <span className="fileinput-new">
                                                                    Select
                                                                </span>
                                                                <span className="fileinput-exists">
                                                                    Change
                                                                </span>
                                                                <input type="hidden" />
                                                                <input
                                                                    type="file"
                                                                    name="expenseFileUpload"
                                                                    ref="expenseFileUpload"
                                                                    id="expenseFileUpload" />
                                                            </span>
                                                            <a
                                                                href="javascript:;"
                                                                className="btn red fileinput-exists"
                                                                data-dismiss="fileinput">
                                                                Remove
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={1} ref="description" name="description"></TextareaAutosize>
                                                    <label htmlFor="description">Description</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="purchasedAt"
                                                        name="purchasedAt"
                                                        defaultValue="" />
                                                    <label htmlFor="purchasedAt">Purchased At</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="cclast"
                                                        name="cclast"
                                                        defaultValue="" />
                                                    <label htmlFor="cclast">CC Last 4</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={1} ref="notes" name="notes"></TextareaAutosize>
                                                    <label htmlFor="notes">Notes</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group  form-md-floating-label">
                                                    <label htmlFor="startDateTime">Entered On<span className="required">*</span>
                                                    </label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        minDate={moment()}
                                                        timePicker={true}
                                                        onApply={this.handleEnteredOn}
                                                        singleDatePicker>
                                                        <div className="input-group date form_datetime">
                                                            <input
                                                                type="text"
                                                                className="selected-date-range-btn"
                                                                size="16"
                                                                readOnly={true}
                                                                name="enteredOn"
                                                                id="enteredOn"
                                                                ref="enteredOn"
                                                                className="form-control"
                                                                defaultValue={this.state.enteredOn}
                                                                key={this.state.enteredOn} />
                                                            <span className="input-group-btn">
                                                                <button className="btn default date-set calendar-shadow-none" type="button">
                                                                    <i className="fa fa-calendar"></i>
                                                                </button>
                                                            </span>
                                                        </div>
                                                    </DateRangePicker>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { projectList: state.expense.projectList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(estimateActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateExpense);