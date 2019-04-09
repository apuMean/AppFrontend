import * as types from '../constants/actionTypes';
import initialState from './initialState';

export default function contactOptionsReducer(state = [], action) {
      
    let newState;
    switch (action.type) {
        case types.GET_CONTACT_LINKS:
            return Object.assign({}, state, { contactLinkData: action.linkdata });

        case types.GET_CONTACT_LISTS:
            return Object.assign({}, state, { contactListsData: action.getContacts });

        case types.GET_CONTACT_ESTIMATES:
            return Object.assign({}, state, { contactEstimatesData: action.estimateData });

        case types.GET_CONTACT_PROPOSALS:
            return Object.assign({}, state, { contactProposalsData: action.proposalData });

        case types.GET_CONTACT_PROJECTS:
            return Object.assign({}, state, { contactProjectsData: action.projectData });

        case types.GET_CONTACT_POS:
            return Object.assign({}, state, { contactPosData: action.poData });

        case types.GET_CONTACT_INVOICES:
            return Object.assign({}, state, { contactInvoicesData: action.invoiceData });

        case types.GET_CONTACT_ACTIVITIES:
            return Object.assign({}, state, { contactActivitiesData: action.activityData });

        case types.GET_CONTACT_DOCUMENTS:
            return Object.assign({}, state, { contactDocumentsData: action.documentData });

        case types.GET_CONTACT_OPPORTUNITIES:
            return Object.assign({}, state, { contactOpportunitiesData: action.opportunityData });

        default:
            return initialState;
    }
}

