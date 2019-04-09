import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function createContactReducer(state = [], action) {
    let newState;
    switch (action.type) {
        case types.GET_COMPANY_LIST_FOR_CONTACT:
            return Object.assign({}, state, { companyList: action.companyList });

        case types.GET_PARENT_COMPANY_LIST_FOR_CONTACT:
            return Object.assign({}, state, { parentCompanyList: action.parentCompanyList });

        case types.GET_ASSOCIATED_CONTACTS:
            return Object.assign({}, state, { associatedContacts: action.associatedContacts });

        case types.CREATE_CONTACT:
            return Object.assign({}, state, { createcontact: action.createcontact });

        case types.CREATE_CONTACT_MORE:
            return Object.assign({}, state, { contactMoreInfo: action.contactMoreInfo });

        case types.GET_CONTACT_DROPDOWNS:
            return Object.assign({}, state, { contactDropdowns: action.contactDropdowns });

        case types.ADD_OTHER_TYPE:
            newState = Object.assign({}, state);
            newState.contactDropdowns.type.push(action.typeData);
            return newState

        case types.ADD_OTHER_STATUS:
            newState = Object.assign({}, state);
            newState.contactDropdowns.status.push(action.statusData);
            return newState

        case types.ADD_OTHER_SOURCE:
            newState = Object.assign({}, state);
            newState.contactDropdowns.source.push(action.sourceData);
            return newState

        case types.ADD_OTHER_DEPARTMENT:
            newState = Object.assign({}, state);
            newState.contactDropdowns.Department.push(action.departmentData);
            return newState

        case types.DELETE_OTHER_DEPARTMENT:
            var data = Object.assign({}, state);
            newState = JSON.parse(JSON.stringify(data));
            newState.contactDropdowns.Department.splice(action.departmentData, 1);
            return newState

        case types.ADD_OTHER_INDUSTRY:
            newState = Object.assign({}, state);
            newState.contactDropdowns.industry.push(action.industryData);
            return newState

        case types.DELETE_OTHER_INDUSTRY:
            var data = Object.assign({}, state);
            newState = JSON.parse(JSON.stringify(data));
            newState.contactDropdowns.industry.splice(action.industryData, 1);
            return newState

        case types.ADD_OTHER_KEYWORD:
            newState = Object.assign({}, state);
            newState.contactDropdowns.keyword.push(action.keywordData);
            return newState

        case types.DELETE_CONTACT:
            return Object.assign({}, state, { contactList: action.deleteData });

        case types.GET_CONTACTS:
            return Object.assign({}, state, { contactList: action.contactData });

        case types.GET_CONTACT_DETAILS:
            return Object.assign({}, state, { contactDetails: action.contactDetails });

        case types.GET_CONTACT:
            return Object.assign({}, state, { contactData: action.contactData });

        case types.UPDATE_CONTACT:
            return Object.assign({}, state, { updatedContactData: action.updatedcontactdata });

        case types.ADD_ASSOCIATEDCONTACT:
            return Object.assign({}, state, { individualAssociated: action.individualAssociated });

        case types.CONTACT_PIC_PATH:
            return Object.assign({}, state, { imagePath: action.imagePath });

        case types.SALES_SIGN_PATH:
            return Object.assign({}, state, { salesImagePath: action.salesImagePath });

        default:
            return initialState;
    }
}

