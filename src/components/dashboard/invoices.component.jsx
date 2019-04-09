import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import autoBind from 'react-autobind';

const STAGE = [
    {
        value: '1',
        label: 'Open'
    }, {
        value: '2',
        label: 'Closed'
    }
];
let min = '';
let max = '';

class Orders extends React.Component {
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
            disabled: false,
            crazy: false,
            stageValue: [],
            stageOptions: STAGE,
            salesreps: [],
            stages: [],
            salesRepList: [],
            filteredSalesrep: [],
            salesFlag: true,
            startDate: '',
            endDate: '',
            per_page: 0,
            page: 0,
            showDropdowns: true,
            invoiceList: [],
            minVal: '',
            maxVal: ''
        };
    }

    componentWillMount() {
        var data = {
            "companyId": localStorage.companyId
        }
        this
            .props
            .actions
            .getDashInvoiceList(data)
        this.props.actions.getAllSalesRep(data);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.salesRepList.length != 0 && this.state.salesFlag) {
            this.setState({ salesRepList: nextProps.salesRepList });
        }

        this.setState({
            invoiceList: nextProps.getInvoiceList
        })
        $('div#dashboard_invoices_container').block({
            message: loader.GET_LOADER_IMAGE,
            css: { width: '25%' },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });
        var groupname_list = $('#dash_invoice').DataTable();
        groupname_list.destroy();
        setTimeout(function () {
            datatable.DashboardInvoicesTable.init();
            $('div#dashboard_invoices_container').unblock();
        }, 3000);
    }

    componentDidMount() {
        var data = {
            parent: 'Dashboard',
            childone: 'Invoices',
            childtwo: ''
        };
        this.props.breadCrumb(data);
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
        this
            .props
            .actions
            .getDashInvoiceFilteredList(data)
        this.setState({ startDate: start, endDate: end });
    }

    handleStageChange(value) {
        var data = {
            "companyId": localStorage.companyId,
            "stage": value,
            "minVal": ReactDOM
                .findDOMNode(this.refs.minVal)
                .value,
            "maxVal": ReactDOM
                .findDOMNode(this.refs.maxVal)
                .value
        }
        this
            .props
            .actions
            .getDashInvoiceList(data)
        this.setState({ stageValue: value });
    }

    handleSalesRepModal(e) {
        e.preventDefault();
        $('#link-salesrep').modal('show');
    }

    handleSalesRepCheck(index, salesId) {
        var currentState = this.state.salesreps;
        var currentSalesRepState = this.state.salesRepList;
        var res = this.state.salesRepList[index];
        var currentFilteredList = this.state.filteredSalesrep;
        var existIndex = currentState.indexOf(salesId);
        if (existIndex > -1) {
            currentState.splice(existIndex, 1);
            currentFilteredList.splice(existIndex, 1);
            this.setState({
                salesreps: currentState,
                filteredSalesrep: currentFilteredList
            });
        }
        else {
            currentState.push(salesId);
            currentFilteredList.push(res);
            this.setState({
                salesreps: currentState,
                filteredSalesrep: currentFilteredList
            });
        }
    }

    handleSalesRepSubmit(e) {
        e.preventDefault();
        if (this.state.salesreps.length != 0) {
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "salesRep",
                "salesRep": this.state.salesreps
            }
            this
                .props
                .actions
                .getDashInvoiceFilteredList(data)
            setTimeout(function () {
                $('#link-salesrep').modal('hide');
            }, 500);
        }
        else {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashInvoiceList(data);
            setTimeout(function () {
                $('#link-salesrep').modal('hide');
            }, 500);
        }
    }

    handleValueChange(valueType, e) {
        if (valueType === 'min') {
            min = e.target.value;
            this.setState({ minVal: e.target.value });
        }
        else if (valueType === 'max') {
            max = e.target.value;
            this.setState({ maxVal: e.target.value });
        }
        if (min && max) {
            var data = {
                "filterType": "value",
                "companyId": localStorage.companyId,
                "min": min,
                "max": max
            }
            this.props.actions.getDashInvoiceFilteredList(data)
        }
        if (min === '' && max === '') {
            var data = {
                "companyId": localStorage.companyId
            }
            this.props.actions.getDashInvoiceList(data);
        }
    }

    render() {
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        var dashboardInvoicesList = this.state.invoiceList;
        if (dashboardInvoicesList) {
            var invoiceList = dashboardInvoicesList.map(function (invoice, index) {

                return <tr key={index}>
                    <td>{invoice.invoiceNumber ? invoice.invoiceNumber : '-'}</td>
                    <td>{invoice.contactId ? invoice.contactId.companyName : '-'}</td>
                    <td>{invoice.createdAt ? moment(invoice.createdAt, moment.ISO_8601).format('MM-DD-YYYY') : '-'}</td>
                    <td>{invoice.salesRep ? invoice.salesRep.firstname + ' ' + invoice.salesRep.lastname : '-'}</td>
                    <td>{invoice.class ? invoice.class : '-'}</td>
                    <td>{invoice.total ? invoice.total : '-'}</td>
                </tr>;
            }.bind(this));
        }
        var salesRepData = this.state.salesRepList
            .map(function (salesrep, index) {
                return <tr key={index}>
                    <td>{salesrep.firstname} {salesrep.lastname}</td>
                    <td>
                        <div className="md-checkbox-inline">
                            <div className="md-checkbox">
                                <input type="checkbox" id={salesrep._id} className="md-check" onChange={this.handleSalesRepCheck.bind(this, index, salesrep._id)} />
                                <label htmlFor={salesrep._id}>
                                    <span></span>
                                    <span className="check"></span>
                                    <span className="box"></span>
                                </label>
                            </div>
                        </div>
                    </td>
                </tr>
            }.bind(this));

        var activeSalesRep = this.state.filteredSalesrep
            .map(function (salesrep, index) {
                return <option key={index}>{salesrep.firstname + ' ' + salesrep.lastname}</option>
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
                            }}>Invoices</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_invoices_container">
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
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Value min</label>
                                <input
                                    type="number"
                                    className="form-control input-small"
                                    ref="minVal"
                                    name="minVal"
                                    value={this.state.minVal}
                                    placeholder="$0.00"
                                    onChange={this.handleValueChange.bind(this, 'min')} />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Value max</label>
                                <input
                                    type="number"
                                    className="form-control input-small"
                                    ref="maxVal"
                                    name="maxVal"
                                    value={this.state.maxVal}
                                    placeholder="$100,000.00"
                                    onChange={this.handleValueChange.bind(this, 'max')} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <a
                                        href="#link-salesrep"
                                        className="btn btn-sm btn-circle green"
                                        data-toggle="modal">
                                        <i className="icon-user-follow"></i>
                                        Sales Reps
                                    </a>
                                </div>
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <select className="form-control" size="3">
                                            {activeSalesRep}
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
                                    <table className="table table-striped table-bordered table-hover" id="dash_invoice">
                                        <thead>
                                            <tr>
                                                <th>Invoice #</th>
                                                <th>Company</th>
                                                <th>Date</th>
                                                <th>Sales Rep</th>
                                                <th>Class</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoiceList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="link-salesrep" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Select SalesRep</h4>
                            </div>
                            <div className="modal-body">
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="icon-users "></i>
                                            <span className="caption-subject bold uppercase">Sales Reps</span>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="table-container table-responsive">
                                            <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                <thead>
                                                    <tr>
                                                        <th>SalesRep Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {salesRepData}
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
                                    id="send-invite-button" onClick={this.handleSalesRepSubmit}>Done</button>
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
        getInvoiceList: state.dashboards.invoicesList,
        salesRepList: state.dashboards.salesRepList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Orders);