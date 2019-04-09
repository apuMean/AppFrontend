import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import * as createContactAction from '../../actions/createContactAction';
import DeleteModal from '../common/deleteModal.component.js';
import "../../styles/bootstrap-fileinput.css";
import * as validate from '../common/validator';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class ContactsDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            contactId: '',
            phoneDetails: [],
            mailDetails: [],
            addressdetails: [],
            contactData: '',
            keyword: [],
            keywords: [],
            breadcrumb: true
        }
    }

    componentWillMount() {

        var contact = {
            contactId: this.props.params.contactId
        }
        this.props.actions.getContact(contact);
    }

    componentDidMount() {
        functions.showLoader('contacts_list');
    }

    componentWillReceiveProps(nextProps) {

        let contactPhone = [];
        let contactMail = [];
        let contactAddress = [];
        if (nextProps.createcontact) {
            var contactState = JSON.parse(JSON.stringify(nextProps.createcontact));

            if (contactState.phoneInfo.length != 0) {
                var phoneState = contactState.phoneInfo
                    .map(function (phone, index) {
                        contactPhone.push(phone);
                    }.bind(this));
            }

            if (contactState.internetInfo.length != 0) {
                var mailState = contactState.internetInfo
                    .map(function (mail, index) {
                        contactMail.push(mail);
                    }.bind(this));
            }

            if (contactState.addressInfo.length != 0) {
                var addressState = contactState.addressInfo
                    .map(function (address, index) {
                        contactAddress.push(address);
                    }.bind(this));
            }

            if (this.state.breadcrumb && contactState.firstname) {
                var data = {
                    parent: <Link to='/contact'>Contacts</Link>,
                    childone: contactState.firstname + ' ' + contactState.lastname,
                    childtwo: ''
                };
                this.props.breadCrumb(data);
                this.state.breadcrumb = false;
            }
        }

        this.setState({
            contactData: contactState,
            phoneDetails: contactPhone,
            mailDetails: contactMail,
            addressdetails: contactAddress
        });
        const el = findDOMNode(this.refs.contacts_list);
        $(el).unblock();
    }

    handleDetail(companyDetailId) {

        if (companyDetailId) {
            window.open('/company/' + companyDetailId, '_blank');
        }

    }

    handleDelete() {
        this.setState({ contactId: this.props.params.contactId })
        $('#contact_delete').modal('show');
    }

    deleteContactHandler() {
        if (this.state.contactId) {
            $('#contact_delete').modal('hide');
            functions.showLoader('contacts_list');
            this.props.actions.deleteContact(this.state.contactId, 2);
        }
    }

    render() {

        var userType;
        var contactData = this.state.contactData;
        if (contactData) {
            var typeName = contactData.typeInfo.length != 0 ? contactData.typeInfo[0].typeName : '';
            var statusName = contactData.statusInfo.length != 0 ? contactData.statusInfo[0].statusName : '';
            var sourceName = contactData.sourcesInfo.length != 0 ? contactData.sourcesInfo[0].sourceName : '';
            var referredByContact = contactData.referredByInfo.length != 0 ? contactData.referredByInfo[0].firstname + ' ' + contactData.referredByInfo[0].lastname : '-';
            var primary = <i className="fa fa-star"></i>;
            let phone = '';
            var phoneData = this.state.phoneDetails.map(function (contact, index) {
                let phoneCount = validate.removeSpecialCharSpace(contact.phone)
                if (phoneCount.length <= 11 && phoneCount.includes("x")) {
                    phone = contact.phone.substring(0, contact.phone.indexOf("x"));
                } else {
                    phone = contact.phone;
                    var str = phone;
                    var newStr = str.replace(/_/g, "");
                    phone = newStr;
                }
                return <tr key={index}>
                    <td>{contact.isPrimary ? primary : ''}</td>
                    <td>{contact.phonetype}</td>
                    <td>{phone ? phone : ''}</td>
                </tr>;
            }.bind(this));
            var mailData = this.state.mailDetails.map(function (mail, index) {
                return <tr key={index}>
                    <td>{mail.isPrimary ? primary : ''}</td>
                    <td>{mail.internetType}</td>
                    <td>{mail.internetvalue}</td>
                </tr>;
            }.bind(this));
            var addressData = this.state.addressdetails
                .map(function (address, index) {
                    let addressMap = address.zip + ' ' + address.city + ' ' + address.state + ' ' + address.mapAddress1 + ' ' + address.mapAddress2;
                    let country = ''
                    if (address.countryId == 1) {
                        country = "US"
                    }
                    else if (address.countryId == 2) {
                        country = "India"
                    }
                    return <tr key={index}>
                        <td>{address.isPrimary ? primary : ''}</td>
                        <td>{address.addressType}</td>
                        <td>
                            <a className="green" href={"http://maps.google.com/?q=" + addressMap} target="_blank">
                                {address.mapAddress1}
                            </a>
                        </td>
                        <td>{address.mapAddress2}</td>
                        <td>{address.city}</td>
                        <td>{address.state}</td>
                        <td>{address.zip}</td>
                        <td>{country}</td>
                    </tr>;
                }.bind(this));

            var keywordsInfo = contactData.contactkeywordInfo ? contactData.contactkeywordInfo.map(function (keyword, index) {
                return <p key={index}>
                    <span>{keyword.keywordName}</span>&nbsp;
                </p>;
            }.bind(this)) : null;

            if (contactData.userType == 1) {
                userType = "Company";
            } else if (contactData.userType == 2) {
                userType = "Individual";
            }
        }

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#contact-add" data-toggle="tab">
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="#contact-moreinfo" data-toggle="tab">
                                More Info
                            </a>
                        </li>
                        <div className="text-right">
                            <Link to="/contact" className="btn btn-sm btn-circle red">
                                Cancel
                                </Link>&nbsp;
                                <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button>&nbsp;
                            <Link to={"/contact/" + this.props.params.contactId + '/edit'} className="btn btn-sm btn-circle green">
                                Edit
                                </Link>
                            &nbsp;
                                <div className="btn-group">
                                <a
                                    className="btn btn-sm btn-circle blue"
                                    href="javascript:;"
                                    data-toggle="dropdown">
                                    <span className="hidden-xs">
                                        More Options
                                    </span>
                                    <i className="fa fa-angle-down"></i>
                                </a>
                                <ul className="dropdown-menu pull-right">
                                    <li >
                                        <Link to={"/contactlinks/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-call-end"></i>
                                            Linked Contacts</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactopportunities/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-trophy"></i>
                                            Opportunities</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactestimates/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-calculator"></i>
                                            Estimates</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactproposals/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-envelope-letter"></i>
                                            Proposals</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactprojects/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-folder"></i>Projects</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactpos/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-wallet"></i>
                                            POs</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactinvoices/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-credit-card"></i>
                                            Invoices</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contacttimecards/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-clock"></i>
                                            Timecards</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactactivities/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-rocket"></i>
                                            Activities</Link>
                                    </li>
                                    <li >
                                        <Link to={"/contactdocuments/" + this.props.params.contactId} className="tool-action">
                                            <i className="icon-docs"></i>
                                            Documents</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="contacts_list" ref="contacts_list">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="contact-add">
                                <div className="row">
                                    <div className="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                                        <div className="form-group form-md-line-input form-md-floating-label">
                                            <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                <div
                                                    className="fileinput-preview thumbnail"
                                                    data-trigger="fileinput" style={{ height: '142px' }}>
                                                    <img src={contactData.profileImage ? contactData.profileImage : require('../../img/profile/avatar-default.png')}
                                                        className="img-responsive"
                                                        alt="Logo" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-10 col-md-10 col-sm-9 col-xs-10">
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        <a onClick={this.handleDetail.bind(this, contactData.companyContactId)}>{contactData ? contactData.companyName : '-'}</a>
                                                    </div>
                                                    <label htmlFor="company">Company</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {contactData.title ? contactData.title : '-'}
                                                    </div>
                                                    <label htmlFor="title">Title</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {statusName ? statusName : '-'}
                                                    </div>
                                                    <label htmlFor="form_control_1">Status</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {contactData ? contactData.firstname : '-'}
                                                    </div>
                                                    <label htmlFor="firstname">First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {contactData ? contactData.lastname : '-'}
                                                    </div>
                                                    <label htmlFor="lastname">Last Name</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {contactData.nickName ? contactData.nickName : '-'}
                                                    </div>
                                                    <label htmlFor="form_control_1">Nickname</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {/* <Link to={contactData.webAddress ? "//" + contactData.webAddress : '#'} target="_blank" onClick={(event) => { event.preventDefault(); window.open(contactData.webAddress ? "//" + contactData.webAddress : '#'); }}>
                                                            {contactData.webAddress ? contactData.webAddress : '-'}
                                                        </Link> */}
                                                         {contactData.webAddress ?<Link to={"//" + contactData.webAddress} target="_blank" onClick={(event) => { event.preventDefault(); window.open("//" + contactData.webAddress); }}>
                                                         {contactData.webAddress}</Link>:'-'}
                                                    </div>
                                                    <label htmlFor="webAddress">Web Address</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">
                                                        {contactData.isSalesRep ? 'Yes' : 'No'}
                                                    </div>
                                                    <label htmlFor="webAddress">Sales Rep</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {this.state.phoneDetails.length !== 0 ?
                                        <div className="col-lg-6 col-md-12">
                                            <div className="portlet blue-hoki box">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <i className="fa fa-phone"></i>Phone
																</div>
                                                </div>
                                                <div className="portlet-body" style={{ padding: 0 }}>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Type</th>
                                                                    <th>Number</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {phoneData}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {this.state.mailDetails.length !== 0 ?
                                        <div className="col-lg-6 col-md-12">
                                            <div className="portlet green-meadow box">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <i className="fa fa-envelope"></i>Email
																</div>
                                                </div>
                                                <div className="portlet-body" style={{ padding: 0 }}>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Type</th>
                                                                    <th>Address</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {mailData}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                    {this.state.addressdetails.length !== 0 ?
                                        <div className="col-lg-12 col-md-12">
                                            <div className="portlet red-sunglo box">
                                                <div className="portlet-title">
                                                    <div className="caption">
                                                        <i className="fa fa-building"></i>Address
																</div>
                                                </div>
                                                <div className="portlet-body" style={{ padding: 0 }}>
                                                    <div className="table-responsive">
                                                        <table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
                                                            <thead>
                                                                <tr>
                                                                    <th></th>
                                                                    <th>Type</th>
                                                                    <th>Addr. 1</th>
                                                                    <th>Addr. 2</th>
                                                                    <th>City</th>
                                                                    <th>State</th>
                                                                    <th>Zip</th>
                                                                    <th>Country</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {addressData}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                            <div className="tab-pane" id="contact-moreinfo">
                                <div className="portlet-title tabbable-line">
                                    <div className="caption">
                                        <i className="icon-users font-dark"></i>
                                        <span className="caption-subject font-dark bold uppercase">Other Details</span>
                                    </div>
                                </div>
                                <div className="portlet-body">
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="user-details">
                                            <div className="row">
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {(contactData && contactData.departmentInfo.length != 0) ? contactData.departmentInfo[0].departmentName : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Department</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.createdBy ? contactData.createdBy : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Created By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.createdAt ? moment(contactData.createdAt).format("LLL") : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">On</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {(contactData && contactData.industryInfo.length != 0) ? contactData.industryInfo[0].industryName : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Industry</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.modifiedBy ? contactData.modifiedBy : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Modified By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.modifiedBy ? moment(contactData.updatedAt).format("LLL") : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">On</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {referredByContact}
                                                        </div>
                                                        <label htmlFor="form_control_1">Reffered By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.branch ? contactData.branch : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Branch</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.birthday ? contactData.birthday : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Birthday</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.age ? contactData.age : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Age</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.notes ? contactData.notes : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Note</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.spouse ? contactData.spouse : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Spouse</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {keywordsInfo ? keywordsInfo : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Keywords</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.children ? contactData.children : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Children</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 col-sm-6 col-xs-12">
                                                    {contactData && contactData.salesRepSign && contactData.isSalesRep ? <div style={{width:'100%'}}>
                                                        <label style={{top:'0',fontSize:'13px',color:'#999'}} htmlFor="signature">Signature</label>
                                                        <div style={{ width: '300px', padding: '10px', border: '1px solid #D3D3D3', margin: '0' }}>
                                                            <img style={{ width: "350px", height: "50px" }}
                                                                src={contactData.salesRepSign}
                                                                className="img-responsive center-block"
                                                                alt="Signature" />
                                                        </div>
                                                    </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal deleteModalId="contact_delete" deleteUserHandler={this.deleteContactHandler} />
            </div>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { createcontact: state.createcontact.contactData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(createContactAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactsDetail);