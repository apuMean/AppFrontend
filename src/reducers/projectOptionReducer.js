import * as types from '../constants/actionTypes';
const initialState = {
    itemList: [],
    costingList: [],
    activityList: [],
    timerList: [],
    documentList: [],
    invoiceList: [],
    dailiesList: [],
    toolsList: [],
    projectEstimateList: [],
    projectPosList: [],
    projectExpensesList: []
};

export default function projectOption(state = [], action) {

    let newState;
    switch (action.type) {

        case types.GET_TRACKING_ITEM:
            return Object.assign({}, state, { itemList: action.itemList });

        case types.GET_COSTING_DATA:
            return Object.assign({}, state, { costingList: action.costingList });

        case types.GET_PROJECT_ACTIVITY:
            return Object.assign({}, state, { activityList: action.activityList });

        case types.GET_PROJECT_TIMER:
            return Object.assign({}, state, { timerList: action.timerList });

        case types.GET_PROJECT_DOCUMENT:
            return Object.assign({}, state, { documentList: action.documentList });

        case types.GET_PROJECT_INVOICE:
            return Object.assign({}, state, { invoiceList: action.invoiceList });

        case types.GET_PROJECT_DAILIES:
            return Object.assign({}, state, { dailiesList: action.dailiesList });

        case types.DELETE_DAILY_REPORT:
            return Object.assign({}, state, { dailiesList: action.deletedDailyData });

        case types.GET_PROJECT_TOOLS:
            return Object.assign({}, state, { toolsList: action.toolsList });

        case types.GET_PROJECT_ESTIMATE:
            return Object.assign({}, state, { projectEstimateList: action.projectEstimate });

        case types.GET_PROJECT_PO:
            return Object.assign({}, state, { projectPosList: action.projectPos });

        case types.GET_PROJECT_EXPENSES:
            return Object.assign({}, state, { projectExpensesList: action.projectExpenses });        

        default:
            return initialState;
    }
}

