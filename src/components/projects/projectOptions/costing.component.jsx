import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
class CostingExpenses extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentWillMount() {

        // var companyId = {
        //     companyId: localStorage.companyId
        // }
        // this     .props     .actions     .getCostingList(companyId);

        var projectId = {
            projectId: this.props.params.projectId
        }
        var data = {
            projectId: this.props.params.projectId,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getProjectEstimate(projectId);

        this
            .props
            .actions
            .getProjectPos(data);

        this
            .props
            .actions
            .getProjectExpenses(projectId);

        var data1 = {
            parent: 'Projects',
            childone: 'Expenses',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        $('div#costingList').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#costingList').unblock();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) { }
    render() {
        var projectEstimateList = this
            .props
            .projectEstimateList
            .map(function (est, index) {

                return <tr key={index}>
                    <td>{est.estimateNumber}</td>
                    <td>{est.title}</td>
                    <td>${est.laborCost}</td>
                    <td>${est.materialCost}</td>
                    <td>${est.equipmentCost}</td>
                    <td>${est.otherCost}</td>
                    <td>${est.totalEstimate}</td>
                </tr>;
            }.bind(this));
        var projectPosList = this
            .props
            .projectPosList
            .map(function (po, index) {

                return <tr key={index}>
                    <td>{po.poNumber ? po.poNumber : '-'}</td>
                    <td>{po.title ? po.title : '-'}</td>
                    <td>{po.total ? "$" + po.total : '-'}</td>
                </tr>;
            }.bind(this));
        var projectExpensesList = this
            .props
            .projectExpensesList
            .map(function (exp, index) {
                return <tr key={index}>
                    <td>{exp.createdAt ? moment(exp.createdAt).format('MM/DD/YYYY') : '-'}</td>
                    <td>{exp.description ? exp.description : '-'}</td>
                    <td>{exp.amount ? "$" + exp.amount : '-'}</td>
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>Expenses</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#costing-estimate" data-toggle="tab">
                                Estimate
                            </a>
                        </li>
                        <li>
                            <a href="#costing-pos" data-toggle="tab">
                                POs
                            </a>
                        </li>
                        <li>
                            <a href="#costing-expenses" data-toggle="tab">
                                Expenses
                            </a>
                        </li>
                        <li>
                            <a href="#costing-callOffs" data-toggle="tab">
                                Call offs
                            </a>
                        </li>
                        <li>
                            <a href="#costing-summary" data-toggle="tab">
                                All Summary
                            </a>
                        </li>
                        <div className="text-right">
                            <Link to={"/project/" + this.props.params.projectId} className="btn btn-sm btn-circle red">
                                BACK
                            </Link>
                        </div>
                    </ul>
                </div>
                <div className="portlet-body" id="costingList">
                    <div className="tab-content">
                        <div className="tab-pane active" id="costing-estimate">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="cost_estimate_list">
                                                    <thead >
                                                        <tr>
                                                            <th>Estimate #</th>
                                                            <th>Title</th>
                                                            <th>Labor</th>
                                                            <th>Material</th>
                                                            <th>Equipment</th>
                                                            <th>Other</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projectEstimateList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane" id="costing-pos">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="cost_po_list">
                                                    <thead >
                                                        <tr>
                                                            <th>PO #</th>
                                                            <th>Title</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projectPosList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane" id="costing-expenses">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="cost_expense_list">
                                                    <thead >
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Title</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projectExpensesList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane" id="costing-callOffs">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="cost_callOff_list">
                                                    <thead >
                                                        <tr>
                                                            <th>Equipment</th>
                                                            <th>Call Offs #
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Cort Furniture</td>
                                                            <td>-</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane" id="costing-summary">
                            <div className="row profile-account">
                                <div className="col-md-3">
                                    <ul className="ver-inline-menu tabbable margin-bottom-10">
                                        <li className="active">
                                            <a data-toggle="tab" href="#tab_1-1">
                                                <i className="fa fa-cog"></i>
                                                Summary
                                            </a>
                                            <span className="after"></span>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#tab_2-2">
                                                <i className="fa fa-money"></i>
                                                Costs
                                            </a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#tab_3-3">
                                                <i className="fa fa-cogs"></i>
                                                Labor EVM
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-md-9">
                                    <div className="tab-content">
                                        <div id="tab_1-1" className="tab-pane active">
                                            <div className="row">
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-body">
                                                        <form role="form">
                                                            <div className="form-body">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 699,467
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Revenue</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 699,467
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Cost</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 64
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Gross Profit</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                44 %
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Gross Profit %
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 65,420
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Net Profit</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                39 5
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Net Profit %</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                66.678
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Overhead</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                2851.50
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Labor Hours</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab_2-2" className="tab-pane">
                                            <div className="row">
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-body">
                                                        <form role="form">
                                                            <div className="form-body">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 699,467
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Labor</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 64
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Material</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 65,420
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Equipment</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 66,678
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Fuel</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 699,467
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Other</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                <b>
                                                                                    $ 1,355,748
                                                                                </b>
                                                                            </div>
                                                                            <label htmlFor="form_control_1">
                                                                                <b>Total</b>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="tab_3-3" className="tab-pane">
                                            <div className="row">
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-body">
                                                        <form role="form">
                                                            <div className="form-body">
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 699,467
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Current Revenue</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 64
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Current Cost</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-7">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                $ 65,420
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Current Gross Profit</label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                                            <div className="form-control form-control-static">
                                                                                66 %
                                                                            </div>
                                                                            <label htmlFor="form_control_1">Current Gross Profit %</label>
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
                                </div>
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
    return {
        projectEstimateList: state.projectOption.projectEstimateList,
        projectPosList: state.projectOption.projectPosList,
        projectExpensesList: state.projectOption.projectExpensesList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(CostingExpenses);