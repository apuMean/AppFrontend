import React from 'react';
import ReactDOM from 'react-dom';
import * as datatable from '../../scripts/table-datatables-buttons';
import '../../styles/plugins/datatables/datatables.min.css';
import '../../styles/custom.css';
import '../../styles/plugins/bootstrap/datatables.bootstrap.css';
import '../../scripts/datatable.js';
import '../../scripts/table-datatables-buttons.js';
import * as functions from '../common/functions';
import moment from 'moment';

export default class UsersTab extends React.Component {
	constructor(props, context) {
		super(props, context);
	}


	render() {
		var actionHead={
			background:'white'
		};
		var companyList = this.props.usersList.map(function (company, index) {
			var userId = 'user_' + company.userId;
			var user_Id = 'user' + company.userId;

			if (company.status == 1) {
				var currentStatus = <span id={userId} className="label label-sm label-success">Enabled</span>;
			} else {
				var currentStatus = <span id={userId} className="label label-sm label-danger">Disabled</span>;
			}
			var partialInvited = <span id={userId} className="label label-sm label-success">Invited</span>;
			var partialInvite = <li><a href="#reinvite-user" onClick={(e) => this.props.resendInviteModalHandler(e, index)}><i className="icon-paper-plane" onClick={(e) => this.props.resendInviteModalHandler(e, index)}></i> Resend Invite </a></li>;
			var partialReset = <li><a href="#reset-user-password" onClick={(e) => this.props.resetPasswordModalHandler(e, index)}><i className="icon-key" onClick={(e) => this.props.resetPasswordModalHandler(e, index)}></i> Reset Password </a></li>;
			var partialEnable = <li><a id={user_Id} href="#disable-user" onClick={(e) => this.props.disableModalHandler(e, index)}><i className="icon-ban" onClick={(e) => this.props.disableModalHandler(e, index)}></i> {company.status ? 'Disable User' : 'Enable User'} </a></li>;
			return <tr key={index}>
				<td onClick={(e) => this.props.userProfileHandler(e, index)}>{company.firstname} {company.lastname}</td>
				<td onClick={(e) => this.props.userProfileHandler(e, index)}><a href={company.email} >{company.email}</a></td>
				<td onClick={(e) => this.props.userProfileHandler(e, index)}>{company.lastLogin ? moment(company.lastLogin).format('LLL') : '-'}</td>
				<td onClick={(e) => this.props.userProfileHandler(e, index)}>{company.isAccepted ? currentStatus : partialInvited}</td>
				<td><div className="btn-group">
					<button className="btn btn-xs green dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false"> Actions<i className="fa fa-angle-down"></i></button>
					<ul className="dropdown-menu" role="menu">
						{company.isAccepted ? partialEnable : ''}
						{company.isAccepted ? partialReset : ''}
						{company.isAccepted ? '' : partialInvite}
						<li><a onClick={(e) => this.props.deleteModalHandler(e, index)}><i className="icon-close" onClick={(e) => this.props.deleteModalHandler(e, index)}></i> Delete User</a></li>
						<li><a onClick={(e) => this.props.userProfileHandler(e, index)}><i className="icon-info" onClick={(e) => this.props.userProfileHandler(e, index)}></i> Details</a></li>
					</ul>
				</div>
				</td>
			</tr>;
		}.bind(this));
		return (<div className="tab-pane" id={this.props.tabId}>
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<i className="icon-users "></i>
						<span className="caption-subject bold uppercase">Users</span>
					</div>

					<div className="actions" id="sample_3_tools">
						<a onClick={this.props.handleInvite} className="btn btn-sm btn-circle green" data-toggle="modal">
							<i className="icon-user-follow"></i> Invite User
						</a>
                        &nbsp;&nbsp;
						<a onClick={this.props.refreshHandler} href="javascript:;" className="btn btn-transparent blue btn-outline btn-circle btn-sm">
							<i className="icon-refresh"></i>
						</a>
                        &nbsp;&nbsp;
						<a href="javascript:;" data-action="1" className="tool-action btn btn-transparent blue btn-outline btn-circle btn-sm">
							<i className="icon-docs"></i>
						</a>
                        &nbsp;&nbsp;
						<a href="javascript:;" data-action="0" className="tool-action btn btn-transparent blue btn-outline btn-circle btn-sm">
							<i className="icon-printer"></i>
						</a>
                        &nbsp;&nbsp;
						<div className="btn-group">
							<a className="btn blue btn-circle" href="javascript:;" data-toggle="dropdown">
								<i className="fa fa-share"></i>
								<span className="hidden-xs"> Export </span>
								<i className="fa fa-angle-down"></i>
							</a>
							<ul className="dropdown-menu pull-right">
								<li>
									<a href="javascript:;" data-action="2" className="tool-action">
										<i className="icon-doc"></i> PDF
									</a>
								</li>
								<li>
									<a href="javascript:;" data-action="3" className="tool-action">
										<i className="icon-paper-clip"></i> Excel
									</a>
								</li>
								<li>
									<a href="javascript:;" data-action="4" className="tool-action">
										<i className="icon-cloud-upload"></i> CSV
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container">
						<table className="table table-striped table-bordered table-hover" id="invited_list">
						{/* <table className="table table-striped table-bordered table-hover" id="sample_3"> */}
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Last Login</th>
									<th>Status</th>
									<th style={actionHead}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{companyList}
							</tbody>
						</table>
					</div>
				</div>
			</div>

		</div>);
	}
}
