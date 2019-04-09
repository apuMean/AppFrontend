import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import moment from 'moment';
import {
	browserHistory
} from 'react-router';
import toastr from 'toastr';

export function createOpportunity(data) {
	return function (dispatch, getState) {

		axios.post(api.CREATE_OPPORTUNITY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					browserHistory.push('/opportunity');
					$('div#create_opportunity').unblock();
					toastr.success(response.data.message);
					if (data.tags.length) {
						let tags = {
							nameValue: data.tags
						};
						axios.post(api.OPPTAGS_SAVE, tags, {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': localStorage.token
							}
						})
							.then(function (response) { })
							.catch(function (error) { });
					}
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
					$('div#create_opportunity').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_opportunity').unblock();
				console.log(error);
			});
	};
}
export function addOtherContact(contactData) {

	return function (dispatch, getState) {
		axios.post(api.ADD_COMPANY_CONTACT, contactData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					let newContact = {
						id: response.data.data._id,
						label: contactData.firstname + ' ' + contactData.lastname,
						phone: contactData.phone[0].phone,
						mail: contactData.internet[0].internetvalue
					};
					console.log(newContact);
					toastr.success(response.data.message);
					return dispatch({
						type: types.ADD_OTHER_CONTACT,
						createdContact: newContact
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
					$('div#create_opportunity').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_opportunity').unblock();
				console.log(error);
			});
	};
}
export function updateOpportunity(data, id) {
	return function (dispatch, getState) {

		axios.post(api.UPDATE_OPPORTUNITY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					browserHistory.push('/opportunity/' + id);
					$('div#update_opportunity').unblock();
					toastr.success(response.data.message);
					if (data.tags.length) {
						let tags = {
							nameValue: data.tags
						};
						axios.post(api.OPPTAGS_SAVE, tags, {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': localStorage.token
							}
						})
							.then(function (response) { })
							.catch(function (error) { });
					}
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
					$('div#update_opportunity').unblock();
				}
			})
			.catch(function (error) {
				$('div#update_opportunity').unblock();
				console.log(error);
			});
	};
}

export function getCategoryList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_CATEGORY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPP_CATEGORY,
						categoryList: response.data.data
					});
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

export function addOtherCategory(name) {

	$('div#opp_category').block({
		message: types.GET_LOADER_IMAGE,
		css: {
			width: '25%'
		},
		overlayCSS: {
			backgroundColor: '#ffffff',
			opacity: 0.7
		}
	});

	var categoryData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		categoryName: name
	};

	return function (dispatch, getState) {

		axios.post(api.ADD_OPP_CATEGORY, categoryData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					$('div#opp_category').unblock();
					return dispatch({
						type: types.ADD_OPP_CATEGORY,
						categoryData: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
					$('div#opp_category').unblock();
				}
			})
			.catch(function (error) {
				console.log(error);
				$('div#opp_category').unblock();
			});
	};
}

export function getCompanyList(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_COMPANY_LIST,
						companyList: response.data.data
					});
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

export function getEndUserList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_COMPANY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_END_USER_LIST,
						endUserList: response.data.data
					});
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

export function getDepartmentData(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_DEPARTMENT_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_DEPARTMENT_LIST,
						departmentList: response.data.data
					});
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

export function getIndustryData(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_INDUSTRY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					localStorage.setItem('statusNameId', response.data.statusNameId);
					return dispatch({
						type: types.GET_INDUSTRY_LIST,
						industryList: response.data.data
					});
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

export function addOtherDepartment(name) {

	$('div#opp_department').block({
		message: types.GET_LOADER_IMAGE,
		css: {
			width: '25%'
		},
		overlayCSS: {
			backgroundColor: '#ffffff',
			opacity: 0.7
		}
	});
	var departmentData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		departmentName: name
	};

	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_DEPARTMENT, departmentData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					$('div#opp_department').unblock();
					return dispatch({
						type: types.ADD_OPP_DEPARTMENT,
						departmentData: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					$('div#opp_department').unblock();
				}
			})
			.catch(function (error) {
				console.log(error);
				$('div#opp_department').unblock();
			});
	};
}

