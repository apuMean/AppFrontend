import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function groupsReducer(state = [], action) {
    
    let newState;
    switch (action.type) {
        case types.GET_GROUPS:
            return Object.assign({}, state, { groupData: action.groupData });

        case types.GET_MULTIPLE_ADD_CONTACTS:
            return Object.assign({}, state, { multipleAddContacts: action.addmultipledata });

        case types.ADD_GROUP:
            return Object.assign({}, state, { groupData: action.groupData });

        case types.DELETE_GROUP:
            return Object.assign({}, state, { groupData: action.deleteData });

        default:
            return initialState;
    }
}



