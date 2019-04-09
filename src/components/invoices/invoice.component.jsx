import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as functions from '../common/functions';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as invoiceActions from '../../actions/invoiceActions';
import autoBind from 'react-autobind';

class Invoice extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            invoiceData: [],
            invoiceId: '',
            deleteIndex: ''
        };
    }

    componentWillMount() {
        var data = {
            parent: 'Invoices',
            childone: '',
            childtwo: ''
        };
        this.props.breadCrumb(data);

        var companyId = {
            companyId: localStorage.companyId
        }
        this
            .props
            .invoiceactions
            .getInvoices(companyId);
    }

    componentDidMount() {
        functions.showLoader('invoice_list');
    }

    handleDetail(invoiceId) {
        browserHistory.push("/invoice/" + invoiceId);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.invoicedata) {
            var invoicestate = JSON.parse(JSON.stringify(nextProps.invoicedata));
            this.setState({ invoiceData: invoicestate });
            var invoice_list = $('#invoice_table').DataTable();
            invoice_list.destroy();
            setTimeout(function () {
                datatable
                    .InvoiceTable
                    .init();
                $('div#invoice_list').unblock();
            }, 3000);
        }
    }

    render() {

        let classType;
        var invoiceList = this
            .state
            .invoiceData
            .map(function (invoice, index) {
                if (invoice.class == 1) {
                    classType = "Maintenance";
                } else {
                    classType = "";
                }
                return <tr key={index} onClick={this.handleDetail.bind(this, invoice._id)}>
                    <td>{invoice.invoiceNumber}</td>
                    {/*<td>{'-'}</td>*/}
                    <td>{invoice.createdDate}</td>
                    <td>{classType}</td>
                    <td>{invoice.salesRep ? invoice.salesRep.firstname + ' ' + invoice.salesRep.lastname : '-'}</td>
                    <td>{invoice.total ? "$" + invoice.total : '-'}</td>
                </tr>;
            }.bind(this));

        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="invoice_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Invoice</span>
                    </div>

                    <div className="actions">
                        <Link to="/invoice/add" className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i> Add Invoice </Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table className="table table-striped table-bordered table-hover" id="invoice_table">
                            <thead >
                                <tr>
                                    <th>Invoice #</th>
                                    {/*<th>QB Inv #</th>*/}
                                    <th>Date</th>
                                    <th>Class</th>
                                    <th>Sales Rep</th>
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
        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { invoicedata: state.invoices.invoiceList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch),
        invoiceactions: bindActionCreators(invoiceActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Invoice);