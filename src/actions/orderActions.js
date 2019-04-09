import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';
import toastr from 'toastr';

export function createOrder(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_ORDER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					let id = response.data.data._id;
					browserHistory.push('/order/' + id);
					$('div#create_order').unblock();
					toastr.success(response.data.message);
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_order').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_order').unblock();
				console.log(error);
			});
	};
}

export function getOrders(data) {
	return function (dispatch, getState) {
		axios.post(api.NEW_GET_ORDERS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					// toastr.success(response.data.message);
					return dispatch({ type: types.GET_ORDER_LIST, orderList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOrderByStatus(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_ORDERS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					// toastr.success(response.data.message);
					return dispatch({ type: types.GET_ORDER_LIST, orderList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteOrder(data) {
	return function (dispatch, getState) {
		axios.post(api.DELETE_ORDER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					toastr.success(response.data.message);
					browserHistory.push('/order');
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOrderDetails(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ORDER_DETAILS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ORDER_DETAILS, orderData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateOrder(data, id) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_ORDER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					browserHistory.push('/order/' + id);
					$('div#create_order').unblock();
					toastr.success(response.data.message);
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_order').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_order').unblock();
				console.log(error);
			});
	};
}

export function updateItemOrder(data) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_ORDER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					$('div#create_order').unblock();
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					$('div#create_order').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_order').unblock();
				console.log(error);
			});
	};
}

export function addServiceMemos(data) {
	return function (dispatch, getState) {
		axios.post(api.ADD_SERVICE_MEMO, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					// toastr.success(response.data.message);
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					// toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addOtherOrderType(name) {
	var typeData = {
		companyId: localStorage.companyId,
		orderTypeName: name
	};
	return function (dispatch, getState) {
		axios.post(api.ADD_OTHER_ORDER_TYPE, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_ORDER_TYPE, typeData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOrderTypes(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OTHER_ORDER_TYPE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					localStorage.setItem('statusNameId', response.data.statusNameId);
					return dispatch({ type: types.GET_OTHER_ORDER_TYPE, orderTypesData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getBillingCompanyList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_BILLING_COMPANIES, companyList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateSignature(signBlob) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_SIGNATURE, signBlob, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.success(response.data.message);
			})
			.catch(function (error) { });
	};
}

export function getEstimateData(data) {
	return function (dispatch, getState) {

		axios.post(api.GET_ESTIMATE_BY_ALPHABET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_LIST_FOR_PROPOSAL, estimateList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function clearSelects() {
	return function (dispatch, getState) {
		return dispatch({ type: types.CLEAR_SELECTS, select: '' });
	};
}

export function getOrderNo(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ORDER_NO, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ORDER_NO, orderNo: response.data.orderNo });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOrderContract(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ORDER_CONTRACT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ORDER_CONTRACT, contractList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addOrderContract(name) {
	let typeData = {
		companyId: localStorage.companyId,
		orderContractName: name
	};
	return function (dispatch, getState) {
		axios.post(api.ADD_ORDER_CONTRACT, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_ORDER_CONTRACT, typeData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}


