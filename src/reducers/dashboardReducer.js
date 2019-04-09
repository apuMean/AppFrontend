import * as types from '../constants/actionTypes';
import objectAssign from 'object-assign';
const initialState = {
    tasksList: [],
    opportunitiesList: [],
    estimatesList: [],
    projectsList: [],
    ordersList: [],
    invoicesList: [],
    tailgatesList: [],
    goalsList: [],
    categoryList: [],
    salesRepList: [],
    projectDropdowns: {
        Department: [],
        categoryInfo: []
    },
    // contactList: [],
    contactList: {
        contact: [],
        totalcount: 0,
        sortColumnName: null,
        sortOrder: null,
        page: 1,
        per_page: 0
    },
    usersList: []
};

export default function dashboardReducer(state = [], action) {
    let newState;
    switch (action.type) {
        case types.BREAD_CRUMB_TITLE:
            return objectAssign({}, state, {
                parent: action.crumbs.parent,
                childone: action.crumbs.childone,
                childtwo: action.crumbs.childtwo
            });
        case types.GET_OPP_CATEGORY:
            return Object.assign({}, state, { categoryList: action.categoryList });
        case types.GET_DASH_SALESREP:
            return Object.assign({}, state, { salesRepList: action.salesRepList });
        case types.DASH_TASK_LIST:
            return Object.assign({}, state, { tasksList: action.tasksList });
        case types.DASH_OPPORTUNITIES_LIST:
            return Object.assign({}, state, { opportunitiesList: action.opportunityList });
        case types.DASH_ESTIMATE_LIST:
            return Object.assign({}, state, { estimatesList: action.estimatesList });
        case types.DASH_PROJECTS_LIST:
            return Object.assign({}, state, { projectsList: action.projectsList });
        case types.DASH_ORDER_LIST:
            return Object.assign({}, state, { ordersList: action.ordersList });
        case types.DASH_INVOICE_LIST:
            return Object.assign({}, state, { invoicesList: action.invoiceList });
        case types.DASH_GOAL_LIST:
            return Object.assign({}, state, { goalsList: action.goalsList });
        case types.GET_PROJECT_DROPDOWNS_FOR_DASHBOARD:
            return Object.assign({}, state, { projectDropdowns: action.projectDropdowns });
        case types.GET_CONTACTS:
            return Object.assign({}, state, { contactList: action.contactData });
        case types.GET_USERS_FOR_TASK_LIST:
            return Object.assign({}, state, { usersList: action.usersList });

        default:
            return initialState;
    }
}