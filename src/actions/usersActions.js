import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getUsers(data) {
    
    return function (dispatch, getState) {
        axios.post(api.GET_USERS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_USERS, usersList: response.data.data });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function getUserDetails(data) {
    
    return function (dispatch, getState) {
        axios.post(api.GET_USER_BY_ID, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_USER_DETAILS, userData: response.data.data });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function getRoles(data) {
    
    return function (dispatch, getState) {
        axios.post(api.GET_ROLES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_ROLES, userRoles: response.data.data });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function updateUserRoles(data) {
    
    return function (dispatch, getState) {
        axios.post(api.UPDATE_ROLES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    toastr.clear();
                    setTimeout(function () {
                        toastr.success(response.data.message);
                    }, 400);
                    // toastr.success(response.data.message);
                }
                else if (response.data.code == 403) {
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

export function updateUserDetails(data, updatedData) {
    
    return function (dispatch, getState) {
        axios.post(api.UPDATE_ROLES, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    updatedData.firstname = data.firstName;
                    updatedData.lastname = data.lastName;
                    updatedData.name = data.firstName + ' ' + data.lastName;
                    toastr.success(response.data.message);
                    return dispatch({ type: types.GET_USER_DETAILS, userData: updatedData });

                }
                else if (response.data.code == 403) {
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

export function updateUserPicture(fileData, userId, updatedData) {
    
    return function (dispatch, getState) {
        var fd = new FormData();
        if (fileData) {
            fd.append("file", fileData);
        }
        fd.append("id", userId);
        axios.post(api.UPDATE_USER_PIC, fd, {
            headers: {
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    updatedData.userImage = response.data.userImage;
                    toastr.success(response.data.message);
                    return dispatch({ type: types.GET_USER_DETAILS, userData: updatedData });

                }
                else if (response.data.code == 403) {
                    toastr.success(response.data.message);
                }
            })
            .catch(function (error) {
                // $('div#create_contact').unblock();
            });
    }
}

export function removeUserPicture(data, updatedData) {
    
    return function (dispatch, getState) {
        axios.post(api.REMOVE_USER_PIC, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                
                if (response.data.code == 200) {
                    updatedData.userImage = "";
                    toastr.clear();
                    toastr.success(response.data.message);
                    return dispatch({ type: types.GET_USER_DETAILS, userData: updatedData });

                }
                else if (response.data.code == 401) {
                    toastr.clear();
                    toastr.error(response.data.message);
                }
                else if (response.data.code == 403) {
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


