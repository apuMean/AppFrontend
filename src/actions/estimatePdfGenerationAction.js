import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';
import lib from 'download-url-file';
let downloadFile = lib.downloadFile;

export function getRevisionList(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_REVISION, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.REVISION_LIST_ESTIMATE, revisionList: response.data.data });
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

export function getAssociatedFormats(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_FORMATS_CONFIGS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_FORMATS_CONFIGS, formatsList: response.data.data });
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

export function addNewFormat(data) {
	return function (dispatch, getState) {
		axios.post(api.ADD_ESTIMATE_FORMAT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.UPDATE_FORMAT_LIST, newFormat: response.data.data });
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

export function updateFormat(data) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_ESTIMATE_FORMAT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					// return dispatch({ type: types.UPDATE_FORMAT_LIST, newFormat: response.data.data });
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

export function generateEstimatePdf(data) {
	return function (dispatch, getState) {
		axios.post(api.GENERATE_ESTIMATE_PDF, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					downloadFile(response.data.pdfurl);
					return dispatch({ type: types.LOADED_TRUE, isLoaded: true });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					return dispatch({ type: types.LOADED_TRUE, isLoaded: true });
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}






