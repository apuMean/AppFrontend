import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as contactsactions from '../../../actions/contactOptionsActions';
class ContactTimecards extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentWillMount() {
        var data1 = {
            parent: 'Contacts',
            childone: 'Timecards',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }
    componentDidMount() {
    }
    componentWillReceiveProps() {
    }

    render() {
        return (
            <div className="portlet light portlet-fit portlet-datatable bordered" id="contacts_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Contact Timecards</span>
                    </div>

                    <div className="actions">
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table className="table table-striped table-bordered table-hover" id="contact_list">
                            <thead >
                                <tr>
                                    <th>User</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Reg</th>
                                    <th>OT</th>
                                    <th>DT</th>
                                    <th>Wages</th>
                                    <th>Approved</th>
                                    <th>Notes</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>

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
    return { contactoptions: state };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch),
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactTimecards);
