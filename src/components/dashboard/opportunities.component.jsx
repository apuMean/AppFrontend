import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as functions from '../common/functions';
import * as dashboardActions from '../../actions/dashboardActions';
import * as datatable from '../../scripts/table-datatables-buttons';
import autoBind from 'react-autobind';
const STAGE = [
    {
        value: '1',
        label: 'Pre-Estimate'
    }, {
        value: '2',
        label: 'Estimate Follow-Up'
    }, {
        value: '3',
        label: 'Work In-Progress'
    }, {
        value: '4',
        label: 'Completed'
    }, {
        value: '5',
        label: 'Obsolete'
    }, {
        value: '6',
        label: 'Estimate'
    }
];

let label = "__-__-__";
//Opportunities controlled component
class Opportunities extends React.Component {
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
            startDate: '',
            endDate: '',
            per_page: 0,
            page: 0,
            getOpportunityList: [],
            showDropdowns: true,
            salesreps: [],
            stages: [],
            salesRepList: [],
            filteredSalesrep: [],
            salesFlag: true
        };
    }

    componentWillMount() {
        var data = {
            "companyId": localStorage.companyId
        }

        var data1 = {
            parent: 'Dashboard',
            childone: 'Opportunities',
            childtwo: ''
        };
        this.props.breadCrumbs(data1);

        this.props.actions.getAllSalesRep(data);

        this.props.actions.getDashOpportunityList(data);

    }
    componentDidMount() {
        functions.showLoader('dashboard_opportunity_container');
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.salesRepList.length != 0 && this.state.salesFlag) {
            this.setState({ salesRepList: nextProps.salesRepList });
        }
        this.setState({ getOpportunityList: nextProps.getOpportunityList });
        let dtable = findDOMNode(self.refs.dashboard_opportunity);
        var groupname_list = $(dtable).DataTable();
        groupname_list.destroy();
        const el = findDOMNode(self.refs.dashboard_opportunity_container);
        setTimeout(function () {
            datatable.DashboardOpportunityTable.init();
            $(el).unblock();
        }, 3000);

    }
    handleEvent(event, picker) {
        this.setState({ stageValue: [] });
        var start = picker.startDate.format('MM-DD-YYYY');
        var end = picker.endDate.format('MM-DD-YYYY');
        var data = {
            "filterType": "date",
            "companyId": localStorage.companyId,
            "startDate": start,
            "endDate": end
        }
        this
            .props
            .actions
            .getDashOpportunityFilteredList(data)
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
                .getDashOpportunityList(data);
            $('input[name=salesRep]').prop('checked', false);
            this.setState({
                stageValue: value,
                filteredSalesrep: []
            });
        }
        else {
            this.state.stages = [];
            this.setState({
                stageValue: value,
                filteredSalesrep: []
            });
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
            $('input[name=salesRep]').prop('checked', false);
            this
                .props
                .actions
                .getDashOpportunityFilteredList(data)
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
            this.getSalesOpportunities(currentState);
        }
        else {
            currentState.push(salesId);
            currentFilteredList.push(res);
            this.setState({
                salesreps: currentState,
                filteredSalesrep: currentFilteredList
            });
            this.getSalesOpportunities(currentState);
        }
    }

    getSalesOpportunities(currentSales) {
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
                .getDashOpportunityFilteredList(data);
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
                .getDashOpportunityList(data);
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
            this.setState({
                stageValue: []
            });
            this
                .props
                .actions
                .getDashOpportunityFilteredList(data)
            setTimeout(function () {
                $(el).modal('hide');
            }, 500);
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
                .getDashOpportunityList(data);
            setTimeout(function () {
                $(el).modal('hide');
            }, 500);
        }
    }

    render() {
        let stage = '';
        var start = this.state.startDate;
        var end = this.state.endDate;
        label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }
        var opportunityList = this.state.getOpportunityList;
        if (opportunityList) {
            var oppList = opportunityList.map(function (opportunity, index) {
                if (opportunity.stageId == 1) {
                    stage = 'Pre-Estimate'
                }
                else if (opportunity.stageId == 2) {
                    stage = 'Estimate Follow-Up'
                }
                else if (opportunity.stageId == 3) {
                    stage = 'Work In-Progress'
                }
                else if (opportunity.stageId == 4) {
                    stage = 'Completed'
                }
                else if (opportunity.stageId == 5) {
                    stage = 'Obsolete'
                }
                else if (opportunity.stageId == 6) {
                    stage = 'Estimate'
                }
                return <tr key={index}>
                    <td>{opportunity.createdAt ? moment(opportunity.createdAt, moment.ISO_8601).format('MM-DD-YYYY') : '--'}</td>
                    <td>{opportunity.companyId.company ? opportunity.companyId.company : '--'}</td>
                    <td>{opportunity.title ? opportunity.title : '--'}</td>
                    <td>{stage ? stage : '--'}</td>
                    <td>${opportunity.value ? opportunity.value : '--'}</td>
                    <td>{opportunity.salesRep.firstname ? opportunity.salesRep.firstname + ' ' + opportunity.salesRep.lastname : '--'}</td>
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
                                <input
                                    type="checkbox"
                                    id={salesrep._id}
                                    className="md-check"
                                    name="salesRep"
                                    onChange={this.handleSalesRepCheck.bind(this, index, salesrep._id)} />
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
                            }}>Opportunities</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_opportunity_container" ref="dashboard_opportunity_container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-floating-label">
                                <div className="row">
                                    <div className="col-md-3">  <label htmlFor="status">Date Range</label></div>
                                    <div className="col-md-9"> <DateRangePicker
                                        ranges={this.state.ranges}
                                        showDropdowns={this.state.showDropdowns}
                                        onApply={this.handleEvent}>
                                        <div className="input-group date form_datetime">
                                            <input
                                                readOnly={true}
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
                                    </DateRangePicker></div></div>
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
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="col-md-3">
                                    <button onClick={this.handleSalesRepModal}
                                        className="btn btn-sm btn-circle green">
                                        <i className="icon-user-follow"></i>
                                        Sales Reps
                                    </button>
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
                                    <table className="table table-striped table-bordered table-hover" id="dashboard_opportunity" ref="dashboard_opportunity">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Company</th>
                                                <th>Title</th>
                                                <th>Stage</th>
                                                <th>Value</th>
                                                <th>Sales Rep</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {oppList}
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
                                        <div className="table-container table-responsive" style={{ maxHeight: "250px", overflowY: "scroll" }}>
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
        getOpportunityList: state.dashboards.opportunitiesList,
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
export default connect(mapStateToProps, mapDispatchToProps)(Opportunities);