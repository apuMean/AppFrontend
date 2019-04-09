import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getProjects(data) {

    return function (dispatch, getState) {
        axios.post(api.GET_PROJECTS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PROJECTS_LIST, projectList: response.data.data });
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

export function getProjectDropdowns(data) {

    return function (dispatch, getState) {

        axios.post(api.GET_PROJECT_DROPDOWNS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PROJECT_DROPDOWNS, projectDropdowns: response.data.data });
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
                    return dispatch({ type: types.GET_COMPANY_LIST_FOR_PROJECT, companyList: response.data.data });
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
                    return dispatch({ type: types.GET_INDIVIDUAL_LIST_FOR_PROJECT, individualList: response.data.data });
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

export function createProject(data) {

    return function (dispatch, getState) {

        axios.post(api.CREATE_PROJECT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    browserHistory.push('/project');
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    $('div#create_project').unblock();
                }
            })
            .catch(function (error) {
                $('div#create_project').unblock();
                console.log(error);
            });
    }
}

export function updateProject(data) {

    return function (dispatch, getState) {

        axios.post(api.UPDATE_PROJECT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    // browserHistory.push('/project');
                    toastr.success(response.data.message);
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                    // $('div#create_estimate').unblock();
                }
            })
            .catch(function (error) {
                // $('div#create_estimate').unblock();
                console.log(error);
            });
    }
}

export function getProjectDetails(data) {

    return function (dispatch, getState) {
        axios.post(api.GET_PROJECT_DETAILS, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.GET_PROJECT_DETAILS, projectData: response.data.data });
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

export function deleteProject(data) {

    return function (dispatch, getState) {

        axios.post(api.DELETE_PROJECT, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    toastr.success(response.data.message);
                    browserHistory.push('/project');
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

    var typeData = {
        userId: localStorage.userId,
        companyId: localStorage.companyId,
        categoryName: name
    }
    return function (dispatch, getState) {
        axios.post(api.ADD_PROJECT_CATEGORY, typeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.ADD_OTHER_CATEGORY_FOR_PROJECT, categoryData: response.data.data });
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

export function addOtherDepartment(name) {

    var typeData = {
        userId: localStorage.userId,
        companyId: localStorage.companyId,
        departmentName: name
    }
    return function (dispatch, getState) {

        axios.post(api.ADD_CONTACT_DEPARTMENT, typeData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {

                if (response.data.code == 200) {
                    return dispatch({ type: types.ADD_OTHER_DEPARTMENT_FOR_PROJECT, departmentData: response.data.data });
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

export function addProjMemos(data) {
    return function (dispatch, getState) {

        axios.post(api.ADD_PROJECT_MEMO, data, {
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
    }
}