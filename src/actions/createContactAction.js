import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

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
					return dispatch({ type: types.GET_COMPANY_LIST_FOR_CONTACT, companyList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				toastr.error(error.message);
			});
	};
}

export function getParentCompanyList(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_PARENT_COMPANY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_PARENT_COMPANY_LIST_FOR_CONTACT, parentCompanyList: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				toastr.error(error.message);
			});
	};
}

export function createContact(data, picData, userType) {
	return function (dispatch, getState) {
		axios.post(api.ADD_COMPANY_CONTACT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					localStorage.setItem('contactId', response.data.data._id);
					if (picData) {
						var fd = new FormData();
						fd.append('file', picData);
						fd.append('id', localStorage.contactId);
						axios.post(api.UPDATE_CONTACT_PIC, fd, {
							headers: {
								'Authorization': localStorage.token
							}
						})
							.then(function (response) {
								if (response.data.code == 200 && userType == 1) {
									browserHistory.push('/company');
									$('div#create_contact').unblock();
									toastr.success('Company info added successfully');
								}
								else if (response.data.code == 200 && userType == 2) {
									browserHistory.push('/contact');
									$('div#create_contact').unblock();
									toastr.success('Contact info added successfully');
								} else if (response.data.code == 403) {
									localStorage.clear();
									browserHistory.push('/signin');
									toastr.error(response.data.message);
								}
								else {
									toastr.error(response.data.message);
									$('div#create_contact').unblock();
								}
							})
							.catch(function (error) {
								$('div#create_contact').unblock();
							});
					}
					else {
						if (response.data.code == 200 && userType == 1) {
							browserHistory.push('/company');
							$('div#create_contact').unblock();
							toastr.success('Company info added successfully');
						}
						else if (response.data.code == 200 && userType == 2) {
							browserHistory.push('/contact');
							$('div#create_contact').unblock();
							toastr.success('Contact info added successfully');
						} else if (response.data.code == 403) {
							localStorage.clear();
							browserHistory.push('/signin');
							toastr.error(response.data.message);
						}
						else {
							toastr.error(response.data.message);
							$('div#create_contact').unblock();
						}
					}
					return dispatch({ type: types.CREATE_CONTACT, createcontact: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#create_contact').unblock();
				}
			})
			.catch(function (error) {
				$('div#create_contact').unblock();
			});
	};
}

export function updateContact(data, picData, userType, id) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_COMPANY_CONTACT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				$('div#edit_contact').unblock();
				if (response.data.code == 200) {

					if (response.data.code == 200 && userType == 1) {
						$('div#edit_contact').unblock();
						browserHistory.push('/company/' + id);
						// toastr.success(response.data.message);
						toastr.success("Company info updated successfully");

					}
					else if (response.data.code == 200 && userType == 2) {
						$('div#edit_contact').unblock();
						browserHistory.push('/contact/' + id);
						toastr.success(response.data.message);
					} else if (response.data.code == 403) {
						localStorage.clear();
						browserHistory.push('/signin');
						toastr.error(response.data.message);
					}
					else {
						$('div#edit_contact').unblock();
						toastr.error(response.data.message);
					}

				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					toastr.error(response.data.message);
					$('div#edit_contact').unblock();
				}
			})
			.catch(function (error) {
				$('div#edit_contact').unblock();
			});
	};
}

export function createContactMoreInfo(data, userType) {
	return function (dispatch, getState) {
		axios.post(api.ADD_COMPANY_MORE_INFO, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200 && userType == 1) {
					browserHistory.push('/company');
					toastr.success(response.data.message);
					$('div#edit_contact').unblock();
				}
				else if (response.data.code == 200 && userType == 2) {
					browserHistory.push('/contact');
					toastr.success(response.data.message);
					$('div#edit_contact').unblock();
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
				else {
					$('div#edit_contact').unblock();
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				$('div#edit_contact').unblock();
			});
	};
}

export function getContactDropdowns(data) {

	return function (dispatch, getState) {

		axios.post(api.GET_CONTACT_DROPDOWN, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_CONTACT_DROPDOWNS, contactDropdowns: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function getContactDetails(contact, userType) {

	if (userType == 1) {

	}
	else if (userType == 2) {

	}
}

export function getContact(contact) {
	return function (dispatch, getState) {
		axios.post(api.GET_CONTACT_DETAIL, contact, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					if (response.data.data.length == 0) {
						toastr.error(types.COMPANY_EXISTANCE);
						browserHistory.push('/company');
					} else {
						return dispatch({ type: types.GET_CONTACT, contactData: response.data.data[0] });
					}
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}
//Add Other Actions
export function addOtherType(name) {

	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		typeName: name
	};
	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_TYPE, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_TYPE, typeData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function addOtherStatus(name) {

	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		statusName: name
	};
	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_STATUS, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_STATUS, statusData: response.data.data });
				} else if (response.data.code == 401) {
					toastr.error(response.data.message);
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function addOtherSource(name) {

	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		sourceName: name
	};
	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_SOURCE, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_SOURCE, sourceData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function addOtherDepartment(name) {

	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		departmentName: name
	};
	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_DEPARTMENT, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_DEPARTMENT, departmentData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function deleteDepartment(id, index) {
	var data = {
		departmentId: id
	};
	return function (dispatch, getState) {

		axios.post(api.DELETE_CONTACT_DEPARTMENT, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.DELETE_OTHER_DEPARTMENT, departmentData: index });
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
			});
	};
}

