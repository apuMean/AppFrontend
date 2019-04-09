import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons';
import * as contactsactions from '../../../actions/contactOptionsActions';
import * as functions from '../../common/functions';
import autoBind from 'react-autobind';

class ContactOpportunities extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = { contactOppData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactOpportunities(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Opportunities',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        functions.showLoader('oppContacts_list');
        setTimeout(function () {
            datatable.ContactTable.init();
        }, 3000);
    }

    contactOpp() {
        localStorage.setItem("contactOppId", this.props.params.contactId);
        browserHistory.push('/opportunity/add');
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactOppState = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactOppData: contactOppState });
            let dtable = findDOMNode(self.refs.contact_list);
            var oppContact_list = $(dtable).DataTable(); oppContact_list.destroy();
            const el = findDOMNode(self.refs.oppContacts_list);
            setTimeout(function () {
                datatable.ContactTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    render() {
        var opportunityList = this.state.contactOppData;
        if (opportunityList) {
            let stage;
            var oppList = opportunityList.map(function (opportunity, index) {
                if (opportunity.stageId == 1) {
                    stage = "Pre-Estimate";
                } else if (opportunity.stageId == 2) {
                    stage = "Estimate Follow-Up";
                } else if (opportunity.stageId == 3) {
                    stage = "Work In-Progress";
                } else if (opportunity.stageId == 4) {
                    stage = "Completed";
                } else if (opportunity.stageId == 5) {
                    stage = "Obsolete";
                } else if (opportunity.stageId == 6) {
                    stage = "Estimate";
                }
                return <tr key={index}>
                    <td>{opportunity.title ? opportunity.title : '-'}</td>
                    <td>{opportunity.estCloseDate ? opportunity.estCloseDate : '-'}</td>
                    <td>{opportunity.actCloseDate ? opportunity.actCloseDate : '-'}</td>
                    <td>{stage}</td>
                    <td>${opportunity.value}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="contacts_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Opportunities</span>
                    </div>

                    <div className="actions">
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container" id="oppContacts_list" ref="oppContacts_list">
                        <table className="table table-striped table-bordered table-hover" id="contact_list" id="contact_list">
                            <thead >
                                <tr>
                                    <th>Title</th>
                                    <th>Close Estimated</th>
                                    <th>Close Actual</th>
                                    <th>Stage</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {oppList}
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

    return { contactoptions: state.contactoptions.contactOpportunitiesData };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactOpportunities);
