import React from 'react';;
class AddOtherProjectSOModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.modalId} className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
				<form role="form" id="addOtherProjectType">
					<div className="modal-dialog modal-sm">

						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true" ></button>
								<div className="actions">
									<h5 className="modal-title">Add {this.props.addType}</h5>
								</div>
							</div>
							<div className="modal-body">
								<input
									type="text"
									className="form-control"
									id="add_value"
									name="add_value"
									ref="add_value"
									defaultValue="" />
							</div>
							<div className="modal-footer">
								<button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
								<button
									type="button"
									className="btn green"
									id="send-invite-button"
									onClick={this.props.handleAddOtherPopup}>Done</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default AddOtherProjectSOModal;