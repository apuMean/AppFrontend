import { combineReducers } from 'redux';
import dashboards from './dashboardReducer';
import worklog from './worklogReducer';
// import {reducer as formReducer } from 'redux-form';
// import crumbs from './dashboardReducer';
// import tasksList from './dashboardReducer';
// import opportunitiesList from './dashboardReducer';
// import estimatesList from './dashboardReducer';
// import projectsList from './dashboardReducer';
// import ordersList from './dashboardReducer';
// import invoicesList from './dashboardReducer';
// import tailgatesList from './dashboardReducer';
// import goalsList from './dashboardReducer';
import signin from './signinReducer';
import users from './usersReducer';
import createcontact from './createContactReducer';
import opportunity from './opportunityReducer';
import estimate from './estimateReducer';
import proposal from './proposalReducer';
import project from './projectReducer';
import contactoptions from './contactOptionsReducer';
import groups from './groupsReducer';
import itemCreation from './itemReducer';
import documentCreation from './documentReducer';
import timer from './timerReducer';
import tailgateReducer from './tailgateReducer';
import projectOption from './projectOptionReducer';
import activityCreation from './activityReducer';
import eventRecordsList from './calendarReducer';
import individualList from './calendarReducer';
import poLists from './poReducer';
import serviceOrder from './orderReducer';
import invoices from './invoiceReducer';
import expense from './espenseReducer';
import pdfGeneration from './estimatePdfGenerationReducer';
import settings from './settingsReducer';
import {routerReducer} from 'react-router-redux';
import accountReducer from './accountReducer';
import proposalpdfGeneration from './proposalPdfGenerationReducer';

const rootReducer = combineReducers({
	// crumbs,
	// tasksList,
	eventRecordsList,
	individualList,
	// opportunitiesList,
	// estimatesList,
	// projectsList,
	// ordersList,
	// invoicesList,
	// tailgatesList,
	// goalsList,
	createcontact,
	signin,
	users,
	opportunity,
	contactoptions,
	groups,
	estimate,
	expense,
	proposal,
	project,
	itemCreation,
	documentCreation,
	timer,
	tailgateReducer,
	projectOption,
	activityCreation,
	poLists,
	serviceOrder,
	invoices,
	dashboards,
	pdfGeneration,
	settings,
	accountReducer,
	routing: routerReducer,
	proposalPDF:proposalpdfGeneration,
	worklog
	// form: formReducer,
});

export default rootReducer;
