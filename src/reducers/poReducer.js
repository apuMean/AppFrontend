import * as types from '../constants/actionTypes';
const initialState = {
    itemList: [],
    requestList: [],
    poList: [],
    manufacturerList: [],
    newCreatedItem: '',
    poDetails: '',
    poFile: '',
    laborRates: [],
    poNumber:''
};

export default function poLists(state = [], action) {
    let newState;
    switch (action.type) {

        case types.GET_REQUESTBY:
            return Object.assign({}, state, { requestList: action.individualList });

        case types.GET_PO_LIST:
            return Object.assign({}, state, { poList: action.poList });

        case types.DELETE_PO:
            return Object.assign({}, state, { poList: action.deletedPoData });

        case types.GET_PO_DETAILS:
            return Object.assign({}, state, { poDetails: action.poData });

        case types.UPDATE_ATTACHMENT:
            return Object.assign({}, state, { poFile: action.uploadFile });

        case types.DELETE_ATTACHMENT:
            return Object.assign({}, state, { poFile: action.deleteAttachment });

        case types.GET_PO_ITEM:
            return Object.assign({}, state, { itemList: action.itemList });

        case types.GET_MANUFACTURER_LIST:
            return Object.assign({}, state, { manufacturerList: action.manufacturerList });

        case types.GET_NEW_CREATEITEM:
            return Object.assign({}, state, { newCreatedItem: action.newCreatedItem });

        case types.GET_LABOR_RATE_PO:
            return Object.assign({}, state, { laborRates: action.laborRates });
        case types.GET_PO_NO:
            return Object.assign({}, state, { poNumber: action.poNumber });       

        default:
            return initialState;
    }
}

