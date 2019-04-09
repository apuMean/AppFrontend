import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as contactsactions from '../../../actions/contactOptionsActions';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons';
import * as functions from '../../common/functions';
class ContactProposals extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { contactProposalData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactProposals(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Proposals',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }
    componentDidMount() {
        setTimeout(function () {
            datatable.ContactProposalTable.init();
        }, 3000);
        functions.showLoader('contact_proposal');
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactProposal = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactProposalData: contactProposal });
            let dtable = findDOMNode(self.refs.contact_proposal_table);
            var proposal_list = $(dtable).DataTable(); proposal_list.destroy();
            const el = findDOMNode(self.refs.contact_proposal);
            setTimeout(function () {
                datatable.ContactProposalTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    render() {
        var proposalList = this.state.contactProposalData;
        if (proposalList) {
            var proposaldata = proposalList.map(function (proposal, index) {
                return <tr key={index}>
                    <td>{proposal.proposalNumber}</td>
                    <td>{moment(proposal.createdAt).format("MM/DD/YYYY")}</td>
                    <td>{proposal.title}</td>
                    <td>{proposal.customerId.firstname + ' ' + proposal.customerId.lastname}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div
                className="portlet light portlet-fit portlet-datatable bordered"
                id="contact_proposal" ref="contact_proposal">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Proposals</span>
                    </div>
                    <div className="actions">
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table
                            className="table table-striped table-bordered table-hover"
                            id="contact_proposal_table" ref="contact_proposal_table">
                            <thead >
                                <tr>
                                    <th>Proposal #</th>
                                    <th>Date</th>
                                    <th>Title</th>
                                    <th>Customer</th>
                                </tr>
                            </thead>
                            <tbody>{proposaldata}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { contactoptions: state.contactoptions.contactProposalsData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactProposals);
