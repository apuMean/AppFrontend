import * as types from '../constants/actionTypes';
const initialState ={
	projectList:[],
	worklogList:[],
	worklogDetails:[],
	worklogNo:'',
	addOther:[]
};

export default function timer(state = [], action) {
	switch (action.type) {    
	case types.GET_PROJECT_AND_SO:
		return Object.assign({}, state, { projectList: action.projectList });    
	case types.GET_WORKLOG_LIST:
		return Object.assign({}, state, { worklogList: action.worklogList }); 
	case types.GET_WORKLOG_DETAIL:
		return Object.assign({},state, {worklogDetails:action.worklogData});
	case types.WORKLOG_NO:
		return Object.assign({}, state, { worklogNo: action.worklogNo });
	case types.WORKLOG_ADD_OTHER:
		return Object.assign({},state,{addOther:action.addOther});
	default:
		return initialState;
	}
}

