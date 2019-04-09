import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { browserHistory } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
import { connect } from 'react-redux';
import DeleteModal from '../common/deleteModal.component.js';
import * as loader from '../../constants/actionTypes.js';
import * as itemAction from '../../actions/itemAction.js';
import { bindActionCreators } from 'redux';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class ItemDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			itemStateData: '',
			supplierStateData: [],
			itemId: '',
			breadcrumb: true
		};
	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		if (nextProps.itemDetail) {
			let itemData = JSON.parse(JSON.stringify(nextProps.itemDetail.item));
			if (this.state.breadcrumb && itemData.modal) {
				var data = {
					parent: <Link to='/material'>Materials</Link>,
					childone: itemData.modal,
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}
			if (itemData) {
				let supplierData = nextProps.itemDetail.supplierdata ? JSON.parse(JSON.stringify(nextProps.itemDetail.supplierdata)) : [];
				this.setState({
					itemStateData: itemData,
					supplierStateData: supplierData
				});
				const el = findDOMNode(self.refs.itemList);
				$(el).unblock();
			}
			else {
				browserHistory.push('/material');
				toastr.error('Item not found!');
			}
		}
	}

	componentWillMount() {
		let materialId = {
			itemId: this.props.params.materialId
		};
		this.props.actions.getItemDetailValues(materialId);
	}

	componentDidMount() {
		functions.showLoader('itemList');
	}

	handleDelete() {
		this.setState({ itemId: this.props.params.materialId });
		$('#item_delete').modal('show');
	}

	deleteItemHandler() {
		if (this.state.itemId) {
			$('#item_delete').modal('hide');
			functions.showLoader('itemList');
			var data = {
				itemId: this.state.itemId
			};
			this.props.actions.deleteItem(data);
		}
	}

	render() {
		let itemData = this.state.itemStateData;
		var supplierData = this.state.supplierStateData.map(function (supplier, index) {
			return <tr key={index}>
				<td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
				<td>{supplier.listPrice ? '$' + supplier.listPrice : '-'}</td>
				<td>{supplier.dealerPrice ? '$' + supplier.dealerPrice : '-'}</td>
				<td>{supplier.demoPrice ? '$' + supplier.demoPrice : '-'}</td>
				<td>{supplier.leadTimeDays ? supplier.leadTimeDays : '-'}</td>
				<td>{supplier.priceDate ? moment(supplier.priceDate).format('LLL') : '-'}</td>
				<td>{supplier.supplySource ? supplier.supplySource : '-'}</td>
				<td>{supplier.priceSchedule.length != 0 ?
					<table className="table table-striped table-bordered table-hover">
						<thead>
							<tr>
								<th>Start Qty</th>
								<th>End Qty</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{supplier.priceSchedule.map((pricedata, index) => <tr key={index}>
								<td>{pricedata.startQty}</td>
								<td>{pricedata.endQty}</td>
								<td>{pricedata.price}</td>
							</tr>)}
						</tbody>
					</table> : '-'}
				</td>
			</tr>;
		}.bind(this));
		return (
			<div>
				<div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#item-add" data-toggle="tab"> Material </a>
							</li>
							<li>
								<a href="#item-moreinfo" data-toggle="tab"> More Info </a>
							</li>
							<li>
								<a href="#item-tools" data-toggle="tab"> Tools </a>
							</li>
							<div className="text-right">
								<Link to="/material" className="btn btn-sm btn-circle red">
                                    Cancel </Link>&nbsp;&nbsp;
								<button type="button" className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                    Delete </button>&nbsp;&nbsp;
								<Link to={'/material/' + this.props.params.materialId + '/edit'} className="btn btn-sm btn-circle green">
                                    Edit </Link>&nbsp;&nbsp;
								{/* <div className="btn-group">
                                    <a className="btn btn-sm btn-circle blue" href="javascript:;" data-toggle="dropdown">
                                        <span className="hidden-xs"> Material Options </span>
                                        <i className="fa fa-angle-down"></i>
                                    </a>
                                    <ul className="dropdown-menu pull-right" >
                                        <li >
                                            <Link to={"/materialestimates/" + this.props.params.materialId} className="tool-action">
                                                Estimates</Link>
                                        </li>
                                        <li >
                                            <Link to={"/materialorders/" + this.props.params.materialId} className="tool-action">
                                                Service Orders</Link>
                                        </li>
                                        <li >
                                            <Link to={"/materialinvoices/" + this.props.params.materialId} className="tool-action">
                                                Invoices</Link>
                                        </li>
                                        <li >
                                            <Link to={"/materialinventory/" + this.props.params.materialId} className="tool-action">
                                                Inventory Log</Link>
                                        </li>
                                        <li >
                                            <Link to={"/materialassembly/" + this.props.params.materialId} className="tool-action">
                                                Related Assemblies</Link>
                                        </li>

                                    </ul>
                                </div> */}
							</div>
						</ul>
					</div>
					<div className="portlet light bordered" id="itemList" ref="itemList">
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
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{itemData.itemName ? itemData.itemName : '-'}</div>
															<label htmlFor="item_name">Name</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{itemData.modal ? itemData.modal : '-'}</div>
															<label htmlFor="item_modalNo">Model No</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{itemData.partNumber ? itemData.partNumber : '-'}</div>
															<label htmlFor="item_partNo">Part No</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{itemData.manufacturer ? itemData.manufacturer : '-'}</div>
															<label htmlFor="item_manufacturer">Mfg</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{itemData.itemCategory ? itemData.itemCategory : '-'}</div>
															<label htmlFor="category">Category</label>
														</div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="fileinput fileinput-exists" data-provides="fileinput">
															<div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ width: 200, height: 150 }}>
																<img src={itemData.itemImage ? itemData.itemImage : require('../../img/itemlogo.png')} className="img-responsive" alt="Logo" />
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{itemData.mfgUrl ?
																<a style={{ wordBreak: 'break-word'}} onClick={(event) => { event.preventDefault(); window.open('//' + itemData.mfgUrl); }} target="_blank">{itemData.mfgUrl}
																</a> : '-'}
														</div>
														<label htmlFor="series">Mfg Url</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">{itemData.series ? itemData.series : '-'}</div>
														<label htmlFor="series">Series</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">{itemData.labourHour ? itemData.labourHour : '-'}</div>
														<label htmlFor="labourHrs">Labor Hrs</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">{itemData.manufactureWarranty ? itemData.manufactureWarranty : '-'}</div>
														<label htmlFor="mfgWarranty">Manufacture Warranty</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">{itemData.itemStatus ? itemData.itemStatus : '-'}</div>
														<label htmlFor="status">Status</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{itemData.description ? itemData.description : '-'}</div>
														<label htmlFor="item_description">Description</label>
													</div>
												</div>
												<div className="col-md-4">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{itemData.notes ? itemData.notes : '-'}</div>
														<label htmlFor="item_notes">Notes</label>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="caption">
												<span className="caption-subject bold">Suppliers</span>
											</div>
											<div className="portlet light portlet-fit portlet-datatable bordered">
												<div className="portlet-body">
													<div className="table-container table-responsive">
														<table className="table table-striped table-bordered table-hover">
															<thead>
																<tr>
																	<th>Name</th>
																	<th>List Price</th>
																	<th>Dealer Price</th>
																	<th>Demo Price</th>
																	<th>Lead Time</th>
																	<th>Price Date</th>
																	<th>Source</th>
																	<th>Price Schedule</th>
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
									</form>
								</div>
								<div className="tab-pane" id="item-moreinfo">
									<div className="portlet-title tabbable-line">
										<div className="caption">
											<span className="caption-subject font-dark bold uppercase">Other Details</span>
										</div>
									</div>
									<div className="portlet-body">
										<div className="tab-content">
											<form action="#" className="horizontal-form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-7">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">{itemData.createdBy ? itemData.createdBy : '-'}</div>
																<label htmlFor="form_control_1">Created By</label>
															</div>
														</div>
														<div className="col-md-5">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {itemData.createdBy ? moment(itemData.createdAt).format('LLL') : '-'} </div>
																<label htmlFor="form_control_1"> Created On</label>
															</div>
														</div>

														<div className="col-md-7">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">{itemData.modifiedBy ? itemData.modifiedBy : '-'}</div>
																<label htmlFor="form_control_1">Modified By</label>
															</div>
														</div>
														<div className="col-md-5">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {itemData.modifiedBy ? moment(itemData.updatedAt).format('LLL') : '-'} </div>
																<label htmlFor="form_control_1">Modified On</label>
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
								<div className="tab-pane" id="item-tools">
									<div className="portlet-title tabbable-line">
										<div className="caption">
											<span className="caption-subject font-dark bold uppercase">Tools</span>
										</div>
									</div>
									<div className="portlet-body">
										<div className="tab-content">
											<form action="#" className="horizontal-form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-6">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">{itemData.toolsId ? itemData.toolsId.title : '-'}</div>
																<label htmlFor="form_control_1">Project</label>
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
					</div>
				</div >
				<DeleteModal
					deleteModalId="item_delete"
					deleteUserHandler={this.deleteItemHandler} />
			</div >

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return { itemDetail: state.itemCreation.itemDetailData };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(itemAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);