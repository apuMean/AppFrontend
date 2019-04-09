import * as types from '../constants/actionTypes';
const initialState = {
	categoryList: [],
	typeList: [],
	itemList: [],
	itemDetailData: '',
	importData: '',
	itemEstimateList: [],
	itemInvoiceList: [],
	itemOrderList: [],
	itemList: {
		item: [],
		totalcount: 0,
		sortColumnName: null,
		sortOrder: null,
		page: 1,
		per_page: 100
	},
	itemListRelated: [],
	itemListAlternative: [],
	itemListReplacement: [],
	itemLogs: [],
	imagePath: ''

};

export default function itemCreation(state = [], action) {
	let newState;
	switch (action.type) {

	case types.GET_ITEM_CATEGORY:
		return Object.assign({}, state, { categoryList: action.categoryList });

	case types.GET_ITEM_TYPE:
		return Object.assign({}, state, { typeList: action.typeList });

	case types.ADD_ITEM_CATEGORY:
		newState = Object.assign({}, state);
		newState.categoryList.push(action.categoryData);
		return JSON.parse(JSON.stringify(newState));

	case types.ADD_ITEM_TYPE:
		newState = Object.assign({}, state);
		newState.typeList.push(action.typeData);
		return JSON.parse(JSON.stringify(newState));

	case types.GET_ITEM_LIST:
		return Object.assign({}, state, { itemList: action.itemList });

	case types.GET_ITEM_LOGS:
		return Object.assign({}, state, { itemLogs: action.itemLogs });

	case types.IMPORT_CSV_DATA:
		return Object.assign({}, state, { importData: action.importData });

	case types.GET_ITEM_DETAILVALUES:
		return Object.assign({}, state, { itemDetailData: action.itemData });

	case types.DELETE_ITEM:
		return Object.assign({}, state, { itemList: action.removeitemData });

	case types.GET_ITEM_ESTIMATE_LIST:
		return Object.assign({}, state, { itemEstimateList: action.itemEstimateList });

	case types.GET_ITEM_INVOICE_LIST:
		return Object.assign({}, state, { itemInvoiceList: action.itemInvoiceList });

	case types.GET_ITEM_ORDER_LIST:
		return Object.assign({}, state, { itemOrderList: action.itemOrderList });

	case types.GET_RELATED_ITEMS:
		return Object.assign({}, state, { itemListRelated: action.itemList });

	case types.GET_ALERNATIVE_ITEMS:
		return Object.assign({}, state, { itemListAlternative: action.itemList });

	case types.GET_REPLACEMENT_ITEMS:
		return Object.assign({}, state, { itemListReplacement: action.itemList });

	case types.MATERIAL_PIC_PATH:
		return Object.assign({}, state, { imagePath: action.imagePath });

	default:
		return initialState;
	}
}

