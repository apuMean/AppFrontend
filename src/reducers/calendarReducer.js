import * as types from '../constants/actionTypes';
import objectAssign from 'object-assign';
const initialState = {
    eventRecordsList: [],
    individualList:[],
};

export default function calendarReducer(state = [], action) {
    
    let newState;
    switch (action.type) {
        case types.GET_EVENT_RECORD_LIST:
            return Object.assign({}, state, { eventRecordsList: action.eventRecordsList });
        case types.GET_INDIVIDUALS_LISTS:    
            return Object.assign({}, state, { individualList: action.individualList });    
        case types.EVENT_LIST_BY_CONTACT:    
            return Object.assign({}, state, { eventRecordsList: action.eventRecordsList });                    
        default:
            return initialState;
    }
}

