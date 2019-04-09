import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddRevision extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.revisionModalId} className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-sm">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 className="modal-title">Add Revision</h4>
						</div>
						<div className="modal-body">
							<div className="form-group form-md-radios">
								<label>#{'Rev'+this.props.revisionNo}</label>
								<div className="md-radio-list">
									<div className="md-radio">
										<input type="radio"
											id="radio6" name="radio6"
											className="md-radiobtn"
											checked={this.props.isCheckedEmpty}
											onChange={this.props.radioHandler.bind(this, 'EMPTY')} />
										<label htmlFor="radio6">
											<span></span>
											<span className="check"></span>
											<span className="box"></span> Create empty revision with no line items. </label>
									</div>
									<div className="md-radio">
										<input type="radio"
											id="radio7"
											name="radio7" className="md-radiobtn"
											checked={this.props.isCheckedDuplicate}
											onChange={this.props.radioHandler.bind(this, 'DUPLICATE')} />
										<label htmlFor="radio7">
											<span></span>
											<span className="check"></span>
											<span className="box"></span> Duplicate line items from. </label>
									</div>
								</div>
								<div className="form-group form-md-line-input form-md-floating-label">
									<select disabled={!this.props.isCheckedDuplicate} defaultValue='' ref="revision_name"
										className="form-control">
										<option value='0'>Select</option>
										{this.props.revisedItems}
									</select>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn red btn-outline">Cancel</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.addRevision}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddRevision;