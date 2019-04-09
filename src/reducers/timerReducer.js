import * as types from '../constants/actionTypes';
const initialState ={
    projectList:[],
    individualList:[],
    itemList:[],
    timerList:[],
    timerDetailData:''
};

export default function timer(state = [], action) {
    let newState;
    switch (action.type) {
    
        case types.GET_TIMER_PROJECT:
            return Object.assign({}, state, { projectList: action.projectList });

        case types.GET_TIMER_CONTACT:
            return Object.assign({}, state, { individualList: action.individualList });  

        case types.GET_TIMER_ITEM:
            return Object.assign({}, state, { itemList: action.itemList });  

         case types.GET_TIMER_LIST:
            return Object.assign({}, state, { timerList: action.timerList });      
        
        case types.GET_TIMER_DETAILVALUES:
            return Object.assign({}, state, { timerDetailData: action.timerData }); 

        case types.DELETE_TIMER:
            return Object.assign({}, state, { timerList: action.removetimerData });     

        default:
            return initialState;
    }
}

