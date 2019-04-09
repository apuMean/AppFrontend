import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import toastr from 'toastr';
import { browserHistory } from 'react-router';

export function getContacts(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {

					if (data.userType == 1) {
						response.data.data.companySearchText = data.companySearchText;
						response.data.data.per_page = data.per_page;
						return dispatch({ type: types.GET_CONTACTS, contactData: response.data.data });
					}
					else if (data.userType == 2) {
						response.data.data.contactSearchText = data.contactSearchText;
						response.data.data.per_page = data.per_page;
						return dispatch({ type: types.GET_CONTACTS, contactData: response.data.data });
					}
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function updateBreadcrumb(data) {
	return function (dispatch, getState) {
		return dispatch({ type: types.BREAD_CRUMB_TITLE, crumbs: data });
	};
}
export function getDashTaskList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_TASK_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_TASK_LIST, tasksList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashTaskFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_TASKS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_TASK_LIST, tasksList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashOpportunityList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OPPORTUNITIES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_OPPORTUNITIES_LIST, opportunityList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashOpportunityFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_OPPORTUNITIES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_OPPORTUNITIES_LIST, opportunityList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashEstimateList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_ESTIMATE_LIST, estimatesList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashEstimateFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_ESTIMATES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_ESTIMATE_LIST, estimatesList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getProjectCategory(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_PROJECT_DROPDOWNS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROJECT_DROPDOWNS_FOR_DASHBOARD, projectDropdowns: response.data.data });
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

export function getDashProjectList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_PROJECTS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_PROJECTS_LIST, projectsList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashProjectFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_PROJECTS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_PROJECTS_LIST, projectsList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getDashOrderList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ORDERS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_ORDER_LIST, ordersList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}
export function getDashOrderFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_ORDERS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_ORDER_LIST, ordersList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}
export function getDashInvoiceList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_INVOICES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_INVOICE_LIST, invoiceList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}
export function getDashInvoiceFilteredList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FILTERED_INVOICES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_INVOICE_LIST, invoiceList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}

			}).catch(function (error) {
				console.log(error);
			});
	};
}
export function getDashTailgateList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_TAILGATES_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_TAILGATE_LIST, tailgatesList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}
export function getDashGoalList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_GOALS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.DASH_GOAL_LIST, goalList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function addNewTailgates(data, tailgateRecordList) {
	if (tailgateRecordList.length > 0) {
		var tailGatesData = tailgateRecordList;
	} else {
		var tailGatesData = [];
	}
	return function (dispatch, getState) {
		axios.post(api.ADD_NEW_TAILGATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					// tailGatesData.push(response.data.data);

					toastr.success(response.data.message);
					// return dispatch({ type: types.DASH_TAILGATE_LIST, tailgatesList: tailGatesData });
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

export function getOpportunityCategory(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OPP_CATEGORY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_OPP_CATEGORY, categoryList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getAllSalesRep(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OPP_SALESREP, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_DASH_SALESREP, salesRepList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}

export function getTaksActivityContacts(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OPP_INDIVIDUAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_USERS_FOR_TASK_LIST, usersList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
				}
			}).catch(function (error) {
				console.log(error);
			});
	};
}
