import React,{Component} from 'react';
import Select from 'react-select';

export default class InviteUserModal extends Component{
	constructor(props, context) {
		super(props, context);
	}
   
	render(){
		return(
			<div id="invite-user" className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={this.props.clearForm}></button>
							<h4 className="modal-title">Invite User</h4>
						</div>
						<div className="modal-body">
							<form role="form" id="inviteUserForm" ref="form">
								<div className="form-body">
									<h4 className="form-section">Enter new user details below</h4>
									<div className="row">
										<div className="col-md-6">
											<div className="form-group inviteForm form-md-line-input form-md-floating-label">
												<input type="text" ref="firstname" maxLength="100" className="form-control" id="invitefirstname" name="firstname" />
												<label htmlFor="firstname">First Name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group inviteForm form-md-line-input form-md-floating-label">
												<input type="text" ref="lastname" maxLength="100" className="form-control" id="invitelastname" name="lastname" />
												<label htmlFor="lastname">Last Name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group inviteForm form-md-line-input form-md-floating-label">
												<input type="email" ref="email"  maxLength="100" className="form-control" id="inviteemail" name="email" />
												<label htmlFor="email">Email<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group inviteForm  form-md-floating-label">
												<label htmlFor="role">Role<span className="required">*</span></label>
												<Select
													multi
													value={this.props.rolesValue}
													placeholder="Select roles"
													options={this.props.rolesOptions}
													onChange={this.props.handleRolesChange}
													required={true}
												/>
                                       
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn dark btn-outline" onClick={this.props.clearForm} >Cancel</button>
							<button type="button" className="btn green" id="send-invite-button" onClick={this.props.inviteUserHandler}>Send Invite</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
