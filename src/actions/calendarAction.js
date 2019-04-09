import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getEventsList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_EVENTS_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_EVENT_RECORD_LIST, eventRecordsList: response.data.data });
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

export function getIndividualList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_INDIVIDUAL_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.GET_INDIVIDUALS_LISTS, individualList: response.data.data });
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

export function getEventsListByContact(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_EVENT_LIST_BY_CONTACT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				return dispatch({ type: types.EVENT_LIST_BY_CONTACT, eventRecordsList: response.data.data });
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