import * as types from '../constants/actionTypes';
const initialState = {
	opportunityCreate: [],
	opportunityUpdate: [],
	categoryList: [],
	companyList: [],
	endUserList: [],
	departmentList: [],
	companyPhoneInternet: [],
	salesRepList: [],
	individualList: [],
	oppList: [],
	oppList: {
		opportunity: [],
		totalcount: 0,
		sortColumnName: null,
		sortOrder: null,
		page: 1,
		per_page: 100
	},
	oppDetailData: '',
	oppCount: '',
	oppEstimates: [],
	industryList: [],
	createdContact: '',
	suggestionlist: [],
	filesData: [],
	sourceList: [],
	estimateStages: []
};

export default function opportunity(state = [], action) {

	let newState;
	switch (action.type) {
	case types.CREATE_OPPORTUNITY:
		return Object.assign({}, state, {
			opportunityCreate: action.opportunityCreate
		});

	case types.UPDATE_OPPORTUNITY:
		return Object.assign({}, state, {
			opportunityUpdate: action.opportunityUpdate
		});

	case types.GET_OPP_CATEGORY:
		return Object.assign({}, state, {
			categoryList: action.categoryList
		});

	case types.ADD_OPP_CATEGORY:
		newState = Object.assign({}, state);
		newState.categoryList.push(action.categoryData);
		return JSON.parse(JSON.stringify(newState));
		// return Object.assign({}, state, { categoryList: [action.categoryData] }); 

	case types.GET_COMPANY_LIST:
		return Object.assign({}, state, {
			companyList: action.companyList
		});

	case types.GET_END_USER_LIST:
		return Object.assign({}, state, {
			endUserList: action.endUserList
		});

		endUserList;
	case types.GET_DEPARTMENT_LIST:
		return Object.assign({}, state, {
			departmentList: action.departmentList.Department
		});

	case types.GET_INDUSTRY_LIST:
		return Object.assign({}, state, {
			industryList: action.industryList
		});

	case types.ADD_OPP_DEPARTMENT:
		newState = Object.assign({}, state);
		newState.departmentList.push(action.departmentData);
		return JSON.parse(JSON.stringify(newState));

	case types.ADD_OPP_INDUSTRY:
		newState = Object.assign({}, state);
		newState.industryList.push(action.industryData);
		return JSON.parse(JSON.stringify(newState));

	case types.GET_PHONE_INTERNET:
		return Object.assign({}, state, {
			companyPhoneInternet: action.companyPhoneInternet
		});

	case types.GET_OPP_SALESREP:
		return Object.assign({}, state, {
			salesRepList: action.salesRepList
		});

	case types.GET_OPP_INDIVIDUAL:
		return Object.assign({}, state, {
			individualList: action.individualList
		});

	case types.GET_OPP_LIST:
		return Object.assign({}, state, {
			oppList: action.oppList
		});

	case types.GET_OPP_DETAILVALUES:
		return Object.assign({}, state, {
			oppDetailData: action.oppData
		});

	case types.GET_OPP_NUMBER:
		return Object.assign({}, state, {
			oppCount: action.oppCount
		});

	case types.DELETE_OPPORTUNITY:
		// newState = Object.assign({}, state);
		// state.oppList.splice(action.removeoppData, 1);
		// return newState
		return Object.assign({}, state, {
			oppList: action.removeoppData
		});

	case types.GET_OPPS_ESTIMATE:
		return Object.assign({}, state, {
			oppEstimates: action.oppEstimates
		});

	case types.ADD_OTHER_CONTACT:
		return Object.assign({}, state, {
			createdContact: action.createdContact
		});

	case types.GET_OPPTAGS:
		return Object.assign({}, state, {
			suggestionlist: action.suggestionlist
		});

	case types.GET_OPP_FILES:
		return Object.assign({}, state, {
			filesData: action.filesData
		});

	case types.UPDATE_FILE_NAME:
		let index = state.filesData.findIndex(p => p._id === action.payload._id);
		let currentFiles = state.filesData.slice();
		currentFiles.splice(index, 1, action.payload);
		return Object.assign({}, state, {
			filesData: currentFiles
		});

	case types.UPLOAD_OPP_FILES:
		let newArray = state.filesData.slice();
		for (var i in action.filesData) {
			newArray.splice(0, 0, action.filesData[i]);
		}
		return Object.assign({}, state, {
			filesData: newArray
		});

	case types.GET_OPPORTUNITY_SOURCE:
		return Object.assign({}, state, {
			sourceList: action.sourcesList
		});
	case types.GET_ESTIMATE_STAGES:
		return Object.assign({}, state, {
			estimateStages: action.estimateStages
		});

	default:
		return initialState;
	}
}
