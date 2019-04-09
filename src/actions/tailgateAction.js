import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import axios from 'axios';
import { browserHistory } from 'react-router';

export function getDashTailgateList(data) {
    return function (dispatch, getState) {
        axios.post(api.GET_TAILGATES_LIST, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    return dispatch({ type: types.DASH_TAILGATE_LIST, tailgatesList: response.data.data })
                } else if (response.data.code == 403) {
                    localStorage.clear();
                    browserHistory.push('/signin');
                    toastr.error(response.data.message);
                }
                else {
                    toastr.error(response.data.message);
                }
            }).catch(function (error) {
                console.log(error);
            });
    }
}

export function addNewTailgates(data, tailgateRecordList) {

    return function (dispatch, getState) {
        axios.post(api.ADD_NEW_TAILGATE, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            }
        })
            .then(function (response) {
                if (response.data.code == 200) {
                    tailgateRecordList.push(response.data.data);
                    toastr.success(response.data.message);
                    return dispatch({ type: types.DASH_TAILGATE_LIST, tailgatesList: tailgateRecordList });
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