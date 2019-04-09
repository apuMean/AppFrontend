import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../common/functions';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as estimateActions from '../../actions/expenseActions';
import * as dashboardActions from '../../actions/dashboardActions';
import { browserHistory } from 'react-router';
import autoBind from 'react-autobind';

class Expense extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            expenseData: [],
            expenseId: '',
            deleteIndex: ''
        }
    }

    componentWillMount() {
        var data = {
            parent: 'Expenses',
            childone: '',
            childtwo: ''
        };
        var companyId = {
            companyId: localStorage.companyId
        }
        this.props.breadCrumb(data);
        this
            .props
            .estimateActions
            .getExpenses(companyId);
    }

    handleDetail(id) {
        browserHistory.push('/expense/' + id);
    }

    componentDidMount() {
        functions.showLoader('expense_list');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.expenseList) {
            var expenseState = JSON.parse(JSON.stringify(nextProps.expenseList));
            this.setState({ expenseData: expenseState });
            var item_list = $('#item_list').DataTable();
            item_list.destroy();
            setTimeout(function () {
                datatable
                    .ItemTable
                    .init();
                $('div#expense_list').unblock();

            }, 3000);

        }
    }
    render() {
        var expenseList = this
            .state
            .expenseData
            .map(function (expense, index) {

                return <tr key={index} onClick={this.handleDetail.bind(this, expense._id)}>
                    <td>{expense.createdBy ? expense.createdBy : '-'}</td>
                    <td>{expense.enteredOn ? expense.enteredOn : '-'}</td>
                    <td>{expense.projectId ? expense.projectId.title : '-'}</td>
                    <td>{expense.amount ? "$" + expense.amount : '-'}</td>
                    <td>{expense.ccLast ? expense.ccLast : '-'}</td>
                </tr>;
            }.bind(this));
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="expense_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Expenses</span>
                    </div>

                    <div className="actions">
                        <Link to="/expense/add" className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i> Add Expense </Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table className="table table-striped table-bordered table-hover" id="item_list">
                            <thead >
                                <tr>
                                    <th>Created By</th>
                                    <th>Entered On</th>
                                    <th>Project</th>
                                    <th>Amount</th>
                                    <th>CC Last 4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenseList}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { expenseList: state.expense.expenseList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch),
        estimateActions: bindActionCreators(estimateActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Expense);
