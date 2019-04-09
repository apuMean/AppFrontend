import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import RoleAwareComponent from '../authorization/roleaware.component';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as orderActions from '../../actions/orderActions';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import { isServiceTech } from '../shared/findRoles';
import autoBind from 'react-autobind';
import { SERVICE_ORDER_STATUS } from '../../constants/collectionConstants';
import GridFilter from '../common/gridFilter.component';
import GridPager from '../common/paging.component';
import ReactPaginate from 'react-paginate';

class Order extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			statusId: '0',
			Data: {
				serviceOrderList: [],
				totalcount: 0,
				sortColumnName: null,
				sortOrder: null,
				page: 1,
				per_page: 20,
				searchText: ''
			}
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Service Orders',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.orderdata.length != 0) {
			var orderstate = JSON.parse(JSON.stringify(nextProps.orderdata));
			this.setState({ Data: orderstate });
			setTimeout(function () {
				$('div#order_list').unblock();
			}, 200);
		}
		else {
			setTimeout(function () {
				// datatable.OrderTable.init();
				$('div#order_list').unblock();
			}, 2000);
		}
	}
    
	getOrdersData() {
		functions.showLoader('order_list');	
		var params={};
		if (isServiceTech()) {
			const user = JSON.parse(localStorage.getItem('user'));
			params = {
				userId: user.companyEmployeeId,
				companyId: localStorage.companyId,
				per_page: this.state.Data.per_page,
				page: this.state.Data.page,
				searchText: this.state.Data.searchText
			};
		}
		else {
			params = {
				companyId: localStorage.companyId,
				per_page: this.state.Data.per_page,
				page: this.state.Data.page,
				searchText: this.state.Data.searchText
			};
		}

		if (this.state.Data.sortColumnName) {
			params.sortColumnName = this.state.Data.sortColumnName;
		}
		if (this.state.Data.sortOrder) {
			params.sortOrder = this.state.Data.sortOrder;
		}
        
		this.props.orderactions.getOrders(params);
	}
	// function for pagination
	pageChanged(pageNumber, e) {
		this.state.Data.page = pageNumber.selected + 1;
		this.getOrdersData();
	}

	//function for sorting
	sortChanged(sortColumnName, order, e) {		
		e.preventDefault();
		this.state.Data.sortColumnName = sortColumnName;
		this.state.Data.page = 1;
		this.state.Data.sortOrder = order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc';
		this.getOrdersData();
	}

	// function for set sort icon on table header
	_sortClass(filterName) {
		return 'fa fa-fw ' + ((filterName == this.state.Data.sortColumnName) ? ('fa-sort-' + this.state.Data.sortOrder) : 'fa-sort');
	}


	pageFilterChange(event) {
		this.state.Data.page = 1;
		this.state.Data.per_page = parseInt(event.target.value);
		this.getOrdersData();
	}

	searchChange(e) {
		e.preventDefault();
		var d = this.state.Data;
		d.searchText = e.target.value;
		this.setState({
			Data: d
		});

		if (!e.target.value) {
			this.getOrdersData();
		}
	}

	_search(event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			this.getOrdersData();
		}
	}

	handleDetail(index) {
		let currentData = this.state.Data.serviceOrderList[index];
		browserHistory.push('/order/' + currentData._id);
	}

	handleStatusChange(value, e) {
		let statusId = parseInt(value);
		this.setState({ statusId: value });
		if (statusId) {
			let data = {
				filterType: 'status',
				statusId: statusId,
				companyId: localStorage.companyId,
				per_page: this.state.Data.per_page,
				page: this.state.Data.page,
			};
			this.props.orderactions.getOrderByStatus(data);
			functions.showLoader('order_list');
		}
		else{
			let orderData={
				companyId: localStorage.companyId,
				per_page: this.state.Data.per_page,
				page: this.state.Data.page,
			};
			this.props.orderactions.getOrders(orderData);
			functions.showLoader('order_list');
		}
	}

	render() {
		let status;
		let orderList;
		var serviceOrderData = this.state.Data.serviceOrderList;
		if (serviceOrderData) {
			if (serviceOrderData.length != 0) {
				orderList = this
					.state
					.Data
					.serviceOrderList
					.map(function (order, index) {
						if (order.statusId == 1) {
							status = 'Open';
						} else if (order.statusId == 2) {
							status = 'In-Progress';
						} else if (order.statusId == 3) {
							status = 'Pending';
						} else if (order.statusId == 4) {
							status = 'Work Completed';
						} else if (order.statusId == 5) {
							status = 'Closed';
						} else if (order.statusId == 6) {
							status = 'Cancelled';
						}
    
						return <tr key={index} onClick={this.handleDetail.bind(this, index)} style={{ cursor: 'pointer' }}>
							<td>{order.orderNumber}</td>
							<td>{Object.keys(order.contractId).length != 0 ? order.contractId.orderContractName : '-'}</td>
							<td>{Object.keys(order.customerId).length != 0 ? order.customerId.companyName : '-'}</td>
							<td>{status ? status : '-'}</td>
							<td>{Object.keys(order.orderTypeId).length != 0 ? order.orderTypeId.orderTypeName : '-'}</td>
							<td>{order.scheduledDate ? moment(order.scheduledDate).format('MM/DD/YYYY') : '-'}</td>
							<td>{order.createdBy ? order.createdBy : '-'}</td>
							<td>{moment(order.createdAt).format('MM/DD/YYYY')}</td>
						</tr>;
					}.bind(this));
			}}
		

		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="order_list">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Service Orders</span>
					</div>
					{this.shouldBeVisible(authorize.ordersAuthorize) ?
						[<div className="actions">
							<Link to="/order/add" className="btn btn-sm btn-circle green">
								<i className="icon-plus"></i> New Service Order </Link>
						</div>,
						<div className="show_status">
							<span className="multiselect-native-select">
								<select className="mt-multiselect btn dark btn-outline btn-circle btn-sm dropdown-toggle" data-width="100%">
									{SERVICE_ORDER_STATUS.map((values, index) =>
										<option key={index} value={values.value} label={values.label} ></option>
									)}
								</select>
								<div className="btn-group" style={{ width: '100%' }}>
									<button type="button" className="multiselect dropdown-toggle mt-multiselect btn dark btn-outline btn-circle btn-sm" data-toggle="dropdown" title="None selected" aria-expanded="false" style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
										<span className="multiselect-selected-text">{SERVICE_ORDER_STATUS[SERVICE_ORDER_STATUS.findIndex(x => x.value === this.state.statusId)].label}</span>
										<b className="caret"></b>
									</button>
									<ul className="multiselect-container dropdown-menu">
										{SERVICE_ORDER_STATUS.map((values, index) =>
											<li onClick={this.handleStatusChange.bind(this, values.value)} key={index}>
												<a tabIndex="0">
													<label style={{ padding: '0' }}>
														<span><i className={SERVICE_ORDER_STATUS[index].value !== this.state.statusId ? 'fa fa-circle-o' : 'fa fa-dot-circle-o'}></i></span> {values.label}
													</label>
												</a>
											</li>
										)}
									</ul>
								</div>
							</span>
						</div>,
						<label className="status-label" >Show Status:</label>]
						: null}
				</div>
				<div className="portlet-body">
					<GridFilter
						per_page={this.state.Data.per_page}
						handlePagingChange={this.pageFilterChange}
						handleSearchChange={this.searchChange}
						searchText={this.state.Data.searchText}
						_search={this._search}
					/>
					<div className="table-container table-responsive portlet_body_table_div" style={{ overflowX: 'hidden !important' }}>
						<table className="table table-striped table-bordered table-hover" id="order_table">
							<thead>
								<tr>
									<th onClick={this.sortChanged.bind(this, 'orderNumber', this.state.Data.sortOrder)}>
									SO #
										<i className={this._sortClass('orderNumber')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'contractId', this.state.Data.sortOrder)}>
									Contract
										<i className={this._sortClass('contractId')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'customerId', this.state.Data.sortOrder)}>
									Company
										<i className={this._sortClass('customerId')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'status', this.state.Data.sortOrder)}>
									Status
										<i className={this._sortClass('status')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'orderTypeId', this.state.Data.sortOrder)}>
									Order Type
										<i className={this._sortClass('orderTypeId')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'scheduledDate', this.state.Data.sortOrder)}>
									Scheduled
										<i className={this._sortClass('scheduledDate')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'createdBy', this.state.Data.sortOrder)}>
									Created By
										<i className={this._sortClass('createdBy')}></i>
									</th>
									<th>Created On</th> 
								</tr>
							</thead>
							{this.state.Data.serviceOrderList.length==0?<tbody><tr><td style={{textAlign:'center'}} colSpan="8">No matching records found</td></tr></tbody>:<tbody>{orderList}</tbody>}
						</table>
						<div className="pull-right">
							<ReactPaginate
								previousLabel={'previous'}
								nextLabel={'next'}
								breakLabel={<a>...</a>}
								breakClassName={'break-me'}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								pageCount={this.state.Data.totalcount - 1}
								onPageChange={this.pageChanged}
								containerClassName={'pagination'}
								subContainerClassName={'pages pagination'}
								activeClassName={'active'}
								forcePage={this.state.Data.page - 1}
								initialPage={this.state.Data.page - 1} 
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return { orderdata: state.serviceOrder.orderList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		orderactions: bindActionCreators(orderActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Order);


