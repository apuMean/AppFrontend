import * as types from '../constants/actionTypes';
const initialState ={
    categoryList:[],
    clientList:[],
    projectList:[],
    estimateList:[],
    orderList:[],
    poList:[],
    oppList:[],
    documentList:[],
    documentDetailData:''
};

export default function documentCreation(state = [], action) {
    let newState;
    switch (action.type) {

        case types.GET_DOCUMENT_CATEGORY:
            return Object.assign({}, state, { categoryList: action.categoryList });

        case types.ADD_DOCUMENT_CATEGORY:
            newState = Object.assign({}, state);
            newState.categoryList.push(action.categoryData);
            return JSON.parse(JSON.stringify(newState))

        case types.GET_DOC_CLIENT:
            return Object.assign({}, state, { clientList: action.clientList });
    
        case types.GET_DOC_PROJECT:
            return Object.assign({}, state, { projectList: action.projectList });

        case types.GET_DOC_ESTIMATE:
            return Object.assign({}, state, { estimateList: action.estimateList });

        case types.GET_DOC_ORDER:
            return Object.assign({}, state, { orderList: action.orderList });

        case types.GET_DOC_PO:
            return Object.assign({}, state, { poList: action.poList });  

        case types.GET_DOC_OPPORTUNITY:
            return Object.assign({}, state, { oppList: action.opportunityList });   

        case types.GET_DOCUMENT_LIST:
            return Object.assign({}, state, { documentList: action.documentList }); 

        case types.GET_DOCUMENT_DETAILVALUES:
            return Object.assign({}, state, { documentDetailData: action.documentData }); 

        case types.DELETE_DOCUMENT:
            return Object.assign({}, state, { documentList: action.removedocumentData });                 

        default:
            return initialState;
    }
}

