import * as types from '../constants/actionTypes';
import objectAssign from 'object-assign';
const initialState={
    tailgatesList:[],
};

export default function tailgateReducer(state = [], action) {
    let newState;
    switch (action.type) {

        case types.DASH_TAILGATE_LIST:
            return Object.assign({}, state, {tailgatesList: action.tailgatesList});
        
        default:
            return state;
    }
}