import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function createInvoice(data) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_INVOICE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    browserHistory.push('/invoice');
                    $('div#create_invoice').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_invoice').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_invoice').unblock();
                console.log(error);
            });
    }
}

export function getInvoices(data) {
    return function (dispatch, getState) {

        axios.post(api.GET_INVOICE_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    // toastr.success(response.data.message);
                    return dispatch({ type: types.GET_INVOICE_LIST, invoiceList: response.data.data });
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

export function deleteInvoice(data) {
    return function (dispatch, getState) {

        axios.post(api.DELETE_INVOICE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    browserHistory.push('/invoice');
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

export function getInvoiceDetails(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_INVOICE_DETAILS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_INVOICE_DETAILS, invoiceData: response.data.data });
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

export function updateInvoice(data) {
    return function (dispatch, getState) {

        axios.post(api.UPDATE_INVOICE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    browserHistory.push('/invoice');
                    $('div#invoice_order').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#invoice_order').unblock();
                }
            })
            .catch(function (error) {
                $('div#invoice_order').unblock();
                console.log(error);
            });
    }
}

