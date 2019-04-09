import * as types from '../constants/actionTypes';
const initialState = {
	customerList: [],
	individualList: [],
	estimateList: [],
	emailtemplate: [],
	customerAddress: [],
	proposalData: [],
	proposalDetail: [],
	salesRepList: [],
	companyCreated:[],
	individualCreated:[],
	salesCreated:[],
	estimateDataList: [],
	createPrposalData: [],
	newEstimateDetail:[]
};

export default function proposal(state = [], action) {
	switch (action.type) {

	case types.GET_PROPOSALS:
		return Object.assign({}, state, { proposalData: action.proposalList });

	case types.GET_PROPOSAL_DETAILS:
		return Object.assign({}, state, { proposalDetail: action.proposalData });

	case types.GET_COMPANY_LIST_FOR_PROPOSAL:
		return Object.assign({}, state, { customerList: action.customerList });

	case types.GET_ESTIMATE_LIST_FOR_PROPOSAL:
		return Object.assign({}, state, { estimateList: action.estimateList });

	case types.GET_INDIVIDUAL_LIST_FOR_PROPOSAL:
		return Object.assign({}, state, { individualList: action.individualList });

	case types.GET_EMAIL_TEMPLATE:
		return Object.assign({}, state, { emailtemplate: action.emailtemplate });

	case types.GET_PHONE_INTERNET_FOR_PROPOSAL:
		return Object.assign({}, state, { customerAddress: action.customerAddress });

	case types.DELETE_PROPOSAL:
		return Object.assign({}, state, { proposalData: action.deleteProposalData });

	case types.GET_PROPOSAL_SALESREP:
		return Object.assign({}, state, { salesRepList: action.salesRepList });
        
	case types.ADD_OTHER_COMPANY:
		return Object.assign({}, state, { companyCreated: action.companyCreated, individualCreated: '',salesCreated:''});
        
	case types.ADD_OTHER_SALES:
		return Object.assign({}, state, { salesCreated: action.salesCreated, individualCreated: '', companyCreated: ''});
        
	case types.ADD_OTHER_INDIVIDUAL:
		return Object.assign({}, state, { individualCreated: action.individualCreated, salesCreated: '', companyCreated: ''});

	case types.GET_ESTIMATE_LIST:
		return Object.assign({}, state, { estimateDataList: action.estimateDataList, updatedName: '' });
	case types.GET_PROPOSAL_NUMBER:
		return Object.assign({}, state, { proposalNo: action.proposalNo });
	case types.CREATE_PROPOSAL_DATA:
		return Object.assign({}, state, { createPrposalData: action.createPrposalData});
	case types.EMPTY:
		return Object.assign({}, state, { createPrposalData: undefined});
	case types.GET_ESTIMATE_BY_ID:
		return Object.assign({}, state, { newEstimateDetail: action.newEstimateDetail,estimateDataList:[] });
	default:
		return {
			...initialState,
			createPrposalData: state.createPrposalData};
	}
}

