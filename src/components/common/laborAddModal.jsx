import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddLabor extends React.Component {
	constructor(props, context) {
		super(props, context);
	}

	render() {
		let labor = this.props.laborOptions ? this.props.laborOptions : [];
		let laborData = labor.map(function (labor, index) {
			return <option value={labor._id}>{labor.laborType}</option>;
		}.bind(this));
		return (
			<div id={this.props.laborAddId} ref={this.props.laborAddId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog ">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">Add Labor</span>
							</div>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-12 col-sm-12 col-xs-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											type="text"
											className="form-control"
											ref="labor_description"
											id="labor_description"
											name="labor_description" />
										<label htmlFor="labor_description">Desc</label>
									</div>
								</div>
								{/*<div className="col-md-6 col-sm-6 col-xs-12">
                                    <div className="form-group form-md-line-input form-md-floating-label">
                                        <input
                                            type="number"
                                            min={0}
                                            className="form-control"
                                            ref="labor_quantity"
                                            id="labor_quantity"
                                            name="labor_quantity" />
                                        <label htmlFor="labor_quantity">Quantity</label>
                                    </div>
                                    </div>*/}
								{this.props.laborValue ? [<div className="col-md-6 col-sm-6 col-xs-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<select
											value={this.props.laborValue}
											onChange={this.props.handleModalLabor}
											name="labor_type"
											ref="labor_type"
											className="form-control">
											{laborData}
										</select>
										<label htmlFor="labor_type">Labor Type</label>
									</div>
								</div>,
								<div className="col-md-6 col-sm-6 col-xs-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											type="number"
											min={0}
											className="form-control"
											ref="labor_hours"
											id="labor_hours"
											name="labor_hours" />
										<label htmlFor="labor_hours">Labor hours</label>
									</div>
								</div>] : null}
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" data-dismiss="modal" className="btn dark btn-outline">Cancel</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.handleLaborAdd}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddLabor;