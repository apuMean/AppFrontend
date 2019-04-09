import * as types from '../constants/actionTypes';
const initialState = {
	orderList: [],
	billingCompanyList: [],
	orderTypesData: [],
	itemList: [],
	orderDetails: '',
	laborRates: [],
	companyList: [],
	contactDetails: '',
	itemDetailData: '',
	salesRepList: [],
	poList: [],
	newCreatedItem: '',
	opportunityList: [],
	estimateList: [],
	manufacturerList: [],
	usersList: [],
	projectList: [],
	orderNo: '',
	contractList: []
};

export default function serviceOrder(state = [], action) {
    
	let newState;
	switch (action.type) {
	case types.GET_ORDER_LIST:
		return Object.assign({}, state, { orderList: action.orderList });

	case types.GET_BILLING_COMPANIES:
		return Object.assign({}, state, { billingCompanyList: action.companyList });

	case types.GET_OTHER_ORDER_TYPE:
		return Object.assign({}, state, { orderTypesData: action.orderTypesData });

	case types.ADD_OTHER_ORDER_TYPE:
		let data = Object.assign({}, state);
		newState = JSON.parse(JSON.stringify(data));
		newState.orderTypesData.push(action.typeData);
		return newState;

	case types.DELETE_ORDER:
		return Object.assign({}, state, { orderList: action.removeorderData });

	case types.GET_ORDER_DETAILS:
		return Object.assign({}, state, { orderDetails: action.orderData });

	case types.GET_ORDER_ITEM:
		return Object.assign({}, state, { itemList: action.itemList });

	case types.GET_LABOR_RATE_ORDER:
		return Object.assign({}, state, { laborRates: action.laborRates });

	case types.GET_COMPANY_LIST:
		return Object.assign({}, state, { companyList: action.companyList });

	case types.GET_CONTACT_DETAIL_FOR_ESTIMATE:
		return Object.assign({}, state, { contactDetails: action.contactData });

	case types.GET_ITEM_DETAILVALUES:
		return Object.assign({}, state, { itemDetailData: action.itemData });

	case types.GET_OPP_SALESREP:
		return Object.assign({}, state, { salesRepList: action.salesRepList });

	case types.GET_PO_LIST:
		return Object.assign({}, state, { poList: action.poList });

	case types.GET_NEW_CREATEITEM:
		return Object.assign({}, state, { newCreatedItem: action.newCreatedItem });

	case types.GET_OPPORTUNITY_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { opportunityList: action.opportunityList });

	case types.GET_ESTIMATE_LIST_FOR_PROPOSAL:
		return Object.assign({}, state, { estimateList: action.estimateList });

	case types.GET_MANUFACTURER_LIST:
		return Object.assign({}, state, { manufacturerList: action.manufacturerList });

	case types.GET_USERS:
		return Object.assign({}, state, { usersList: action.usersList });

	case types.GET_PROJECT_LIST_FOR_ESTIMATE:
		return Object.assign({}, state, { projectList: action.projectList });

	case types.CLEAR_SELECTS:
		return Object.assign({}, state, { companyList: [], billingCompanyList: [] });

	case types.GET_ORDER_NO:
		return Object.assign({}, state, { orderNo: action.orderNo });

	case types.GET_ORDER_CONTRACT:
		return Object.assign({}, state, { contractList: action.contractList });

	case types.ADD_ORDER_CONTRACT:
		let contractdata = Object.assign({}, state);
		newState = JSON.parse(JSON.stringify(contractdata));
		newState.contractList.splice(0, 0, action.typeData);
		// newState.contractList.push(action.typeData);
		return newState;

	default:
		return initialState;
	}
}

