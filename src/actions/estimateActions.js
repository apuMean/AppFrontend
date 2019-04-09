import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import * as url from '../../tools/config';
// import download from 'downloadjs';
// import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';
import lib from 'download-url-file';
import toastr from 'toastr';
import socketIOClient from 'socket.io-client';
import { setTimeout } from 'timers';
var endpoint= api.SOCKETURL;
let downloadFile = lib.downloadFile;
const socket = socketIOClient(endpoint);


export function getEstimates(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_LIST, estimateList: response.data.data });
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
//hold estimate Name in the reducer
export function holdEstimateName(data){
	return function (dispatch, getState) {
		browserHistory.push('/estimate/add');
		return dispatch({ type: types.ESTIMATE_NAME, newEstimateName: data.estimateName });

	};
}
//saves estimate with modal
export function saveEstimate(estimateData){
	return function (dispatch, getState) {
		axios.post(api.SAVE_ESTIMATE, estimateData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					let estimateId = response.data.data.estimateId;
					browserHistory.push(`/estimate/${estimateId}`);
					
					// return dispatch({ type: types.SAVE_ESTIMATE, newEstimateData: response.data.data });
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
export function createEstimate(estimateData, redirectPage) {
	let estimateNo = '';
	let estimateMessage = '';
	let estimateId = '';
	return function (dispatch, getState) {
		axios.post(api.ADD_ESTIMATE, estimateData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					estimateNo = response.data.data.estimateId.slice(-7).toUpperCase();
					estimateId = response.data.data.estimateId;
					estimateMessage = response.data.message;
					let opportunityData = {
						companyId: localStorage.companyId,
						contactId: estimateData.customerId,
						title: estimateData.estimateName,
						individualId: estimateData.individualId,
						salesRep: estimateData.salesRep,
						priorityId: 1,
						probabilityId: 5,
						description: 'NA',
						stageId: estimateData.stage,
						value: estimateData.totalEstimate,
						createdBy: localStorage.userName
					};
					if (!estimateData.opportunityId) {
						axios.post(api.CREATE_OPPORTUNITY, opportunityData, {
							headers: {
								'Authorization': localStorage.token
							}
						})
							.then(function (response) {
								if (response.data.code == 200) {
									let memoData = {
										opportunityId: response.data.data._id,
										message: 'This opportunity was created by #' + estimateNo + ' by user ' + localStorage.userName,
										userName: localStorage.userName,
									};
									axios.post(api.ADD_OPPORTUNITY_MEMO, memoData, {
										headers: {
											'Authorization': localStorage.token
										}
									})
										.then(function (response) {
											if (response.data.code == 200) {
												if (redirectPage) {
													browserHistory.push(redirectPage);
												}else
												{
													browserHistory.push(`/estimate/${estimateId}`);
												}
												toastr.success(estimateMessage);
											}
										})
										.catch(function (error) {
											$('div#create_estimate').unblock();
										});
								}
								else {
									if (redirectPage) {
										browserHistory.push(redirectPage);
									}else {
										browserHistory.push(`/estimate/${estimateId}`);
									}

									toastr.success(estimateMessage);
								}
							})
							.catch(function (error) {
								$('div#create_estimate').unblock();
							});
					}
					else {
						if (redirectPage) {
							browserHistory.push(redirectPage);
						}else {
							browserHistory.push(`/estimate/${estimateId}`);
						}

						toastr.success(response.data.message);
					}
					return dispatch({ type: types.NEW_ESTIMATE, newEstimate: response.data.data });
				}
				else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_estimate').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_estimate').unblock();
				console.log(error);
			});
	};
}

export function updateEstimate(data, id) {

	return function (dispatch, getState) {

		axios.post(api.UPDATE_ESTIMATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					let modifierName = localStorage.completeName;
					socket.emit('update estimate', modifierName);

					toastr.success(response.data.message);
					browserHistory.push('/estimate/' + id);
					// return dispatch({type:types.UPDATE_ESTIMATE,updatedEstimate:response.data.data})
					// return dispatch({ type: types.UPDATE_OPPORTUNITY, opportunityUpdate: response.data.data })
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#update_estimate').unblock();
				}
			})
			.catch(function (error) {
				$('div#update_estimate').unblock();
				console.log(error);
			});
	};
}

