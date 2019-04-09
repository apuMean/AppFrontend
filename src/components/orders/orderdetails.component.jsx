import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeleteModal from '../common/deleteModal.component';
import RoleAwareComponent from '../authorization/roleaware.component';
import * as validate from '../common/validator';
import * as loader from '../../constants/actionTypes';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as orderActions from '../../actions/orderActions';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import autoBind from 'react-autobind';

class OrderDetails extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			orderDetails: '',
			billingAddress: '',
			shippingAddress: '',
			memoList: [],
			orderId: '',
			itemPricedData: [],
			expandTotal: false,
			expandHours: false,
			itemTab: 'active',
			materialTab: '',
			laborTab: '',
			assignedValues: [],
			breadcrumb: true
		};
	}

	componentWillMount() {
		var orderId = {
			orderId: this.props.params.orderId
		};
		this
			.props
			.actions
			.getOrderDetails(orderId);

		setTimeout(function () {
			datatable
				.OrderTable
				.init();
		}, 2000);
	}

	componentDidMount() {
		functions.showLoader('orderList');
	}

	componentWillReceiveProps(nextProps) {
		let assignedObjDisplay = [];
		if (nextProps.orderDetail) {
			var orderstate = nextProps.orderDetail.orderDetails;
			var itemState = nextProps.orderDetail.itemLists;
			var billingAddress = orderstate.billingAddress1 + ' ' + orderstate.billingAddress2 + ' ' + orderstate.billingCity + ' ' + orderstate.billingState + ' ' + orderstate.billingZip;
			var shippingAddress = orderstate.shippingAddress1 + ' ' + orderstate.shippingAddress2 + ' ' + orderstate.shippingCity + ' ' + orderstate.shippingState + ' ' + orderstate.shippingZip;

			if (orderstate.userIds) {
				let assignList = orderstate.userIds
					.map(function (usr, index) {
						assignedObjDisplay.push(usr.userName);
					}.bind(this));
			}

			this.setState({
				orderDetails: orderstate,
				itemPricedData: nextProps.orderDetail.itemLists,
				billingAddress: billingAddress,
				shippingAddress: shippingAddress,
				memoList: orderstate.memo ? orderstate.memo.reverse() : [],
				assignedValues: assignedObjDisplay
			});
			if (this.state.breadcrumb && orderstate.orderNumber) {
				let company_name=orderstate.customerId ? ' (' + orderstate.customerId.companyName + ')':'';
				var data = {
					parent: <Link to='/order'>Service Orders</Link>,
					childone: ('#' + orderstate.orderNumber) + company_name ,
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}
			$('div#orderList').unblock();
		}
	}

	handleExpand(type) {
		if (type === 'TOTAL') {
			let total = !this.state.expandTotal;
			this.setState({ expandTotal: total });
		}
		else if (type === 'HOURS') {
			let hours = !this.state.expandHours;
			this.setState({ expandHours: hours });
		}
	}

	handleLineTab(tabIndex) {
		if (tabIndex === 1) {
			this.setState({ itemTab: 'active', materialTab: '', laborTab: '' });
		}
		else if (tabIndex === 2) {
			this.setState({ itemTab: '', materialTab: 'active', laborTab: '' });
		}
		else if (tabIndex === 3) {
			this.setState({ itemTab: '', materialTab: '', laborTab: 'active' });
		}
	}

	handleMemoAdd() {
		toastr.remove();
		let memoText = ReactDOM.findDOMNode(this.refs.servMemo).value.trim();
		if (memoText !== '') {
			let memoData = {
				serviceOrderId: this.props.params.orderId,
				message: memoText,
				userName: localStorage.userName,
			};
			this.props.actions.addServiceMemos(memoData);
			let currentMemo = {
				message: memoText,
				userName: localStorage.userName,
				createdAt: moment()

			};
			let currentState = this.state.memoList;
			currentState.unshift(currentMemo);
			this.setState({ memoList: currentState });
			var memo_list = $('#service_memos').DataTable();
			memo_list.destroy();
			setTimeout(function () {
				datatable.OrderTable.init();
			}, 2000);
			$('#serv_memos').modal('hide');
		}
		else {
			toastr.error('Please enter a valid memo.');
		}
	}

	handleDelete() {
		this.setState({ orderId: this.props.params.orderId });
		$('#order_delete').modal('show');
	}

	deleteOrderHandler() {
		if (this.state.orderId) {
			$('#order_delete').modal('hide');
			functions.showLoader('orderList');
			var data = {
				orderId: this.state.orderId
			};
			this.props.actions.deleteOrder(data);
		}
	}

	render() {
		// let clonedItemData = JSON.parse(JSON.stringify(this.state.itemPricedData));

		// let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
		// let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		// let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
		// let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
		// let grandTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + (next.mTaxExtended + next.lExtended) : prev, 0);
		// let mExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
		// let mTaxTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
		// let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
		// let lExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		// let lHoursTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
		// let lRateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);

		//Totals Section
		// let totalCost = mExtendedTotal;
		// let totalTax = mTaxTotal;
		// let totalShipping = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
		// let totalMaterial = mExtendedTotal + mTaxTotal + totalShipping;
		// let markupTotal = mExtendedTotal - mOurCostExtTotal;
		// let markupPercent = ((materialTotal - markupTotal) / markupTotal) * 100;

		let orderDetailData = this.state.orderDetails;
		let status = '';
		// let stage = '';
		let memos = null;
		if (orderDetailData) {
			if (orderDetailData.statusId == 1) {
				status = 'Open';
			} else if (orderDetailData.statusId == 2) {
				status = 'In-Progress';
			} else if (orderDetailData.statusId == 3) {
				status = 'Pending';
			} else if (orderDetailData.statusId == 4) {
				status = 'Work Completed';
			} else if (orderDetailData.statusId == 5) {
				status = 'Closed';
			} else if (orderDetailData.statusId == 6) {
				status = 'Cancelled';
			}

			// if (orderDetailData.stageId == 1) {
			//     stage = "Pre-Approved";
			// } else if (orderDetailData.stageId == 2) {
			//     stage = "Approved";
			// } else if (orderDetailData.stageId == 3) {
			//     stage = "In-Progress";
			// } else if (orderDetailData.stageId == 4) {
			//     stage = "Dead";
			// } else if (orderDetailData.stageId == 5) {
			//     stage = "In-Complete";
			// } else if (orderDetailData.stageId == 6) {
			//     stage = "Complete";
			// }

			memos = this.state.memoList.map(function (memo, index) {
				return (
					<tr key={index}>
						<td>{memo.userName}</td>
						<td>{moment(memo.createdAt).format('LLL')}</td>
						<td>{memo.message}</td>
					</tr>
				);
			});

		}

		// let countItem = 0;
		// let countMaterial = 0;
		// let countLabor = 0;

		// let materialTabData = this
		//     .state
		//     .itemPricedData
		//     .map(function (i, index) {
		//         if (i.itemTypeId == 1) {
		//             countMaterial = countMaterial + 1;
		//         } else if (i.itemTypeId == 2) {
		//             countMaterial = countMaterial + 1;
		//         } else if (i.itemTypeId == 3) {
		//             countMaterial = countMaterial + 1;
		//         } else if (i.itemTypeId == 4) {
		//             countMaterial = countMaterial;
		//         }
		//         if (i.itemTypeId === 1) {
		//             return (<tr key={index}>
		//                 <td>{countMaterial ? countMaterial : ''}</td>
		//                 <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
		//                 <td>{i.quantity}</td>
		//                 <td><input type="checkbox" defaultChecked={i.mTaxable} value={i.mTaxable} disabled="disabled" /></td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mOurCost).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mOurCost).toFixed(2))}</td>
		//                 <td>{i.mMarkup}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mCost).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mExtended).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTax).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
		//                 <td
		//                     onClick={this.handleLineTab.bind(this, 3)}
		//                     style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended + i.lExtended).toFixed(2))}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 2) {
		//             return (<tr key={index}>
		//                 <td>{countMaterial ? countMaterial : ''}</td>
		//                 <td><b>Labor:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td>{i.quantity ? (i.quantity).toString() : '0'}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}
		//                 </td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 3) {
		//             return (<tr key={index}>
		//                 <td>{countMaterial ? countMaterial : ''}</td>
		//                 <td><b>Shipping:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 4) {
		//             return (
		//                 <tr key={index} data-id={index}>
		//                     <td className="unselectable-header" colSpan="13">{i.headerName}</td>
		//                 </tr>
		//             )
		//         }
		//     }.bind(this));

		// let itemTabData = this.state.itemPricedData
		//     .map(function (i, index) {
		//         if (i.itemTypeId == 1) {
		//             countItem = countItem + 1;
		//         } else if (i.itemTypeId == 2) {
		//             countItem = countItem + 1;
		//         } else if (i.itemTypeId == 3) {
		//             countItem = countItem + 1;
		//         } else if (i.itemTypeId == 4) {
		//             countItem = countItem;
		//         }
		//         if (i.itemTypeId === 1) {
		//             return (<tr key={index}>
		//                 <td style={{ textAlign: 'center' }}>{countItem}</td>
		//                 <td>{i.itemMfg}</td>
		//                 <td >{i.modelNo ? i.modelNo : '-'}</td>
		//                 <td >{i.partNo ? i.partNo : '-'}</td>
		//                 <td >{i.itemName}</td>
		//                 <td>{i.quantity}</td>
		//                 <td
		//                     onClick={this.handleLineTab.bind(this, 2)}
		//                     style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
		//                 <td
		//                     onClick={this.handleLineTab.bind(this, 3)}
		//                     style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended + i.lExtended).toFixed(2))}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 2) {
		//             return (<tr key={index}>
		//                 <td style={{ textAlign: 'center' }}>{countItem}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td><b>Labor:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td>{i.quantity ? i.quantity : ''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.rowTotal).toFixed(2))}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 3) {
		//             return (<tr key={index}>
		//                 <td style={{ textAlign: 'center' }}>{countItem}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td><b>Shipping:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.rowTotal).toFixed(2))}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 4) {
		//             return (
		//                 <tr key={index} data-id={index}>
		//                     <td className="unselectable-header" colSpan="9">{i.headerName}</td>
		//                 </tr>
		//             )
		//         }
		//     }.bind(this));

		// let laborTabData = this
		//     .state
		//     .itemPricedData
		//     .map(function (i, index) {
		//         if (i.itemTypeId == 1) {
		//             countLabor = countLabor + 1;
		//         } else if (i.itemTypeId == 2) {
		//             countLabor = countLabor + 1;
		//         } else if (i.itemTypeId == 3) {
		//             countLabor = countLabor + 1;
		//         } else if (i.itemTypeId == 4) {
		//             countLabor = countLabor;
		//         }
		//         if (i.itemTypeId === 1) {
		//             return (<tr key={index}>
		//                 <td>{countLabor ? countLabor : ''}</td>
		//                 <td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.quantity}</td>
		//                 <td onClick={this.handleLineTab.bind(this, 2)}
		//                     style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.laborTypeName ? i.laborTypeName : '-'}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.lHours}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.lHoursExtended}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lRate).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
		//                 <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lExtended + i.mTaxExtended).toFixed(2))}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 2) {
		//             return (<tr key={index}>
		//                 <td>{countLabor ? countLabor : ''}</td>
		//                 <td><b>Labor:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td>{i.quantity ? (i.quantity).toString() : '0'}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td>{i.laborTypeName ? i.laborTypeName : ''}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.lHours ? i.lHours : '0'}</td>
		//                 <td style={{ textAlign: 'center' }}>{i.lHoursExtended ? i.lHoursExtended : ''}</td>
		//                 <td style={{ textAlign: 'right' }}>{i.lRate ? '$' + validate.numberWithCommas((i.lRate).toFixed(2)) : '$' + 0}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 3) {
		//             return (<tr key={index}>
		//                 <td>{countLabor ? countLabor : ''}</td>
		//                 <td><b>Shipping:</b>{i.itemName ? i.itemName : 'NA'}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td className="unselectable">{''}</td>
		//                 <td style={{ textAlign: 'right' }}>
		//                     {i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
		//             </tr>)
		//         }
		//         else if (i.itemTypeId === 4) {
		//             return (
		//                 <tr key={index} data-id={index}>
		//                     <td className="unselectable-header" colSpan="11">{i.headerName}</td>
		//                 </tr>
		//             )
		//         }
		//     }.bind(this));

		// let sum = [];
		// clonedItemData.forEach(function (o) {
		//     var existing = sum.filter(function (i) {
		//         if (i.itemTypeId !== 3 && i.itemTypeId !== 4) {
		//             return i.laborTypeName === o.laborTypeName
		//         }
		//     })[0];
		//     if (!existing) {
		//         sum.push(o);
		//     }
		//     else {
		//         existing.lHours += o.lHours;
		//         existing.lExtended += o.lExtended;
		//     }
		// });
		// let totalHours = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
		// let totalRate = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);

		// let laborTotalMore = sum.map(function (labor, index) {
		//     if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
		//         return <tr key={index}>
		//             <th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
		//             <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((labor.lExtended).toFixed(2))}</td>
		//         </tr>
		//     }
		// }.bind(this));

		// let laborHoursMore = sum.map(function (labor, index) {
		//     if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
		//         return <tr key={index}>
		//             <th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
		//             <td style={{ textAlign: 'right' }}>{labor.lHours}</td>
		//         </tr>
		//     }
		// }.bind(this));

		return (
			<div>
				<div className="portlet-title tabbable-line">
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#order-add" data-toggle="tab"> Service Order </a>
						</li>
						<li>
							<a href="#order-moreinfo" data-toggle="tab"> More Info </a>
						</li>
						<li>
							<a href="#service-memos" data-toggle="tab">
                                Memos
							</a>
						</li>

						<div className="text-right">
							<Link to="/order" className="btn btn-sm btn-circle red">
                                Cancel </Link>&nbsp;&nbsp;
							{this.shouldBeVisible(authorize.ordersAuthorize) ? <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                Delete </button> : null}&nbsp;&nbsp;
							{this.shouldBeVisible(authorize.ordersAuthorize) ? <Link to={'/order/' + this.props.params.orderId + '/edit'} className="btn btn-sm btn-circle green">
                                Edit </Link> : null}
						</div>

					</ul>
				</div>
				<div className="portlet light bordered" id="orderList">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="order-add">
								{/* <div className="portlet-title">
                                    <div className="caption">
                                        <span className="caption-subject bold uppercase">General Details</span>
                                    </div>
                                </div> */}
								<form role="form">
									<div className="form-body">
										<div className="row">
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static italic">{orderDetailData.orderNumber ? orderDetailData.orderNumber : '-'}</div>
													<label htmlFor="service_number">Service Order #</label>
												</div>
											</div>
											<div className="col-md-8 col-sm-8 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.customerId ? orderDetailData.customerId.companyName : '-'}</div>
													<label htmlFor="form_control_1">Customer</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{status}</div>
													<label htmlFor="form_control_1">Status</label>
												</div>
											</div>
											<div className="col-md-8 col-sm-8 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.billingCompanyId ? orderDetailData.billingCompanyId.companyName : '-'}</div>
													<label htmlFor="form_control_1">Billing Company</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.orderTypeId ? orderDetailData.orderTypeId.orderTypeName : '-'}</div>
													<label htmlFor="form_control_1">OrderType</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData && this.state.assignedValues.length > 0 ? this.state.assignedValues.toString() : '-'}</div>
													<label htmlFor="form_control_1">Assigned</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData && orderDetailData.scheduledDate ? orderDetailData.scheduledDate : '-'}</div>
													<label htmlFor="form_control_1">Scheduled Date</label>
												</div>
											</div>
											<div className="col-md-8 col-sm-8 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{orderDetailData ? orderDetailData.descriptionWork : '-'}</div>
													<label htmlFor="form_control_1">Description of work</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{orderDetailData.serviceLocation ? orderDetailData.serviceLocation : '-'}</div>
													<label htmlFor="name">Service Location</label>
												</div>
											</div>
											<div className="col-md-4 col-sm-4 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{orderDetailData.contractId ? orderDetailData.contractId.orderContractName : '-'}</div>
													<label htmlFor="contract">Contract</label>
												</div>
											</div>
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData ? this.state.billingAddress : '-'}</div>
                                                    <label htmlFor="form_control_1">Billing Address</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{this.state.shippingAddress ? this.state.shippingAddress : '-'}</div>
                                                    <label htmlFor="form_control_1">Shipping Address</label>
                                                </div>
                                            </div> */}
											<div className="col-md-8 col-sm-8 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>{orderDetailData.workPerformed ? orderDetailData.workPerformed : '-'}</div>
													<label htmlFor="form_control_1">Work Performed</label>
												</div>
											</div>
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData.poNumber ? orderDetailData.poNumber : '-'}</div>
                                                    <label htmlFor="form_control_1">PO #</label>
                                                </div>
                                            </div> */}
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{stage}</div>
                                                    <label htmlFor="form_control_1">Stage</label>
                                                </div>
                                            </div> */}
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData ? orderDetailData.salesRep.firstname + ' ' + orderDetailData.salesRep.lastname : '-'}</div>
                                                    <label htmlFor="form_control_1">Sales Rep</label>
                                                </div>
                                            </div> */}
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData && orderDetailData.estimatedDuration ? orderDetailData.estimatedDuration : '-'}</div>
                                                    <label htmlFor="form_control_1">Estimated Duration(Hr)</label>
                                                </div>
                                            </div> */}
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData && orderDetailData.projectId ? orderDetailData.projectId.title : '-'}</div>
                                                    <label htmlFor="form_control_1">Project</label>
                                                </div>
                                            </div> */}
											{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="form-control form-control-static">{orderDetailData && orderDetailData.estimateId ? orderDetailData.estimateId.estimateNumber : '-'}</div>
                                                    <label htmlFor="form_control_1">Estimate #</label>
                                                </div>
                                            </div> */}
										</div>
									</div>
								</form>
								{/* <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet light bordered">
                                        <div className="portlet-title tabbable-line">
                                            <div className="caption">
                                                <i className="icon-share font-dark"></i>
                                                <span className="caption-subject font-dark bold uppercase">Line Items</span>
                                            </div>
                                            <ul className="nav nav-tabs">
                                                <li className={this.state.itemTab}>
                                                    <a href="#portlet_tab1" data-toggle="tab" onClick={this.handleLineTab.bind(this, 1)}> Items </a>
                                                </li>
                                                <li className={this.state.materialTab}>
                                                    <a href="#portlet_tab2" data-toggle="tab" onClick={this.handleLineTab.bind(this, 2)}> Material </a>
                                                </li>
                                                <li className={this.state.laborTab}>
                                                    <a href="#portlet_tab3" data-toggle="tab" onClick={this.handleLineTab.bind(this, 3)}> Labor </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="portlet-body">
                                            <div className="tab-content">
                                                <div className={'tab-pane' + ' ' + this.state.itemTab} id="portlet_tab1">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items">#</th>
                                                                            <th className="items">Mfg</th>
                                                                            <th className="items">Model No</th>
                                                                            <th className="items">Part No</th>
                                                                            <th className="items">Desc</th>
                                                                            <th className="items">Qty</th>
                                                                            <th className="material" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
                                                                            <th className="labor" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal">Row Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {itemTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((laborTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((grandTotal).toFixed(2))}</td>
                                                                        </tr>
                                                                    </tfoot> : null}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'tab-pane' + ' ' + this.state.materialTab} id="portlet_tab2">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items" rowSpan="2">#</th>
                                                                            <th className="items" rowSpan="2">Item</th>
                                                                            <th className="items" rowSpan="2">Qty</th>
                                                                            <th className="material" colSpan="8">Material</th>
                                                                            <th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="material">Taxable</th>
                                                                            <th className="material">Our Cost</th>
                                                                            <th className="material">Our Cost Ext</th>
                                                                            <th className="material">Mark Up</th>
                                                                            <th className="material">Cost</th>
                                                                            <th className="material">Extended</th>
                                                                            <th className="material">Tax</th>
                                                                            <th className="material">Tax Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {materialTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mOurCostTotal).toFixed(2))}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mTaxTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((laborTotal).toFixed(2))}</td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((grandTotal).toFixed(2))}</td>
                                                                        </tr>
                                                                    </tfoot> : null}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'tab-pane' + ' ' + this.state.laborTab} id="portlet_tab3">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="table-container table-responsive">
                                                                <table className="table table-striped table-bordered" id="lineitem">
                                                                    <thead >
                                                                        <tr>
                                                                            <th className="items" rowSpan="2">#</th>
                                                                            <th className="items" rowSpan="2">Item</th>
                                                                            <th className="items" rowSpan="2">Qty</th>
                                                                            <th className="material" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
                                                                            <th className="labor" colSpan="6">Labor</th>
                                                                            <th className="rowtotal" rowSpan="2">Row Total</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <th className="labor">Type</th>
                                                                            <th className="labor">Hrs</th>
                                                                            <th className="labor">Hrs Ext</th>
                                                                            <th className="labor">Rate</th>
                                                                            <th className="labor">Unit</th>
                                                                            <th className="labor">Extended</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {laborTabData}
                                                                    </tbody>
                                                                    {this.state.itemPricedData.length != 0 ? <tfoot>
                                                                        <tr>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'center' }}>{lHoursExtended}</td>
                                                                            <td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((lRateTotal).toFixed(2))}</span></td>
                                                                            <td></td>
                                                                            <td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((lExtended).toFixed(2))}</span></td>
                                                                            <td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((grandTotal).toFixed(2))}</span></td>
                                                                        </tr>
                                                                    </tfoot> : null}
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Material</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Cost</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Our Cost Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mOurCostTotal).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Tax</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Shipping</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Markup %</th>
                                                            <td style={{ textAlign: 'right' }}>{isNaN(markupPercent) ? 0 : (markupPercent).toFixed(2)}%</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Markup Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((markupTotal).toFixed(2))}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Labor</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Total&nbsp;<span onClick={this.handleExpand.bind(this, 'TOTAL')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandTotal ? " (less...)" : "(more...)"}</span></th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
                                                        </tr>
                                                        {this.state.expandTotal ? laborTotalMore : null}
                                                        <tr>
                                                            <th colSpan="1">Hours&nbsp;<span onClick={this.handleExpand.bind(this, 'HOURS')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandHours ? " (less...)" : "(more...)"}</span></th>
                                                            <td style={{ textAlign: 'right' }}>{totalHours}</td>
                                                        </tr>
                                                        {this.state.expandHours ? laborHoursMore : null}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-md-4">
                                                <table className="table table-striped table-bordered">
                                                    <caption className="font-dark bold uppercase">Total</caption>
                                                    <tbody>
                                                        <tr>
                                                            <th colSpan="1">Material</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Labor</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Tax</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th colSpan="1">Shipping</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                        <tr>
                                                            <th className="caption-subject font-dark bold uppercase" colSpan="1">Grand Total</th>
                                                            <td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal + totalRate + totalTax + totalShipping).toFixed(2))}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
							</div>
							<div className="tab-pane" id="order-moreinfo">
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
													{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">{orderDetailData ? orderDetailData.title : '-'}</div>
                                                            <label htmlFor="form_control_1">Title</label>
                                                        </div>
                                                    </div> */}
													<div className="col-md-4 col-sm-6 col-xs-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {orderDetailData ? orderDetailData.createdBy : '-'} </div>
															<label htmlFor="form_control_1">Created By</label>
														</div>
													</div>
													<div className="col-md-4 col-sm-6 col-xs-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {orderDetailData.createdAt ? moment(orderDetailData.createdAt).format('LLL') : '-'} </div>
															<label htmlFor="form_control_1">On</label>
														</div>
													</div>
													<div className="col-md-4 col-sm-6 col-xs-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {orderDetailData ? orderDetailData.orderNumber : '-'} </div>
															<label htmlFor="form_control_1">Order #</label>
														</div>
													</div>
													<div className="col-md-4 col-sm-6 col-xs-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {orderDetailData.modifiedBy ? orderDetailData.modifiedBy : '-'} </div>
															<label htmlFor="form_control_1">Modified By</label>
														</div>
													</div>
													<div className="col-md-4 col-sm-6 col-xs-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">  {orderDetailData.modifiedBy ? moment(orderDetailData.updatedAt).format('LLL') : '-'} </div>
															<label htmlFor="form_control_1">On</label>
														</div>
													</div>
													{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">{orderDetailData.opportunityId ? orderDetailData.opportunityId.title : '-'}</div>
                                                            <label htmlFor="form_control_1">Opportunity</label>
                                                        </div>
                                                    </div> */}
													{/* <div className="col-md-4 col-sm-6 col-xs-12">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">{orderDetailData.estimateId ? orderDetailData.estimateId.estimateNumber : '-'}</div>
                                                            <label htmlFor="form_control_1">Estimate #</label>
                                                        </div>
                                                    </div> */}
												</div>
											</div>
										</form>
									</div>
								</div>
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject bold uppercase">Technician Info</span>
									</div>
								</div>
								<form role="form">
									<div className="form-body">
										<div className="row">
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.technicianName ? orderDetailData.technicianName : '-'}</div>
													<label htmlFor="form_control_1">Name</label>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.phone ? orderDetailData.phone : '-'}</div>
													<label htmlFor="form_control_1">Phone</label>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.startdate ? orderDetailData.startdate : '-'}</div>
													<label htmlFor="form_control_1">Start Date/Time</label>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.enddate ? orderDetailData.enddate : '-'}</div>
													<label htmlFor="form_control_1">End Date/Time</label>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{orderDetailData.notes ? orderDetailData.notes : '-'}</div>
													<label htmlFor="form_control_1">Notes</label>
												</div>
											</div>
											{orderDetailData && orderDetailData.signatureImg.length > 0 ? <div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="fileinput fileinput-exists" data-provides="fileinput">
														<div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: '50px' }}>
															<img
																src={orderDetailData.signatureImg[0].url}
																className="img-responsive"
																alt="Signature" />
														</div>
													</div>
												</div>
											</div> : null}
										</div>
									</div>
								</form>
							</div>
							<div className="tab-pane" id="service-memos">
								<div className="portlet light portlet-fit portlet-datatable bordered">
									<div className="portlet-title">
										<div className="actions">
											<a href="#serv_memos" data-toggle="modal"
												data-backdrop="static" data-keyboard="false" className="btn btn-sm btn-circle green">
												<i className="icon-plus"></i>
                                                Add Memo
											</a>
										</div>
									</div>
									<div className="portlet-body">
										<div className="table-container table-responsive">
											<table className="table table-striped table-bordered table-hover" id="service_memos">
												<thead >
													<tr>
														<th>User</th>
														<th>Date/Time</th>
														<th>Message</th>
													</tr>
												</thead>
												<tbody>
													{memos}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<div id="serv_memos" className="modal fade" tabIndex="-1" aria-hidden="true">
								<div className="modal-dialog modal-sm">
									<div className="modal-content">
										<div className="modal-header">
											<div className="caption">
												<span className="caption-subject bold uppercase">Add Memo</span>
											</div>
										</div>
										<div className="modal-body">
											<div className="row">
												<div className="col-md-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="servMemo"
															name="servMemo"
															id="servMemo"
															defaultValue=''
															key=''></TextareaAutosize>
													</div>
												</div>
											</div>
										</div>
										<div className="modal-footer">
											<button type="button" data-dismiss="modal" className="btn dark btn-outline">Cancel</button>
											<button
												type="button"
												className="btn green"
												onClick={this.handleMemoAdd}>Save</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<DeleteModal deleteModalId="order_delete" deleteUserHandler={this.deleteOrderHandler} />
			</div>

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return { orderDetail: state.serviceOrder.orderDetails };
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(orderActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);