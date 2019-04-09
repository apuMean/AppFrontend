import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
class AddEstimate extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			itemOptions: [],
			searchedItems: null
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ itemOptions: nextProps.itemOptions, searchedItems: nextProps.searchedItems });
	}

	render() {
		return (
			<div id={this.props.estimateAddId} ref={this.props.estimateAddId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">{this.props.title}</span>
							</div>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input
											type="text"
											className="form-control"
											ref="searchItem"
											name="searchItem"
											id="searchItem"
											autoFocus={true}
											onChange={this.props.onItemInputChange}
										/>
										<label htmlFor="searchItem">Estimate</label>
									</div>
								</div>
								<div className="col-md-12">
									{this.state.itemOptions.length != 0 ?
										<div className="table-container table-responsive" style={{ height: '400px', overflow: 'auto' }}>
											<table className="table table-striped table-bordered">
												<thead >
													<tr>
														<th >Estimate #</th>
														<th >Name</th>
														<th >Company</th>
														<th >Sales Rep</th>
														<th>Action</th>
													</tr>
												</thead>
												<tbody>
													{this.state.searchedItems}
												</tbody>
											</table>
										</div> : null}
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn dark btn-outline"
								onClick={this.props.handlePopUpClose.bind(this, 'item')}>Close</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.estimateForm.bind(this, 'item')}>Create New Estimate</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddEstimate;