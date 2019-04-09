import * as types from '../constants/actionTypes';
const initialState = {
    activityList: [],
    templateList: [],
    categoryList: [],
    activityDetails:''
};

export default function activityCreation(state = [], action) {
    let newState;
    switch (action.type) {

        case types.GET_ACTIVITY_LIST:
            return Object.assign({}, state, { activityList: action.activityList });

        case types.DELETE_ACTIVITY:
            return Object.assign({}, state, { activityList: action.removeActivity });

        case types.GET_ACTIVITY_TEMPLATE:
            return Object.assign({}, state, { templateList: action.activitytempalteList });

        case types.GET_ACTIVITY_CATEGORY:
            return Object.assign({}, state, { categoryList: action.activityCategory });

        case types.GET_ACTIVITY_DETAILS:
            return Object.assign({}, state, { activityDetails: action.activityDetail });

        default:
            return initialState;
    }
}

