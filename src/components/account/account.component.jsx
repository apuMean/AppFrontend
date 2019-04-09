import React from 'react';
import { blockUI, unblockUI } from 'block-ui';
import jQuery from 'jquery';
import { findDOMNode } from 'react-dom';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as crumbActions from '../../actions/accountAction';
import Select from 'react-select';
import moment from 'moment';
import * as api from '../../../tools/apiConfig';
import InputElement from 'react-input-mask';
import * as layout from '../../scripts/app';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as functions from '../common/functions';
import InviteUserModal from '../common/inviteUserModal';
import UsersTab from './users.component';
import ActivityTab from './activity.component';
import SettingsTab from './settings.component';
import DetailsTab from './details.component';
import { isValidImage } from '../shared/isValidImage';
import * as messages from '../../constants/messageConstants';
class Account extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			currentCompanyUserData: [],
			activityData: [],
			companyName: '',
			phone: '',
			weburl: '',
			location: '',
			about: '',
			companyImage: '',
			isAccepted: '',
			userIndex: null,
			isEnabled: '',
			loggedInAs: '',
			userData: '',
			disabled: false,
			userRoles: [],
			rolesValue: [],
			rolesOptions: [],
			roleData: [],
			usersList: [],
			companyUserData: ''
		};
		this.getRole = this.getRole.bind(this);
		this.updateAccountHandler = this.updateAccountHandler.bind(this);
		this.inviteUserHandler = this.inviteUserHandler.bind(this);
		this.triggerLabel = this.triggerLabel.bind(this);
		this.deleteUserHandler = this.deleteUserHandler.bind(this);
		this.updateUserStatusHandler = this.updateUserStatusHandler.bind(this);
		this.resendInvitationHandler = this.resendInvitationHandler.bind(this);
		this.resetUserPasswordHandler = this.resetUserPasswordHandler.bind(this);
		this.resetUserPassword = this.resetUserPassword.bind(this);
		this.activityHandler = this.activityHandler.bind(this);
		this.userActivityHandler = this.userActivityHandler.bind(this);
		this.getActivityList = this.getActivityList.bind(this);
		this.handleRolesChange = this.handleRolesChange.bind(this);
		this.clearForm = this.clearForm.bind(this);
		this.resendInviteModalHandler = this.resendInviteModalHandler.bind(this);
		this.resetPasswordModalHandler = this.resetPasswordModalHandler.bind(this);
		this.disableModalHandler = this.disableModalHandler.bind(this);
		this.userProfileHandler = this.userProfileHandler.bind(this);
		this.deleteModalHandler = this.deleteModalHandler.bind(this);
		this.imageUpdateHandler = this.imageUpdateHandler.bind(this);
		this.removeProfileImage = this.removeProfileImage.bind(this);
		this.refresh = this.refresh.bind(this);
	}
	getRole() {
		if (localStorage.roleName == 'Admin') {
			this.setState({
				loggedInAs: true
			});

		}
	}
	clearForm() {
		this.refs.inviteUser.refs.form.reset();
		this.setState({
			rolesValue: ''
		});
	}

	triggerLabel() {
		if (localStorage.roleName == 'Admin') {
			var companyName = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.companyName).value.trim();
			if (companyName) {
				var company = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.companyName);
				company.className += ' edited';
			}
			var web = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.weburl).value.trim();
			if (web) {
				var webUrl = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.weburl);
				webUrl.className += ' edited';
			}
			var location = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.location).value.trim();
			if (location) {
				var userLocation = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.location);
				userLocation.className += ' edited';
			}
			var phone = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.phone).value.trim();
			if (phone) {
				var userPhone = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.phone);
				userPhone.className += ' edited';
			}
			var about = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.about).value.trim();
			if (about) {
				var userAbout = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.about);
				userAbout.className += ' edited';
			}
		}
	}


	updateAccountHandler(event) {
		event.preventDefault();
		// var fileData = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.accountFileUpload).files[0];
		var data = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.phone).value.trim();
		var updatedData = {
			companyUserId: localStorage.employeeId,
			companyId: localStorage.companyId,
			companyName: ReactDOM.findDOMNode(this.refs.SettingsTab.refs.companyName).value.trim(),
			weburl: ReactDOM.findDOMNode(this.refs.SettingsTab.refs.weburl).value.trim(),
			phone: ReactDOM.findDOMNode(this.refs.SettingsTab.refs.phone).value.trim(),
			// phone: (ReactDOM.findDOMNode(this.refs.phone).value.trim()).replace(/[-()_]/g, ''),
			location: ReactDOM.findDOMNode(this.refs.SettingsTab.refs.location).value.trim(),
			about: ReactDOM.findDOMNode(this.refs.SettingsTab.refs.about).value.trim(),
		};
		// if(updatedData.weburl!=this.state.phone||updatedData.phone!=this.state.weburl||updatedData.location!=this.state.location||updatedData.about!=this.state.about)
		var activityData = {
			userId: localStorage.employeeId,
			companyId: localStorage.companyId,
			fullname: localStorage.userName,
			activity: '' + 'updated profile details',
			activity_type: 'success'
		};
		//loader
		if (jQuery('#accountUpdateForm').valid()) {
			if (updatedData.companyName) {
				this.props.actions.updateAccountUser(updatedData, activityData);
			} 
		}else {
			toastr.error(messages.VALID_FIELDS);
		}
		
       

	}

	imageUpdateHandler(event) {

		let userId;
		let fileData;
		let currentState = JSON.parse(JSON.stringify(this.state.companyUserData));
		if (event.target.value) {
			// userId = {
			// 	companyUserId: localStorage.employeeId
			// };
			userId = localStorage.employeeId;
			fileData = ReactDOM.findDOMNode(this.refs.SettingsTab.refs.userFileUpload).files[0];
			if (!isValidImage(fileData.name)) {
				userId = '';
				// userId = {
				// 	companyUserId: ''
				// };
			}
		}
		else {
			userId = '';
			// userId = {
			// 	companyUserId: ''
			// };
		}
		if (userId) {
			this.props.actions.updateUserPicture(fileData, userId, currentState);
			// this.props.actions.getUserDetails({companyUserId: userId});
		}

	}
	removeProfileImage() {

		let currentState = JSON.parse(JSON.stringify(this.state.companyUserData));
		let userId = localStorage.employeeId;
		let data = {
			userId: userId,
			path: this.state.companyUserData.userImage.replace(/ +/g, '')
		};
		this.props.actions.removeUserPicture(data, currentState);
	}
	refresh() {

		let companyId = {
			companyId: localStorage.companyId,
			userId: localStorage.userId
		};
		this.props.actions.getUsersList(companyId);
		functions.showLoader('accounttable');

	}

	componentWillMount() {
		let companyId = {
			companyId: localStorage.companyId,
			userId: localStorage.userId
		};
		let userId = {
			companyUserId: localStorage.employeeId
		};

		this.props.actions.getUserDetails(userId);
		this.props.actions.getUsersList(companyId);
		this.props.actions.getRoles(companyId);
		this.props.actions.getActivityList(companyId);

		var data = {
			parent: 'Users',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
      
	}

	componentDidMount() {

		this.getRole();
		functions.showLoader('accounttable');
		setTimeout(function () {
			// datatable.TableDatatablesButtons.init();
			datatable.InviteUserTable.init();
			if (localStorage.activeTab) {
				$('#activitydata a[href="' + localStorage.activeTab + '"]').tab('show');
			}
			jQuery('#activitydata').unblock();
		}, 2000);
	}

	componentWillReceiveProps(nextProps) {
		const ul = findDOMNode(this.refs.accountUsers);
		if (nextProps.userRoles) {
			if (nextProps.userRoles.length !== 0 && this.state.rolesOptions.length == 0) {
				let rolesState = nextProps.userRoles.map(function (role) {
					this.state.rolesOptions.push({ value: role._id, label: role.roleName });
				}.bind(this));

				this.setState({
					userRoles: nextProps.userRoles
				});
			}

		}
		// if (nextProps.deleteUser || nextProps.updateUserStatus) {
		if (nextProps.updateUserStatus) {
			let companyId = {
				companyId: localStorage.companyId,
				userId: localStorage.userId

			};
			this.props.actions.getUsersList(companyId);
			functions.showLoader('accounttable');

		}
		if (nextProps.updateCompanyUser) {
			this.setState({
				companyName: nextProps.updateCompanyUser.company,
				weburl: nextProps.updateCompanyUser.weburl,
				location: nextProps.updateCompanyUser.location,
				phone: nextProps.updateCompanyUser.phone,
				about: nextProps.updateCompanyUser.about,
				status: nextProps.updateCompanyUser.status
			});
		}
		//this is userdata which is not updated when updating in setting tab that's y companyName is not chaging
		if (nextProps.userById) {
			this.setState({
				companyUserData: nextProps.userById,
				companyName: nextProps.userById.company,
				companyImage: nextProps.userById.userImage,
				weburl: nextProps.userById.weburl,
				location: nextProps.userById.location,
				phone: nextProps.userById.phone,
				about: nextProps.userById.about,
				status: nextProps.userById.status

			});
		}


		if (nextProps.usersList) {
			$('#accounttable').unblock();

			this.setState({
				usersList: nextProps.usersList,
				currentCompanyUserData: nextProps.usersList
			});

		}
		if (nextProps.allActivities) {
			$('#users-activity').unblock();

			this.setState({
				activityData: nextProps.allActivities
			});
		}
		if (nextProps.invitedUser) {
			let companyId = {
				companyId: localStorage.companyId,
				userId: localStorage.userId
			};
			this.props.actions.getUsersList(companyId);
			functions.showLoader('accounttable');
		}

	}


	handleRolesChange(value) {
		this.setState({ rolesValue: value });
		let roleData = [];
		value.map(function (role) {
			let obj = {
				roleId: role.value,
				roleName: role.label
			};
			roleData.push(obj);
		});
		this.setState({ roleData: roleData });
		// this.props.actions.updateUserRoles(roledata);
	}

	componentDidUpdate() {
		this.triggerLabel();
		layout.FormValidationMd.init();
	}

	inviteUserHandler(e) {

		e.preventDefault();

		if (jQuery('#inviteUserForm').valid()) {
			var userData = {
				firstname: ReactDOM.findDOMNode(this.refs.inviteUser.refs.firstname).value.trim(),
				lastname: ReactDOM.findDOMNode(this.refs.inviteUser.refs.lastname).value.trim(),
				email: ReactDOM.findDOMNode(this.refs.inviteUser.refs.email).value.trim(),
				companyId: localStorage.companyId,
				companyName: this.state.companyName,
				roles: this.state.roleData
			};

			$('#invite-user').modal('hide');
			this.props.actions.sendInvite(userData);
			this.clearForm();

		}
	}


	userProfileHandler(e, index) {
		e.preventDefault();
		var data = this.state.currentCompanyUserData;
		var companydata = data[index];
		var userId = companydata.userId;
		browserHistory.push('/account/user/' + userId);
	}

	userActivityHandler(e, index) {
		e.preventDefault();
		var data = this.state.activityData;
		var userdata = data[index];
		var userId = userdata.userId;
		browserHistory.push('/account/user/' + userId);
	}


	deleteUserHandler(e) {
		e.preventDefault();
		var stateData = this.state.currentCompanyUserData;
		var data = stateData[this.state.userIndex];
		var userData = {
			companyId: localStorage.companyId,
			userId: data.userId
		};
		var activityData = {
			userId: data.userId,
			companyId: localStorage.companyId,
			fullname: data.firstname + ' ' + data.lastname,
			activity: '' + 'was deleted by ' + localStorage.companyName + '',
			activity_type: 'errornotify'
		};
		this.props.actions.deleteUser(userData, activityData);
		$('#delete-user').modal('hide');
	}

	updateUserStatusHandler(e) {

		e.preventDefault();
		var updatedStatus;
		var stateData = this.state.currentCompanyUserData;
		var data = stateData[this.state.userIndex];
		var response = $('#span').attr('id');
		var text = $('#user_' + data.userId).text(response);
		var textData = text[0].innerText;
		if (textData == 'ENABLED') {
			updatedStatus = '0';
		}
		else if (textData == 'DISABLED') {
			updatedStatus = '1';
		}
		// var textData=this.state.isEnabled;

		// if (textData == 1) {
		//     updatedStatus = "0";
		// }
		// else if (textData == 0) {
		//     updatedStatus = "1";
		// }

		var userData = {
			userId: data.userId,
			status: updatedStatus,
			companyId: localStorage.companyId
		};
		var activity_type = data.status ? 'disable' : 'enable';
		var activityData = {
			userId: data.userId,
			companyId: data.companyId,
			fullname: data.firstname + ' ' + data.lastname,
			activity: '' + 'status was ' + activity_type + 'd by ' + localStorage.companyName + '',
			activity_type: activity_type
		};
		this.props.actions.changeUserStatus(userData, activityData);
		$('#disable-user').modal('hide');
		// this.props.actions.getUsersList(localStorage.companyId);
		// this.updateUserStatus(userData, activityData);
	}

	resendInvitationHandler(e) {

		e.preventDefault();
		var stateData = this.state.currentCompanyUserData;
		var data = stateData[this.state.userIndex];
		var userData = {
			companyId: localStorage.companyId,
			userId: data.userId,
			companyName: this.state.companyName
		};
		var activityData = {
			userId: data.userId,
			companyId: data.companyId,
			fullname: data.firstname + ' ' + data.lastname,
			activity: '' + 'was re sent invitation by ' + localStorage.companyName + '',
			activity_type: 'notify'
		};
		this.props.actions.reinviteUser(userData, activityData);
		$('#reinvite-user').modal('hide');
		// this.resendInvitation(userData, activityData);
	}


	resetUserPasswordHandler(e) {

		e.preventDefault();
		var stateData = this.state.currentCompanyUserData;
		var data = stateData[this.state.userIndex];
		var userData = {
			companyId: localStorage.companyId,
			userId: data.userId
		};
		var activityData = {
			userId: data.userId,
			companyId: localStorage.companyId,
			fullname: data.firstname + ' ' + data.lastname,
			activity: '' + 'password has been reset by ' + localStorage.companyName + '',
			activity_type: 'notify'
		};
		this.props.actions.resetUserPassword(userData, activityData);
		$('#reset-user-password').modal('hide');

		// this.resetUserPassword(userData, activityData);
	}

	resetUserPassword(userData, activityData) {

	}

	resendInviteModalHandler(e, index) {
		e.preventDefault();
		this.setState({
			userIndex: index
		});
		$('#reinvite-user').modal('show');
	}
	deleteModalHandler(e, index) {

		e.preventDefault();
		this.setState({
			userIndex: index
		});
		$('#delete-user').modal('show');
	}
	resetPasswordModalHandler(e, index) {

		e.preventDefault();
		this.setState({
			userIndex: index
		});
		$('#reset-user-password').modal('show');
	}
	disableModalHandler(e, index) {

		e.preventDefault();
		this.setState({
			userIndex: index
		});
		$('#disable-user').modal('show');
	}
	activityHandler(activityData) {

		this.props.actions.addActivity(activityData);
	}
	getActivityList() {
		let companyId = {
			companyId: localStorage.companyId,
			userId: localStorage.userId

		};
		functions.showLoader('users-activity');

		this.props.actions.getActivityList(companyId);

	}
	setActivetab(e) {
		e.preventDefault();
		localStorage.setItem('activeTab', $(e.target).attr('href'));
	}
	handleinviteModal() {
		$('#invite-user').modal({ backdrop: 'static', keyboard: false });
	}
	render() {

		const loggedInAs = this.state.loggedInAs;
		return (
			<div>
				{loggedInAs ? (
					<div>
						<div className="portlet light bordered" id="accounttable">
							<div className="portlet-title tabbable-line">
								<div className="caption">
									<i className="icon-briefcase font-dark"></i>
									<span className="caption-subject font-dark bold uppercase">{this.state.companyName}</span>
								</div>
								<ul className="nav nav-tabs" id="accountTab">
									<li className="active">
										<a href="#account-details" data-toggle="tab" onClick={this.setActivetab}> Details </a>
									</li>
									<li>
										<a href="#account-settings" data-toggle="tab" onClick={this.setActivetab}> Settings </a>
									</li>
									<li>
										<a href="#account-users" data-toggle="tab" onClick={this.setActivetab}> Users </a>
									</li>
									<li>
										<a href="#users-activity" data-toggle="tab" onClick={this.getActivityList}> Activity </a>
									</li>
								</ul>
							</div>
							<div className="portlet-body" id="activitydata">
								<div className="tab-content">
									<DetailsTab
										tabId="account-details"
										companyImage={this.state.companyImage}
										companyName={this.state.companyName}
										phone={this.state.phone}
										weburl={this.state.weburl}
										location={this.state.location}
										about={this.state.about} />
									<SettingsTab
										tabId="account-settings"
										imageUpdateHandler={this.imageUpdateHandler}
										removeProfileImage={this.removeProfileImage}
										updateAccountHandler={this.updateAccountHandler}
										companyImage={this.state.companyImage}
										companyName={this.state.companyName}
										phone={this.state.phone}
										weburl={this.state.weburl}
										location={this.state.location}
										about={this.state.about}
										ref='SettingsTab' />
									<UsersTab
										ref='accountUsers'
										tabId='account-users'
										handleInvite={this.handleinviteModal.bind(this)}
										usersList={this.state.usersList}
										resendInviteModalHandler={this.resendInviteModalHandler}
										resetPasswordModalHandler={this.resetPasswordModalHandler}
										disableModalHandler={this.disableModalHandler}
										userProfileHandler={this.userProfileHandler}
										deleteModalHandler={this.deleteModalHandler}
										refreshHandler={this.refresh}
									/>
									<ActivityTab
										activityData={this.state.activityData}
										tabId="users-activity" />
								</div>
							</div>
						</div>
						<InviteUserModal
							InviteUserModalId="invite-user"
							inviteUserHandler={this.inviteUserHandler}
							handleRolesChange={this.handleRolesChange}
							rolesValue={this.state.rolesValue}
							rolesOptions={this.state.rolesOptions}
							clearForm={this.clearForm}
							ref='inviteUser'
						/>

						<div id="delete-user" className="modal fade" tabIndex="-1" aria-hidden="true">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true" ></button>
										<h4 className="modal-title">Delete User</h4>
									</div>
									<div className="modal-body">
                                        Are you sure you want to delete this user ?
									</div>
									<div className="modal-footer">
										<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
										<button type="button" className="btn green" onClick={(e) => this.deleteUserHandler(e)}>Yes</button>
									</div>
								</div>
							</div>
						</div>
						<div id="reset-user-password" className="modal fade" tabIndex="-1" aria-hidden="true">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
										<h4 className="modal-title">Reset User Password</h4>
									</div>
									<div className="modal-body">
                                        Are you sure you want to reset this user password ?
									</div>
									<div className="modal-footer">
										<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
										<button type="button" className="btn green" onClick={this.resetUserPasswordHandler}>Yes</button>
									</div>
								</div>
							</div>
						</div>
						<div id="disable-user" className="modal fade" tabIndex="-1" aria-hidden="true">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
										<h4 className="modal-title">Update User Status</h4>
									</div>
									<div className="modal-body">
                                        Are you sure you want to update this user status ?
									</div>
									<div className="modal-footer">
										<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
										<button type="button" className="btn green" onClick={this.updateUserStatusHandler}>Yes</button>
									</div>
								</div>
							</div>
						</div>
						<div id="reinvite-user" className="modal fade" tabIndex="-1" aria-hidden="true">
							<div className="modal-dialog">
								<div className="modal-content">
									<div className="modal-header">
										<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
										<h4 className="modal-title">Reinvite User</h4>
									</div>
									<div className="modal-body">
                                        Are you sure you want to reinvite this user ?
									</div>
									<div className="modal-footer">
										<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
										<button type="button" className="btn green" onClick={this.resendInvitationHandler}>Yes</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div>
						<div className="portlet light bordered" id="accounttable">
							<div className="portlet-title tabbable-line">
								<div className="caption">
									<i className="icon-briefcase font-dark"></i>
									<span className="caption-subject font-dark bold uppercase">{this.state.companyName}</span>
								</div>
								<ul className="nav nav-tabs">
									<li className="active">
										<a href="#account-details" data-toggle="tab"> Details </a>
									</li>
								</ul>
							</div>
							<div className="portlet-body">
								<div className="tab-content">
									<div className="tab-pane active" id="account-details">
										<form role="form">
											<div className="form-body">
												<div className="row">
													<div className="col-md-2">
														<ul className="list-unstyled profile-nav">
															<li>
																<img src={this.state.companyImage ? this.state.companyImage : require('../../img/profile/avatar-default.png')} className="img-responsive pic-bordered" alt="Logo" />
															</li>
														</ul>
													</div>
													<div className="col-md-10">
														<div className="row">
															<div className="col-md-6">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static"> {this.state.companyName}</div>
																	<label htmlFor="companyName">Account Name</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static"> {this.state.phone ? this.state.phone : '-'} </div>
																	<label htmlFor="phone">Phone</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static"> {this.state.weburl ? this.state.weburl : '-'} </div>
																	<label htmlFor="web">Web</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static"> {this.state.location ? this.state.location : '-'} </div>
																	<label htmlFor="location">Location</label>
																</div>
															</div>
															<div className="col-md-12">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">
																		{this.state.about ? this.state.about : '-'}
																	</div>
																	<label htmlFor="about">About</label>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>

					</div>
				)}
			</div>
		);

	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		// breadcrumb: state.accountReducer,
		userRoles: state.accountReducer.userRoles,
		invitedUser: state.accountReducer.invitedUser,
		usersList: state.accountReducer.usersList,
		userById: state.accountReducer.userById,
		updateCompanyUser: state.accountReducer.updateCompanyUser,

		deleteUser: state.accountReducer.deleteUser,
		updateUserStatus: state.accountReducer.updateUserStatus,
		allActivities: state.accountReducer.allActivities
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(crumbActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Account);