export function addOtherIndustry(name) {
	var industryData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		industryName: name,
		moduleType: 2
	};

	return function (dispatch, getState) {
		axios.post(api.ADD_CONTACT_INDUSTRY, industryData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.ADD_OPP_INDUSTRY,
						industryData: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else { }
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getCompanyPhoneInternet(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_PHONE_INTERNET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_PHONE_INTERNET,
						companyPhoneInternet: response.data.data
					});
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

export function getSalesRepData(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_SALESREP, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPP_SALESREP,
						salesRepList: response.data.data
					});
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

export function getIndividualData(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_INDIVIDUAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPP_INDIVIDUAL,
						individualList: response.data.data
					});
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

export function getOpportunitiesList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					response.data.data.searchText = data.searchText;
					response.data.data.per_page = data.per_page;
					return dispatch({
						type: types.GET_OPP_LIST,
						oppList: response.data.data
					});
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

export function getOppDetails(oppId) {

	return function (dispatch, getState) {

	};
}

export function getOppDetailValues(data) {
	// debugger

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_DETAILVALUES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				// debugger

				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPP_DETAILVALUES,
						oppData: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteOpportunity(data) {
	return function (dispatch, getState) {

		axios.post(api.DELETE_OPPORTUNITY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					toastr.success(response.data.message);
					browserHistory.push('/opportunity');
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

export function getOppEstimates(data) {
	return function (dispatch, getState) {

		axios.post(api.GET_OPPS_ESTIMATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPPS_ESTIMATE,
						oppEstimates: response.data.data
					});
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

export function addOppMemos(data) {
	return function (dispatch, getState) {

		axios.post(api.ADD_OPPORTUNITY_MEMO, data, {
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
				} else {
					// toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getSuggestionList() {
	return function (dispatch, getState) {
		axios.get(api.GET_OPPTAGS, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPPTAGS,
						suggestionlist: response.data.data
					});
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOpportunityFiles(data) {
	// debugger
	return function (dispatch, getState) {
		axios.post(api.GET_OPPORTUNITY_FILES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				// debugger
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPP_FILES,
						filesData: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					// toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function handleDrop(files, oppId) {
	// debugger
	let uploadedData = [];
	// Push all the axios request promise into a single array
	const uploaders = files.map(file => {
		// Initial FormData
		const formData = new FormData();
		formData.append('file', file);
		formData.append('uploader', localStorage.userName);
		formData.append('createdBy', localStorage.userName);
		formData.append('id', oppId);

		// Make an AJAX upload request using Axios
		return axios.post(api.UPLOAD_OPPORTUNITY_FILES, formData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(response => {
			uploadedData.push(response.data.data);
		});
	});

	// Once all the files are uploaded 
	return function (dispatch, getState) {
		axios.all(uploaders).then((response) => {
			// debugger
			return dispatch({
				type: types.UPLOAD_OPP_FILES,
				filesData: uploadedData
			});
		});
	};
}

export function renameFile(data) {
	return function (dispatch, getState) {
		axios.post(api.RENAME_FILE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					let updatedData = response.data.data;
					updatedData.filename = data.filename;
					updatedData.updatedAt = moment().format('L');
					return dispatch({
						type: types.UPDATE_FILE_NAME,
						payload: updatedData
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteFile(data) {
	// debugger
	return function (dispatch, getState) {
		axios.post(api.DELETE_FILE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				// debugger
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					let updatedData = response.data.data;
					updatedData.temp_deleted = data.isTemp;
					return dispatch({
						type: types.UPDATE_FILE_NAME,
						payload: updatedData
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function restoreFile(data) {
	return function (dispatch, getState) {
		axios.post(api.RESTORE_FILE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					let updatedData = response.data.data;
					updatedData.temp_deleted = false;
					return dispatch({
						type: types.UPDATE_FILE_NAME,
						payload: updatedData
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				} else {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}
