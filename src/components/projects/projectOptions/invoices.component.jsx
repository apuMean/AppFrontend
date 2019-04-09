import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class ProjectInvoices extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
    }

    componentWillMount() {

        var projectId = {
            projectId: this.props.params.projectId,
            companyId: localStorage.companyId
        }
        this.props.actions.getInvoiceList(projectId);

        var data1 = {
            parent: 'Projects',
            childone: 'Invoices',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    projectInvoice() {
        localStorage.setItem("projectInvoiceId", this.props.params.projectId);
        localStorage.setItem("invoiceProjectName", localStorage.projectName);
        browserHistory.push('/invoice/add');
    }

    componentDidMount() {
        $('div#invoiceList').block({
            message: '<h5><img src="http://elsevierafrica.com/public/assets/style/img/loading-spinner-' +
            'blue.gif"> Processing...</h5>',
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#invoiceList').unblock();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) { }
    render() {
        let invoiceClass;
        var invoiceList = this
            .props
            .invoiceList
            .map(function (invoice, index) {

                if (invoice.class == 1) {
                    invoiceClass = "Maintenance";
                } else {
                    invoiceClass = '-';
                }

                return <tr key={index}>
                    <td>{invoice.invoiceNumber ? invoice.invoiceNumber : '-'}</td>
                    <td>{invoice.createdAt ? moment(invoice.createdAt).format('MM/DD/YYYY') : '-'}</td>
                    <td>{invoiceClass}</td>
                    <td>{invoice.salesRep ? invoice.salesRep.firstname + ' ' + invoice.salesRep.lastname : '-'}</td>
                    <td>{invoice.total ? "$" + invoice.total : '-'}</td>
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
                            }}>Invoices</span>
                    </div>
                </div>
                <hr></hr>
                <div className="text-right" style={{ "marginBottom": "5px" }}>
                    <a onClick={this.projectInvoice} className="btn btn-sm btn-circle green">
                        <i className="icon-plus"></i> Add Invoice </a>&nbsp;&nbsp;
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red">
                        Back
                    </Link>
                </div>
                <div className="portlet-body" id="invoiceList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_invoice">
                                                    <thead >
                                                        <tr>
                                                            <th>Invoice #</th>
                                                            <th>Date</th>
                                                            <th>Class</th>
                                                            <th>Sales rep</th>
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { invoiceList: state.projectOption.invoiceList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectInvoices);