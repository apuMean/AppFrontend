import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import InputMask from 'react-input-mask';
import '../../styles/bootstrap-fileinput.css';
class AddContactModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.addContactModalId} className="modal fade bs-modal-md" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-md">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
							<div className="actions">
								<h5 className="modal-title">Add Contact</h5>
							</div>
						</div>
						<div className="modal-body">
							<form role="form" id="add_proposal_contact">
								<div className="form-body">
									<div className="row">
										<div className="col-md-12">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="new_company"
													name="new_company"
													ref="new_company"
													readOnly={true}
													value={this.props.companyValue ? this.props.companyValue.label : ''}
													key={this.props.companyValue} />
												<label htmlFor="company">Company<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="first_name"
													maxLength="100"
													name="first_name"
													ref="first_name"
													defaultValue=""
												/>
												<label htmlFor="first_name">First name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label  contactForm">
												<input
													type="text"
													className="form-control contactForm"
													id="last_name"
													maxLength="100"
													name="last_name"
													ref="last_name"
													defaultValue="" />
												<label htmlFor="last_name">Last name<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<input
													type="email"
													className="form-control contactForm"
													id="new_email"
													name="new_email"
													ref="new_email"
													defaultValue="" />
												<label htmlFor="email">Email</label>
											</div>
										</div>
										{/* <div className="col-md-6">
                                            <div className="form-group form-md-line-input form-md-floating-label contactForm">
                                                <input
                                                    type="number"
                                                    minLength="10"
                                                    maxLength="10"
                                                    className="form-control contactForm"
                                                    id="new_phone"
                                                    name="new_phone"
                                                    ref="new_phone"
                                                    defaultValue="" />
                                                <label htmlFor="phone">Phone<span className="required">*</span></label>
                                            </div>
                                        </div> */}
										<div className="col-md-6">
											<div className="form-group form-md-line-input form-md-floating-label contactForm">
												<InputMask
													className="form-control contactForm"
													id="new_phone"
													ref="new_phone"
													value={this.props.phoneValue}
													onChange={this.props.handleContactPhoneChange}
													name="new_phone" mask="(999) 999-9999  x99999" />
												<label htmlFor="form_control_1">Phone</label>
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn red">Cancel</button>
							<button type="button" className="btn green"
								id="send-invite-button" onClick={this.props.contactAddhandler} >Add</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddContactModal;