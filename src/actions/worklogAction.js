import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import { browserHistory } from 'react-router';
import jQuery from 'jquery';

export function getProjectList(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_PROJECT_AND_SO_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROJECT_AND_SO, projectList: response.data.data });
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


export function createWorkLog(data) {
	return function (dispatch, getState) {

		axios.post(api.ADD_NEW_WORKLOG, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/worklog');
				$('div#create_timer').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_timer').unblock();
			}
		})
			.catch(function (error) {
				$('div#create_timer').unblock();
				console.log(error);
			});
	};
}

export function updateWorklog(data){
	return function (dispatch, getState) {

		axios.post(api.UPDATE_WORKLOG, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/worklog/'+data.workLogId);
				$('div#create_timer').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_timer').unblock();
			}
		})
			.catch(function (error) {
				$('div#create_timer').unblock();
				console.log(error);
			});
	};
}
export function getWorklogList(data) {
	return function (dispatch, getState) {

		axios.post(api.GET_WORKLOG_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_WORKLOG_LIST, worklogList: response.data.data });
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

export function getWorklogDetails(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_WORKLOG_DETAIL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_WORKLOG_DETAIL, worklogData: response.data.data });
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

export function deleteWorklog(data) {
	return function (dispatch, getState) {
		axios.post(api.DELETE_WORKLOG, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					browserHistory.push('/worklog');
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

export function addOtherOption(data){
	// console.log(">>>>>>>..",data)
	return function (dispatch, getState) {
		axios.post(api.ADD_OTHER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.WORKLOG_ADD_OTHER, addOther: response.data.data });
					// browserHistory.push('/worklog');
				} else if (response.data.code == 401) {
					toastr.warning(response.data.message);
				}else if (response.data.code == 403) {
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
export function getWorklogNo(data) {

	return function (dispatch, getState) {
		axios.post(api.WORKLOG_NO, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.WORKLOG_NO, worklogNo: response.data.workLogNo });
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

export function worklogInlineEdit(data){
	return function (dispatch, getState) {

		axios.post(api.INLINE_EDIT_WORKLOG, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// browserHistory.push('/worklog/'+data.workLogId);

				let detailData={
					workLogId:data.workLogId,
					companyId: localStorage.companyId,
				}
				axios.post(api.GET_WORKLOG_DETAIL, detailData, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': localStorage.token
					}
				})
					.then(function (response) {
		
						if (response.data.code == 200) {
							return dispatch({ type: types.GET_WORKLOG_DETAIL, worklogData: response.data.data });
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

				$('div#create_timer').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_timer').unblock();
			}
		})
			.catch(function (error) {
				$('div#create_timer').unblock();
				console.log(error);
			});
	};
}

export function clearSelects() {
	return function (dispatch, getState) {
		return dispatch({ type: types.CLEAR_SELECTS, select: '' });
	};
}
