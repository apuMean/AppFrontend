import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddHeader extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		return (
			<div id={this.props.headerAddId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog ">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">Add Sub-Header</span>
							</div>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											type="text"
											className="form-control"
											id="subheader"
											ref="subheader"
											name="subheader"
										/>
										<label htmlFor="subheader">Sub-header</label>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn dark btn-outline">Cancel</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.handleHeaderAdd}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddHeader;