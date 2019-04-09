import * as types from '../constants/actionTypes';
const initialState = {
	revisionList: [],
	estimateDetails: '',
	isLoaded: false,
	formatsList: [],
	newFormat: ''
};

export default function pdfGeneration(state = [], action) {
	let newState;
	switch (action.type) {
	case types.REVISION_LIST_ESTIMATE:
		return Object.assign({}, state, { revisionList: action.revisionList });

	case types.GET_ESTIMATE_DETAILS:
		return Object.assign({}, state, { estimateDetails: action.estimateData });

	case types.GET_FORMATS_CONFIGS:
		return Object.assign({}, state, { formatsList: action.formatsList });

	case types.UPDATE_FORMAT_LIST:
		return Object.assign({}, state, { newFormat: action.newFormat });

	case types.LOADED_TRUE:
		return Object.assign({}, state, { isLoaded: action.isLoaded });

	default:
		return initialState;
	}
}

