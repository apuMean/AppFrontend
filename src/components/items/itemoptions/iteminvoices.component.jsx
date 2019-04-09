import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons';
import * as itemAction from '../../../actions/itemAction.js';
import { browserHistory } from 'react-router';
import * as functions from '../../common/functions';

class ItemInvoices extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillMount() {
        var itemData = {
            itemId: this.props.params.materialId,
            companyId: localStorage.companyId
        }
        this
            .props
            .actions
            .getItemsInvoiceList(itemData);

        var data1 = {
            parent: 'Materials',
            childone: 'Invoices',
            childtwo: ''
        };

        this.props.breadCrumb(data1);
    }

    componentDidMount() {

        functions.showLoader('itemList');

        setTimeout(function () {
            datatable
                .ItemTable
                .init();
            $('div#itemList').unblock();
        }, 2000);

    }

    render() {

        var itemList = this
            .props
            .itemInvoiceList
            .map(function (item, index) {

                return <tr key={index}>
                    <td>{item.invoiceId ? item.invoiceId.invoiceNumber : '-'}</td>
                    <td>{item.createdAt ? moment(item.createdAt).format('MM/DD/YYYY') : '-'}</td>
                    <td>{item.invoiceId ? item.invoiceId.title : '-'}</td>
                    <td>{item.salesRep ? item.salesRep.firstname + ' ' + item.salesRep.lastname : '-'}</td>
                    <td>{item.total ? "$" + item.total : '-'}</td>
                </tr>;
            }.bind(this));

        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="itemList">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Invoices</span>
                    </div>
                    <div className="actions">
                        <Link to={"/material/" + this.props.params.materialId} className="btn btn-sm btn-circle green">
                            <i className="icon-arrow-left"></i> Back </Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container table-responsive">
                        <table className="table table-striped table-bordered table-hover" id="item_list">
                            <thead >
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Sales Rep</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemList}
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
    return { itemInvoiceList: state.itemCreation.itemInvoiceList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(itemAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemInvoices);
