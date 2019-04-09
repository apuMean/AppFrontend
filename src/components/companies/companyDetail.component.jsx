import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import Select from 'react-select';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as loader from '../../constants/actionTypes';
import DeleteModal from '../common/deleteModal.component';
import * as createContactAction from '../../actions/createContactAction';
import '../../styles/bootstrap-fileinput.css';
import * as validate from '../common/validator';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class CompanyDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			contactDetails: {},
			phoneDetails: [],
			mailDetails: [],
			addressdetails: [],
			contactData: '',
			associatedContacts: [],
			breadcrumb: true
		};
	}

	componentWillMount() {

		let contact = {
			contactId: this.props.params.companyId
		};

		let associateData = {
			companyId: localStorage.companyId,
			companyContactId: this.props.params.companyId,
			userType: 2
		};
		this.props.actions.getContact(contact);
		this.props.actions.getAssociatedContacts(associateData);
	}

	componentDidMount() {
		functions.showLoader('companyList');
	}

	componentWillReceiveProps(nextProps) {

		let contactPhone = [];
		let contactMail = [];
		let contactAddress = [];
		if (nextProps.createcontact) {
			var contactState = JSON.parse(JSON.stringify(nextProps.createcontact));

			if (contactState.phoneInfo) {
				var phoneState = contactState.phoneInfo
					.map(function (phone, index) {
						contactPhone.push(phone);
					}.bind(this));
			}

			if (contactState.internetInfo) {
				var mailState = contactState.internetInfo
					.map(function (mail, index) {
						contactMail.push(mail);
					}.bind(this));
			}

			if (contactState.addressInfo) {
				var addressState = contactState.addressInfo
					.map(function (address, index) {
						contactAddress.push(address);
					}.bind(this));
			}

			const el = findDOMNode(this.refs.companyList);
			$(el).unblock();

			if (this.state.breadcrumb && contactState.companyName) {
				var data = {
					parent: <Link to='/company'>Companies</Link>,
					childone: contactState.companyName,
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
			addressdetails: contactAddress,
			associatedContacts: nextProps.contactsList
		});
	}

	handleContactDetails(index) {
		let currentData = this.state.associatedContacts[index];
		window.open('/contact/' + currentData._id, '_blank');
	}

	handleCompanyDetails(parentCompanyId) {
		if (parentCompanyId) {
			window.open('/company/' + parentCompanyId, '_blank');
		}
	}

	handleDelete() {
		$('#company_delete').modal('show');
	}

	deleteEstimateHandler() {
		if (this.props.params.companyId) {
			$('#company_delete').modal('hide');
			functions.showLoader('companyList');
			this.props.actions.deleteContact(this.props.params.companyId, 1);
		}
	}

	render() {

		var contactData = this.state.contactData;
		if (contactData) {
			var statusName = contactData.statusInfo.length != 0 ? contactData.statusInfo[0].statusName : '';
			var primary = <i className="fa fa-star"></i>;
			let phone = '';
			var phoneData = this.state.phoneDetails.map(function (contact, index) {
				let phoneCount = validate.removeSpecialCharSpace(contact.phone);
				if (phoneCount.length <= 11 && phoneCount.includes('x')) {
					phone = contact.phone.substring(0, contact.phone.indexOf('x'));
				} else {
					phone = contact.phone;
					let str = phone;
					let newStr = str.replace(/_/g, '');
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
					<td>
						{mail.internetvalue}
					</td>
				</tr>;


			}.bind(this));
			var addressData = this.state.addressdetails
				.map(function (address, index) {
					let addressMap = address.zip + ' ' + address.city + ' ' + address.state + ' ' + address.mapAddress1 + ' ' + address.mapAddress2;
					let country = '';
					if (address.countryId == 1) {
						country = 'US';
					}
					else if (address.countryId == 2) {
						country = 'India';
					}
					return <tr key={index}>
						<td>{address.isPrimary ? primary : ''}</td>
						<td>{address.addressType}</td>
						<td><a href={'http://maps.google.com/?q=' + addressMap} target="_blank">{address.mapAddress1}</a></td>
						<td>{address.mapAddress2}</td>
						<td>{address.city}</td>
						<td>{address.state}</td>
						<td>{address.zip}</td>
						<td>{country}</td>
					</tr>;
				}.bind(this));



			var contactsAssociated = this.state.associatedContacts
				.map(function (contact, index) {
					let phone = contact.phoneInfo.map(function (phonedata, index) {
						if (phonedata.isPrimary) {
							return phonedata.phone;
						}
					});
					let internet = contact.internetInfo.map(function (internetData, index) {
						if (internetData.isPrimary) {
							return internetData.internetvalue;
						}
					});
					return <tr key={index}>
						<td><a onClick={this.handleContactDetails.bind(this, index)}>{contact.firstname + ' ' + contact.lastname}</a></td>
						<td>{contact.title ? contact.title : '-'}</td>
						<td>{contact.phoneInfo.length != 0 ? phone : '-'}</td>
						<td>{contact.internetInfo.length != 0 ? internet : '-'}</td>
					</tr>;
				}.bind(this));
		}

		return (
			<div>
				<div className="portlet-title tabbable-line">
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#contact-add" data-toggle="tab">
                                Company
							</a>
						</li>
						<li>
							<a href="#contact-moreinfo" data-toggle="tab">
                                More Info
							</a>
						</li>
						<div className="text-right">
							<Link to="/company" className="btn btn-sm btn-circle red">
                                Cancel
							</Link>&nbsp;
							<button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button>&nbsp;
							<Link to={'/company/' + this.props.params.companyId + '/edit'} className="btn btn-sm btn-circle green">
                                Edit
							</Link>
                            &nbsp;
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="companyList" ref="companyList">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="contact-add">
								<div className="row">
									<div className="col-lg-2 col-md-2 col-sm-2 col-xs-4">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="fileinput fileinput-exists" data-provides="fileinput">
												<div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: '142px' }}>
													<img
														src={contactData.profileImage ? contactData.profileImage : require('../../img/itemlogo.png')}
														className="img-responsive"
														alt="Logo" />
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-10 col-md-10 col-sm-8 col-xs-12">
										<div className="row">
											<div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">
														{contactData.companyName ? contactData.companyName : '-'}
													</div><label htmlFor="company">Company</label>
												</div>
											</div>
											<div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static" onClick={this.handleCompanyDetails.bind(this, contactData.parentContactId)}>
														<a>{contactData.parentContactName ? contactData.parentContactName : '-'}</a>
													</div><label htmlFor="parent">Parent Company</label>
												</div>
											</div>
											<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">
														{statusName}
													</div><label htmlFor="status">Status</label>
												</div>
											</div>
											<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">
														{contactData.webAddress ?<Link to={contactData.webAddress ? '//' + contactData.webAddress : '#'} target="_blank" onClick={(event) => { event.preventDefault(); window.open(contactData.webAddress ? '//' + contactData.webAddress : '#'); }}>
															{contactData.webAddress}
															{/* {contactData.webAddress ? contactData.webAddress : '-'} */}
														</Link>:'-'}
													</div><label htmlFor="webAddress">Web Address</label>
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
									{this.state.associatedContacts.length !== 0 ?
										<div className="col-lg-12 col-md-12">
											<div className="portlet grey-cascade box">
												<div className="portlet-title">
													<div className="caption">
														<i className="fa fa-address-book"></i>Contacts
													</div>
												</div>
												<div className="portlet-body" style={{ padding: 0 }}>
													<div className="table-responsive">
														<table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
															<thead>
																<tr>
																	<th>Name</th>
																	<th>Title</th>
																	<th>Phone</th>
																	<th>Email</th>
																</tr>
															</thead>
															<tbody>
																{contactsAssociated}
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
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.createdBy ? contactData.createdBy : '-'}
														</div>
														<label htmlFor="form_control_1">Created By</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.createdAt ? moment(contactData.createdAt).format('LLL') : '-'}
														</div>
														<label htmlFor="form_control_1">On</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.modifiedBy ? contactData.modifiedBy : '-'}
														</div>
														<label htmlFor="form_control_1">Modified By</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.modifiedBy ? moment(contactData.updatedAt).format('LLL') : '-'}
														</div>
														<label htmlFor="form_control_1">On</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<DeleteModal deleteModalId="company_delete" deleteUserHandler={this.deleteEstimateHandler} />
			</div>
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		createcontact: state.createcontact.contactData,
		contactsList: state.createcontact.associatedContacts
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(createContactAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyDetail);