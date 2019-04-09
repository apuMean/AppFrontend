import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
// import download from 'downloadjs';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';
import lib from 'download-url-file';
import toastr from 'toastr';
let downloadFile = lib.downloadFile;


export function getAssociatedFormats(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_PROPOSAL_FORMATS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROPOSAL_FORMATS, formatsList: response.data.data });
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

export function getProposalDetails(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_PROPOSAL_DETAILS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROPOSALPDF_DETAILS, proposalData: response.data.data });
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
export function addNewFormat(data) {
	return function (dispatch, getState) {
		axios.post(api.ADD_PROPOSAL_FORMAT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.UPDATE_PROPOSAL_FORMAT_LIST, newFormat: response.data.data });
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

export function generateProposalPdf(data) {
	return function (dispatch, getState) {
		axios.post(api.GENERATE_PROPOSAL_PDF, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					downloadFile(response.data.pdfurl);
					return dispatch({ type: types.PROPOSAL_LOADED_TRUE, isLoaded: true });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					return dispatch({ type: types.PROPOSAL_LOADED_TRUE, isLoaded: true });
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateFormat(data) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_PROPOSAL_FORMAT, data, {
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