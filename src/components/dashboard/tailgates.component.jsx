import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import moment from 'moment';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as tailgateActions from '../../actions/tailgateAction.js';
import '../../styles/daterangepicker.css';
import autoBind from 'react-autobind';

class Tailgates extends React.Component {
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
            startDate: '',
            endDate: '',
            per_page: 0,
            page: 0,
            tailgateList: [],
            dateEffective: '',
            dateExpire: '',
            topic: '',
            content: '',
            showDropdowns: true
        };
    }

    componentWillMount() {
        var data = {
            "companyId": localStorage.companyId,
            "per_page": this.state.per_page,
            "page": this.state.page
        }
        this
            .props
            .tailgateAction
            .getDashTailgateList(data)
    }

    componentDidMount() {
        var data = {
            parent: 'Dashboard',
            childone: 'Tailgates',
            childtwo: ''
        };
        this.props.breadCrumb(data);

        $('div#dashboard_tailgates_container').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .DashboardTailgatesTable
                .init();
            $('div#dashboard_tailgates_container').unblock();
        }, 3000);
    }

    onAddTailgatesHandler(event) {

        event.preventDefault();
        var tailgatesRecord = {
            companyId: localStorage.companyId,
            dateEffective: this
                .refs
                .dateEffective
                .value
                .trim(),
            dateExpire: this
                .refs
                .dateExpire
                .value
                .trim(),
            topic: this
                .refs
                .topic
                .value
                .trim(),
            content: this
                .refs
                .content
                .value
                .trim()
        }

        if (this.refs.dateEffective.value.trim() && this.refs.dateExpire.value.trim() && this.refs.topic.value.trim() && this.refs.content.value.trim()) {
            if (this.refs.dateExpire.value.trim() < this.refs.dateEffective.value.trim()) {
                toastr.error('Expiry Date should be greater than Effective Date.');
                return false;
            }
            $('#add-tailgate').modal('hide');
            $('div#dashboard_tailgates_container').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this
                .props
                .tailgateAction
                .addNewTailgates(tailgatesRecord, JSON.parse(JSON.stringify(this.state.tailgateList)));

        }

    }
    handleDateEffective(event, picker) {
        var DateEffective = picker
            .startDate
            .format('MM-DD-YYYY');
        this.setState({ DateEffective: DateEffective });
    }

    handleDateExpire(event, picker) {
        var dateExpire = picker
            .startDate
            .format('MM-DD-YYYY');
        this.setState({ dateExpire: dateExpire });
    }

    addTopic() {
        ReactDOM
            .findDOMNode(this.refs.dateEffective)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.dateExpire)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.topic)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.content)
            .value = "";
        $('#add-tailgate').modal('show');

    }

    handleEvent(event, picker) {
        var start = picker
            .startDate
            .format('MM-DD-YYYY');
        var end = picker
            .endDate
            .format('MM-DD-YYYY');
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
            .getDashTailgateList(data)
        this.setState({ startDate: start, endDate: end });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ tailgateList: nextProps.getTailgateList })
        $('div#dashboard_tailgates_container').unblock();
        var tailgate_list = $('#dash_tailgate').DataTable();
        tailgate_list.destroy();
        setTimeout(function () {
            datatable
                .DashboardTailgatesTable
                .init();
        }, 3000);
    }

    render() {
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        var dashboardTailgateList = this.state.tailgateList;
        if (dashboardTailgateList) {
            var tailgatesListView = dashboardTailgateList.map(function (tailgate, index) {
                return <tr key={index}>
                    <td>{tailgate.dateEffective
                        ? tailgate.dateEffective
                        : '--'}</td>
                    <td>{tailgate.dateExpire
                        ? tailgate.dateExpire
                        : '--'}</td>
                    <td>{tailgate.topic
                        ? tailgate.topic
                        : '--'}</td>
                </tr>;
            }.bind(this));
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
                            }}>Tailgates</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_tailgates_container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-floating-label">
                                <label htmlFor="status">Date Range</label>
                                <DateRangePicker
                                    ranges={this.state.ranges}
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
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <a
                                        onClick={this.addTopic}
                                        className="btn btn-sm btn-circle green"
                                        data-toggle="modal">
                                        <i className="icon-plus"></i>
                                        New Topic
                                    </a>
                                </div>
                                <div className="col-md-3">
                                    <button className="btn btn-sm btn-circle green" data-toggle="modal">
                                        <i className="icon-book-open"></i>
                                        Attendance Report
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div
                            className="portlet light portlet-fit portlet-datatable bordered"
                            style={{
                                marginTop: 15
                            }}>
                            <div className="portlet-body">
                                <div className="table-container table-responsive">
                                    <table
                                        className="table table-striped table-bordered table-hover"
                                        id="dash_tailgate">
                                        <thead>
                                            <tr>
                                                <th>Start</th>
                                                <th>End</th>
                                                <th>Topics</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tailgatesListView}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="add-tailgate" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Safety Topics</h4>
                            </div>
                            <form role="form" id="addTailgateForm">
                                <div className="modal-body">
                                    <div className="portlet-body form">
                                        <div className="form-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label">Date Effective
                                                            <span className="required">*</span>
                                                        </label>
                                                        <DateRangePicker
                                                            showDropdowns={true}
                                                            singleDatePicker
                                                            minDate={moment()}
                                                            onHide={this.handleDateEffective}>
                                                            <div className="input-group date form_datetime">
                                                                <input
                                                                    type="text"
                                                                    className="selected-date-range-btn"
                                                                    size="16"
                                                                    disabled={true}
                                                                    className="form-control"
                                                                    defaultValue={this.state.DateEffective}
                                                                    key={this.state.DateEffective}
                                                                    name="dateEffective"
                                                                    ref="dateEffective" />
                                                                <span className="input-group-btn">
                                                                    <button className="btn default date-set" type="button" disabled={true}>
                                                                        <i className="fa fa-calendar" disabled={true}></i>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </DateRangePicker>

                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label">Date Expire
                                                            <span className="required">*</span>
                                                        </label>
                                                        <DateRangePicker
                                                            showDropdowns={true}
                                                            singleDatePicker
                                                            minDate={moment()}
                                                            onHide={this.handleDateExpire}>
                                                            <div className="input-group date form_datetime">
                                                                <input
                                                                    type="text"
                                                                    className="selected-date-range-btn"
                                                                    size="16"
                                                                    disabled={true}
                                                                    className="form-control"
                                                                    defaultValue={this.state.dateExpire}
                                                                    key={this.state.dateExpire}
                                                                    name="dateExpire"
                                                                    ref="dateExpire" />
                                                                <span className="input-group-btn">
                                                                    <button className="btn default date-set" type="button" disabled={true}>
                                                                        <i className="fa fa-calendar" disabled={true}></i>
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </DateRangePicker>

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label className="control-label">Topic
                                                    <span className="required">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="topic"
                                                    ref="topic"
                                                    name="topic"
                                                    className="form-control"
                                                    placeholder="Name"
                                                    defaultValue="" />
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label">Content
                                                    <span className="required">*</span>
                                                </label>
                                                <textarea
                                                    id="content"
                                                    ref="content"
                                                    name="content"
                                                    className="form-control"
                                                    rows="1"
                                                    defaultValue=""></textarea>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                    <button
                                        type="button"
                                        className="btn green"
                                        id="send-invite-button"
                                        onClick={this.onAddTailgatesHandler}>Done</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return { getTailgateList: state.tailgateReducer.tailgatesList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch),
        tailgateAction: bindActionCreators(tailgateActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Tailgates);
