import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import SingleInput from '../shared/SingleInput';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import MaskedInput from 'react-text-mask';
import { priceMask } from '../../constants/customMasks';
import '../../styles/bootstrap-fileinput.css';
class AddSupplierModal extends React.Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		return (
			<div id={this.props.addSupplierId} ref={this.props.addSupplierId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<div className="caption">
								<span className="caption-subject bold uppercase">{this.props.headerText}</span>
							</div>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-md-4">
									<SingleInput
										inputType="text"
										parentDivClass="form-group form-md-line-input form-md-floating-label"
										className="form-control"
										id="supplierName"
										title="Name"
										name="supplierName"
										htmlFor="supplierName"
										defaultValue=""
										required={true}
										ref={'supplierName'}
									/>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label">
										<MaskedInput
											mask={priceMask}
											className="form-control"
											guide={false}
											name="listPrice"
											id="listPrice"
											ref="listPrice"
											htmlFor="listPrice"
										/>
										<label htmlFor="listPrice"><span className="required">*</span>List Price</label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label">
										<MaskedInput
											mask={priceMask}
											className="form-control"
											guide={false}
											name="dealerPrice"
											id="dealerPrice"
											ref="dealerPrice"
											htmlFor="dealerPrice"
										/>
										<label htmlFor="dealerPrice"><span className="required">*</span>Dealer Price</label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label">
										<MaskedInput
											mask={priceMask}
											className="form-control"
											guide={false}
											name="demoPrice"
											id="demoPrice"
											ref="demoPrice"
											htmlFor="demoPrice"
										/>
										<label htmlFor="demoPrice">Demo Price</label>
									</div>
								</div>
								<div className="col-md-4">
									<SingleInput
										inputType="number"
										min={0}
										parentDivClass="form-group form-md-line-input form-md-floating-label"
										className="form-control"
										title="Lead time days"
										name="leadTimeDays"
										htmlFor="leadTimeDays"
										defaultValue=""
										required={false}
										ref={'leadTimeDays'}
									/>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label">
										<select className="form-control edited" id="supplySource" ref="supplySource">
											<option value="Retail">Retail</option>
											<option value="Reseller">Reseller</option>
											<option value="Distributor">Distributor</option>
											<option value="Manufacturer">Manufacturer</option>
										</select>
										<label htmlFor="supplySource">Supply source</label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-floating-label">
										<label htmlFor="priceDate">Price Date</label>
										<DateRangePicker
											showDropdowns={true}
											singleDatePicker
											minDate={moment()}
											onApply={this.props.handlePriceDateEvent}>
											<div className="input-group date form_datetime">
												<input
													type="text"
													className="selected-date-range-btn"
													size="16"
													readOnly={true}
													className="form-control"
													defaultValue={this.props.priceDateDisplay}
													key={this.props.priceDateDisplay}
													id="priceDate"
													name="priceDate" />
												<span className="input-group-btn">
													<button className="btn default date-set calendar-shadow-none" type="button">
														<i className="fa fa-calendar"></i>
													</button>
												</span>
											</div>
										</DateRangePicker>
									</div>
								</div>
							</div>
							<div className="caption">
								<span className="caption-subject bold">Price schedule</span>
							</div>
							<div className="row">
								<div className="col-md-3">
									<SingleInput
										inputType="number"
										min={0}
										parentDivClass="form-group form-md-line-input form-md-floating-label"
										className="form-control"
										id="startQty"
										title="Start Qty"
										name="startQty"
										htmlFor="startQty"
										defaultValue=""
										required={false}
										ref={'startQty'}
									/>
								</div>
								<div className="col-md-3">
									<SingleInput
										inputType="number"
										min={0}
										parentDivClass="form-group form-md-line-input form-md-floating-label"
										className="form-control"
										id="endQty"
										title="End Qty"
										name="endQty"
										htmlFor="endQty"
										defaultValue=""
										required={false}
										ref={'endQty'}
									/>
								</div>
								<div className="col-md-3">
									<div className="form-group form-md-line-input form-md-floating-label">
										<MaskedInput
											mask={priceMask}
											className="form-control"
											guide={false}
											name="price"
											id="price"
											ref="price"
											htmlFor="price"
										/>
										<label htmlFor="price">Price</label>
									</div>
								</div>
								<div className="col-md-3" style={{ marginTop: '30px' }}>
									<a onClick={this.props.addPriceSchedule} className="btn btn-icon-only green">
										<i className="fa fa-plus"></i>
									</a>
								</div>
							</div>
							{this.props.priceScheduleDetails.length != 0 ?
								<div className="portlet light portlet-fit portlet-datatable bordered">
									<div className="portlet-body">
										<div className="table-container table-responsive">
											<table className="table table-striped table-bordered table-hover" id="sample_3">
												<thead>
													<tr>
														<th>Start Qty</th>
														<th>End Qty</th>
														<th>Price($)</th>
														<th>Actions</th>
													</tr>
												</thead>
												<tbody>
													{this.props.priceScheduleData}
												</tbody>
											</table>
										</div>
									</div>
								</div> : null}
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn dark btn-outline"
								data-dismiss="modal">Close</button>
							<button
								type="button"
								className="btn green"
								onClick={this.props.addSupplier}>Save</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddSupplierModal;