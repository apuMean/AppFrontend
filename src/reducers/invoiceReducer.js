import * as types from '../constants/actionTypes';
const initialState ={
    invoiceList:[],
    invoiceDetails:''
};

export default function invoices(state = [], action) {
    let newState;
    switch (action.type) {

         case types.GET_INVOICE_LIST:
            return Object.assign({}, state, { invoiceList: action.invoiceList });  

         case types.DELETE_INVOICE:
            return Object.assign({}, state, { invoiceList: action.removeinvoiceData });

          case types.GET_INVOICE_DETAILS:
            return Object.assign({}, state, { invoiceDetails: action.invoiceData });       

        default:
            return initialState;
    }
}

