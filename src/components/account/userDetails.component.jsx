import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as api from '../../../tools/apiConfig';
import * as datatable from '../../scripts/table-datatables-buttons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as functions from '../common/functions';
import * as crumbActions from '../../actions/accountAction';
import { browserHistory } from 'react-router';
import jQuery from 'jquery';
import { blockUI, unblockUI } from 'block-ui';
import moment from 'moment';
//User page presentational component
class UserDetail extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			userData: [],
			isAccepted: '',
			isEnabled: '',
			activityData: [],
			rolesOptions: [],
			roles: [],
			breadcrumb: true
		};

		this.editUserHandler = this.editUserHandler.bind(this);
		this.CancelHandler = this.CancelHandler.bind(this);
		this.deleteUserHandler = this.deleteUserHandler.bind(this);
		this.updateUserStatusHandler = this.updateUserStatusHandler.bind(this);
		this.resendInvitationHandler = this.resendInvitationHandler.bind(this);
		this.resetUserPasswordHandler = this.resetUserPasswordHandler.bind(this);
		this.getActivityList = this.getActivityList.bind(this);

	}

	componentWillMount() {


		var userData = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId
		};
		this.props.actions.loadUserData(userData);
	}
	componentDidMount() {
		functions.showLoader('details');
	}

	componentWillReceiveProps(nextProps) {

		if (nextProps.userDetails) {
			$('#details').unblock();
			this.setState({
				userData: nextProps.userDetails,
				rolesOptions: nextProps.userDetails.roles,
				isAccepted: nextProps.userDetails.isAccepted,
				isEnabled: nextProps.userDetails.status
			});
			if (this.state.breadcrumb && nextProps.userDetails.firstname) {
				var data = {
					parent: <Link to='/account'>Users</Link>,
					childone: nextProps.userDetails.firstname + ' ' + nextProps.userDetails.lastname,
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}
		}
		if (nextProps.updateUserStatus) {
			this.setState({
				isEnabled: nextProps.updateUserStatus.status
			});
		}
		if (nextProps.deleteUser) {
			browserHistory.push('/account');
		}
		if (nextProps.activityByUser) {
			$('#user-activity').unblock();

			this.setState({
				activityData: nextProps.activityByUser
			});
		}
	}



	editUserHandler(e) {
		e.preventDefault();
		jQuery('div.portlet').block();
		browserHistory.push('/account/user/' + this.props.params.userId + '/edit' + '');
	}
	CancelHandler(e) {
		e.preventDefault();
		browserHistory.push('/account');
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
			fullname: this.state.userData.firstname + ' ' + this.state.userData.lastname,
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
			fullname: this.state.userData.firstname + ' ' + this.state.userData.lastname,
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
			fullname: this.state.userData.firstname + ' ' + this.state.userData.lastname,
			activity: '' + 'was re-sent invitation by ' + localStorage.companyName + '',
			activity_type: 'notify'
		};
		// this.resendInvitation(userData, activityData);
		this.props.actions.reinviteUser(userData, activityData);
		$('#reinvite-user').modal('hide');
	}


	// }

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



	getActivityList() {
		var userCompanyId = {
			userId: this.props.params.userId,
			companyId: localStorage.companyId
		};
		this.props.actions.getActivityByUser(userCompanyId);
		functions.showLoader('user-activity');
	}



	render() {
		var status;
		if (this.state.isEnabled) {
			status = 'Enabled';
		}
		else {
			status = 'Disabled';
		}


		//Partial html for enable,reset,resent invite
		var partialEnable = <a className="btn green" data-toggle="modal" href="#disable-user"><i className="fa fa-ban"></i>{this.state.isEnabled ? 'Disable User' : 'Enable User'}</a>;
		var partialReset = <a className="btn red" data-toggle="modal" href="#reset-user-password"><i className="fa fa-key"></i>Password Reset</a>;
		var partialInvite = <a className="btn blue" data-toggle="modal" href="#reinvite-user"><i className="fa fa-paper-plane-o"></i>Resend Invite</a>;

		var activityList = this.state.activityData.map(function (useractivity, index) {
			// var userId = "user_" + company.userId;
			// var user_Id = "user" + company.userId;

			// Activity tab activites partials
			if (useractivity.activity_type == 'success') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-info">
								<i className="fa fa-check"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'notify') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-warning">
								<i className="fa fa-bell-o"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'disable') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-default">
								<i className="fa fa-user"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			else if (useractivity.activity_type == 'enable') {
				var successActivity = <div className="col1">
					<div className="cont">
						<div className="cont-col1">
							<div className="label label-sm label-success">
								<i className="fa fa-user"></i>
							</div>
						</div>
						<div className="cont-col2">
							<div className="desc"><span>{useractivity.fullname}</span> {useractivity.activity}</div>
						</div>
					</div>
				</div>;
			}
			var currentTime = moment(useractivity.updatedAt).fromNow();
			return <tr key={index} className="feeds">
				<td><li>
					{successActivity}
					<div className="col2">
						<div className="date"> {currentTime} </div>
					</div>
				</li></td>
			</tr>;
		}.bind(this));
		return (
			<div className="portlet light bordered" id="details">
				<div className="portlet-title tabbable-line">
					<div className="caption">
						<i className="icon-users font-dark"></i>
						<span className="caption-subject font-dark bold uppercase">User - {this.state.userData.firstname} {this.state.userData.lastname}</span>
					</div>
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#user-details" data-toggle="tab"> Details </a>
						</li>
						<li>
							<a id="get-user-activity" href="#user-activity" data-toggle="tab" onClick={this.getActivityList}> Activity </a>
						</li>
					</ul>
				</div>
				<div className="portlet-body" >
					<div className="tab-content">
						<div className="tab-pane active" id="user-details">
							<form action="#" className="horizontal-form">
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
											<button className="btn btn-sm btn-circle red" onClick={this.CancelHandler}>
												<i className="fa fa-remove"></i> Cancel
											</button>
											<button className="btn btn-sm btn-circle green" onClick={this.editUserHandler}>
												<i className="fa fa-pencil"></i> Edit
											</button>
										</div>
									</div>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.userData.firstname}</div>
												<label htmlFor="first_name">First Name</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.isEnabled ? status : 'Invited'} </div>
												<label htmlFor="status">Status</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.userData.lastname} </div>
												<label htmlFor="last_name">Last Name</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static">
													{this.state.rolesOptions ? this.state.rolesOptions.map(function (role) {
														return <span>{role.roleName}&nbsp;&nbsp;&nbsp;</span>;
													}) : '-'}
												</div>
												<label htmlFor="role">Roles</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.userData.email} </div>
												{/* <a href='mailto:{this.state.userData.email}'>{this.state.userData.email}</a> */}
												<label htmlFor="email">Email</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static">{this.state.userData.lastLogin ? moment(this.state.userData.lastLogin).format('LLL') : '-'}</div>
												<label htmlFor="last_login">Last Login</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.userData.phone ? this.state.userData.phone : '-'}</div>
												<label htmlFor="phone">Phone</label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static"> {this.state.userData.location ? this.state.userData.location : '-'}</div>
												<label htmlFor="location">Location</label>
											</div>
										</div>
										<div className="col-md-12">
											<div className="form-group form-md-line-input form-md-floating-label">
												<div className="form-control form-control-static">
													{this.state.userData.about ? this.state.userData.about : '-'}
												</div>
												<label htmlFor="about">About</label>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>

						<div className="tab-pane" id="user-activity">
							<div className="table-container">
								<table className="table table-striped table-bordered table-hover" id="activity_3">
									<thead>
										<tr>
											<th>Activity</th>
										</tr>
									</thead>
									<tbody>

										{activityList}

									</tbody>
								</table>
							</div>
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
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		// breadcrumb: state.breadcrumb,
		userDetails: state.accountReducer.companyUserDetail,
		deleteUser: state.accountReducer.deleteUser,
		updateUserStatus: state.accountReducer.updateUserStatus,
		activityByUser: state.accountReducer.activityByUser
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(crumbActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);