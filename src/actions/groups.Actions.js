import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getGroups(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_CONTACT_GROUP, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_GROUPS, groupData: response.data.data })
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

export function getAddContactList(groupID) {
    var getGroupData = {
        groupId: groupID,
        companyId: localStorage.companyId
    }
    return function (dispatch, getState) {
        axios.post(api.GET_ADD_CONTACT_LIST, getGroupData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_MULTIPLE_ADD_CONTACTS, addmultipledata: response.data.data })
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

export function getRemoveContactList(groupID) {
    var getGroupData = {
        groupId: groupID,
        companyId: localStorage.companyId
    }
    return function (dispatch, getState) {
        axios.post(api.GET_REMOVE_CONTACT_LIST, getGroupData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_MULTIPLE_ADD_CONTACTS, addmultipledata: response.data.data })
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

export function addMultipleContacts(groupId, multiplecontact) {
    var groupcontactdata = {
        groupId: groupId,
        contactArray: multiplecontact,
        userId: localStorage.userId
    }
    return function (dispatch, getState) {
        axios.post(api.ADD_CONTACT_TO_GROUP, groupcontactdata, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    //return dispatch({ type: types.GET_MULTIPLE_ADD_CONTACTS, addmultipledata: response.data.data })
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

export function removeMultipleContacts(groupId, multiplecontact) {
    var groupcontactdata = {
        groupId: groupId,
        contactArray: multiplecontact,
        userId: localStorage.userId
    }
    return function (dispatch, getState) {
        axios.post(api.REMOVE_CONTACT_FROM_GROUP, groupcontactdata, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    //return dispatch({ type: types.GET_MULTIPLE_ADD_CONTACTS, addmultipledata: response.data.data })
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

export function createGroup(name, groupdata) {

    var groupData = {
        userId: localStorage.userId,
        companyId: localStorage.companyId,
        groupName: name
    }
    return function (dispatch, getState) {

        axios.post(api.ADD_GROUP, groupData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    groupdata.push(response.data.data);
                    toastr.success(response.data.message);
                    return dispatch({ type: types.ADD_GROUP, groupData: groupdata });
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#groupsDiv').unblock();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function deleteGroup(groupId, index, data) {

    var groupdata = {
        groupId: groupId
    }
    return function (dispatch, getState) {

        axios.post(api.DELETE_CONTACT_GROUP, groupdata, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    data.splice(index, 1)
                    toastr.success(response.data.message);
                    return dispatch({ type: types.DELETE_GROUP, deleteData: data })
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


