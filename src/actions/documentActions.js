import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function createDocument(data, docData) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_DOCUMENT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {

                    localStorage.setItem("documentId", response.data.data._id);
                    if (docData) {
                        var fd = new FormData();
                        fd.append("file", docData);
                        fd.append("id", localStorage.documentId);
                        axios.post(api.UPDATE_DOC_FILE, fd, {
                            headers: {
                                'Authorization': localStorage.token
                            }
                        })
                            .then(function (response) {
                                if (response.data.code == 200) {
                                    // browserHistory.push('/document');
                                    $('div#create_document').unblock();
                                } else if (response.data.code == 403) {
                                    localStorage.clear();
                                    browserHistory.push('/signin');
                                    toastr.error(response.data.message);
                                }
                            })
                            .catch(function (error) {
                                $('div#create_document').unblock();
                            });
                    }
                    else {
                        $('div#create_document').unblock();
                    }

                    browserHistory.push('/document');
                    $('div#create_document').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_document').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_document').unblock();
                console.log(error);
            });
    }
}
export function getCategoryList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_DOCUMENT_CATEGORY, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOCUMENT_CATEGORY, categoryList: response.data.data });
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

export function addOtherCategory(name) {

    $('div#document_category').block({
        message: types.GET_LOADER_IMAGE,
        css: { width: '25%' },
        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
    });

    var categoryData = {
        companyId: localStorage.companyId,
        categoryName: name
    }

    return function (dispatch, getState) {
        axios.post(api.ADD_DOCUMENT_CATEGORY, categoryData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.ADD_DOCUMENT_CATEGORY, categoryData: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                $('div#document_category').unblock();
            })
            .catch(function (error) {
                console.log(error);
                $('div#document_category').unblock();
            });
    }
}
export function getClientData(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_COMPANY_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_CLIENT, clientList: response.data.data });
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
export function getProjectData(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_DOC_PROJECT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_PROJECT, projectList: response.data.data });
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
export function getEstimateData(data) {
    return function (dispatch, getState) {

        axios.post(api.GET_DOC_ESTIMATE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_ESTIMATE, estimateList: response.data.data });
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
export function getOrderData(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_DOC_ORDER, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_ORDER, orderList: response.data.data });
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
export function getPoData(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_DOC_PO, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_PO, poList: response.data.data });
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
export function getOpportunityData(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_OPPORTUNITY_BY_ALPHABET, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOC_OPPORTUNITY, opportunityList: response.data.data });
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
export function getDocmentsList(data) {
    return function (dispatch, getState) {

        axios.post(api.GET_DOCUMENT_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOCUMENT_LIST, documentList: response.data.data });
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
export function getDocumentDetailValues(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_DOCUMENT_DETAILVALUES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_DOCUMENT_DETAILVALUES, documentData: response.data.data });
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
export function updateDocument(data, docData) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_DOCUMENT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {

                    if (docData) {
                        var fd = new FormData();
                        fd.append("file", docData);
                        fd.append("id", this.props.params.documentId);
                        axios.post(api.UPDATE_DOC_FILE, fd, {
                            headers: {
                                'Authorization': localStorage.token
                            }
                        })
                            .then(function (response) {
                                if (response.data.code == 200) {
                                    // browserHistory.push('/document');
                                    $('div#update_document').unblock();
                                } else if (response.data.code == 403) {
                                    localStorage.clear();
                                    browserHistory.push('/signin');
                                    toastr.error(response.data.message);
                                }
                            })
                            .catch(function (error) {

                                $('div#update_document').unblock();
                            });
                    }
                    else {
                        browserHistory.push('/document');
                        $('div#update_document').unblock();
                    }

                    browserHistory.push('/document');
                    $('div#update_document').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#update_document').unblock();
                }
            })
            .catch(function (error) {
                $('div#update_document').unblock();
                console.log(error);
            });
    }
}
export function deleteDocument(data, index, List) {
    return function (dispatch, getState) {
        axios.post(api.DELETE_DOCUMENT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    browserHistory.push('/document');
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