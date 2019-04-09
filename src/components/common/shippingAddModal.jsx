import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddShipping extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div id={this.props.shippingAddId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog ">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">Add Shipping</span>
							</div>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											type="text"
											className="form-control"
											ref="description"
											id="shipping_description"
											name="description" />
										<label htmlFor="description">Desc</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											min={0}
											type="number"
											className="form-control"
											id="shipping_amount"
											ref="amount"
											name="amount" />
										<label htmlFor="amount">Amount<span className="required">*</span></label>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn dark btn-outline">Cancel</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.handleShippingAdd}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddShipping;