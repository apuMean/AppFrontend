import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getContactLinks(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_LINKS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_LINKS, linkdata: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function addContactLinks(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_CONTACT_LINKS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				toastr.success(response.data.message);
				// return dispatch({ type: types.ADD_CONTACT_LINKS, addlinkdata: response.data.data })
				return;
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function removeContactLinks(data, index) {

	return function (dispatch, getState) {
		axios.post(api.REMOVE_CONTACT_LINKS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				toastr.success(response.data.message);
				if (index) {
					return dispatch({ type: types.REMOVE_CONTACT_LINKS, removelinkdata: index });
				} else {
					return;
				}
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactLists(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_LISTS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_CONTACT_LISTS, getContacts: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactEstimates(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_ESTIMATES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_ESTIMATES, estimateData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactProposals(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_PROPOSALS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_PROPOSALS, proposalData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactProjects(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_PROJECTS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_PROJECTS, projectData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactPOs(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_POS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_POS, poData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactInvoices(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_INVOICES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_INVOICES, invoiceData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactActivities(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_ACTIVITIES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_ACTIVITIES, activityData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getLinkContactActivities(data) {

	return function (dispatch, getState) {
		axios.get(api.GET_CONTACT_ACTIVITIES, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_ACTIVITIES, activityData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactDocuments(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_DOCUMENTS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_DOCUMENTS, documentData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}

export function getContactOpportunities(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_OPPORTUNITIES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {

			if (response.data.code == 200) {
				return dispatch({ type: types.GET_CONTACT_OPPORTUNITIES, opportunityData: response.data.data });
			} else if (response.data.code == 403) {
				localStorage.clear();
				browserHistory.push('/signin');
				toastr.error(response.data.message);
			}
			else {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
		});
	};
}