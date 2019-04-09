import * as types from '../constants/actionTypes';
const initialState = {
    usersList: [],
    userRoles: [],
    userData: ''
};

export default function timer(state = [], action) {
    let newState;
    switch (action.type) {
        case types.GET_USERS:
            return Object.assign({}, state, { usersList: action.usersList });

        case types.GET_USER_DETAILS:
            return Object.assign({}, state, { userData: action.userData });

        case types.GET_ROLES:
            return Object.assign({}, state, { userRoles: action.userRoles });

        default:
            return initialState;
    }
}

