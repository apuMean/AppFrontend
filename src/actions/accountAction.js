import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import toastr from 'toastr';
import { browserHistory } from 'react-router';
/**
 * this action get the list of all Roles 
 */
export function getRoles(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ROLES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_ROLES, userRoles: response.data.data });
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action sends invitation to a user through mail 
 */
export function sendInvite(userData) {
	return function (dispatch, getState) {
		axios.post(api.INVITE_USER, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				toastr.success(response.data.message);
				var activityData = {
					userId: response.data.data.userId,
					companyId: response.data.data.companyId,
					fullname: response.data.data.firstname + ' ' + response.data.data.lastname,
					activity: '' + 'was invited by ' + localStorage.companyName + '',
					activity_type: 'notify'
				};
				addActivity(activityData);
				return dispatch({ type: types.INVITE_USER, invitedUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action get the list of all users for given compnayId 
 */
export function getUsersList(companyId) {
	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_USERS, companyId, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_ACCOUNT_USERS, userList: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action re-sends invitation to a user through mail 
 */
export function reinviteUser(userData, activityData) {
	return function (dispatch, getState) {
		axios.post(api.RESEND_INVITATION, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				toastr.success(response.data.message);
				return dispatch({ type: types.RESEND_INVITATION, reinviteUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action changes status of particular user
 */
export function changeUserStatus(userData, activityData) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_USER_STATUS, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				// browserHistory.push('/account');
				toastr.success(response.data.message);
				return dispatch({ type: types.UPDATE_USER_STATUS, updateUserStatus: response.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action deletes the given user
 */
export function deleteUser(userData, activityData) {
	let companyId = {
		companyId: localStorage.companyId,
		userId: localStorage.userId

	};
	return function (dispatch, getState) {
		axios.post(api.DELETE_USER, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// getUsersList(companyId);
				addActivity(activityData);
				toastr.success(response.data.message);
				return dispatch({ type: types.DELETE_USER, deleteUser: response.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action resets given user's password 
 */
export function resetUserPassword(userData, activityData) {
	return function (dispatch, getState) {
		axios.post(api.RESET_USER_PASSWORD, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				toastr.success(response.data.message);
				return dispatch({ type: types.RESET_USER_PASSWORD, resetPassword: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

/**
 * userDetails Component functions
 * this action get the data of given userId 
 */
export function loadUserData(userData) {
	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_USER_DETAILS, userData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);    
				return dispatch({ type: types.COMPANY_USER_DETAILS, companyUserDetail: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
/**
 * this action get the data of given userId 
 */
export function getUserDetails(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_USER_BY_ID, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.USER_DETAILS, userById: response.data.data });
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

/**
 * this action updates logged in user's account details 
 */
export function updateAccount(updatedData, activityData) {
	var token = localStorage.token;

	return function (dispatch, getState) {
		axios.post(api.UPDATE_COMPANY_USER_PROFILE, updatedData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				var data = {
					crumbTitle: response.data.data.company,
					userImage: ''
				};
				toastr.success(response.data.message);
				// browserHistory.push('/account/user/'+updatedData.simpleUserId);
				profileAction(data);
				return dispatch({ type: types.UPDATE_COMPANY_USER_PROFILE, updateCompanyUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
export function updateAccountUser(updatedData, activityData) {
	var token = localStorage.token;
	return function (dispatch, getState) {
		axios.post(api.UPDATE_COMPANY_USER_PROFILE, updatedData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				var data = {
					crumbTitle: response.data.data.company,
					userImage: ''
				};
				toastr.success(response.data.message);
				profileAction(data);
				return dispatch({ type: types.UPDATE_COMPANY_USER_PROFILE, updateCompanyUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
export function updateUser(updatedData, activityData) {

	var token = localStorage.token;
	return function (dispatch, getState) {
		axios.post(api.UPDATE_COMPANY_USER_PROFILE, updatedData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				addActivity(activityData);
				var data = {
					crumbTitle: response.data.data.company,
					userImage: ''
				};
				toastr.success(response.data.message);
				browserHistory.push('/account/user/' + updatedData.simpleUserId);
				profileAction(data);
				return dispatch({ type: types.UPDATE_COMPANY_USER_PROFILE, updateCompanyUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {

			console.log(error);
		});
	};
}

export function updateUserPicture(fileData, userId, updatedData) {

	return function (dispatch, getState) {
		var fd = new FormData();
		if (fileData) {
			fd.append('file', fileData);
		}
		fd.append('id', userId);
		axios.post(api.UPDATE_USER_PIC, fd, {
			headers: {
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				updatedData.userImage = response.data.userImage;
				// browserHistory.push('/account');
				toastr.success(response.data.message);
				return dispatch({ type: types.USER_DETAILS, userById: updatedData });

			}
			else if (response.data.code == 403) {
				toastr.success(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
export function removeUserPicture(data, updatedData) {

	return function (dispatch, getState) {
		axios.post(api.REMOVE_USER_PIC, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				updatedData.userImage = '';
				toastr.clear();
				toastr.success(response.data.message);
				return dispatch({ type: types.USER_DETAILS, userById: updatedData });
			}
			else if (response.data.code == 401) {
				toastr.clear();
				toastr.error(response.data.message);
			}
			else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}



export function checkIsAccepted(data) {

	return function (dispatch, getState) {
		axios.post(api.CHECK_IS_ACCEPTED, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				if (response.data.data.isAccepted == 1) {
					browserHistory.push('/signin');
					toastr.error('Password already set');
				}
				else if (response.data == null) {
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else if (response.data.data.isAccepted == 0) {
					toastr.success(response.data.message);
					return dispatch({ type: types.CHECK_IS_ACCEPTED, isAccepted: response.data.data });
				}
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

export function setPassword(passwordData) {
	return function (dispatch, getState) {
		axios.post(api.SET_COMPANY_USERS_PASSWORD, passwordData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				if (localStorage.token != null) {
					localStorage.clear();
				}
				toastr.success(response.data.message);
				localStorage.setItem('roleName', response.data.data.roles[0].roleName);
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', JSON.stringify(response.data.data));
				localStorage.setItem('employeeId', response.data.data.companyEmployeeId);
				localStorage.setItem('userId', response.data.data.userId);
				localStorage.setItem('userName', response.data.data.name ? response.data.data.name : response.data.data.email);
				localStorage.setItem('companyId', response.data.data.companyId);
				localStorage.setItem('companyName', response.data.data.companyName);
				localStorage.setItem('fname', response.data.data.firstname);
				localStorage.setItem('lname', response.data.data.lastname);
				localStorage.setItem('userEmail', response.data.data.email);
				return dispatch({ type: types.SET_COMPANY_USERS_PASSWORD, setPassword: response.data.data });
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

//activity api's
export function getActivityList(currentActivityData) {

	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_USER_ACTIVITY, currentActivityData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_COMPANY_USER_ACTIVITY, allActivities: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}
export function addActivity(activityData) {
	axios.post(api.ADD_USER_ACTIVITY, activityData, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': localStorage.token
		}
	}).then(function (response) {
		if (response.data.code == 200) {
			// toastr.success(response.data.message);
		}
		else if (response.data.code == 401) {
			toastr.error(response.data.message);
		}
	}).catch(function (error) {
		console.log(error);
	});
	return;
}

export function getActivityByUser(userCompanyId) {
	return function (dispatch, getState) {
		axios.post(api.GET_USER_ACTIVITY, userCompanyId, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_USER_ACTIVITY, activityByUser: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

export function profileAction(data) {
	return function (dispatch, getState) {
		return dispatch({ type: types.ACCOUNT_TITLE, breadcrumb: data });
	};
}

export function imageAction(data) {
	return function (dispatch, getState) {
		return dispatch({ type: types.ACCOUNT_TITLE, userimage: data });

	};
}