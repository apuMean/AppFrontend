import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as functions from '../common/functions';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import autoBind from 'react-autobind';

const STAGE = [
    {
        value: '1',
        label: 'Pre-Approved'
    }, {
        value: '2',
        label: 'Approved'
    }, {
        value: '3',
        label: 'In-Progress'
    }, {
        value: '4',
        label: 'Dead'
    }, {
        value: '5',
        label: 'In-Complete'
    }, {
        value: '6',
        label: 'Complete'
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
            orderList: [],
            minVal: '',
            maxVal: ''
        };
    }

    componentWillMount() {
        var data = {
            "companyId": localStorage.companyId
        }
        var data1 = {
            parent: 'Dashboard',
            childone: 'Service Orders',
            childtwo: ''
        };
        this.props.actions.getDashOrderList(data);

        this.props.actions.getAllSalesRep(data);

        this.props.breadCrumbs(data1);
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.salesRepList.length != 0 && this.state.salesFlag) {
            this.setState({ salesRepList: nextProps.salesRepList });
        }

        this.setState({ orderList: nextProps.getOrderList });
        let dtable = findDOMNode(self.refs.dash_order);
        var groupname_list = $(dtable).DataTable();
        groupname_list.destroy();
        const el = findDOMNode(self.refs.dashboard_orders_container);
        setTimeout(function () {
            datatable.DashboardOrdersTable.init();
            $(el).unblock();
        }, 3000);
    }

    componentDidMount() {
        functions.showLoader('dashboard_orders_container');
    }

    handleEvent(event, picker) {
        this.setState({ stageValue: [] });
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
            .getDashOrderFilteredList(data)
        this.setState({ startDate: start, endDate: end });
    }

    handleStageChange(value) {
        this.setState({
            startDate: '__-__-__',
            endDate: '__-__-__'
        });
        if (value.length == 0) {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashOrderList(data);
            this.setState({
                stageValue: value,
                filteredSalesrep: []
            });
        }
        else {
            this.state.stages = [];
            this.setState({ stageValue: value });
            var stageState = value.map(function (res, index) {
                this
                    .state
                    .stages
                    .push(res.value);
            }.bind(this));
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "stage",
                "stageId": this.state.stages
            }
            this
                .props
                .actions
                .getDashOrderFilteredList(data)
        }
    }

    handleSalesRepModal(e) {
        e.preventDefault();
        let self = this;
        const el = findDOMNode(self.refs.link_salesrep);
        $(el).modal('show');
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
            this.getSalesOrders(currentState);
        }
        else {
            currentState.push(salesId);
            currentFilteredList.push(res);
            this.setState({
                salesreps: currentState,
                filteredSalesrep: currentFilteredList
            });
            this.getSalesOrders(currentState);
        }
    }

    handleSalesRepSubmit(e) {
        e.preventDefault();
        let self = this;
        const el = findDOMNode(self.refs.link_salesrep);
        if (this.state.salesreps.length != 0) {
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "salesRep",
                "salesRep": this.state.salesreps
            }
            this
                .props
                .actions
                .getDashOrderFilteredList(data)
            setTimeout(function () {
                $(el).modal('hide');
            }, 500);
        }
        else {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashOrderList(data);
            setTimeout(function () {
                $(el).modal('hide');
            }, 500);
        }
    }

    getSalesOrders(currentSales) {
        if (currentSales.length != 0) {
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "salesRep",
                "salesRep": currentSales
            }
            this.setState({
                stageValue: []
            });
            this
                .props
                .actions
                .getDashOrderFilteredList(data);
        }
        else {
            var data = {
                "companyId": localStorage.companyId
            }
            this.setState({
                stageValue: []
            });
            this
                .props
                .actions
                .getDashOrderList(data);
        }
    }

    render() {
        let stage = '';
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }

        var dashboardProjectsList = this.state.orderList;
        if (dashboardProjectsList) {
            var orderList = dashboardProjectsList.map(function (order, index) {
                if (order.stageId == 1) {
                    stage = 'Pre-Approved'
                }
                else if (order.stageId == 2) {
                    stage = 'Approved'
                }
                else if (order.stageId == 3) {
                    stage = 'In-Progress'
                }
                else if (order.stageId == 4) {
                    stage = 'Dead'
                }
                else if (order.stageId == 5) {
                    stage = 'In-Complete'
                }
                else if (order.stageId == 6) {
                    stage = 'Complete'
                }

                return <tr key={index}>
                    <td>{order.orderNumber ? order.orderNumber : '-'}</td>
                    <td>{order.customerId ? order.customerId.companyName : '-'}</td>
                    <td>{order.title}</td>
                    <td>{stage ? stage : '-'}</td>
                    <td>{order.createdAt ? moment(order.createdAt, moment.ISO_8601).format('MM-DD-YYYY') : '-'}</td>
                    <td>{order.salesRep ? order.salesRep.firstname + ' ' + order.salesRep.lastname : '-'}</td>
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
                            }}>Orders</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_orders_container" ref="dashboard_orders_container">
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
                            <Select
                                multi
                                disabled={this.state.disabled}
                                value={this.state.stageValue}
                                placeholder="Select stage"
                                options={this.state.stageOptions}
                                onChange={this.handleStageChange}
                                style={{
                                    "marginTop": "25px"
                                }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <a
                                        href="#link_salesrep"
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
                                    <table className="table table-striped table-bordered table-hover" id="dash_order" ref="dash_order">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Company</th>
                                                <th>Title</th>
                                                <th>Stage</th>
                                                <th>Date</th>
                                                <th>Sales Rep</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="link_salesrep" ref="link_salesrep" className="modal fade" tabIndex="-1" aria-hidden="true">
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
        getOrderList: state.dashboards.ordersList,
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