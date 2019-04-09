import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getEstimateById(data){
	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_BY_ID, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_BY_ID, newEstimateDetail: response.data.data });
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
export function getProposals(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_PROPOSALS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROPOSALS, proposalList: response.data.data });
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
					return dispatch({ type: types.GET_COMPANY_LIST_FOR_PROPOSAL, customerList: response.data.data });
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

export function getIndividualList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_OPP_INDIVIDUAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_INDIVIDUAL_LIST_FOR_PROPOSAL, individualList: response.data.data });
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

export function getEstimateList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_ESTIMATE_BY_ALPHABET, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_LIST_FOR_PROPOSAL, estimateList: response.data.data });
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


export function createProposal(data) {
	return function (dispatch, getState) {
		axios.post(api.CREATE_PROPOSAL, data, {
			// axios.post("http://172.10.55.154:5000/api/addProposal", data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					let proposalId=response.data.data._id;
					browserHistory.push('/proposal/'+proposalId);
					toastr.success(response.data.message);
					// return dispatch({ type: types.CREATE_ESTIMATE, opportunityCreate: response.data.data })
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_proposal').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_proposal').unblock();
				console.log(error);
			});
	};
}

export function updateProposal(data, id) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_PROPOSAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					$('div#create_proposal').unblock();
					browserHistory.push('/proposal/'+id);
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_proposal').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_proposal').unblock();
				console.log(error);
			});
	};
}

export function getCompanyAddress(data) {

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
						return dispatch({ type: types.GET_PHONE_INTERNET_FOR_PROPOSAL, customerAddress: response.data.data[0].ContactAddressesInfo });
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

export function deleteProposal(data) {

	return function (dispatch, getState) {

		axios.post(api.DELETE_PROPOSAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					toastr.success(response.data.message);
					browserHistory.push('/proposal');
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

export function sendProposal(data) {

	return function (dispatch, getState) {
		axios.post(api.SEND_PROPOSAL, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
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
export function clearSelects() {
	return function (dispatch, getState) {
		return dispatch({ type: types.CLEAR_SELECTS, select: '' });
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

export function getEstimates(data) {
	return function (dispatch, getState) {
		axios.post(api.SEARCH_ESTIMATES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ESTIMATE_LIST, estimateDataList: response.data.data });
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

export function getProposalNo(data){
	return function (dispatch, getState) {
		axios.post(api.GET_PROPOSAL_NUMBER, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PROPOSAL_NUMBER, proposalNo: response.data.proposalNumber });
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

export function ProposalforEstimate(data){
    return function(dispatch,getState){
        return dispatch({ type: types.CREATE_PROPOSAL_DATA, createPrposalData: data });
    }

   
}

export function emptyState(){
	return function(dispatch,getState){
        return dispatch({ type: types.EMPTY });
    }
}