export function addOtherIndustry(name) {

	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		industryName: name
	};
	return function (dispatch, getState) {

		axios.post(api.ADD_CONTACT_INDUSTRY, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_INDUSTRY, industryData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function deleteIndustry(id, index) {
	var data = {
		industryId: id
	};
	return function (dispatch, getState) {

		axios.post(api.DELETE_CONTACT_INDUSTRY, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.DELETE_OTHER_INDUSTRY, industryData: index });
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
			});
	};
}

export function addOtherKeyword(name) {
	var typeData = {
		userId: localStorage.userId,
		companyId: localStorage.companyId,
		keyword: name
	};
	return function (dispatch, getState) {
		axios.post(api.ADD_CONTACT_KEYWORD, typeData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({ type: types.ADD_OTHER_KEYWORD, keywordData: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function deleteContact(contactId, userType) {

	var contactData = {
		contactId: contactId
	};
	return function (dispatch, getState) {
		axios.post(api.DELETE_CONTACT, contactData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					if (userType === 1) {
						browserHistory.push('/company');
						toastr.success(response.data.message);
					}
					else if (userType === 2) {
						browserHistory.push('/contact');
						toastr.success(response.data.message);
					}
					// data.splice(index, 1)
					// toastr.success(response.data.message);
					// return dispatch({ type: types.DELETE_CONTACT, deleteData: data })
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function getAssociatedContacts(data) {

	return function (dispatch, getState) {
		axios.post(api.GET_ASSOCIATED_CONTACTS, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({ type: types.GET_ASSOCIATED_CONTACTS, associatedContacts: response.data.data });
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {

			});
	};
}

export function addOtherContactAssociate(contactData, addType) {

	return function (dispatch, getState) {
		axios.post(api.ADD_COMPANY_CONTACT, contactData, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {

					// return dispatch({ type: types.ADD_ASSOCIATEDCONTACT, individualAssociated:  contactData })
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
			});
	};
}

export function updateCompanyPicture(fileData, contactId) {

	return function (dispatch, getState) {
		var fd = new FormData();
		if (fileData) {
			fd.append('file', fileData);
		}
		fd.append('id', contactId);
		axios.post(api.UPDATE_CONTACT_PIC, fd, {
			headers: {
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.CONTACT_PIC_PATH, imagePath: response.data.contactImage });
				}
				else if (response.data.code == 403) {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function updateContactPicture(fileData, contactId) {

	return function (dispatch, getState) {
		var fd = new FormData();
		if (fileData) {
			fd.append('file', fileData);
		}
		fd.append('id', contactId);
		axios.post(api.UPDATE_CONTACT_PIC, fd, {
			headers: {
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.CONTACT_PIC_PATH, imagePath: response.data.contactImage });
				}
				else if (response.data.code == 403) {
					toastr.success(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function updateSalesSignature(fileData, contactId) {
	return function (dispatch, getState) {
		let fd = new FormData();
		if (fileData) {
			fd.append('file', fileData);
		}
		fd.append('id', contactId);
		axios.post(api.UPDATE_SALESREP_SIGN, fd, {
			headers: {
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.SALES_SIGN_PATH, salesImagePath: response.data.url });
				}
				else if (response.data.code == 403) {
					toastr.success(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function removeCompanyPicture(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_CONTACT_PIC, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.CONTACT_PIC_PATH, imagePath: '' });
				} else if (response.data.code == 403) {
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
			});
	};
}

export function updateSignature(signBlob) {
	return function (dispatch, getState) {
		axios.post(api.UPDATE_SIGNATURE_SALESREP, signBlob, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				toastr.remove();
				if (response.data.code == 200) {
					toastr.success(response.data.message);
					return dispatch({ type: types.SALES_SIGN_PATH, salesImagePath: response.data.url });
				}
				else if (response.data.code == 403) {
					toastr.success(response.data.message);
				}
			})
			.catch(function (error) { });
	};
}




