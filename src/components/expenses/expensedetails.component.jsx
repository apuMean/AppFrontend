import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import Select from 'react-select';
import TextareaAutosize from 'react-autosize-textarea';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import * as functions from '../common/functions';
import * as appValid from '../../scripts/app';
import * as estimateActions from '../../actions/expenseActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import * as layout from '../../scripts/app';
import "../../styles/bootstrap-fileinput.css";
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class ExpenseDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            enteredOn: '',
            disabled: false,
            projectValue: '',
            projectOptions: [],
            expenseDetail: ''
        }
    }

    componentWillMount() {
        var expenseId = {
            expenseId: this.props.params.expenseId
        }
        this
            .props
            .actions
            .getExpenseDetails(expenseId);

        var data1 = {
            parent: 'Expenses',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        functions.showLoader('expense_detail');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.expenseDetails) {
            var expenseState = JSON.parse(JSON.stringify(nextProps.expenseDetails));
            this.setState({
                expenseDetail: expenseState
            });
            $('div#expense_detail').unblock();
        }
    }

    handleDelete() {
        $('#expense_delete').modal('show');
    }

    deleteExpenseHandler() {
        if (this.props.params.expenseId) {
            $('#expense_delete').modal('hide');
            functions.showLoader('expense_detail');
            var data = {
                itemId: this.props.params.expenseId
            }
            // this
            //     .props
            //     .actions
            //     .deleteItem(data);
        }
    }

    render() {
        let type = ''
        var expenseState = this.state.expenseDetail;
        if (expenseState) {
            if (expenseState.type === "1") {
                type = 'Other'
            }
            else if (expenseState.type === "2") {
                type = 'Fuel'
            }
            else if (expenseState.type === "3") {
                type = 'Material'
            }
        }
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
                            <Link to="/expense" className="btn btn-sm btn-circle red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            {/* <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button>&nbsp;&nbsp; */}
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="expense_detail">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="item-add">
                                <form role="form" id="createExpense">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-9">
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">{expenseState.createdBy ? expenseState.createdBy : '-'}</div>
                                                        <label htmlFor="createdBy">Created By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">{expenseState.projectId ? expenseState.projectId.title : '-'}</div>
                                                        <label htmlFor="project">Project</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">{type ? type : '-'}</div>
                                                        <label htmlFor="type">Type</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">{expenseState.amount ? expenseState.amount : '-'}</div>
                                                        <label htmlFor="amount">Amount</label>
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
                                                                src={expenseState.createdBy ? expenseState.createdBy : require('../../img/profile/avatar-default.png')}
                                                                className="img-responsive"
                                                                alt="Logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{expenseState.description ? expenseState.description : '-'}</div>
                                                    <label htmlFor="description">Description</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{expenseState.purchasedAt ? expenseState.purchasedAt : '-'}</div>
                                                    <label htmlFor="purchasedAt">Purchased At</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{expenseState.ccLast ? expenseState.ccLast : '-'}</div>
                                                    <label htmlFor="cclast">CC Last 4</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{expenseState.notes ? expenseState.notes : '-'}</div>
                                                    <label htmlFor="notes">Notes</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{expenseState.enteredOn ? expenseState.enteredOn : '-'}</div>
                                                    <label htmlFor="notes">Entered On</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal deleteModalId="expense_delete" deleteUserHandler={this.deleteExpenseHandler} />
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { expenseDetails: state.expense.expenseDetails };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(estimateActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ExpenseDetail);