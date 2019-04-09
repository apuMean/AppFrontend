import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import toastr from 'toastr';
import { browserHistory } from 'react-router';

export function createItem(data, picData) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_ITEM, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    localStorage.setItem("itemId", response.data.data._id);
                    if (picData) {
                        var fd = new FormData();
                        fd.append("file", picData);
                        fd.append("itemId", localStorage.itemId);
                        axios.post(api.UPDATE_ITEM_PIC, fd, {
                            headers: {
                                'Authorization': localStorage.token
                            }
                        })
                            .then(function (response) {
                                if (response.data.code == 200) {
                                    browserHistory.push('/material');
                                    $('div#create_item').unblock();
                                } else if (response.data.code == 403) {
                                    localStorage.clear();
                                    browserHistory.push('/signin');
                                    toastr.error(response.data.message);
                                }
                            })
                            .catch(function (error) {
                                $('div#create_item').unblock();
                            });
                    }
                    else {
                        $('div#create_item').unblock();
                    }

                    browserHistory.push('/material');
                    $('div#create_item').unblock();
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_item').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_item').unblock();
                console.log(error);
            });
    }
}
export function getCategoryList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_ITEM_CATEGORY, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_CATEGORY, categoryList: response.data.data });
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
export function getTypeList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_ITEM_TYPE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_TYPE, typeList: response.data.data });
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

    $('div#item_category').block({
        message: types.GET_LOADER_IMAGE,
        css: { width: '25%' },
        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
    });

    var categoryData = {
        companyId: localStorage.companyId,
        categoryName: name
    }

    return function (dispatch, getState) {

        axios.post(api.ADD_ITEM_CATEGORY, categoryData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.ADD_ITEM_CATEGORY, categoryData: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                $('div#item_category').unblock();
            })
            .catch(function (error) {
                console.log(error);
                $('div#item_category').unblock();
            });
    }
}
export function addOtherType(name) {

    $('div#item_type').block({
        message: types.GET_LOADER_IMAGE,
        css: { width: '25%' },
        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
    });

    var typeData = {
        companyId: localStorage.companyId,
        itemName: name
    }

    return function (dispatch, getState) {

        axios.post(api.ADD_ITEM_TYPE, typeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.ADD_ITEM_TYPE, typeData: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                $('div#item_type').unblock();
            })
            .catch(function (error) {
                console.log(error);
                $('div#item_type').unblock();
            });
    }
}
export function getItemsList(data) {
    return function (dispatch, getState) {

        axios.post(api.GET_ITEM_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    localStorage.setItem('itemTypeId', response.data.itemType._id);
                    response.data.data.searchText = data.searchText;
                    response.data.data.per_page = data.per_page;
                    return dispatch({ type: types.GET_ITEM_LIST, itemList: response.data.data });
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
export function getItemDetailValues(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_ITEM_DETAILVALUES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_DETAILVALUES, itemData: response.data.data });
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
export function deleteItem(data) {
    return function (dispatch, getState) {

        axios.post(api.DELETE_ITEM, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    browserHistory.push('/material')
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
export function updateItem(data, picData, id) {
    return function (dispatch, getState) {

        axios.post(api.UPDATE_ITEM, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {

                    browserHistory.push('/material/' + id);
                    $('div#update_item').unblock();

                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#update_item').unblock();
                }
            })
            .catch(function (error) {
                $('div#update_item').unblock();
                console.log(error);
            });
    }
}
export function updateOtherCategory(name, id) {
    $('div#item_category').block({
        message: types.GET_LOADER_IMAGE,
        css: { width: '25%' },
        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
    });

    var categoryData = {
        itemCategoryId: id,
        categoryType: name
    }

    return function (dispatch, getState) {

        axios.post(api.UPDATE_ITEM_CATEGORY, categoryData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    // return dispatch({ type: types.ADD_ITEM_CATEGORY, categoryData: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                $('div#item_category').unblock();
            })
            .catch(function (error) {
                console.log(error);
                $('div#item_category').unblock();
            });
    }
}
export function updateOtherType(name, id) {

    $('div#item_type').block({
        message: types.GET_LOADER_IMAGE,
        css: { width: '25%' },
        overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
    });

    var typeData = {
        itemTypeId: id,
        itemType: name
    }

    return function (dispatch, getState) {

        axios.post(api.UPDATE_ITEM_TYPE, typeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    // return dispatch({ type: types.ADD_ITEM_TYPE, typeData: response.data.data });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                $('div#item_type').unblock();
            })
            .catch(function (error) {
                console.log(error);
                $('div#item_type').unblock();
            });
    }
}
export function updateTool(data) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_TOOL, data, {
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
                    // toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
export function getItemsEstimateList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_ESTIMATE_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_ESTIMATE_LIST, itemEstimateList: response.data.data });
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
export function getItemsInvoiceList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_INVOICE_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_INVOICE_LIST, itemInvoiceList: response.data.data });
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
export function getItemsOrderList(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_ORDER_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ITEM_ORDER_LIST, itemOrderList: response.data.data });
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
export function uploadItemsCsv(importData, URL) {
    debugger
    return function (dispatch, getState) {
        if (importData) {
            var fd = new FormData();
            fd.append("file", importData);
            fd.append("id", localStorage.companyId);
            fd.append("itemTypeId", localStorage.itemTypeId);
            fd.append("createdBy", localStorage.userName);
            axios.post(URL, fd, {
                headers: {
                    'Authorization': localStorage.token
                }
            })
                .then(function (response) {
                    if (response.data.code == 200) {
                        if (response.data.invalid.length) {
                            return dispatch({ type: types.GET_ITEM_LOGS, itemLogs: response.data.invalid });
                        }
                        else {
                            browserHistory.push('/material')
                        }
                    } else if (response.data.code == 403) {
                        localStorage.clear();
                        browserHistory.push('/signin');
                        toastr.error(response.data.message);
                    } else if (response.data.code == 404) {
                        $('div#itemList').unblock();
                        toastr.error(response.data.message);
                    }
                    else {
                        $('div#itemList').unblock();
                        toastr.error(response.data.message);
                    }
                })
                .catch(function (error) {
                    $('div#itemList').unblock();
                });
        }
        else {
            $('div#itemList').unblock();
        }
    }
}
export function getRelatedItem(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_ITEM_BY_ALPHABET, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_RELATED_ITEMS, itemList: response.data.data });
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
export function getAlternativeItem(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_ITEM_BY_ALPHABET, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ALERNATIVE_ITEMS, itemList: response.data.data });
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
export function getReplacementItem(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_ITEM_BY_ALPHABET, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_REPLACEMENT_ITEMS, itemList: response.data.data });
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
export function createItemNew(data) {
    return function (dispatch, getState) {

        axios.post(api.CREATE_ITEM, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    localStorage.setItem("itemId", response.data.data._id);
                    toastr.success(response.data.message);
                    return dispatch({ type: types.GET_NEW_CREATEITEM, newCreatedItem: response.data.data });
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
export function updateMaterialPicture(fileData, itemId) {

    return function (dispatch, getState) {
        var fd = new FormData();
        if (fileData) {
            fd.append("file", fileData);
        }
        fd.append("itemId", itemId);
        axios.post(api.UPDATE_ITEM_PIC, fd, {
            headers: {
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                toastr.remove();
                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    return dispatch({ type: types.MATERIAL_PIC_PATH, imagePath: response.data.contactImage })
                }
                else if (response.data.code == 403) {
                    toastr.success(response.data.message);
                }
            })
            .catch(function (error) {
            });
    }
}

export function removeMaterialPicture(data) {

    return function (dispatch, getState) {
        axios.post(api.DELETE_MATERIAL_PIC, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    return dispatch({ type: types.MATERIAL_PIC_PATH, imagePath: false })
                } else if (response.data.code == 403) {
                    toastr.error(response.data.message);
                }
            })
            .catch(function (error) {
            });
    }
}
