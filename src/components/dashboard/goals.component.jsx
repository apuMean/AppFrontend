import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as dashboardActions from '../../actions/dashboardActions';
import '../../styles/goals.css';
import autoBind from 'react-autobind';

const NAMES = [
    {
        value: '1',
        label: 'John Miller'
    }, {
        value: '2',
        label: 'Nathan Bracken'
    }, {
        value: '3',
        label: 'Martin Guptil'
    }
];

class Goals extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
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
            crazy: false,
            startDate: '',
            endDate: '',
            showDropdowns: true,
            disabled: false,
            nameValue: '',
            per_page: 0,
            page: 0,
            nameOptions: NAMES
        };
    }

    handleChange(value) {
        var data = {
            "companyId": localStorage.companyId,
            "per_page": this.state.per_page,
            "page": this.state.page,
            "name": value
        }
        this
            .props
            .actions
            .getDashGoalList(data)
        this.setState({ nameValue: value });
    }

    handleEvent(event, picker) {
        var start = picker
            .startDate
            .format('DD-MM-YYYY');
        var end = picker
            .endDate
            .format('DD-MM-YYYY');
        var data = {
            "companyId": localStorage.companyId,
            "per_page": this.state.per_page,
            "page": this.state.page,
            "startDate": start,
            "endDate": end
        }
        this
            .props
            .actions
            .getDashGoalList(data)
        this.setState({ startDate: start, endDate: end });
    }

    componentWillMount() {

        var data = {
            "companyId": localStorage.companyId,
            "per_page": this.state.per_page,
            "page": this.state.page,
        }
        this
            .props
            .actions
            .getDashGoalList(data)
    }

    componentDidMount() {
        var data = {
            parent: 'Dashboard',
            childone: 'Goals',
            childtwo: ''
        };
        this.props.breadCrumb(data);
    }

    render() {
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "17px"
                            }}>Goals</span>
                    </div>
                </div>
                <hr></hr>
                <div className="profile">
                    <div className="tabbable-line tabbable-full-width">
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a href="#tab_1_1" data-toggle="tab">
                                    Individual
                                </a>
                            </li>
                            <li>
                                <a href="#tab_1_6" data-toggle="tab">
                                    Company
                                </a>
                            </li>
                            <li>
                                <a href="#tab_1_3" data-toggle="tab">
                                    Goals Setup
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className="tab-pane active" id="tab_1_1">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-floating-label">
                                            <label htmlFor="status">Date Range</label>
                                            <DateRangePicker
                                                showDropdowns={this.state.showDropdowns}
                                                onHide={this.handleEvent}>
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
                                        <Select
                                            disabled={this.state.disabled}
                                            value={this.state.nameValue}
                                            placeholder="Select Sales Rep"
                                            options={this.state.nameOptions}
                                            onChange={this.handleChange}
                                            style={{
                                                "marginTop": "25px"
                                            }} />
                                    </div>
                                </div>
                                <div
                                    className="portlet light bordered"
                                    style={{
                                        "height": "300px"
                                    }}></div>
                            </div>

                            <div className="tab-pane" id="tab_1_6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group form-md-floating-label">
                                            <label htmlFor="status">Date Range</label>
                                            <DateRangePicker
                                                showDropdowns={this.state.showDropdowns}
                                                onHide={this.handleEvent}>
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
                                </div>
                                <div
                                    className="portlet light bordered"
                                    style={{
                                        "height": "300px"
                                    }}></div>
                            </div>

                            <div className="tab-pane" id="tab_1_3">
                                <div className="row profile-account">
                                    <div className="col-md-3">
                                        <ul className="ver-inline-menu tabbable margin-bottom-10">
                                            <li className="active">
                                                <a data-toggle="tab" href="#tab_1-1">
                                                    <i className="fa fa-cog"></i>
                                                    Individual
                                                </a>
                                                <span className="after"></span>
                                            </li>
                                            <li>
                                                <a data-toggle="tab" href="#tab_2-2">
                                                    <i className="fa fa-cogs"></i>
                                                    Company
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="tab-content">
                                            <div id="tab_1-1" className="tab-pane active">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <a
                                                            href="#individual_goal"
                                                            className="btn btn-sm btn-circle green"
                                                            data-toggle="modal">
                                                            <i className="icon-plus"></i>
                                                            Individual Goal
                                                        </a>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <Select
                                                            disabled={this.state.disabled}
                                                            value={this.state.nameValue}
                                                            placeholder="Select Sales Rep"
                                                            options={this.state.nameOptions}
                                                            onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div
                                                        className="portlet light portlet-fit portlet-datatable bordered"
                                                        style={{
                                                            "marginTop": "10px"
                                                        }}>
                                                        <div className="portlet-body">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Year</th>
                                                                            <th>Month</th>
                                                                            <th>Goal</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="tab_2-2" className="tab-pane">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <a
                                                            href="#company_goal"
                                                            className="btn btn-sm btn-circle green"
                                                            data-toggle="modal">
                                                            <i className="icon-plus"></i>
                                                            Company Goal
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div
                                                        className="portlet light portlet-fit portlet-datatable bordered"
                                                        style={{
                                                            "marginTop": "10px"
                                                        }}>
                                                        <div className="portlet-body">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Year</th>
                                                                            <th>Month</th>
                                                                            <th>Goal</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody></tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div
                    id="individual_goal"
                    className="modal fade bs-modal-sm"
                    tabIndex="-1"
                    aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Individual Goal</h4>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input ref="year" type="text" className="form-control" id="year" name="year" />
                                                    <label htmlFor="year">Year</label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input
                                                        ref="month"
                                                        type="text"
                                                        className="form-control"
                                                        id="month"
                                                        name="month" />
                                                    <label htmlFor="month">Month</label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input ref="goal" type="text" className="form-control" id="goal" name="goal" />
                                                    <label htmlFor="goal">Goal</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn green"
                                    id="send-invite-button">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="company_goal"
                    className="modal fade bs-modal-sm"
                    tabIndex="-1"
                    aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Company Goal</h4>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input ref="year" type="text" className="form-control" id="year" name="year" />
                                                    <label htmlFor="year">Year</label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input
                                                        ref="month"
                                                        type="text"
                                                        className="form-control"
                                                        id="month"
                                                        name="month" />
                                                    <label htmlFor="month">Month</label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div
                                                    className="form-group form-md-line-input form-md-floating-label has-success">
                                                    <input ref="goal" type="text" className="form-control" id="goal" name="goal" />
                                                    <label htmlFor="goal">Goal</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn green"
                                    id="send-invite-button">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return { getGoalList: state.goalsList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Goals);