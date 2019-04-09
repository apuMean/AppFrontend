import * as types from '../constants/actionTypes';
const initialState = {
	revisionList: [],
	proposalDetail: '',
	isLoaded: false,
	formatsList: [],
	newFormat: ''
};

export default function pdfGeneration(state = [], action) {
	let newState;
	switch (action.type) {
	case types.GET_PROPOSALPDF_DETAILS:
		return Object.assign({}, state, { proposalDetail: action.proposalData });
	case types.GET_PROPOSAL_FORMATS:
		return Object.assign({}, state, { formatsList: action.formatsList });
	case types.UPDATE_PROPOSAL_FORMAT_LIST:
		return Object.assign({}, state, { newFormat: action.newFormat });
	case types.PROPOSAL_LOADED_TRUE:
		return Object.assign({}, state, { isLoaded: action.isLoaded });

	default:
		return initialState;
	}
}

