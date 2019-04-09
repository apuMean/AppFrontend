import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class CreateEstimateModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	
	render() {
		return (
			<div id={this.props.modalId} ref={this.props.modalId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-md">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">{this.props.title}</span>
							</div>
						</div>
						<form role="form" id="estimateName">
							<div className="modal-body">
								<div className="row">
									<div className="col-md-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<input
												type="text"
												name='ename'
												ref='ename'
												className="form-control"											
												onChange={this.props.inputChange}
											/>
											<label htmlFor="searchItem">Estimate Name <span className="required">*</span></label>
                                            
										</div>
									</div>
							
								</div>
							</div>
						</form>
						<div className="modal-footer">
							<button
								type="button"
								className="btn dark btn-outline"
								onClick={this.props.handleModalClose}
							>Cancel</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.saveEstimateName}
							>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CreateEstimateModal;