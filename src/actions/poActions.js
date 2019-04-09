import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import toastr from 'toastr';
import { browserHistory } from 'react-router';

export function getRequestBy(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_OPP_INDIVIDUAL, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_REQUESTBY, individualList: response.data.data });
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
export function createPO(data) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_PO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    browserHistory.push('/po');
                    $('div#create_po').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_po').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_po').unblock();
                console.log(error);
            });
    }
}
export function getPos(data) {

    return function (dispatch, getState) {
        axios.post(api.GET_PO_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PO_LIST, poList: response.data.data });
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
export function deletePo(data) {
    return function (dispatch, getState) {
        axios.post(api.DELETE_PO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    browserHistory.push('/po');
                    toastr.success(response.data.message);
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
export function getPoDetails(data) {

    return function (dispatch, getState) {
        axios.post(api.GET_PO_DETAILS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PO_DETAILS, poData: response.data.data });
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
export function updatePO(data, id) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_PO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    browserHistory.push('/po/' + id);
                    toastr.success(response.data.message);
                    $('div#create_po').unblock();
                    // return dispatch({ type: types.UPDATE_OPPORTUNITY, opportunityUpdate: response.data.data })
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_po').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_po').unblock();
                console.log(error);
            });
    }
}
export function uploadFile(picData, desc, poId, attachmentData) {
    return function (dispatch, getState) {
        var fd = new FormData();
        fd.append("file", picData);
        fd.append("id", poId);
        fd.append("description", desc);

        axios.post(api.UPDATE_PO_FILE, fd, {
            headers: {
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    attachmentData.push(response.data.data);
                    toastr.success(response.data.message);
                    return dispatch({ type: types.UPDATE_ATTACHMENT, uploadFile: attachmentData });
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
                // $('div#edit_contact').unblock();
            });
    }
}
export function deleteFileAttachment(data, index, List) {
    return function (dispatch, getState) {
        axios.post(api.DELETE_ATTACHMENT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    List.splice(index, 1)
                    toastr.success(response.data.message);
                    return dispatch({ type: types.DELETE_ATTACHMENT, deleteAttachment: List });
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
export function updatePOItem(data) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_PO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    $('div#create_po').unblock();
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    $('div#create_po').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_po').unblock();
                console.log(error);
            });
    }
}
export function getPurchaseOrderNo(data) {
    
    return function (dispatch, getState) {
        axios.post(api.GET_PO_NO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PO_NO, poNumber: response.data.poNumber });
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
