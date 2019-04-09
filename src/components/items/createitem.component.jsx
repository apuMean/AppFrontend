import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import TextareaAutosize from 'react-autosize-textarea';
import Select from 'react-select';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import * as itemAction from '../../actions/itemAction.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import jQuery from 'jquery';
import autoBind from 'react-autobind';
import * as layout from '../../scripts/app';
import '../../styles/bootstrap-fileinput.css';
import * as functions from '../common/functions';
import { isValidImage } from '../shared/isValidImage';
import AddSupplierModal from './../common/addSupplierModal';
import * as message from '../../constants/messageConstants';

class CreateItem extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			priceScheduleDetails: [],
			supplierDetails: [],
			priceDateDisplay: '',
			isImage: false,
			headerText: '',
			updateSupplierIndex: -1,
			priceScheduleIndex: ''
		};
		autoBind(this);
	}

	componentWillMount() {
		var data1 = {
			parent: 'Materials',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data1);
	}

	componentDidMount() {
		appValid
			.FormValidationMd
			.init();
		layout
			.FloatLabel
			.init();
	}

	removePriceSchedule(index) {
		var priceSchedule = this.state.priceScheduleDetails[index];
		this.setState({ currentRecordState: priceSchedule });
		this.state.priceScheduleDetails.splice(index, 1);
		this.setState({
			priceScheduleDetails: this.state.priceScheduleDetails
		});
	}

	removeSupplier(index) {
		var supplierData = this.state.supplierDetails[index];
		this.setState({ currentRecordState: supplierData });
		this.state.supplierDetails.splice(index, 1);
		this.setState({
			supplierDetails: this.state.supplierDetails
		});
	}

	componentWillReceiveProps(nextProps) {
		layout.FloatLabel.init();
	}

	addPriceSchedule() {
		toastr.remove();
		let supplierData = {
			supplierName: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value,
			listPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value).replace(/[^0-9.]/g, ''),
			dealerPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value).replace(/[^0-9.]/g, ''),
		};
		let data = {
			startQty: ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value.trim(),
			endQty: ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value.trim(),
			price: (ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value.trim()).replace(/[^0-9.]/g, '')
		};
		if (supplierData.supplierName !== '' && supplierData.listPrice !== '' && supplierData.dealerPrice !== '') {
			if (data.startQty == '') {
				toastr.error(message.START_QTY);
			}
			else if (data.startQty < 1) {
				toastr.error(message.START_QTY_GREATER);
			}
			else if (data.endQty == '') {
				toastr.error(message.END_QTY);
			}
			else if (data.endQty < 1) {
				toastr.error(message.END_QTY_GREATER);
			}
			else if (data.price == '') {
				toastr.error(message.REQUIRED_PRICE);
			}
			else if (data.price < 1) {
				toastr.error(message.PRICE_GREATER);
			}
			else {
				if (this.state.priceScheduleIndex !== '') {
					var priceSchedule = this.state.priceScheduleDetails[this.state.priceScheduleIndex];
					priceSchedule.startQty = data.startQty;
					priceSchedule.endQty = data.endQty;
					priceSchedule.price = data.price;
					this.setState({ priceScheduleDetails: this.state.priceScheduleDetails, priceScheduleIndex: '' });
				} else {
					this.state.priceScheduleDetails.push(data);
					var updatedData = this.state.priceScheduleDetails;
					this.setState({ priceScheduleDetails: updatedData });
				}
				ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value = '';
			}
		}
		else {
			toastr.error(message.REQUIRED_SUPPLIER_DETAILS);
		}
	}

	editPriceSchedule(index) {
		var priceSchedule = this.state.priceScheduleDetails[index];
		this.setState({ priceScheduleIndex: index });
		ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = priceSchedule.startQty;
		ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = priceSchedule.endQty;
		ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value = priceSchedule.price;
		setTimeout(function () {
			layout.FloatLabel.init();
		}, 400);
	}

	addSupplier(e) {
		toastr.remove();
		e.preventDefault();
		let data = {
			supplierName: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value,
			listPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value).replace(/[^0-9.]/g, ''),
			dealerPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value).replace(/[^0-9.]/g, ''),
			demoPrice: (ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value).replace(/[^0-9.]/g, ''),
			leadTimedays: parseInt(ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value),
			supplySource: ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value,
			priceDate: this.state.priceDateDisplay,
			schedule: this.state.priceScheduleDetails
		};
		if (data.supplierName.trim() == '') {
			toastr.error(message.REQUIRED_SUPPLIER_NAME);
		} else if (data.listPrice == '') {
			toastr.error(message.REQUIRED_LIST_PRICE);
		} else if (data.listPrice < 1) {
			toastr.error(message.LIST_PRICE_GREATER);
		} else if (data.dealerPrice == '') {
			toastr.error(message.REQUIRED_DEALER_PRICE);
		} else if (data.dealerPrice < 1) {
			toastr.error(message.DEALER_PRICE_GREATER);
		} else if (data.demoPrice && (data.demoPrice < 1)) {
			toastr.error(message.DEMO_PRICE_GREATER);
		} else if (data.leadTimedays && (data.leadTimedays < 1)) {
			toastr.error(message.LEAD_TIME_GREATER);
		}
		else {
			if (this.state.updateSupplierIndex > -1) {
				const newSupplierArray = this.state.supplierDetails;
				newSupplierArray[this.state.updateSupplierIndex] = data;
				this.setState({
					supplierDetails: newSupplierArray,
					updateSupplierIndex: -1,
					priceScheduleDetails: [],
					priceDateDisplay: ''
				});
			}
			else {
				this.state.supplierDetails.push(data);
				var updatedData = this.state.supplierDetails;
				this.setState({
					supplierDetails: updatedData
				});
				ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value = '';
				ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value = '';
				this.setState({
					priceScheduleDetails: [],
					priceDateDisplay: ''
				});
				layout.FloatLabel.init();
			}
			let el = ReactDOM.findDOMNode(this.refs.sup_add);
			$(el).modal('hide');
		}
	}

	handlePriceDateEvent(event, picker) {
		var displayDate = picker.startDate.format('MM/DD/YYYY');
		this.setState({ priceDateDisplay: displayDate });
		layout.FloatLabel.init();
	}

	itemHandler() {
		toastr.remove();
		if (jQuery('#createItem').valid()) {
			if (this.state.supplierDetails.length !== 0) {
				var itemDetails = {
					companyId: localStorage.companyId,
					itemName: ReactDOM
						.findDOMNode(this.refs.item_name.refs.item_name)
						.value,
					modal: ReactDOM
						.findDOMNode(this.refs.item_modalNo.refs.item_modalNo)
						.value,
					partNumber: ReactDOM
						.findDOMNode(this.refs.item_partNo.refs.item_partNo)
						.value,
					itemCategory: ReactDOM
						.findDOMNode(this.refs.category.refs.category)
						.value,
					series: ReactDOM
						.findDOMNode(this.refs.series.refs.series)
						.value,
					manufacturer: ReactDOM
						.findDOMNode(this.refs.item_manufacturer.refs.item_manufacturer)
						.value,
					description: ReactDOM
						.findDOMNode(this.refs.item_description)
						.value,
					notes: ReactDOM
						.findDOMNode(this.refs.item_notes)
						.value,
					labourHours: ReactDOM
						.findDOMNode(this.refs.labourHrs.refs.labourHrs)
						.value,
					itemStatus: ReactDOM
						.findDOMNode(this.refs.status)
						.value,
					suppliers: this.state.supplierDetails,
					manufactureWarranty: ReactDOM
						.findDOMNode(this.refs.mfgWarranty.refs.mfgWarranty)
						.value,
					priceDate: this.state.priceDateDisplay,
					mfgUrl: ReactDOM
						.findDOMNode(this.refs.mfgUrl.refs.mfgUrl)
						.value,
					createdBy: localStorage.userName
				};
				var picData = ReactDOM
					.findDOMNode(this.refs.itemFileUpload)
					.files[0];
				this.props.actions.createItem(itemDetails, picData);
				functions.showLoader('create_item');
			}
			else {
				toastr.error(message.MIN_SUPPLIER);
			}
		}
	}

	imageUpdateHandler(event) {

		var file = document.querySelector('input[type=file]').files[0];
		if (!isValidImage(file.name)) {
			console.log('');
		} else {
			var reader = new FileReader();
			reader.addEventListener('load', function () {
				let image = document.getElementById('uplodedImage');
				image.src = reader.result;
			}, false);

			if (file) {
				reader.readAsDataURL(file);
			}
			this.setState({ isImage: true });
		}
	}

	imageRemoveHandler() {
		let image = document.getElementById('uplodedImage');
		image.src = require('../../img/itemlogo.png');
		this.setState({ isImage: false });
		ReactDOM.findDOMNode(this.refs.itemFileUpload).value = '';
	}

	handleSupplierModal(e) {
		e.preventDefault();
		let el = ReactDOM.findDOMNode(this.refs.sup_add);
		$(el).modal('show');
		this.clearFields();
	}

	editSupplier(index) {
		let currentSupplierData = this.state.supplierDetails[index];
		this.setState({
			updateSupplierIndex: index,
			priceDateDisplay: currentSupplierData.priceDate ? currentSupplierData.priceDate : '',
			headerText: 'Update Supplier'
		});
		ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value = currentSupplierData.supplierName ? currentSupplierData.supplierName : '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value = currentSupplierData.listPrice ? currentSupplierData.listPrice : '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value = currentSupplierData.dealerPrice ? currentSupplierData.dealerPrice : '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value = currentSupplierData.demoPrice ? currentSupplierData.demoPrice : '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value = currentSupplierData.leadTimedays ? currentSupplierData.leadTimedays : '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value = currentSupplierData.supplySource ? currentSupplierData.supplySource : 'Retail';

		if (currentSupplierData.schedule.length != 0) {
			this.setState({ priceScheduleDetails: currentSupplierData.schedule });
		} else {
			this.setState({ priceScheduleDetails: [] });
		}
		setTimeout(function () {
			layout.FloatLabel.init();
		}, 400);

		let el = ReactDOM.findDOMNode(this.refs.sup_add);
		$(el).modal('show');
	}

	clearFields() {
		ReactDOM.findDOMNode(this.refs.sup_add.refs.supplierName.refs.supplierName).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.listPrice.inputElement).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.dealerPrice.inputElement).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.demoPrice.inputElement).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.leadTimeDays.refs.leadTimeDays).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.supplySource).value = 'Retail';

		ReactDOM.findDOMNode(this.refs.sup_add.refs.startQty.refs.startQty).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.endQty.refs.endQty).value = '';
		ReactDOM.findDOMNode(this.refs.sup_add.refs.price.inputElement).value = '';
		this.setState({
			priceScheduleDetails: [],
			updateSupplierIndex: -1,
			priceDateDisplay: '',
			headerText: 'Add Supplier'
		});
	}

	render() {
		var priceScheduleData = this
			.state
			.priceScheduleDetails
			.map(function (schedule, index) {
				return <tr key={index}>
					<td>{schedule.startQty}</td>
					<td>{schedule.endQty}</td>
					<td>{schedule.price}</td>
					<td>
						<span className="btn btn-icon-only purple" onClick={this.editPriceSchedule.bind(this, index)}><i className="fa fa-pencil" ></i></span>&nbsp;&nbsp;&nbsp;
						<span className="btn btn-icon-only red" onClick={this.removePriceSchedule.bind(this, index)}><i className="fa fa-trash-o" ></i></span>
					</td>
				</tr>;
			}.bind(this));
		var supplierData = this
			.state
			.supplierDetails
			.map(function (supplier, index) {
				return <tr key={index}>
					<td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
					<td>{supplier.listPrice ? supplier.listPrice : '-'}</td>
					<td>{supplier.dealerPrice ? supplier.dealerPrice : '-'}</td>
					<td>{supplier.demoPrice ? supplier.demoPrice : '-'}</td>
					<td>{supplier.leadTimedays ? supplier.leadTimedays : '-'}</td>
					<td>{supplier.priceDate ? supplier.priceDate : '-'}</td>
					<td>{supplier.supplySource ? supplier.supplySource : '-'}</td>
					<td>
						<span className="btn btn-icon-only purple" onClick={this.editSupplier.bind(this, index)}><i className="fa fa-pencil" ></i></span>&nbsp;&nbsp;&nbsp;
						<span className="btn btn-icon-only red" onClick={this.removeSupplier.bind(this, index)}><i className="fa fa-trash-o" ></i></span>
					</td>
				</tr>;
			}.bind(this));

		return (
			<div>
				<div className="portlet-title tabbable-line">
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#item-add" data-toggle="tab">
                                Material
							</a>
						</li>
						<div className="form-actions noborder text-right">
							<Link to="/material" className="btn red">
                                Cancel
							</Link>&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.itemHandler}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="create_item">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="item-add">
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject bold uppercase">General Details</span>
									</div>
								</div>
								<form role="form" id="createItem">
									<div className="form-body">
										<div className="row">
											<div className="col-md-9" style={{ marginLeft: '-15px' }}>
												<div className="col-md-6">
													<SingleInput
														inputType="text"
														parentDivClass="form-group form-md-line-input form-md-floating-label"
														className="form-control"
														title="Name"
														name="item_name"
														htmlFor="item_name"
														defaultValue=""
														required={true}
														ref={'item_name'}
													/>
												</div>
												<div className="col-md-6">
													<SingleInput
														inputType="text"
														parentDivClass="form-group form-md-line-input form-md-floating-label"
														className="form-control"
														title="Model No"
														name="item_modalNo"
														htmlFor="item_modalNo"
														defaultValue=""
														required={true}
														ref={'item_modalNo'}
													/>
												</div>
												<div className="col-md-6">
													<SingleInput
														inputType="text"
														parentDivClass="form-group form-md-line-input form-md-floating-label"
														className="form-control"
														title="Part No"
														name="item_partNo"
														htmlFor="item_partNo"
														defaultValue=""
														required={false}
														ref={'item_partNo'}
													/>
												</div>
												<div className="col-md-6">
													<SingleInput
														inputType="text"
														parentDivClass="form-group form-md-line-input form-md-floating-label"
														className="form-control"
														title="Mfg"
														name="item_manufacturer"
														htmlFor="item_manufacturer"
														defaultValue=""
														required={true}
														ref={'item_manufacturer'}
													/>
												</div>
												<div className="col-md-6">
													<SingleInput
														inputType="text"
														parentDivClass="form-group form-md-line-input form-md-floating-label"
														className="form-control"
														title="Category"
														name="category"
														htmlFor="category"
														defaultValue=""
														required={false}
														ref={'category'}
													/>
												</div>
											</div>
											<div className="col-md-3">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="fileinput fileinput-exists" data-provides="fileinput">
														<div
															className="fileinput-preview thumbnail"
															data-trigger="fileinput"
															style={{
																width: 200,
																height: 150
															}}>
															<img
																src={require('../../img/itemlogo.png')}
																className="img-responsive"
																ref="uplodedImage"
																id="uplodedImage"
																alt="Logo" />
														</div>
														<div>
															<span className="btn red btn-sm btn-outline btn-file">
																<span className="fileinput-new">
                                                                    Select
																</span>
																<span className="fileinput-exists">
                                                                    Change
																</span>

																<input
																	type="file"
																	name="itemFileUpload"
																	ref="itemFileUpload"
																	id="itemFileUpload"
																	accept='image/*'
																	onChange={this.imageUpdateHandler} />
															</span>
															{this.state.isImage ? <a
																href="javascript:;"
																className="btn red btn-sm"
																onClick={this.imageRemoveHandler}>
                                                                Remove
															</a> : null}
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-4">
												<SingleInput
													inputType="number"
													min={0}
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Labor Hrs"
													name="labourHrs"
													htmlFor="labourHrs"
													defaultValue=""
													required={false}
													ref={'labourHrs'}
												/>
											</div>
											<div className="col-md-4">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Manufacture Warranty"
													name="mfgWarranty"
													htmlFor="mfgWarranty"
													defaultValue=""
													required={false}
													ref={'mfgWarranty'}
												/>
											</div>
											<div className="col-md-4">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Series"
													name="series"
													htmlFor="series"
													defaultValue=""
													required={false}
													ref={'series'}
												/>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }} 
														type="text"
														className="form-control"
														ref="item_description"
														name="item_description"
														defaultValue=""
														rows={3}>
													</TextareaAutosize>
													<label htmlFor="item_description">Description</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }} 
														type="text"
														className="form-control"
														ref="item_notes"
														name="item_notes"
														defaultValue=""
														rows={3}></TextareaAutosize>
													<label htmlFor="item_notes">Notes</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select className="form-control edited" id="status" ref="status">
														<option value="Upcoming">Upcoming</option>
														<option value="Active">Active</option>
														<option value="Retired">Retired</option>
														<option value="Retiring">Retiring</option>
													</select>
													<label htmlFor="status">Status<span className="required">*</span></label>
												</div>
											</div>
											<div className="col-md-6">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Mfg Url"
													name="mfgUrl"
													htmlFor="mfgUrl"
													defaultValue=""
													required={false}
													ref={'mfgUrl'}
												/>
											</div>
										</div>
										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Suppliers</span>
											</div>
											<div className="row">
												<div className="col-md-4 col-md-offset-10" style={{ marginBottom: '10px' }}>
													<button onClick={this.handleSupplierModal} className="btn green">
                                                        Add supplier
													</button>
												</div>
											</div>
										</div>
										<AddSupplierModal
											addSupplierId="sup_add"
											ref="sup_add"
											handlePriceDateEvent={this.handlePriceDateEvent}
											priceDateDisplay={this.state.priceDateDisplay}
											addPriceSchedule={this.addPriceSchedule}
											addSupplier={this.addSupplier}
											priceScheduleDetails={this.state.priceScheduleDetails}
											priceScheduleData={priceScheduleData}
											headerText={this.state.headerText}
										/>

										<div className="row">
											<div className="portlet light portlet-fit portlet-datatable bordered">
												<div className="portlet-body">
													<div className="table-container table-responsive">
														<table className="table table-striped table-bordered table-hover" id="sample_3">
															<thead>
																<tr>
																	<th>Supplier</th>
																	<th>List($)</th>
																	<th>Dealer($)</th>
																	<th>Demo($)</th>
																	<th>Lead Time</th>
																	<th>Price Date</th>
																	<th>Source</th>
																	<th>Action</th>
																</tr>
															</thead>
															<tbody>
																{supplierData}
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		itemList: state.itemCreation.itemList,
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(itemAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateItem);