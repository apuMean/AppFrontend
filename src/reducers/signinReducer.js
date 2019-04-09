import * as types from '../constants/actionTypes';

export default function signinReducer(state = [], action) {
    switch (action.type) {
        case types.SIGN_IN_USER:
            return [...state,
            Object.assign({}, action.signin)
            ];
        default:
            return state;
    }
}