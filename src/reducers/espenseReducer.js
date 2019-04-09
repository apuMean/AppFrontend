import * as types from '../constants/actionTypes';
const initialState = {
    estimateCreate: [],
    estimateUpdate: [],
    expenseList: [],
    estimateDetails: [],
    companyList: [],
    companyPhoneInternet: [],
    salesRepList: [],
    projectList: [],
    itemList: [],
    individualList: [],
    opportunityList: [],
    estList: [],
    estDetailData: [],
    expenseDetails:''
};

export default function expense(state = [], action) {
    let newState;
    switch (action.type) {
        case types.GET_EXPENSES_LIST:
            return Object.assign({}, state, { expenseList: action.expenseList });

        case types.CREATE_ESTIMATE:
            return Object.assign({}, state, { estimateCreate: action.estimateCreate });

        case types.GET_PROJECT_LIST_FOR_EXPENSE:
            return Object.assign({}, state, { projectList: action.projectList });

        case types.GET_EXPENSE_DETAILS:
            return Object.assign({}, state, { expenseDetails: action.expenseData });

        case types.DELETE_ESTIMATE:
            return Object.assign({}, state, { estimateList: action.deletedEstimateData });

        default:
            return initialState;
    }
}

