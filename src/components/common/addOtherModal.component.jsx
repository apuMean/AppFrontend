import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddOther extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div
				id={this.props.addId}
				className="modal fade bs-modal-sm"
				tabIndex="-1"
				aria-hidden="true">
				<div className="modal-dialog modal-sm">
					<div className="modal-content">
						<div className="modal-header">
							<div className="actions">
								<h5 className="modal-title">Add {this.props.addType}</h5>
							</div>
						</div>
						<div className="modal-body">
							<input
								type="text"
								className="form-control"
								id="addvalue"
								name="addvalue"
								ref="addvalue"
								defaultValue="" />
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
							<button
								type="button"
								className="btn green"
								id="send-invite-button"
								onClick={this.props.handleAddFormat}>Done</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddOther;