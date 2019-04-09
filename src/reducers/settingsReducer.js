
import * as types from '../constants/actionTypes';
const initialState = {
    industryList: [],
    sourceList: [],
    laborRates: [],
    orderTypesData: [],
    estimateStages: []
};

export default function settings(state = [], action) {

    switch (action.type) {
        case types.GET_INDUSTRIES:
            return Object.assign({}, state, { industryList: action.industriesList });
        case types.GET_OPPORTUNITY_SOURCE:
            return Object.assign({}, state, { sourceList: action.sourcesList });
        case types.GET_LABOR_RATE_FOR_ADMIN:
            return Object.assign({}, state, { laborRates: action.laborRates });
        case types.GET_OTHER_ORDER_TYPE:
            return Object.assign({}, state, { orderTypesData: action.orderTypesData });
        case types.GET_ESTIMATE_STAGES:
            return Object.assign({}, state, { estimateStages: action.estimateStages });
        case types.ADD_INDUSTRIES:
            let newIndustries = state.industryList.slice();
            newIndustries.splice(0, 0, action.newIndustry)
            return Object.assign({}, state, { industryList: newIndustries });
        case types.ADD_OPPORTUNITY_SOURCE:
            let newSource = state.sourceList.slice();
            newSource.splice(0, 0, action.newSource)
            return Object.assign({}, state, { sourceList: newSource });
        case types.ADD_LABOR_RATE_FOR_ADMIN:
            let newRate = state.laborRates;
            newRate.splice(0, 0, action.newRate)
        // return Object.assign({}, state, { laborRates: newRate });
        case types.DELETE_INDUSTRIES:
            let industriesBefore = state.industryList.slice();
            let industriesAfter = industriesBefore.filter(p => p._id !== action.deleteId)
            return Object.assign({}, state, { industryList: industriesAfter });
        case types.DELETE_OPPORTUNITY_SOURCE:
            let sourcesBefore = state.sourceList.slice();
            let sourcesAfter = sourcesBefore.filter(p => p._id !== action.deleteId)
            return Object.assign({}, state, { sourceList: sourcesAfter });
        case types.DELETE_ORDER_TYPE:
            let typesBefore = state.orderTypesData.slice();
            let typesAfter = typesBefore.filter(p => p._id !== action.deleteId)
            return Object.assign({}, state, { orderTypesData: typesAfter });
        case types.DELETE_APP_STAGE:
            let stageBefore = state.estimateStages.slice();
            let stageAfter = stageBefore.filter(p => p._id !== action.deleteId)
            return Object.assign({}, state, { estimateStages: stageAfter });
        case types.DELETE_LABOR_RATE:
            let laborBefore = state.laborRates.slice();
            let laborAfter = laborBefore.filter(p => p._id !== action.deleteId)
            return Object.assign({}, state, { laborRates: laborAfter });
        default:
            return initialState;
    }
}