export function updateEstimateRevision(data) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_ESTIMATE_REVISION, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					let modifierName = localStorage.completeName;
					socket.emit('update estimate', modifierName);
				//	// return dispatch({ type: types.UPDATE_OPPORTUNITY, opportunityUpdate: response.data.data })
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#update_estimate').unblock();
				}
			})
			.catch(function (error) {
				$('div#update_estimate').unblock();
				console.log(error);
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
					return dispatch({ type: types.GET_COMPANY_LIST_FOR_ESTIMATE, companyList: response.data.data });
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

export function getOpportunityList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPPORTUNITY_BY_ALPHABET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_OPPORTUNITY_LIST_FOR_ESTIMATE, opportunityList: response.data.data });
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

export function getProjectData(data) {
	return function (dispatch, getState) {

		axios.post(api.GET_PROJECT_BY_ALPHABET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROJECT_LIST_FOR_ESTIMATE, projectList: response.data.data });
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

export function getProposalData(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_PROPOSAL_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROPOSAL_LIST_FOR_ESTIMATE, proposalList: response.data.data });
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
					if (response.data.data[0].ContactAddressesInfo) {
						return dispatch({ type: types.GET_PHONE_INTERNET_FOR_ESTIMATE, companyPhoneInternet: response.data.data[0].ContactAddressesInfo });
					}
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
					return dispatch({ type: types.GET_EST_SALESREP, salesRepList: response.data.data });
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

export function getItemData(data, actionType) {

	return function (dispatch, getState) {
		axios.post(api.GET_ITEM_BY_ALPHABET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: actionType, itemList: response.data.data });
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
					return dispatch({ type: types.GET_EST_INDIVIDUAL, individualList: response.data.data });
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

export function getLaborRates(data, typeData) {

	return function (dispatch, getState) {
		axios.post(api.GET_LABOR_RATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: typeData, laborRates: response.data.data });
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

export function getEstimateDetails(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_DETAILS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {					
					return dispatch({ type: types.GET_ESTIMATE_DETAILS, estimateData: response.data.data });
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
				console.log('Error is ', error);
			});
	};
}

export function deleteEstimate(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_ESTIMATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					toastr.success(response.data.message);
					browserHistory.push('/estimate');
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

export function getCustomerDetails(contact) {

	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_DETAIL, contact, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_CONTACT_DETAIL_FOR_ESTIMATE, contactData: response.data.data[0] });
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

export function addOtherContact(contactData, addType) {

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
						label: contactData.firstname + ' ' + contactData.lastname
					};
					toastr.success(response.data.message);
					if (addType == 'SALES') {
						return dispatch({ type: types.ADD_OTHER_SALES, salesCreated: newContact });
					}
					else if (addType == 'INDIVIDUAL') {
						return dispatch({ type: types.ADD_OTHER_INDIVIDUAL, individualCreated: newContact });
					}

				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
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

