import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getExpenses(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_EXPENSES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_EXPENSES_LIST, expenseList: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function createExpense(data, picData) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_EXPENSE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    if (picData) {
                        var fd = new FormData();
                        fd.append("file", picData);
                        fd.append("expenseId", response.data.data._id);
                        axios.post(api.UPDATE_EXPENSE_IMAGE, fd, {
                            headers: {
                                'Authorization': localStorage.token
                            }
                        })
                            .then(function (response) {
                                if (response.data.code == 200) {
                                    $('div#create_expense').unblock();
                                    browserHistory.push('/expense');
                                    toastr.success(response.data.message);
                                } else if (response.data.code == 403) {
                                    localStorage.clear();
                                    browserHistory.push('/signin');
                                    toastr.error(response.data.message);
                                }
                                else {
                                    $('div#create_expense').unblock();
                                    toastr.error(response.data.message);
                                }
                            })
                            .catch(function (error) {
                                $('div#create_expense').unblock();
                            });
                    }
                    else {
                        $('div#create_expense').unblock();
                        browserHistory.push('/expense');
                        toastr.success(response.data.message);
                    }
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_expense').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_expense').unblock();
            });
    }
}

export function updateEstimate(data) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_ESTIMATE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    toastr.success(response.data.message);
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
    }
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
                    return dispatch({ type: types.GET_PROJECT_LIST_FOR_EXPENSE, projectList: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function getExpenseDetails(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_EXPENSE_DETAILS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_EXPENSE_DETAILS, expenseData: response.data.data });
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
    }
}

export function deleteEstimate(data, index, List) {

    return function (dispatch, getState) {

        axios.post(api.DELETE_ESTIMATE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    List.splice(index, 1)
                    toastr.success(response.data.message);
                    return dispatch({ type: types.DELETE_ESTIMATE, deletedEstimateData: List });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
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
                    return dispatch({ type: types.GET_CONTACT_DETAIL_FOR_ESTIMATE, contactData: response.data.data[0] })
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}





