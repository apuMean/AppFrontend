import * as types from '../constants/actionTypes';
const initialState = {
	companyList: [],
	individualList: [],
	estimateList: [],
	projectList: [],
	emailtemplate: [],
	customerAddress: [],
	proposalData: [],
	proposalDetails: [],
	projectDropdowns: {
		Department: [],
		categoryInfo: []
	},
	projectDetailData:''
};

export default function project(state = [], action) {
	let newState;
	switch (action.type) {

	case types.GET_PROJECTS_LIST:
		return Object.assign({}, state, { projectList: action.projectList });

	case types.DELETE_PROJECT:
		return Object.assign({}, state, { projectList: action.deletedProjectData });

	case types.GET_PROJECT_DROPDOWNS:
		return Object.assign({}, state, { projectDropdowns: action.projectDropdowns });

	case types.GET_COMPANY_LIST_FOR_PROJECT:
		return Object.assign({}, state, { companyList: action.companyList });

	case types.GET_INDIVIDUAL_LIST_FOR_PROJECT:
		return Object.assign({}, state, { individualList: action.individualList });

	case types.ADD_OTHER_CATEGORY_FOR_PROJECT:
		var data = Object.assign({}, state);
		newState = JSON.parse(JSON.stringify(data));
		newState.projectDropdowns.categoryInfo.push(action.categoryData);
		return newState;

	case types.ADD_OTHER_DEPARTMENT_FOR_PROJECT:
		var data = Object.assign({}, state);
		newState = JSON.parse(JSON.stringify(data));
		newState.projectDropdowns.Department.push(action.departmentData);
		return newState;

	case types.GET_PROJECT_DETAILS:
		return Object.assign({}, state, { projectDetailData: action.projectData });

	default:
		return initialState;
	}
}