export function addOtherCompany(companyData) {
	return function (dispatch, getState) {
		axios.post(api.ADD_COMPANY_CONTACT, companyData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					let newCompany = {
						id: response.data.data._id,
						label: companyData.companyName
					};
					toastr.success(response.data.message);
					return dispatch({ type: types.ADD_OTHER_COMPANY, companyCreated: newCompany });
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

export function addOtherRevision(revisedData, addType) {
	return function (dispatch, getState) {
		axios.post(api.ADD_OTHER_REVISION, revisedData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					if (addType == 1) {
						browserHistory.push('/estimate/' + revisedData.estimateId + '/edit');
					}
					else if (addType == 2) {
						return dispatch({ type: types.ADD_OTHER_REVISION, revision: response.data.data });
					}
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
					return dispatch({ type: types.GET_ESTIMATE_REVISION, revisionData: response.data.data });
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

export function getExportedRevision(data) {

	return function (dispatch, getState) {
		axios.post(api.EXPORT_ESTIMATE_CSV, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					// download('http://i.imgur.com/G9bDaPH.jpg');
					// download(response.data.path);
					// window.open(response.data.path);
					downloadFile(response.data.path);
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

export function addEstMemos(data) {
	return function (dispatch, getState) {

		axios.post(api.ADD_ESTIMATE_MEMO, data, {
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

export function renameRevision(data) {
	return function (dispatch, getState) {
		axios.post(api.RENAME_REVISION, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					// return dispatch({ type: types.RENAME_REVISION, manufacturerList: response.data.data });
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

export function deleteRevision(data, index) {
	return function (dispatch, getState) {
		axios.post(api.DELETE_REVISION, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.DELETE_REVISION, index: index });
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

export function getRevisionCount(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_REVISION_COUNT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_REVISION_COUNT, revisionNo: response.data.count });
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

export function refreshLineItemName(data) {
	return function (dispatch, getState) {
		axios.post(api.REFRESH_LINE_ITEM_NAME, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					let { itemId, lineItemId, estimateItemId } = data;
					let updatedData = {
						itemId: itemId,
						lineItemId: lineItemId,
						estimateItemId: estimateItemId,
						itemName: response.data.data
					};
					return dispatch({ type: types.GET_REFRESHED_NAME_UPDATE, updatedData: updatedData });
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

export function getManufacturerList(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_MANUFACTURER_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.GET_MANUFACTURER_LIST, manufacturerList: response.data.data });
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

export function updateOpportunityState() {
	return function (dispatch, getState) {
		return dispatch({ type: types.UPDATE_OPPORTUNITY_STATE, opportunity: '' });
	};
}

export function clearSelects() {
	return function (dispatch, getState) {
		return dispatch({ type: types.CLEAR_SELECTS, select: '' });
	};
}

export function getEstimateNo(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_NUMBER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_NUMBER, estimateNo: response.data.estimateNo });
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
					return dispatch({ type: types.GET_PROPOSAL_DETAILS, proposalData: response.data.data });
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

export function emptyState() {
	return function (dispatch, getState) {
		return dispatch({ type: types.EMPTY });
	};
}
/**
 * Created by Apurva on 3-oct-2018
 * api to enable inline update functionality on detail view  
 */
export function estimateInlineEdit(data) {
	console.log('>>>>>>>>>>',data);
	let estimateId = data.estimateId;

	return function (dispatch, getState) {
	
		axios.post(api.ESTIMATE_INLINE_EDIT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
	
				if (response.data.code == 200) {
					let modifierName = localStorage.completeName;
					toastr.success(response.data.message);
					var detailData = {
						estimateId: estimateId
					};
					axios.post(api.GET_ESTIMATE_DETAILS, detailData, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {
							if (response.data.code == 200) {
								return dispatch({ type: types.GET_ESTIMATE_DETAILS, estimateData: response.data.data });
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
							console.log('Error', error);
						});
					// browserHistory.push(`/estimate/${estimateId}`);
					// return dispatch({type:types.UPDATE_ESTIMATE,updatedEstimate:response.data.data})
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#update_estimate').unblock();
				}
			})
			.catch(function (error) {
				$('div#update_estimate').unblock();
				console.log(error);
			});
	};
}

export function getCompanyEmployeesList(data){
	return function (dispatch, getState) {

		axios.post(api.GET_COMPANY_EMPLOYEE_LIST,data,{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				// toastr.success(response.data.message);
				return dispatch({ type: types.GET_COMPANY_EMPLOYEE_LIST, employeeList: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}

export function createNewProjectSO(data){
	return function (dispatch, getState) {

		axios.post(api.CREATE_PROJECT_SO,data,{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		}).then(function (response) {
			if (response.data.code == 200) {
				
				toastr.success(response.data.message);
				// return dispatch({ type: types.GET_COMPANY_EMPLOYEE_LIST, employeeList: response.data.data });
			}
			else if (response.data.code == 401) {
				toastr.error(response.data.message);
			}
		}).catch(function (error) {
			console.log(error);
		});
	};
}