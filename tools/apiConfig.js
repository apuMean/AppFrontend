import * as url from './config';

// constants for api URL
var BASEURL = url.LOCAL_API_URL;
// var BASEURL = url.PRODUCTION_API_URL;
export const SOCKETURL=url.PRODUCTION_SOCKET_URL;
// export const SOCKETURL=url.LOCAL_SOCKET_URL;
//Sign In 
export const USER_AUTH = BASEURL + 'api/azureSignIn';
export const SIGN_IN = BASEURL + 'api/signIn';
export const GET_AZURE_USER_DETAILS = 'https://graph.windows.net/me?api-version=1.6';
export const IS_TOKEN_VALID = BASEURL + 'api/checkToken';

//User Management
export const GET_USERS = BASEURL + 'api/getAllUsers';
export const GET_USER_BY_ID = BASEURL + 'api/getUserById';
export const GET_ROLES = BASEURL + 'api/getRole';

export const GET_COMPANY_USERS=BASEURL+'api/getCompanyUsers';
export const UPDATE_ROLES = BASEURL + 'api/updateUserDetail';
export const UPDATE_USER_PIC = BASEURL + 'api/updateUserPic';
export const REMOVE_USER_PIC = BASEURL + 'api/removeUserPic';
export const INVITE_USER = BASEURL + 'api/inviteUser';
export const RESEND_INVITATION = BASEURL + 'api/resendInvitation';
export const UPDATE_USER_STATUS = BASEURL + 'api/updateUserStatus';
export const DELETE_USER = BASEURL + 'api/deleteCompanyUser';
export const GET_COMPANY_USER_DETAILS = BASEURL + 'api/getCompanyUsersDetails';
export const RESET_USER_PASSWORD = BASEURL + 'api/resetCompanyUserPassword';
export const UPDATE_COMPANY_USER_PROFILE = BASEURL + 'api/updateCompanyUserProfile';
export const UPDATE_COMPANY_PIC = BASEURL + 'api/updateUserPic';
export const CHECK_IS_ACCEPTED = BASEURL + 'api/checkIsAccepted';
export const SET_COMPANY_USERS_PASSWORD = BASEURL + 'api/setCompanyUsersPassword';
export const GET_COMPANY_USER_ACTIVITY = BASEURL + 'api/getCompanyUserActivity';

export const GET_USER_ACTIVITY = BASEURL +'api/getUserActivity';
export const ADD_USER_ACTIVITY = BASEURL +'api/addUserActivity';
export const CHANGE_USER_EMAIL_ACTIVITY = BASEURL + 'api/changeUserEmailActivity';



//Contact Module
export const GET_CONTACT_LIST = BASEURL + 'api/getContactList';
export const GET_PARENT_COMPANY_LIST = BASEURL + 'api/getCompanyContactList';
export const GET_CONTACT_DROPDOWN = BASEURL + 'api/getcontactDropdown';
export const ADD_COMPANY_CONTACT = BASEURL + 'api/addcompanycontact';
export const DELETE_CONTACT = BASEURL + 'api/deletecontact';
export const ADD_COMPANY_MORE_INFO = BASEURL + 'api/addcompanycontactMoreinfo';
export const UPDATE_CONTACT_PIC = BASEURL + 'api/updateContactPic';
export const UPDATE_SALESREP_SIGN = BASEURL + 'api/addSignatureImageSalesrep';
export const GET_CONTACT_DETAIL = BASEURL + 'api/getContactDetail';
export const ADD_GROUP = BASEURL + 'api/addgroup';
export const DELETE_CONTACT_GROUP = BASEURL + 'api/deletecontactGroup';
export const ADD_CONTACT_TYPE = BASEURL + 'api/addcontactType';
export const ADD_CONTACT_STATUS = BASEURL + 'api/addcontactStatus';
export const ADD_CONTACT_SOURCE = BASEURL + 'api/addcontactSource';
export const ADD_CONTACT_DEPARTMENT = BASEURL + 'api/addcontactDepartment';
export const DELETE_CONTACT_DEPARTMENT = BASEURL + 'api/deleteContactDepartment';
export const ADD_CONTACT_INDUSTRY = BASEURL + 'api/addcontactIndustry';
export const DELETE_CONTACT_INDUSTRY = BASEURL + 'api/deleteContactIndustry';
export const ADD_CONTACT_KEYWORD = BASEURL + 'api/addNewkeywords';
export const UPDATE_COMPANY_CONTACT = BASEURL + 'api/updateCompanyContact';
export const GET_CONTACT_GROUP = BASEURL + 'api/getcontactGroup';
export const GET_ADD_CONTACT_LIST = BASEURL + 'api/addcontactlist';
export const GET_REMOVE_CONTACT_LIST = BASEURL + 'api/removecontactlist';
export const ADD_CONTACT_TO_GROUP = BASEURL + 'api/addcontacttoGroup';
export const REMOVE_CONTACT_FROM_GROUP = BASEURL + 'api/removecontactfromGroup';
export const GET_ASSOCIATED_CONTACTS = BASEURL + 'api/getAssociateContactList';
export const DELETE_CONTACT_PIC = BASEURL + 'api/removeContactPic';
export const UPDATE_SIGNATURE_SALESREP = BASEURL + 'api/addSignatureSalesrep';

//Contact Link Module
export const ADD_CONTACT_LINKS = BASEURL + 'api/addContactLinks';
export const REMOVE_CONTACT_LINKS = BASEURL + 'api/removeContactLinks';
export const GET_CONTACT_LINKS = BASEURL + 'api/getContactLinks';
export const GET_CONTACT_LISTS = BASEURL + 'api/getContactLists';
export const GET_CONTACT_ESTIMATES = BASEURL + 'api/getEstimate';
export const GET_CONTACT_PROPOSALS = BASEURL + 'api/getProposal';
export const GET_CONTACT_PROJECTS = BASEURL + 'api/getProject';
export const GET_CONTACT_POS = BASEURL + 'api/getPOlist';
export const GET_CONTACT_INVOICES = BASEURL + 'api/getInvoice';
// export const GET_CONTACT_ACTIVITIES = BASEURL + 'api/getActivities';
export const GET_CONTACT_ACTIVITIES = BASEURL + 'api/getActivityList';
export const GET_CONTACT_DOCUMENTS = BASEURL + 'api/getDocument';
export const GET_CONTACT_OPPORTUNITIES = BASEURL + 'api/getContactOpportunities';

//Dashboard Module
export const NEW_GET_ORDERS_LIST = BASEURL + 'api/getServiceOrderListData';

export const GET_TASK_LIST = BASEURL + 'api/getTasksList';
export const GET_FILTERED_TASKS_LIST = BASEURL + 'api/getFilterTasksList';
export const GET_OPPORTUNITIES_LIST = BASEURL + 'api/getOpportunitiesList';
export const GET_FILTERED_OPPORTUNITIES_LIST = BASEURL + 'api/getFilterOpportunitiesList';
export const GET_ESTIMATES_LIST = BASEURL + 'api/getEstimatesList';
export const GET_FILTERED_ESTIMATES_LIST = BASEURL + 'api/getFilterEstimatesList';
export const GET_PROJECTS_LIST = BASEURL + 'api/getProjectsList';
export const GET_FILTERED_PROJECTS_LIST = BASEURL + 'api/getFilterProjectsList';
export const GET_ORDERS_LIST = BASEURL + 'api/getOrdersList';
export const GET_FILTERED_ORDERS_LIST = BASEURL + 'api/getFilterOrdersList';
export const GET_INVOICES_LIST = BASEURL + 'api/getInvoicesList';
export const GET_FILTERED_INVOICES_LIST = BASEURL + 'api/getFilterInvoicesList';
export const GET_TAILGATES_LIST = BASEURL + 'api/getTailgatesList';
export const GET_GOALS_LIST = BASEURL + 'api/getGoalsList';
export const ADD_TAILGATES = BASEURL + 'api/addNewTailGate';
export const ADD_NEW_TAILGATE = BASEURL + 'api/addNewTailGate';

//Opportunity Module 
export const GET_OPP_CATEGORY = BASEURL + 'api/getCategory';
export const ADD_OPP_CATEGORY = BASEURL + 'api/addcategory';
export const GET_COMPANY_LIST = BASEURL + 'api/getCompanyListByAlphabet';
export const GET_DEPARTMENT_LIST = BASEURL + 'api/getcontactDropdown';
export const GET_PHONE_INTERNET = BASEURL + 'api/getCompanyPhoneInternet';
export const GET_OPP_SALESREP = BASEURL + 'api/salesrep';
export const GET_OPP_INDIVIDUAL = BASEURL + 'api/getIndividual';
export const CREATE_OPPORTUNITY = BASEURL + 'api/addOpportunity';
export const GET_OPP_LIST = BASEURL + 'api/getOpportunitiesByCompany';
export const GET_OPP_DETAILVALUES = BASEURL + 'api/getOpportunitiesData';
export const UPDATE_OPPORTUNITY = BASEURL + 'api/updateOpportunity';
export const GET_OPP_NUMBER = BASEURL + 'api/opportunityNo';
export const DELETE_OPPORTUNITY = BASEURL + 'api/deleteOpportunity';
export const GET_OPPS_ESTIMATE = BASEURL + 'api/getOpportunitiesEstimates';
export const GET_INDUSTRY_LIST = BASEURL + 'api/getIndustryList';
export const ADD_OPPORTUNITY_MEMO = BASEURL + 'api/addMemoOpportunity';
export const OPPTAGS_SAVE = BASEURL + 'api/addOpportunityTag';
export const GET_OPPTAGS = BASEURL + 'api/getOpportunityTag';
export const UPLOAD_OPPORTUNITY_FILES = BASEURL + 'api/uploadMultipleFile';
export const GET_OPPORTUNITY_FILES = BASEURL + 'api/getFileList';
export const RENAME_FILE = BASEURL + 'api/renameFileAttachment';
export const DELETE_FILE = BASEURL + 'api/deleteFileAttachment';
export const RESTORE_FILE = BASEURL + 'api/restoreFileAttachment';

//Estimate Module
export const ADD_ESTIMATE = BASEURL + 'api/addEstimate';
export const GET_OPPORTUNITY_BY_ALPHABET = BASEURL + 'api/getOpportunityListByAlphabet';
export const GET_PROPOSAL_LIST = BASEURL + 'api/getProposalList';
export const GET_ESTIMATE_LIST = BASEURL + 'api/getEstimate';
export const GET_ESTIMATE_DETAILS = BASEURL + 'api/getEstimateDetail';
export const UPDATE_ESTIMATE = BASEURL + 'api/updateEstimateDetail';
export const DELETE_ESTIMATE = BASEURL + 'api/deleteEstimate';
export const GET_ITEM_BY_ALPHABET = BASEURL + 'api/getItemListByAlphabet';
export const GET_PROJECT_BY_ALPHABET = BASEURL + 'api/getProjectListByAlphabet';
export const GET_LABOR_RATE = BASEURL + 'api/getlaborRate';
export const ADD_OTHER_REVISION = BASEURL + 'api/addItemRevision';
export const RENAME_REVISION = BASEURL + 'api/updateItemRevisionName';
export const DELETE_REVISION = BASEURL + 'api/deleteItemRevision';
export const GET_ESTIMATE_REVISION = BASEURL + 'api/getRevisionList';
export const UPDATE_ESTIMATE_REVISION = BASEURL + 'api/updateItemRevision';
export const ADD_ESTIMATE_MEMO = BASEURL + 'api/addMemoEstimate';
export const EXPORT_ESTIMATE_CSV = BASEURL + 'api/exportEstimateCsv';
export const GET_ESTIMATE_REVISION_COUNT = BASEURL + 'api/getEstimateRevisionCount';
export const REFRESH_LINE_ITEM_NAME = BASEURL + 'api/updateEstimateItemName';
export const GET_ESTIMATE_NUMBER = BASEURL + 'api/getEstimateNo';
export const GET_ESTIMATE_BY_ID = BASEURL + 'api/getEstimateById';
export const SAVE_ESTIMATE=BASEURL + 'api/addEstimateName';
export const ESTIMATE_INLINE_EDIT=BASEURL + 'api/updateEstimateDetailInline';
export const GET_COMPANY_EMPLOYEE_LIST=BASEURL+'api/getCompanyEmployeeByAlphabet';
export const CREATE_PROJECT_SO=BASEURL+'api/createProjectSO';

//Item Module
export const CREATE_ITEM = BASEURL + 'api/addItem';
export const GET_ITEM_CATEGORY = BASEURL + 'api/getItemCategory';
export const GET_ITEM_TYPE = BASEURL + 'api/getItemType';
export const ADD_ITEM_CATEGORY = BASEURL + 'api/addItemCategory';
export const ADD_ITEM_TYPE = BASEURL + 'api/addItemType';
export const GET_ITEM_LIST = BASEURL + 'api/getItem';
export const GET_ITEM_DETAILVALUES = BASEURL + 'api/getIndividualItem';
export const DELETE_ITEM = BASEURL + 'api/deleteItem';
export const UPDATE_ITEM = BASEURL + 'api/updateItem';
export const UPDATE_ITEM_PIC = BASEURL + 'api/updateItemImage';
export const UPDATE_ITEM_CATEGORY = BASEURL + 'api/updateItemCategory';
export const UPDATE_ITEM_TYPE = BASEURL + 'api/updateItemType';
export const UPDATE_TOOL = BASEURL + 'api/updateTools';
export const GET_MANUFACTURER_LIST = BASEURL + 'api/getManufacturerByName';
export const DELETE_MATERIAL_PIC = BASEURL + 'api/removeItemPic';
export const UPLOAD_CSV = BASEURL + 'api/getUploadItemFile';
export const UPLOAD_EXTRON_CSV = BASEURL + 'api/uploadExtronFile';
export const UPLOAD_CRESTRON_CSV = BASEURL + 'api/uploadCrestronFile';

//Document Module
export const GET_DOCUMENT_CATEGORY = BASEURL + 'api/getDocumentCategory';
export const ADD_DOCUMENT_CATEGORY = BASEURL + 'api/addDocumentCategory';
export const GET_DOC_CLIENT = BASEURL + 'api/getClientListByAlphabet';
export const GET_DOC_PROJECT = BASEURL + 'api/getProjectListByAlphabet';
export const GET_DOC_ESTIMATE = BASEURL + 'api/getEstimateByAlphabet';
export const GET_DOC_ORDER = BASEURL + 'api/getServiceOrderlist';
export const GET_DOC_PO = BASEURL + 'api/getPOlist';
export const CREATE_DOCUMENT = BASEURL + 'api/addDocument';
export const GET_DOCUMENT_LIST = BASEURL + 'api/getDocument';
export const GET_DOCUMENT_DETAILVALUES = BASEURL + 'api/getIndividualDocument';
export const UPDATE_DOCUMENT = BASEURL + 'api/updateDocument';
export const DELETE_DOCUMENT = BASEURL + 'api/deleteDocument';
export const UPDATE_DOC_FILE = BASEURL + 'api/addDocumentFiles';

//Proposal Module
export const GET_ESTIMATE_BY_ALPHABET = BASEURL + 'api/getEstimateByAlphabet';
export const GET_EMAIL_TEMPLATE = BASEURL + 'api/getEmailTemplate';
export const CREATE_PROPOSAL = BASEURL + 'api/addProposal';
export const UPDATE_PROPOSAL = BASEURL + 'api/updateProposalDetail';
export const GET_PROPOSALS = BASEURL + 'api/getProposal';
export const GET_PROPOSAL_DETAILS = BASEURL + 'api/getProposalDetail';
export const DELETE_PROPOSAL = BASEURL + 'api/deleteProposal';
export const SEND_PROPOSAL = BASEURL + 'api/proposalSendToCustomer';
export const GET_EMAIL_TEMPLATE_LIST = BASEURL + 'api/getEmailTemplatelist';
export const GET_PROPOSAL_NUMBER = BASEURL+'api/getproposalNo';
export const SEARCH_ESTIMATES=BASEURL+'api/getEstimateSalesCompanyByAlphabet';

//Timer Module
export const CREATE_TIMER = BASEURL + 'api/addNewTimer';
export const GET_TIMER_LIST = BASEURL + 'api/getTimersList';
export const GET_TIMER_DETAILVALUES = BASEURL + 'api/getTimerDetails';
export const UPDATE_TIMER = BASEURL + 'api/updateTimerInfo';
export const DELETE_TIMER = BASEURL + 'api/deleteTimerInfo';
export const GET_TASK_BY_ALPHABET = BASEURL + 'api/getProjecttaskByAlphabet';

//Project Module
export const ADD_PROJECT_CATEGORY = BASEURL + 'api/addProjectCategory';
export const GET_PROJECT_DROPDOWNS = BASEURL + 'api/getProjectDropdownList';
export const CREATE_PROJECT = BASEURL + 'api/addProject';
export const GET_PROJECTS = BASEURL + 'api/getProject';
export const DELETE_PROJECT = BASEURL + 'api/deleteProject';
export const GET_PROJECT_DETAILS = BASEURL + 'api/getProjectDetail';
export const UPDATE_PROJECT = BASEURL + 'api/updateProjectDetail';
export const ADD_PROJECT_MEMO = BASEURL + 'api/addMemoProject';

//Project More Options
export const GET_TRACKING_ITEM = BASEURL + 'api/getProjecttask';
export const GET_COSTING_DATA = BASEURL + '';
export const GET_PROJECT_ACTIVITY = BASEURL + 'api/getActivityDetailByProject';
export const GET_PROJECT_TIMER = BASEURL + 'api/getTimerDetailByProject';
export const GET_PROJECT_DOCUMENT = BASEURL + 'api/getDocumentDetailByProject';
export const GET_PROJECT_INVOICE = BASEURL + 'api/getInvoice';
export const GET_PROJECT_DAILIES = BASEURL + 'api/getDailyReportList';
export const GET_PROJECT_TOOLS = BASEURL + 'api/getTools';
export const ADD_DAILIES_PROJECT = BASEURL + 'api/addDailyReport';
export const SEND_DAILY_REPORT = BASEURL + 'api/dailyReportSendToCustomer';
export const DELETE_DAILY_REPORT = BASEURL + 'api/deleteDailyReport';
export const ADD_PROJECT_ITEM = BASEURL + 'api/addProjecttask';
export const GET_PROJECT_ESTIMATE = BASEURL + 'api/getProjectestimate';

//Calendar Module
export const GET_EVENTS_LIST = BASEURL + 'api/getEventsList';
export const GET_INDIVIDUAL_LIST = BASEURL + 'api/getIndividualList';
export const GET_EVENT_LIST_BY_CONTACT = BASEURL + 'api/getEventsListByContact';

//activity Module
export const CREATE_NOTE = BASEURL + 'api/addNoteDetails';
export const CREATE_TASK = BASEURL + 'api/addTaskDetails';
export const GET_ACTIVITY_LIST = BASEURL + 'api/getActivityList';
export const DELETE_ACTIVITY = BASEURL + 'api/deleteActivity';
export const GET_ACTIVITY_TEMPLATE = BASEURL + 'api/getCompanyEmailTemplates';
export const CREATE_LETTER = BASEURL + 'api/addLetterDetails';
export const GET_ACTIVITY_CATEGORY = BASEURL + 'api/getActivityCategoryList';
export const CREATE_FAX = BASEURL + 'api/addFaxDetails';
export const CREATE_CALL = BASEURL + 'api/addCallDetails';
export const CREATE_EVENT = BASEURL + 'api/addEventDetails';
export const CREATE_EMAIL = BASEURL + 'api/addEmailDetails';
export const UPLOAD_EMAIL_ATTACHMENT = BASEURL + 'api/addEmailFile';
export const GET_ACTIVITY_DETAILS = BASEURL + 'api/getActivityDetails';

//PO Module
export const CREATE_PO = BASEURL + 'api/addPurchaseOrder';
export const GET_PO_LIST = BASEURL + 'api/getPOlist';
export const DELETE_PO = BASEURL + 'api/deletePO';
export const GET_PO_DETAILS = BASEURL + 'api/getPODetail';
export const UPDATE_PO = BASEURL + 'api/updatePurchaseOrder';
export const UPDATE_PO_FILE = BASEURL + 'api/addAttachmentFile';
export const DELETE_ATTACHMENT = BASEURL + 'api/deletePOAttach';
export const GET_PO_NO=BASEURL+'api/getpurchaseOrderNo';

//Service Order Module
export const CREATE_ORDER = BASEURL + 'api/addServiceOrder';
export const GET_ORDER_LIST = BASEURL + 'api/getServiceOrderlist';
export const DELETE_ORDER = BASEURL + 'api/deleteServiceOrder';
export const GET_ORDER_DETAILS = BASEURL + 'api/getServiceDetail';
export const UPDATE_ORDER = BASEURL + 'api/updateServiceOrder';
export const ADD_SERVICE_MEMO = BASEURL + 'api/addMemoServiceOrder';
export const ADD_OTHER_ORDER_TYPE = BASEURL + 'api/addOrderType';
export const GET_OTHER_ORDER_TYPE = BASEURL + 'api/getOrderType';
export const UPDATE_SIGNATURE = BASEURL + 'api/addSignatureServiceOrder';
export const GET_ORDER_NO = BASEURL + 'api/getOrderNo';
export const GET_ORDER_CONTRACT = BASEURL + 'api/getOrdercontract';
export const ADD_ORDER_CONTRACT = BASEURL + 'api/addContract';

//Invoice Module
export const CREATE_INVOICE = BASEURL + 'api/addInvoice';
export const GET_INVOICE_LIST = BASEURL + 'api/getInvoice';
export const DELETE_INVOICE = BASEURL + 'api/deleteInvoice';
export const GET_INVOICE_DETAILS = BASEURL + 'api/getInvoiceDetails';
export const UPDATE_INVOICE = BASEURL + 'api/updateInvoice';

//Expenses Module
export const CREATE_EXPENSE = BASEURL + 'api/addExpenses';
export const UPDATE_EXPENSE_IMAGE = BASEURL + 'api/updateExpenseImage';
export const GET_EXPENSES = BASEURL + 'api/getExpensesList';
export const GET_EXPENSE_DETAILS = BASEURL + 'api/getIndividualExpenses';

//Export estimate Module
export const GET_FORMATS_CONFIGS = BASEURL + 'api/getItemConfiglist';
export const GENERATE_ESTIMATE_PDF = BASEURL + 'api/generateEstimatePdf';
export const ADD_ESTIMATE_FORMAT = BASEURL + 'api/addEstimateFormat';
export const UPDATE_ESTIMATE_FORMAT = BASEURL + 'api/updateEstimateFormat';

//Export proposal Module
export const GET_PROPOSAL_FORMATS=BASEURL + 'api/getProposalItemConfiglist';
export const ADD_PROPOSAL_FORMAT=BASEURL + 'api/addProposalFormat';
export const GENERATE_PROPOSAL_PDF = BASEURL + 'api/generateProposalPdf';
export const UPDATE_PROPOSAL_FORMAT=BASEURL + 'api/updateProposalFormat';

//Settings Section
export const GET_OPPORTUNITY_SOURCE = BASEURL + 'api/getOpportunitySource';
export const GET_ESTIMATE_STAGES = BASEURL + 'api/getStageList';

//work Log API
export const GET_PROJECT_AND_SO_LIST=BASEURL + 'api/getProjectAndServiceOrderList';
export const ADD_NEW_WORKLOG=BASEURL + 'api/addNewWorkLog';
export const GET_WORKLOG_LIST=BASEURL + 'api/getWorkLogList';
export const GET_WORKLOG_DETAIL=BASEURL + 'api/getWorkLogDetails';
export const DELETE_WORKLOG=BASEURL + 'api/deleteWorkLogInfo';
export const ADD_OTHER=BASEURL + 'api/saveAddOtherOption';
export const WORKLOG_NO=BASEURL + 'api/getWorkLogNo';
export const UPDATE_WORKLOG=BASEURL + 'api/updateWorkLogInfo';
export const INLINE_EDIT_WORKLOG=BASEURL + 'api/inlineEditWorklog';



export const ADD_INDUSTRY_LIST = BASEURL + 'api/addIndustry';
export const ADD_OPPORTUNITY_SOURCE = BASEURL + 'api/addOpportunitySource';
export const ADD_LABOR_RATE = BASEURL + 'api/addlaborRate';
export const ADD_ORDER_TYPE = BASEURL + 'api/addOrderType';
export const ADD_APP_STAGE = BASEURL + 'api/addStage';

export const UPDATE_INDUSTRY_LIST = BASEURL + 'api/updateIndustry';
export const UPDATE_OPPORTUNITY_SOURCE = BASEURL + 'api/updateOpportunitySource';
export const UPDATE_ORDER_TYPE = BASEURL + 'api/updateOrderType';
export const UPDATE_APP_STAGE = BASEURL + 'api/updateStage';
export const UPDATE_LABOR_RATE = BASEURL + 'api/updatelaborRate';

export const DELETE_INDUSTRY_LIST = BASEURL + 'api/deleteIndustry';
export const DELETE_OPPORTUNITY_SOURCE = BASEURL + 'api/deleteOpportunitySource';
export const DELETE_ORDER_TYPE = BASEURL + 'api/deleteOrderType';
export const DELETE_APP_STAGE = BASEURL + 'api/deleteStage';
export const DELETE_LABOR_RATE = BASEURL + 'api/deletelaborRate';
