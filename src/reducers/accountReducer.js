import * as types from '../constants/actionTypes';
//reducer for resend container component
export default function accountReducer(state = [], action) {
    
   
    const initialState = {
        userRoles: [],
        invitedUser:[],
        usersList:[],
        reinviteUser:[],
        updateUserStatus:[],
        deleteUser:[],
        companyUserDetail:[],
        resetPassword:[],
        userById:[],
        updateCompanyUser:[],
        isAccepted:[],
        setPassword:[],
        allActivities:[],
        activityByUser:[],
    };
    state = [];
    const obj = { breadcrumb: action.breadcrumb };
    
    switch (action.type) {
        case types.ACCOUNT_TITLE:
            return [...state,
            Object.assign({}, obj)
            ];
        case types.GET_ROLES:
            return Object.assign({}, state, { userRoles: action.userRoles });
        case types.INVITE_USER:
            return Object.assign({}, state, { invitedUser: action.invitedUser });
        case types.GET_ACCOUNT_USERS:
            return Object.assign({}, state, { usersList: action.userList });
        case types.RESEND_INVITATION:
            return Object.assign({},state,{reinviteUser:action.reinviteUser});
        case types.UPDATE_USER_STATUS:
            return Object.assign({},state,{updateUserStatus:action.updateUserStatus});
        case types.DELETE_USER:
            return Object.assign({},state,{deleteUser:action.deleteUser});
        case types.RESET_USER_PASSWORD:
            return Object.assign({},state,{resetPassword:action.resetPassword});
        case types.COMPANY_USER_DETAILS:
            return Object.assign({},state,{companyUserDetail:action.companyUserDetail});
        case types.USER_DETAILS:
            return Object.assign({},state,{userById:action.userById});
        case types.UPDATE_COMPANY_USER_PROFILE:
            return Object.assign({},state,{updateCompanyUser:action.updateCompanyUser});
        case types.CHECK_IS_ACCEPTED:
            return Object.assign({},state,{isAccepted:action.isAccepted});
        case types.SET_COMPANY_USERS_PASSWORD:
            return Object.assign({},state,{setPassword:action.setPassword});
        case types.GET_COMPANY_USER_ACTIVITY:
            return Object.assign({},state,{allActivities:action.allActivities});
        case types.GET_USER_ACTIVITY:
            return Object.assign({},state,{activityByUser:action.activityByUser});
            activityByUser
        default:
            return state;
    }
}
