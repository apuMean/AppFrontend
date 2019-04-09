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

class ContactEstimates extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = { contactEstimateData: [] };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactEstimates(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Estimates',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactEstimateState = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactEstimateData: contactEstimateState });
            const el = findDOMNode(self.refs.estimates_list);
            setTimeout(function () {
                datatable.ContactEstimateTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    componentDidMount() {
        functions.showLoader('estimates_list');
        setTimeout(function () {
            datatable.ContactEstimateTable.init();
        }, 3000);
    }

    contactEstimate() {
        localStorage.setItem("contactEstId", this.props.params.contactId);
        browserHistory.push('/estimate/add');
    }

    render() {
        var estimateList = this.state.contactEstimateData;
        if (estimateList) {
            var estimatedata = estimateList.map(function (estimate, index) {
                return <tr key={index}>
                    <td>{estimate.estimateNumber ? estimate.estimateNumber : '-'}</td>
                    <td>{estimate.opportunityId && estimate.opportunityId.title ? estimate.opportunityId.title : '-'}</td>
                    <td>{estimate.salesRep.firstname + ' ' + estimate.salesRep.lastname}</td>
                    <td>{moment(estimate.createdAt).format("MM-DD-YYYY")}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="estimates_list" ref="estimates_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Estimates</span>
                    </div>

                    <div className="actions">
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table className="table table-striped table-bordered table-hover" id="estimates_table">
                            <thead >
                                <tr>
                                    <th>Estimate #</th>
                                    <th>Title</th>
                                    <th>Sales Rep</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimatedata}
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
    return { contactoptions: state.contactoptions.contactEstimatesData };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactEstimates);
