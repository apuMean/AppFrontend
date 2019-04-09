import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../common/functions';
import * as invoiceActions from '../../actions/invoiceActions';
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class InvoiceDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            invoiceDetails: '',
            itemDetails: [],
            billingAddress: '',
            shippingAddress: ''
        }
    }

    componentWillMount() {
        var invoiceId = {
            invoiceId: this.props.params.invoiceId
        }
        this
            .props
            .actions
            .getInvoiceDetails(invoiceId);

        var data1 = {
            parent: 'Invoices',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        functions.showLoader('invoice_detail');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.invoiceDetail) {
            var invoicestate = nextProps.invoiceDetail.InvoiceDetails;
            var itemState = nextProps.invoiceDetail.InvoiceItemDetails;
            var billingAddress = invoicestate.billingAddress1 + ' ' + invoicestate.billingAddress2 + ' ' + invoicestate.billingCity + ' ' + invoicestate.billingState + ' ' + invoicestate.billingZip
            var shippingAddress = invoicestate.shippingAddress1 + ' ' + invoicestate.shippingAddress2 + ' ' + invoicestate.shippingCity + ' ' + invoicestate.shippingState + ' ' + invoicestate.shippingZip
            this.setState({
                invoiceDetails: invoicestate, itemDetails: itemState,
                billingAddress: billingAddress, shippingAddress: shippingAddress,
            });
            $('div#invoice_detail').unblock();
        }
    }

    handleDelete() {
        $('#invoice_delete').modal('show');
    }

    deleteInvoiceHandler() {
        if (this.props.params.invoiceId) {
            var invoiceId = {
                invoiceId: this.props.params.invoiceId
            }
            $('#invoice_delete').modal('hide');
            functions.showLoader('invoice_detail');
            this
                .props
                .actions
                .deleteInvoice(invoiceId);
        }
    }
    render() {

        var invoiceDetailData = this.state.invoiceDetails;
        let terms = '';
        let classType = '';
        let custMessage = '';
        var itemData = this
            .state
            .itemDetails
            .map(function (item, index) {
                return <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{"$" + item.unitPrice}</td>
                    <td>{"$" + item.amount}</td>
                    <td>{"$" + item.total}</td>
                </tr>;
            }.bind(this));
        if (invoiceDetailData) {
            if (invoiceDetailData.terms == 1) {
                terms = "Net 30";
            } else if (invoiceDetailData.terms == 2) {
                terms = "Net 60";
            } else if (invoiceDetailData.terms == 3) {
                terms = "Net 90";
            }

            if (invoiceDetailData.customerMessage == 1) {
                custMessage = "Thank you for your payment.";
            } else if (invoiceDetailData.customerMessage == 2) {
                custMessage = "Please submit payment.";
            }

            if (invoiceDetailData.class == 1) {
                classType = "Maintenance";
            } else {
                classType = "";
            }

        }

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#invoice-add" data-toggle="tab"> Invoice </a>
                        </li>
                        <li>
                            <a href="#invoice-payments" data-toggle="tab"> Payments </a>
                        </li>
                        <li>
                            <a href="#invoice-moreinfo" data-toggle="tab"> More Info </a>
                        </li>
                        <div className="text-right">
                            <Link to="/invoice" className="btn btn-sm btn-circle red">
                                Cancel </Link>&nbsp;&nbsp;
                                <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button>&nbsp;&nbsp;
                                    <Link to={"/invoice/" + this.props.params.invoiceId + '/edit'} className="btn btn-sm btn-circle green">
                                Edit </Link>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="invoice_detail">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="invoice-add">
                                <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div>
                                <form role="form">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.contactId.companyName : '-'} </div>
                                                    <label htmlFor="form_control_1">Customer</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.title : '-'} </div>
                                                    <label htmlFor="form_control_1">Title</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.individualId.firstname + ' ' + invoiceDetailData.individualId.lastname : '-'} </div>
                                                    <label htmlFor="form_control_1">Contact</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.projectId.title : '-'} </div>
                                                    <label htmlFor="form_control_1">Project</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.salesRep.firstname + ' ' + invoiceDetailData.salesRep.lastname : '-'} </div>
                                                    <label htmlFor="form_control_1">Sales Rep</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {this.state.billingAddress} </div>
                                                    <label htmlFor="form_control_1">Billing Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {this.state.shippingAddress} </div>
                                                    <label htmlFor="form_control_1">Shipping Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.createdDate : '-'} </div>
                                                    <label htmlFor="form_control_1">Date</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.dueDate : '-'} </div>
                                                    <label htmlFor="form_control_1">Due Date</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {terms} </div>
                                                    <label htmlFor="form_control_1">Terms</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {classType} </div>
                                                    <label htmlFor="form_control_1">Class</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.poNumber : '-'} </div>
                                                    <label htmlFor="form_control_1">PO #</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        Items
                                    </div>
                                    <div className="portlet-body">
                                        <div className="table-container table-responsive">
                                            <table className="table table-striped table-bordered table-hover">
                                                <thead >
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Description</th>
                                                        <th>Quantity</th>
                                                        <th>Unit Price</th>
                                                        <th>Amount</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {itemData}
                                                </tbody>
                                            </table>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="col-md-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {custMessage}
                                                            </div>
                                                            <label htmlFor="form_control_1">Customer Message</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">
                                                                {invoiceDetailData ? invoiceDetailData.memo : '-'}
                                                            </div>
                                                            <label htmlFor="form_control_1">Memo</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {invoiceDetailData ? invoiceDetailData.laborCost : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Labor</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {invoiceDetailData ? invoiceDetailData.otherCost : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Other</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {invoiceDetailData ? invoiceDetailData.materialCost : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Material</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {invoiceDetailData ? invoiceDetailData.equipmentCost : '-'}
                                                                </div>
                                                                <label htmlFor="form_control_1">Equipment</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group form-md-line-input form-md-floating-label">
                                                                <div className="form-control form-control-static">
                                                                    {invoiceDetailData ? invoiceDetailData.total : '-'}
                                                                </div>
                                                                <label htmlFor="total">Total</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="invoice-payments">
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form action="#" className="horizontal-form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.title : '-'} </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.invoiceNumber : '-'} </div>
                                                            <label htmlFor="form_control_1">Inv #</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                                    <div className="portlet-title">
                                                        <label htmlFor="form_control_1"><b>Payments</b></label>
                                                    </div>
                                                    <div className="portlet-body">
                                                        <div className="table-container table-responsive">
                                                            <table className="table table-striped table-bordered table-hover">
                                                                <thead >
                                                                    <tr>
                                                                        <th>Date</th>
                                                                        <th>Payment Type</th>
                                                                        <th>Amt Received</th>
                                                                        <th>Memo</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>04/25/2017</td>
                                                                        <td>Cash</td>
                                                                        <td>$ 100</td>
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
                                </div>
                            </div>
                            <div className="tab-pane" id="invoice-moreinfo">
                                <div className="portlet-title tabbable-line">
                                    <div className="caption">
                                        <span className="caption-subject font-dark bold uppercase">Other Details</span>
                                    </div>
                                </div>
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <form action="#" className="horizontal-form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.title : '-'} </div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData ? invoiceDetailData.createdBy : '-'} </div>
                                                            <label htmlFor="form_control_1">Created By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData ? moment(invoiceDetailData.createdAt).format('LLL') : '-'} </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData && invoiceDetailData.invoiceNumber ? invoiceDetailData.invoiceNumber : '-'} </div>
                                                            <label htmlFor="form_control_1">Inv #</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">  {invoiceDetailData && invoiceDetailData.modifiedBy ? invoiceDetailData.modifiedBy : '-'} </div>
                                                            <label htmlFor="form_control_1">Modified By</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData && invoiceDetailData.modifiedBy ? moment(invoiceDetailData.updatedAt).format('LLL') : '-'} </div>
                                                            <label htmlFor="form_control_1">On</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData && invoiceDetailData.opportunityId ? invoiceDetailData.opportunityId.title : '-'} </div>
                                                            <label htmlFor="form_control_1">Opportunity</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData && invoiceDetailData.estimateId ? invoiceDetailData.estimateId.estimateNumber : '-'} </div>
                                                            <label htmlFor="form_control_1">Estimate</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {invoiceDetailData && invoiceDetailData.orderId ? invoiceDetailData.orderId : '-'} </div>
                                                            <label htmlFor="form_control_1">Order</label>
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
                <DeleteModal
                    deleteModalId="invoice_delete"
                    deleteUserHandler={this.deleteInvoiceHandler} />
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { invoiceDetail: state.invoices.invoiceDetails };
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(invoiceActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetail);