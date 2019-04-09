import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function createNote(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_NOTE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_note').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_note').unblock();
			}
		}).catch(function (error) {
			$('div#create_note').unblock();
			console.log(error);
		});
	};
}

export function createTask(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_TASK, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_task').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_task').unblock();
			}
		}).catch(function (error) {
			$('div#create_task').unblock();
			console.log(error);
		});
	};
}

export function getActivityList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ACTIVITY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_ACTIVITY_LIST, activityList: response.data.data });
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

export function deleteActivity(data, index, List) {
	return function (dispatch, getState) {
		axios.post(api.DELETE_ACTIVITY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				List.splice(index, 1);
				toastr.success(response.data.message);
				$('div#activity_list').unblock();
				return dispatch({ type: types.DELETE_ACTIVITY, removeActivity: List });
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

export function getTemplate() {
	return function (dispatch, getState) {
		axios.get(api.GET_ACTIVITY_TEMPLATE, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_ACTIVITY_TEMPLATE, activitytempalteList: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				// toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

export function createLetter(data) {
	return function (dispatch, getState) {

		axios.post(api.CREATE_LETTER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_letter').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_letter').unblock();
			}
		}).catch(function (error) {
			$('div#create_letter').unblock();
			console.log(error);
		});
	};
}

export function getActCategory(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ACTIVITY_CATEGORY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_ACTIVITY_CATEGORY, activityCategory: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				// toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

export function createFax(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_FAX, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_fax').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_fax').unblock();
			}
		}).catch(function (error) {
			$('div#create_fax').unblock();
			console.log(error);
		});
	};
}

export function createCall(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_CALL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_call').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_call').unblock();
			}
		}).catch(function (error) {
			$('div#create_call').unblock();
			console.log(error);
		});
	};
}

export function createEvent(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_EVENT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				browserHistory.push('/activity');
				$('div#create_event').unblock();
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_event').unblock();
			}
		}).catch(function (error) {
			$('div#create_event').unblock();
			console.log(error);
		});
	};
}

export function createEmail(data, attachment) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_EMAIL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				if (attachment) {
					var fd = new FormData();
					fd.append('file', attachment);
					fd.append('id', response.data.data._id);
					axios.post(api.UPLOAD_EMAIL_ATTACHMENT, fd, {
						headers: {
							'Authorization': localStorage.token
						}
					}).then(function (response) {
						if (response.data.code == 200) {
							$('div#create_email').unblock();
						}
					}).catch(function (error) {

						$('div#create_email').unblock();

					});
				}
				else {
					$('div#create_email').unblock();
				}

				browserHistory.push('/activity');
				toastr.success(response.data.message);
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
				$('div#create_email').unblock();
			}
		}).catch(function (error) {
			$('div#create_email').unblock();
			console.log(error);
		});
	};
}

export function getActivityDetails(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ACTIVITY_DETAILS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_ACTIVITY_DETAILS, activityDetail: response.data.data });
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