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

class ContactPos extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = { contactPosData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactPOs(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'POs',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        functions.showLoader('po_list');
        setTimeout(function () {
            datatable.ContactEstimateTable.init();
        }, 3000);
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        var contactPoState = JSON.parse(JSON.stringify(nextProps.contactoptions));
        this.setState({ contactPosData: contactPoState });
        const el = findDOMNode(this.refs.po_list);
        setTimeout(function () { $(el).unblock(); }, 3200);
    }

    contactPos() {
        localStorage.setItem("contactPoId", this.props.params.contactId);
        browserHistory.push('/po/add');
    }

    render() {
        var poList = this.state.contactPosData;
        let status = '';
        let approvalStatus = '';
        let shipVia = '';
        if (poList) {
            var podata = poList.map(function (po, index) {

                if (po.statusId == '1') {
                    status = "Open";
                } else if (po.statusId == '2') {
                    status = "Close";
                } else if (po.statusId == '3') {
                    status = "In Process";
                }
                if (po.approvalStatusId == '1') {
                    approvalStatus = "In Process";
                } else if (po.approvalStatusId == '2') {
                    approvalStatus = "Pending";
                } else if (po.approvalStatusId == '3') {
                    approvalStatus = "Approved";
                } else if (po.approvalStatusId == '4') {
                    approvalStatus = "Rejected";
                }
                if (po.shipVia == "1") {
                    shipVia = "Fed Ex";
                } else if (po.shipVia == "2") {
                    shipVia = "Amazon";
                } else {
                    shipVia = '-';
                }

                return <tr key={index}>
                    <td>{po.poNumber}</td>
                    <td>{status}</td>
                    {/* <td>{approvalStatus}</td> */}
                    <td>{moment(po.createdAt).format('L')}</td>
                    {/* <td>{po.total ? "$" + po.total : '-'}</td> */}
                    <td>{po.vendor ? po.vendor : '-'}</td>
                    <td>{po.shipDate ? po.shipDate : '-'}</td>
                    <td>{shipVia}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="po_list" ref="po_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact POs</span>
                    </div>

                    <div className="actions">
                        {/* <a onClick={this.contactPos} className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i> New PO </a>&nbsp; */}
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table className="table table-striped table-bordered table-hover" id="estimates_table">
                            <thead >
                                <tr>
                                    <th>PO #</th>
                                    <th>Status</th>
                                    {/* <th>Approval Status</th> */}
                                    <th>Date Created</th>
                                    {/* <th>Total</th> */}
                                    <th>Vendor</th>
                                    <th>Ship Date</th>
                                    <th>Ship Via</th>
                                </tr>
                            </thead>
                            <tbody>
                                {podata}
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
    return { contactoptions: state.contactoptions.contactPosData };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactPos);
