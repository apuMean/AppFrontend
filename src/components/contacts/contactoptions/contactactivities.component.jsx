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
class ContactActivities extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            contactActivityData: []
        };
    }

    componentWillMount() {
        var data = {
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactActivities(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Activities',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }
    componentDidMount() {
        setTimeout(function () {
            datatable
                .ContactActivityTable
                .init();
        }, 3000);
        functions.showLoader('contact_activity');
    }
    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactActivity = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactActivityData: contactActivity });
            let dtable = findDOMNode(self.refs.contact_activity_table);
            var activity_list = $(dtable).DataTable();
            activity_list.destroy();
            setTimeout(function () {
                datatable
                    .ContactActivityTable
                    .init();
                const el = findDOMNode(self.refs.contact_activity);
                $(el).unblock();
            }, 3000);

        }
    }

    render() {
        var activityType = '';
        var activityList = this.state.contactActivityData.map(function (act, index) {
            if (act.activityType == "1") {
                activityType = "Note";
            } else if (act.activityType == "2") {
                activityType = "Event";
            } else if (act.activityType == "3") {
                activityType = "Task";
            } else if (act.activityType == "4") {
                activityType = "Email";
            } else if (act.activityType == "5") {
                activityType = "Fax";
            } else if (act.activityType == "6") {
                activityType = "Call";
            } else if (act.activityType == "7") {
                activityType = "Letter";
            }
            return <tr key={index}>
                <td>{activityType}</td>
                <td>{moment(act.createdAt).format("DD-MM-YYYY")}</td>
                <td>{moment(act.createdAt).format("hh:mm:ss a")}</td>
                <td>{act.activityId ? act.activityId.subject : '-'}</td>
            </tr>;
        }.bind(this));
        return (
            <div
                className="portlet light portlet-fit portlet-datatable bordered"
                id="contact_activity" ref="contact_activity">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Activities</span>
                    </div>
                    <div className="actions">
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="row">
                        <div className="table-container">
                            <table className="table table-striped table-bordered table-hover" id="contact_activity_table" ref="contact_activity_table">
                                <thead >
                                    <tr>
                                        <th>Type</th>
                                        <th>Date Start</th>
                                        <th>Time Start</th>
                                        <th>Subject/Title</th>
                                    </tr>
                                </thead>
                                <tbody>{activityList}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { contactoptions: state.contactoptions.contactActivitiesData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactActivities);
