import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import moment from 'moment';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons';
import * as contactsactions from '../../../actions/contactOptionsActions';
import * as functions from '../../common/functions';
import autoBind from 'react-autobind';

class ContactInvoices extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = { contactInvoiceData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactInvoices(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Invoices',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }
    componentDidMount() {
        setTimeout(function () {
            datatable.ContactTable.init();
        }, 3000);
        functions.showLoader('invoice_list');
    }

    contactInvoice() {
        localStorage.setItem("contactInvoiceId", this.props.params.contactId);
        browserHistory.push('/invoice/add');
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactOppState = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactInvoiceData: contactOppState });
            let dtable = findDOMNode(self.refs.contact_list);
            var oppContact_list = $(dtable).DataTable(); oppContact_list.destroy();
            const el = findDOMNode(self.refs.invoice_list);
            setTimeout(function () {
                datatable.ContactTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    render() {

        var invoiceList = this.state.contactInvoiceData;
        let classType;
        if (invoiceList) {
            var invoiceList = invoiceList.map(function (invoice, index) {
                if (invoice.class == 1) {
                    classType = "Maintenance";
                } else {
                    classType = "";
                }
                return <tr key={index}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.createdAt ? moment(invoice.createdAt).format('MM/DD/YYYY') : '-'}</td>
                    <td>{classType}</td>
                    <td>{invoice.salesRep ? invoice.salesRep.firstname + ' ' + invoice.salesRep.lastname : '-'}</td>
                    <td>{invoice.total ? "$" + invoice.total : '-'}</td>
                </tr>;
            }.bind(this));
        }

        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="invoice_list" ref="invoice_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Invoices</span>
                    </div>

                    <div className="actions">
                        {/* <a className="btn btn-sm btn-circle green" onClick={this.contactInvoice}>
                            <i className="icon-plus"></i> New Invoice </a>&nbsp; */}
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive" style={{ marginTop: 10 }}>
                        <table className="table table-striped table-bordered table-hover" id="contact_list" ref="contact_list">
                            <thead >
                                <tr>
                                    <th>Invoice #</th>
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
    return { contactoptions: state.contactoptions.contactInvoicesData };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactInvoices);