import * as types from '../constants/actionTypes';
const initialState = {
	estimateCreate: [],
	estimateUpdate: [],
	estimateList: [],
	estimateDetails: [],
	companyList: [],
	companyPhoneInternet: [],
	salesRepList: [],
	projectList: [],
	proposalList: [],
	itemList: [],
	individualList: [],
	opportunityList: [],
	estList: [],
	estDetailData: [],
	laborRates: [],
	salesCreated: '',
	individualCreated: '',
	companyCreated: '',
	revisionData: [],
	newCreatedItem: '',
	manufacturerList: [],
	revisionNo: 0,
	updatedName: '',
	estimateStages : [],
	updatedEstimate:[],
	proposalDetail:[],
	newEstimate:'',
	newEstimateName:'',
	estimateNo:'',
	employeeList:[]

};

export default function estimate(state = [], action) {
	// debugger
	let newState;
	switch (action.type) {
	case types.GET_ESTIMATE_LIST:
		return Object.assign({}, state, { estimateList: action.estimateList, updatedName: '' });

	case types.CREATE_ESTIMATE:
		return Object.assign({}, state, { estimateCreate: action.estimateCreate });

	case types.GET_COMPANY_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { companyList: action.companyList, contactDetails: '', updatedName: '', estimateDetails: [] });

	case types.GET_PROJECT_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { projectList: action.projectList, contactDetails: '', updatedName: '' });

	case types.GET_PROPOSAL_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { proposalList: action.proposalList, contactDetails: '', updatedName: '' });

	case types.GET_OPPORTUNITY_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { opportunityList: action.opportunityList, contactDetails: '', updatedName: '' });

	case types.GET_PHONE_INTERNET_FOR_ESTIMATE:
		return Object.assign({}, state, { companyPhoneInternet: action.companyPhoneInternet, updatedName: '', estimateDetails: [] });

	case types.GET_EST_SALESREP:
		return Object.assign({}, state, { salesRepList: action.salesRepList, contactDetails: '', updatedName: '', estimateDetails: [] });

	case types.GET_EST_ITEM:
		return Object.assign({}, state, { itemList: action.itemList, manufacturerList: [], contactDetails: '', updatedName: '', estimateDetails: [] });

	case types.GET_EST_INDIVIDUAL:
		return Object.assign({}, state, { individualList: action.individualList, contactDetails: '', updatedName: '', estimateDetails: [] });

	case types.GET_ESTIMATE_DETAILS:
		return Object.assign({}, state, { estimateDetails: action.estimateData, contactDetails: '', updatedName: '' });

	case types.DELETE_ESTIMATE:
		return Object.assign({}, state, { estimateList: action.deletedEstimateData });

	case types.GET_CONTACT_DETAIL_FOR_ESTIMATE:
		return Object.assign({}, state, { contactDetails: action.contactData, updatedName: '', estimateDetails: [] });

	case types.GET_LABOR_RATE:
		return Object.assign({}, state, { laborRates: action.laborRates });

	case types.ADD_OTHER_SALES:
		return Object.assign({}, state, { salesCreated: action.salesCreated, individualCreated: '', companyCreated: '', updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.ADD_OTHER_INDIVIDUAL:
		return Object.assign({}, state, { individualCreated: action.individualCreated, salesCreated: '', companyCreated: '', updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.ADD_OTHER_COMPANY:
		return Object.assign({}, state, { companyCreated: action.companyCreated, individualCreated: '', salesCreated: '', updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_ESTIMATE_REVISION:
		return Object.assign({}, state, { revisionData: action.revisionData, contactDetails: '', updatedName: '' });

	case types.ADD_OTHER_REVISION:
		let data = state.revisionData.slice();
		data.splice(0, 0, action.revision);
		return Object.assign({}, state, { revisionData: data, updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.DELETE_REVISION:
		let currentData = state.revisionData.slice();
		currentData.splice(action.index, 1);
		return Object.assign({}, state, { revisionData: currentData, updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_NEW_CREATEITEM:
		return Object.assign({}, state, { newCreatedItem: action.newCreatedItem, updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_MANUFACTURER_LIST:
		return Object.assign({}, state, { manufacturerList: action.manufacturerList, itemList: [], updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.UPDATE_OPPORTUNITY_STATE:
		return Object.assign({}, state, { individualList: [], salesRepList: [], companyPhoneInternet: [], contactDetails: '', updatedName: '', estimateDetails: [] });

	case types.CLEAR_SELECTS:
		return Object.assign({}, state, { companyList: [], individualList: [], salesRepList: [], updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_ESTIMATE_REVISION_COUNT:
		return Object.assign({}, state, { revisionNo: action.revisionNo, updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_REFRESHED_NAME_UPDATE:
		return Object.assign({}, state, { updatedName: action.updatedData, estimateDetails: [], contactDetails: '', });

	case types.GET_COMPANY_LIST_FOR_CONTACT:
		return Object.assign({}, state, { companyList: action.companyList, individualList: [], salesRepList: [], companyPhoneInternet: [], contactDetails: '', updatedName: '', contactDetails: '', estimateDetails: [] });

	case types.GET_ESTIMATE_NUMBER:
		return Object.assign({}, state, { estimateNo: action.estimateNo });
	case types.GET_ESTIMATE_STAGES:
		return Object.assign({}, state, { estimateStages: action.estimateStages });
	case types.GET_PROPOSAL_DETAILS:
		return Object.assign({}, state, { proposalDetail: action.proposalData });
	case types.NEW_ESTIMATE:
		return Object.assign({}, state, { newEstimate: action.newEstimate });
	case types.ESTIMATE_NAME:
		return Object.assign({}, state, { newEstimateName: action.newEstimateName });
	case types.UPDATE_ESTIMATE:
		    return Object.assign({},state,{updatedEstimate:action.updatedEstimate});
	case types.GET_COMPANY_EMPLOYEE_LIST:
		    return Object.assign({},state,{employeeList:action.employeeList});
	default:
		return initialState;
        // return {
		// 	...initialState,
		// 	createPrposalData: state.createPrposalData};}
	}
}

