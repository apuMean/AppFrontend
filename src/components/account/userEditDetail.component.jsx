import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import InputElement from 'react-input-mask';
// import * as appLayout from '../../scripts/account_layout';
import * as layout from '../../scripts/app';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as crumbActions from '../../actions/accountAction';
import { Link } from 'react-router';
import jQuery from 'jquery';
import * as functions from '../common/functions';
import { blockUI, unblockUI } from 'block-ui';
import '../../styles/custom.css';
import Select from 'react-select';
import * as authorize from '../authorization/roleTypes';
import moment from 'moment';

//EditUser page presentational component
class EditUser extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			userData: [],
			firstname: '',
			lastname: '',
			email: '',
			phone: '',
			location: '',
			about: '',
			lastlogin: '',
			selectedStatus: '',
			selectedValue: '',
			isAccepted: '',
			isEnabled: '',
			rolesOptions: [],
			rolesValue: [],
			dataRecieved: false,
			userRoles: [],
			companyUserId: '',
			userId: ''

		};
		this.triggerLabel = this.triggerLabel.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleStatusChange = this.handleStatusChange.bind(this);
		this.updateUserHandler = this.updateUserHandler.bind(this);
		this.cancelHandler = this.cancelHandler.bind(this);
		this.deleteUserHandler = this.deleteUserHandler.bind(this);
		this.updateUserStatusHandler = this.updateUserStatusHandler.bind(this);
		this.resendInvitationHandler = this.resendInvitationHandler.bind(this);
		this.resetUserPasswordHandler = this.resetUserPasswordHandler.bind(this);
		this.handleRolesChange = this.handleRolesChange.bind(this);
	}

	triggerLabel() {
		var firstname = ReactDOM.findDOMNode(this.refs.firstname).value.trim();
		if (firstname) {
			var first = ReactDOM.findDOMNode(this.refs.firstname);
			first.className += ' edited';
		}
		var lastname = ReactDOM.findDOMNode(this.refs.lastname).value.trim();
		if (lastname) {
			var last = ReactDOM.findDOMNode(this.refs.lastname);
			last.className += ' edited';
		}
		var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
		if (email) {
			var userEmail = ReactDOM.findDOMNode(this.refs.email);
			userEmail.className += ' edited';
		}
		var location = ReactDOM.findDOMNode(this.refs.location).value.trim();
		if (location) {
			var userLocation = ReactDOM.findDOMNode(this.refs.location);
			userLocation.className += ' edited';
		}
		var phone = ReactDOM.findDOMNode(this.refs.phone).value.trim();
		if (phone) {
			var userPhone = ReactDOM.findDOMNode(this.refs.phone);
			userPhone.className += ' edited';
		}
		var about = ReactDOM.findDOMNode(this.refs.about).value.trim();
		if (about) {
			var userAbout = ReactDOM.findDOMNode(this.refs.about);
			userAbout.className += ' edited';
		}
	}
	componentWillMount() {
		this.setState({
			dataRecieved: true,
			userId: this.props.params.userId
		});
		let companyId = {
			companyId: localStorage.companyId,
			userId: localStorage.userId
		};
		var userid = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId
		};
		this.props.actions.loadUserData(userid);
		this.props.actions.getRoles(companyId);
  


	}
	componentDidMount() {
		functions.showLoader('user-details');
		layout.FormValidationMd.init();
	}

	componentDidUpdate() {
		this.triggerLabel();
       
	}


	componentWillReceiveProps(nextProps) {
		if (nextProps.userDetails) {
			$('#user-details').unblock();
			this.setState({
				firstname: nextProps.userDetails.firstname,
				lastname: nextProps.userDetails.lastname,
				email: nextProps.userDetails.email,
				phone: nextProps.userDetails.phone,
				location: nextProps.userDetails.location,
				about: nextProps.userDetails.about,
				lastlogin: nextProps.userDetails.lastLogin,
				selectedStatus: nextProps.userDetails.status,
				isAccepted: nextProps.userDetails.isAccepted,
				isEnabled: nextProps.userDetails.status,
				companyUserId: nextProps.userDetails.companyUserId
			});

			if (this.state.dataRecieved) {
				let currentRolesState = nextProps.userDetails.roles.map(function (role) {
					this.state.rolesValue.push({ value: role.roleId, label: role.roleName });
				}.bind(this));
				this.setState({
					dataRecieved: false
				});
			}

		}

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
		if (nextProps.deleteUser || nextProps.updateUserStatus) {
			browserHistory.push('/account');

		}
	}


	handleSelectChange(event) {
		this.setState({ selectedValue: event.target.value });
	}

	handleStatusChange() {
		this.setState({ selectedStatus: event.target.value });
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

		return roleData;
	}



	cancelHandler(e) {
		e.preventDefault();
		browserHistory.push('/account/user/' + this.props.params.userId);
	}



	updateUserHandler(e) {
		e.preventDefault();
		var updatedData = {
			simpleUserId: this.state.userId,
			companyUserId: this.state.companyUserId,
			firstname: ReactDOM.findDOMNode(this.refs.firstname).value.trim(),
			lastname: ReactDOM.findDOMNode(this.refs.lastname).value.trim(),
			email: ReactDOM.findDOMNode(this.refs.email).value.trim(),
			phone: ReactDOM.findDOMNode(this.refs.phone).value.trim(),
			location: ReactDOM.findDOMNode(this.refs.location).value.trim(),
			about: ReactDOM.findDOMNode(this.refs.about).value.trim(),
			status: ReactDOM.findDOMNode(this.refs.status).value.trim(),
			roles: this.state.roleData ? this.state.roleData : this.handleRolesChange(this.state.rolesValue),
			companyId: localStorage.companyId
		};
		var activityData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId,
			fullname: this.state.firstname + ' ' + this.state.lastname,
			activity: '' + 'details were updated by ' + localStorage.companyName + '',
			activity_type: 'success'
		};
		if (jQuery('#inviteUserEditForm').valid()) {
			// jQuery('div.portlet').block();
			this.props.actions.updateUser(updatedData, activityData);
		}
	}



	deleteUserHandler(e) {
		e.preventDefault();
		var userData = {
			companyId: localStorage.companyId,
			userId: this.props.params.userId
		};
		var activityData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId,
			fullname: this.state.firstname + ' ' + this.state.lastname,
			activity: '' + 'was deleted by ' + localStorage.companyName + '',
			activity_type: 'errornotify'
		};
		this.props.actions.deleteUser(userData, activityData);
		$('#delete-user').modal('hide');
	}


	updateUserStatusHandler(e) {
		e.preventDefault();
		var updatedStatus;
		var textData = this.state.isEnabled;

		if (textData == 1) {
			updatedStatus = '0';
		}
		else if (textData == 0) {
			updatedStatus = '1';
		}

		var userData = {
			userId: this.props.params.userId,
			status: updatedStatus,
			companyId: localStorage.companyId
		};
		var activity_type = status ? 'disable' : 'enable';
		var activityData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId,
			fullname: this.state.firstname + ' ' + this.state.lastname,
			activity: '' + 'status was ' + activity_type + 'd by ' + localStorage.companyName + '',
			activity_type: activity_type
		};
		this.props.actions.changeUserStatus(userData, activityData);
		$('#disable-user').modal('hide');
	}





	resendInvitationHandler(e) {
		e.preventDefault();
		var userData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId
		};
		var activityData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId,
			fullname: this.state.firstname + ' ' + this.state.lastname,
			activity: '' + 'was re sent invitation by ' + localStorage.companyName + '',
			activity_type: 'notify'
		};
		this.props.actions.reinviteUser(userData, activityData);
		$('#reinvite-user').modal('hide');
	}


	resetUserPasswordHandler(e) {

		e.preventDefault();
		var userData = {
			companyId: localStorage.companyId,
			userId: this.props.params.userId
		};
		var activityData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId,
			fullname: this.state.userData.firstname + ' ' + this.state.userData.lastname,
			activity: '' + 'password has been reset by ' + localStorage.companyName + '',
			activity_type: 'notify'
		};
		this.props.actions.resetUserPassword(userData, activityData);
		$('#reset-user-password').modal('hide');

	}

	render() {
		var userRoles = this.state.userRoles.map(function (user, index) {
			return <option value={user._id} key={index}>{user.roleName}</option>;
		}.bind(this));
		var status;
		if (this.state.isEnabled) {
			status = 'Enabled';
		}
		else {
			status = 'Disabled';
		}
		var disabledSelect = <div className="form-control form-control-static"> Invited </div>;
		var partialEnable = <a className="btn green" data-toggle="modal" href="#disable-user"><i className="fa fa-ban"></i>{this.state.isEnabled ? 'Disable User' : 'Enable User'}</a>;
		var partialInvite = <a className="btn blue" data-toggle="modal" href="#reinvite-user"><i className="fa fa-paper-plane-o"></i>Resend Invite</a>;
		var partialReset = <a className="btn red" data-toggle="modal" href="#reset-user-password"><i className="fa fa-key"></i>Password Reset</a>;
		return (
			<div className="portlet light bordered">
				<div className="portlet-title tabbable-line">
					<div className="caption">
						<i className="icon-users font-dark"></i>
						<span id={this.state.isEnabled} className="caption-subject font-dark bold uppercase">User - {this.state.firstname} {this.state.lastname}</span>
					</div>
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#user-details" data-toggle="tab"> Details </a>
						</li>
					</ul>
				</div>
				<div className="portlet-body">
					<div className="tab-content">
						<div className="tab-pane active" id="user-details">
							<form className="horizontal-form" id="inviteUserEditForm">
								<div className="form-body">
									<div className="row clearfix margin-bottom-30">
										<div className="col-md-8">
											<div className="btn-group btn-group-circle">
												{this.state.isAccepted ? partialReset : ''}
												{this.state.isAccepted ? partialEnable : ''}
												<a className="btn purple" data-toggle="modal" href="#delete-user" ><i className="fa fa-remove"></i>Delete User</a>
												{this.state.isAccepted ? '' : partialInvite}
											</div>
										</div>
										<div className="col-md-4 text-right">
											<button onClick={this.cancelHandler} className="btn btn-sm btn-circle red">
												<i className="fa fa-remove"></i> Cancel
											</button>&nbsp;&nbsp;
											<button onClick={this.updateUserHandler} className="btn btn-sm btn-circle green">
												<i className="fa fa-save"></i> Save
											</button>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<input type="text" className="form-control" name="firstname" ref="firstname" maxLength="100" key={this.state.firstname} defaultValue={this.state.firstname} />
												<label htmlFor="firstname">First Name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<select value={this.state.selectedStatus} onChange={this.handleStatusChange} name="status" className="form-control edited" ref="status" id="status">
													<option value="0">Disabled</option>
													<option value="1">Enabled</option>
												</select>
												<label htmlFor="status">Status<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<input type="text" className="form-control" name="lastname" ref="lastname" maxLength="100" key={this.state.lastname} defaultValue={this.state.lastname} />
												<label htmlFor="lastname">Last Name<span className="required">*</span></label>
											</div>
										</div>

										{/* {this.shouldBeVisible(authorize.userAuthorize) ?  */}
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<label htmlFor="role">Roles<span className="required">*</span></label>
												<Select
													ref="role"
													multi
													disabled={this.state.disabled}
													value={this.state.rolesValue}
													placeholder="Select roles"
													options={this.state.rolesOptions}
													onChange={this.handleRolesChange}
													required={true}
												/>
											</div>
										</div>
										{/* : null} */}
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<input type="email" className="form-control" name="email" ref="email" maxLength="100" key={this.state.email} defaultValue={this.state.email} />
												<label htmlFor="email">Email<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.lastlogin ? moment(this.state.lastlogin).format('LLL') : '-'} </div>
												<label htmlFor="lastlogin">Last Login</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<InputElement mask="(999) 999-9999" maskChar="" type="text" className="form-control" name="phone" ref="phone" key={this.state.phone} defaultValue={this.state.phone} />
												<label htmlFor="phone">Phone<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<input type="text" className="form-control" name="location" ref="location" maxLength="100" key={this.state.location} defaultValue={this.state.location} />
												<label htmlFor="location">Location</label>
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group form-md-line-input form-md-floating-label">
												<textarea className="form-control" rows="3" name="about" ref="about" key={this.state.about} defaultValue={this.state.about}></textarea>
												<label htmlFor="about">About</label>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div id="delete-user" className="modal fade" tabIndex="-1" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 className="modal-title">Delete User</h4>
							</div>
							<div className="modal-body">
                                Are you sure you want to delete this user ?
							</div>
							<div className="modal-footer">
								<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
								<button type="button" className="btn green" onClick={this.deleteUserHandler}>Yes</button>
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
								<button type="button" className="btn green" onClick={(e) => this.updateUserStatusHandler(e)}>Yes</button>
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
		);
	}
}





//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		breadcrumb: state.breadcrumb,
		userDetails: state.accountReducer.companyUserDetail,
		userRoles: state.accountReducer.userRoles,
		deleteUser: state.accountReducer.deleteUser,
		updateUserStatus: state.accountReducer.updateUserStatus
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(crumbActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(EditUser);