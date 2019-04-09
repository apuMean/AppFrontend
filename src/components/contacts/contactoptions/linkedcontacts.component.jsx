import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as loader from '../../../constants/actionTypes.js';
import * as contactsactions from '../../../actions/contactOptionsActions';
import * as datatable from '../../../scripts/table-datatables-buttons';
import DeleteModal from '../../common/deleteModal.component.js';
import * as validate from '../../common/validator';
import * as functions from '../../common/functions';
import autoBind from 'react-autobind';
let isDelete = false;

class LinkedContacts extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            contactLinkData: [],
            linkContactId: '',
            deleteIndex: '',
            checkboxChange: false,
        };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId
        }
        this
            .props
            .actions
            .getContactLinks(data);
        this
            .props
            .actions
            .getContactLists(data);

        var data1 = {
            parent: 'Contacts',
            childone: 'Linked Contacts',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        functions.showLoader('linkContacts_list');
        setTimeout(function () {
            datatable
                .ContactLinkTable
                .init();
        }, 2000);
    }

    handleMultipleCheck(contactId, index, typeName, e) {
        this.setState({ checkboxChange: true });
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId,
            linkContactId: contactId,
            typeName: typeName
        }
        var data1 = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId,
            linkContactId: contactId
        }
        if (e.target.checked == true) {
            this
                .props
                .actions
                .addContactLinks(data);

        } else if (e.target.checked == false) {
            this
                .props
                .actions
                .removeContactLinks(data1, "");
        }

    }

    doneAddContact() {

        if (this.state.checkboxChange || isDelete) {
            this.setState({ checkboxChange: false })
            isDelete = false;
            var data = {
                companyId: localStorage.companyId,
                contactId: this.props.params.contactId
            }
            this
                .props
                .actions
                .getContactLinks(data);
            this
                .props
                .actions
                .getContactLists(data);
        }
    }

    handleDelete(id, index) {

        this.setState({ linkContactId: id, deleteIndex: index })
        $('#contact_delete').modal('show');
    }

    deleteUserHandler() {
        isDelete = true;
        var data = {
            companyId: localStorage.companyId,
            contactId: this.props.params.contactId,
            linkContactId: this.state.linkContactId
        }
        if (this.state.linkContactId) {
            isDelete = true;
            $('#contact_delete').modal('hide');
            functions.showLoader('linkContacts_list');
            this
                .props
                .actions
                .removeContactLinks(data, "1");
            this.doneAddContact();
        }
    }

    handleContactDetail(contactId) {
        browserHistory.push('/contact/' + contactId);
    }

    componentWillReceiveProps(nextProps) {
        let self = this;
        if (nextProps.contactoptions) {
            var contactLinkState = JSON.parse(JSON.stringify(nextProps.contactoptions));
            this.setState({ contactLinkData: contactLinkState });
            let dtable = findDOMNode(self.refs.contact_links_list);
            let dtable1 = findDOMNode(self.refs.multiple_contacts_list);
            var linkContact_list = $(dtable).DataTable(); linkContact_list.destroy();
            var contact_list = $(dtable1).DataTable(); contact_list.destroy();
            const el = findDOMNode(self.refs.linkContacts_list);
            setTimeout(function () {
                datatable.ContactLinkTable.init();
                $(el).unblock();
            }, 3000);
        }
    }

    render() {
        let contactLinks = this.state.contactLinkData;
        let phone = '';

        var linkContactList = contactLinks.map(function (linkContact, index) {
            var phoneN = linkContact.phoneInfo.map(function (value) {
                if (value.isPrimary) {
                    let phoneCount = validate.removeSpecialCharSpace(value.phone)
                    if (phoneCount.length <= 11 && phoneCount.includes("x")) {
                        phone = value.phone.substring(0, value.phone.indexOf("x"));
                    } else {
                        phone = value.phone;
                    }
                    return phone
                }
            })
            var internet = linkContact.internetInfo.map(function (value) {
                if (value.isPrimary) {
                    return value.internetvalue;
                }
            })
            return <tr key={index}>
                <td onClick={this.handleContactDetail.bind(this, linkContact.companycontactsInfo[0]._id)}>{linkContact.companycontactsInfo[0].firstname} {linkContact.companycontactsInfo[0].lastname}</td>
                <td>{linkContact.companycontactsInfo[0].title ? linkContact.companycontactsInfo[0].title : '-'}</td>
                <td>{linkContact.phoneInfo.length ? phoneN : '-'}</td>
                <td>{linkContact.internetInfo.length ? internet : '-'}</td>
                <td><span className="btn btn-icon-only red times" onClick={this.handleDelete.bind(this, linkContact.companycontactsInfo[0]._id, index)}><i className="fa fa-times" ></i></span></td>
            </tr>
        }.bind(this));

        var contacts = this
            .props
            .contactLists
            .map(function (contact, index) {
                var typeName = contact.contactTypeId ? contact.contactTypeId.typeName : '';
                return <tr key={index}>
                    <td>{contact.firstname} {contact.lastname}</td>
                    <td>
                        <div className="md-checkbox-inline">
                            <div className="md-checkbox">
                                <input
                                    type="checkbox"
                                    id={contact._id}
                                    className="md-check"
                                    onChange={this
                                        .handleMultipleCheck
                                        .bind(this, contact._id, index, typeName)} />
                                <label htmlFor={contact._id}>
                                    <span></span>
                                    <span className="check"></span>
                                    <span className="box"></span>
                                </label>
                            </div>
                        </div>
                    </td>
                </tr>
            }.bind(this));

        return (
            <div
                className="portlet light portlet-fit portlet-datatable bordered"
                id="linkContacts_list" ref="linkContacts_list">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject bold uppercase">Linked Contacts</span>
                    </div>

                    <div className="actions">
                        <a
                            href="#multiple-contacts"
                            data-toggle="modal"
                            data-backdrop="static"
                            data-keyboard="false"
                            className="btn btn-sm btn-circle green">
                            <i className="icon-plus"></i>
                            Link Contact
                        </a>&nbsp;
                        <Link to={"/contact/" + this.props.params.contactId} className="btn btn-sm btn-circle red">Back</Link>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-container">
                        <table
                            className="table table-striped table-bordered table-hover"
                            id="contact_links_list" ref="contact_links_list">
                            <thead >
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Phone</th>
                                    <th>Internet</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {linkContactList}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div
                    id="multiple-contacts"
                    className="modal fade"
                    tabIndex="-1"
                    aria-hidden="true">
                    <div className="modal-dialog" id="multiple_contacts_dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                {/*<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>*/}
                                <h4 className="modal-title">Link Contacts</h4>
                            </div>
                            <div className="modal-body">
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="icon-users "></i>
                                            <span className="caption-subject bold uppercase">Contacts</span>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="table-container table-responsive" style={{ maxHeight: "250px", overflowY: "scroll" }}>
                                            <table
                                                className="table table-striped table-bordered table-hover"
                                                id="multiple_contacts_list" ref="multiple_contacts_list">
                                                <thead>
                                                    <tr>
                                                        <th>Contact Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {contacts}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" onClick={this.doneAddContact} className="btn dark btn-outline">Close</button>
                                {/*<button
                                    type="button"
                                    className="btn green"
                                    id="send-invite-button" data-dismiss="modal">Done</button>*/}
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal
                    deleteModalId="contact_delete"
                    deleteUserHandler={this.deleteUserHandler} />
            </div>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { contactoptions: state.contactoptions.contactLinkData, contactLists: state.contactoptions.contactListsData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(contactsactions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(LinkedContacts);
