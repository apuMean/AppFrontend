import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Select from 'react-select';
class AddCompanyModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.addCompanyModalId} className="modal fade bs-modal-md" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-md">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
							<div className="actions">
								<h5 className="modal-title">Add Customer</h5>
							</div>
						</div>
						<div className="modal-body">
							<form role="form">
								<div className="form-body">
									<div className="row">
										<div className="col-md-6 col-sm-6 col-xs-12">
											<div className="form-group form-md-line-input form-md-floating-label  customerForm">
												<input
													type="text"
													className="form-control customerForm"
													id="new_customer"
													name="new_customer"
													ref="new_customer"
													defaultValue='' />
												<label htmlFor="customer">Company<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-md-6 col-sm-6 col-xs-12">
											<div className="form-group form-md-line-input form-md-floating-label">
												{/* <label htmlFor="salesrep">Parent Company
                                                </label> */}
												<Select
													value={this.props.customerValue}
													valueKey='id'
													placeholder="Parent company"
													name="customer"
													id="customer"
													options={this.props.customerOptions}
													onChange={this.props.handleCustomerChange}
													onBlur={this.props.handleSelectsBlur ? this.props.handleSelectsBlur : null}
													onInputChange={this.props.onCompanyInputChange} />
											</div>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn red">Cancel</button>
							<button type="button" className="btn green"
								id="send-invite-button" onClick={this.props.companyAddhandler} >Add</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddCompanyModal;