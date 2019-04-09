import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
// import { isValidToken } from './actions/sharedActions';
import Loadable from 'react-loadable';

import App from './components/App';
import Index from './components/index'
import HomePage from './components/common/homepage.component';
import Contact from './components/common/contact.component';
import Pricing from './components/common/pricing.component';
import Login from './components/login/login.component';
import ResetPassword from './components/account/resetPassword.component';


import Users from './components/usermanagement/users.component';
import ErrorPage from './components/common/404.component';

import Dashboard from './components/Index/dashboard.component';
import Tasks from './components/dashboard/tasks.component';
import Opportunities from './components/dashboard/opportunities.component';
import Estimates from './components/dashboard/estimates.component';
import Projects from './components/dashboard/projects.component';
import Orders from './components/dashboard/orders.component';
import Invoices from './components/dashboard/invoices.component';
import Goals from './components/dashboard/goals.component';
import Tailgates from './components/dashboard/tailgates.component';
import SafetyTopic from './components/dashboard/tailgates.topics.component';
import Account from './components/account/account.component';
import EstimateDuplicate from './components/estimates/estimateDuplicate.component';

import { browserHistory } from 'react-router';

import Home from './components/home/home.component';

const LoadableCompanies = Loadable({
  loader: () => import('./components/containers/companycontainer'),
  loading() {
    return <div></div>
  }
});
const LoadableAccount=Loadable({
  loader: () => import('./components/containers/accountcontainer'),
  loading() {
    return <div></div>
  }
});
// import CompaniesContainer from './components/containers/companycontainer';
const LoadableCompany = Loadable({
  loader: () => import('./components/companies/companies.component'),
  loading() {
    return <div></div>
  }
});
// import Companies from './components/companies/companies.component';
const LoadableCompanyAdd = Loadable({
  loader: () => import('./components/companies/companyAdd.component'),
  loading() {
    return <div></div>
  }
});
// import CompanyAdd from './components/companies/companyAdd.component';
const LoadableCompanyDetail = Loadable({
  loader: () => import('./components/companies/companyDetail.component'),
  loading() {
    return <div></div>
  }
});
// import CompanyDetail from './components/companies/companyDetail.component';
const LoadableCompanyEdit = Loadable({
  loader: () => import('./components/companies/companyEdit.component'),
  loading() {
    return <div></div>
  }
});
// import CompanyEdit from './components/companies/companyEdit.component';

const LoadableContacts = Loadable({
  loader: () => import('./components/containers/contactcontainer'),
  loading() {
    return <div></div>
  }
});
// import ContactsContainer from './components/containers/contactcontainer';
const LoadableContact = Loadable({
  loader: () => import('./components/contacts/contacts.component'),
  loading() {
    return <div></div>
  }
});
// import Contacts from './components/contacts/contacts.component';
const LoadableContactAdd = Loadable({
  loader: () => import('./components/contacts/contactsAdd.component'),
  loading() {
    return <div></div>
  }
});
// import ContactAdd from './components/contacts/contactsAdd.component';
const LoadableContactDetail = Loadable({
  loader: () => import('./components/contacts/contactsDetail.component'),
  loading() {
    return <div></div>
  }
});
// import ContactDetail from './components/contacts/contactsDetail.component';
const LoadableContactEdit = Loadable({
  loader: () => import('./components/contacts/contactEdit.component'),
  loading() {
    return <div></div>
  }
});
// import ContactEdit from './components/contacts/contactEdit.component';
const LoadableLinkedContacts = Loadable({
  loader: () => import('./components/contacts/contactoptions/linkedcontacts.component'),
  loading() {
    return <div></div>
  }
});
// import LinkedContacts from './components/contacts/contactoptions/linkedcontacts.component';
const LoadableContactOpportunities = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactopportunities.component'),
  loading() {
    return <div></div>
  }
});
// import ContactOpportunities from './components/contacts/contactoptions/contactopportunities.component';
const LoadableContactEstimates = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactestimates.component'),
  loading() {
    return <div></div>
  }
});
// import ContactEstimates from './components/contacts/contactoptions/contactestimates.component';
const LoadableContactProposals = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactproposals.component'),
  loading() {
    return <div></div>
  }
});
// import ContactProposals from './components/contacts/contactoptions/contactproposals.component';
const LoadableContactProjects = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactprojects.component'),
  loading() {
    return <div></div>
  }
});
// import ContactProjects from './components/contacts/contactoptions/contactprojects.component';
const LoadableContactPos = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactpos.component'),
  loading() {
    return <div></div>
  }
});
// import ContactPos from './components/contacts/contactoptions/contactpos.component';
const LoadableContactInvoices = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactinvoices.component'),
  loading() {
    return <div></div>
  }
});
// import ContactInvoices from './components/contacts/contactoptions/contactinvoices.component';
const LoadableContactTimecards = Loadable({
  loader: () => import('./components/contacts/contactoptions/contacttimecards.component'),
  loading() {
    return <div></div>
  }
});
// import ContactTimecards from './components/contacts/contactoptions/contacttimecards.component';
const LoadableContactActivities = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactactivities.component'),
  loading() {
    return <div></div>
  }
});
// import ContactActivities from './components/contacts/contactoptions/contactactivities.component';
const LoadableContactDocuments = Loadable({
  loader: () => import('./components/contacts/contactoptions/contactdocuments.component'),
  loading() {
    return <div></div>
  }
});
// import ContactDocuments from './components/contacts/contactoptions/contactdocuments.component';
const LoadableGroupsContainer = Loadable({
  loader: () => import('./components/containers/groupscontainer'),
  loading() {
    return <div></div>
  }
});
// import GroupsContainer from './components/containers/groupscontainer';
const LoadableGroups = Loadable({
  loader: () => import('./components/groups/groups.component'),
  loading() {
    return <div></div>
  }
});
// import Groups from './components/groups/groups.component';

const LoadableOpportunitiesContainer = Loadable({
  loader: () => import('./components/containers/opportunitiescontainer'),
  loading() {
    return <div></div>
  }
});
// import OpportunitiesContainer from './components/containers/opportunitiescontainer';
const LoadableOpportunities = Loadable({
  loader: () => import('./components/opportunities/opportunity.component'),
  loading() {
    return <div></div>
  }
});
// import Opportunity from './components/opportunities/opportunity.component';
const LoadableOpportunityAdd = Loadable({
  loader: () => import('./components/opportunities/opportunityAdd.component'),
  loading() {
    return <div></div>
  }
});
// import OpportunityAdd from './components/opportunities/opportunityAdd.component';

const LoadableOpportunityDetail = Loadable({
  loader: () => import('./components/opportunities/opportunityDetail.component'),
  loading() {
    return <div></div>
  }
});
// import OpportunityDetail from './components/opportunities/opportunityDetail.component';
const LoadableOpportunityEdit = Loadable({
  loader: () => import('./components/opportunities/opportunityEdit.component'),
  loading() {
    return <div></div>
  }
});
// import OpportunityEdit from './components/opportunities/opportunityEdit.component';

const LoadableEstimates = Loadable({
  loader: () => import('./components/containers/estimatescontainer'),
  loading() {
    return <div></div>
  }
});
// import EstimatesContainer from './components/containers/estimatescontainer';
const LoadableEstimate = Loadable({
  loader: () => import('./components/estimates/estimate.component'),
  loading() {
    return <div></div>
  }
});
// import Estimate from './components/estimates/estimate.component';
const LoadableEstimateAdd = Loadable({
  loader: () => import('./components/estimates/estimateAdd.component'),
  loading() {
    return <div></div>
  }
});
// import EstimateAdd from './components/estimates/estimateAdd.component';
const LoadableEstimateDetail = Loadable({
  loader: () => import('./components/estimates/estimateDetail.component'),
  loading() {
    return <div></div>
  }
});
// import EstimateDuplicate from './components/estimates/estimateDuplicate.component';
const LoadableEstimateDuplicate = Loadable({
  loader: () => import('./components/estimates/estimateDuplicate.component'),
  loading() {
    return <div></div>
  }
});
// import EstimateDetail from './components/estimates/estimateDetail.component';
const LoadableEstimateEdit = Loadable({
  loader: () => import('./components/estimates/estimateEdit.component'),
  loading() {
    return <div></div>
  }
});
const AccountLoad = Loadable({
  loader: () => import('./components/account/account.component'),
  loading() {
    return <div></div>
  }
});
const LoadableUserDetail =Loadable({
  loader: () => import('./components/account/userDetails.component'),
  loading() {
    return <div></div>
  }
})

const LoadableUserEditDetail =Loadable({
  loader: () => import('./components/account/userEditDetail.component'),
  loading() {
    return <div></div>
  }
})
// const ResetPassword =Loadable({
//   loader: () => import('./components/account/resetPassword.component'),
//   loading() {
//     return <div></div>
//   }
// })

// import EstimateEdit from './components/estimates/estimateEdit.component';

import ProposalsContainer from './components/containers/proposalscontainer';
import Proposal from './components/proposals/proposal.component';
import ProposalAdd from './components/proposals/proposalAdd.component';
import ProposalDetail from './components/proposals/proposalDetail.component';
import ProposalEdit from './components/proposals/proposalEdit.component';

import ProjectsContainer from './components/containers/projectscontainer';
import Project from './components/projects/project.component';
import ProjectAdd from './components/projects/projectAdd.component';
import ProjectDetail from './components/projects/projectDetail.component';
import ProjectEdit from './components/projects/projectEdit.component';
import ProjectTracking from './components/projects/projectOptions/tracking.component';
import CostingExpenses from './components/projects/projectOptions/costing.component';
import ProjectActivities from './components/projects/projectOptions/activities.component';
import ProjectTimers from './components/projects/projectOptions/timers.component';
import ProjectDocuments from './components/projects/projectOptions/documents.component';
import ProjectInvoices from './components/projects/projectOptions/invoices.component';
import ProjectDailies from './components/projects/projectOptions/dailies.component';
import ProjectTools from './components/projects/projectOptions/tools.component';
import NewDaily from './components/projects/projectOptions/newDailyReport.component';

const LoadableServicesContainer = Loadable({
  loader: () => import('./components/containers/servicescontainer'),
  loading() {
    return <div></div>
  }
});
// import ServicesContainer from './components/containers/servicescontainer';
const LoadableOrder = Loadable({
  loader: () => import('./components/orders/order.component'),
  loading() {
    return <div></div>
  }
});
// import Order from './components/orders/order.component';
const LoadableCreateOrder = Loadable({
  loader: () => import('./components/orders/createorder.component'),
  loading() {
    return <div></div>
  }
});
// import CreateOrder from './components/orders/createorder.component';
const LoadableEditOrder = Loadable({
  loader: () => import('./components/orders/editorder.component'),
  loading() {
    return <div></div>
  }
});
// import EditOrder from './components/orders/editorder.component';
const LoadableOrderDetails = Loadable({
  loader: () => import('./components/orders/orderdetails.component'),
  loading() {
    return <div></div>
  }
});
// import OrderDetails from './components/orders/orderdetails.component';
const LoadablePosContainer = Loadable({
  loader: () => import('./components/containers/poscontainer'),
  loading() {
    return <div></div>
  }
});
// import PosContainer from './components/containers/poscontainer';
const LoadablePOrder = Loadable({
  loader: () => import('./components/purchaseOrder/pos.component'),
  loading() {
    return <div></div>
  }
});
// import POrder from './components/purchaseOrder/pos.component';
const LoadablePOAdd = Loadable({
  loader: () => import('./components/purchaseOrder/poAdd.component'),
  loading() {
    return <div></div>
  }
});
// import POAdd from './components/purchaseOrder/poAdd.component';
const LoadablePODetail = Loadable({
  loader: () => import('./components/purchaseOrder/poDetail.component'),
  loading() {
    return <div></div>
  }
});
// import PODetail from './components/purchaseOrder/poDetail.component';
const LoadablePOEdit = Loadable({
  loader: () => import('./components/purchaseOrder/poEdit.component'),
  loading() {
    return <div></div>
  }
});
// import POEdit from './components/purchaseOrder/poEdit.component';

import InvoicesContainer from './components/containers/invoicescontainer';
import Invoice from './components/invoices/invoice.component';
import InvoiceAdd from './components/invoices/invoiceAdd.component';
import InvoiceDetail from './components/invoices/invoiceDetail.component';
import InvoiceEdit from './components/invoices/invoiceEdit.component';

const LoadableMaterialsContainer = Loadable({
  loader: () => import('./components/containers/materialscontainer'),
  loading() {
    return <div></div>
  }
});
// import MaterialsContainer from './components/containers/materialscontainer';
const LoadableItem = Loadable({
  loader: () => import('./components/items/item.component'),
  loading() {
    return <div></div>
  }
});
// import Item from './components/items/item.component';
const LoadableCreateItem = Loadable({
  loader: () => import('./components/items/createitem.component'),
  loading() {
    return <div></div>
  }
});
// import CreateItem from './components/items/createitem.component';
const LoadableItemEdit = Loadable({
  loader: () => import('./components/items/edititem.component'),
  loading() {
    return <div></div>
  }
});
// import ItemEdit from './components/items/edititem.component';
const LoadableItemDetail = Loadable({
  loader: () => import('./components/items/itemdetails.component'),
  loading() {
    return <div></div>
  }
});
// import ItemDetail from './components/items/itemdetails.component';
const LoadableImportItems = Loadable({
  loader: () => import('./components/items/importItems.component'),
  loading() {
    return <div></div>
  }
});
// import ImportItems from './components/items/importItems.component';
const LoadableItemEstimate = Loadable({
  loader: () => import('./components/items/itemoptions/itemestimates.component'),
  loading() {
    return <div></div>
  }
});
// import ItemEstimate from './components/items/itemoptions/itemestimates.component';
const LoadableItemOrders = Loadable({
  loader: () => import('./components/items/itemoptions/itemorders.component'),
  loading() {
    return <div></div>
  }
});
// import ItemOrders from './components/items/itemoptions/itemorders.component';
const LoadableItemInvoices = Loadable({
  loader: () => import('./components/items/itemoptions/iteminvoices.component'),
  loading() {
    return <div></div>
  }
});
// import ItemInvoices from './components/items/itemoptions/iteminvoices.component';
const LoadableItemInventory = Loadable({
  loader: () => import('./components/items/itemoptions/iteminventory.component'),
  loading() {
    return <div></div>
  }
});
// import ItemInventory from './components/items/itemoptions/iteminventory.component';
const LoadableItemAssembly = Loadable({
  loader: () => import('./components/items/itemoptions/itemassembly.component'),
  loading() {
    return <div></div>
  }
});
// import ItemAssembly from './components/items/itemoptions/itemassembly.component';

import ExpensesContainer from './components/containers/expensescontainer';
import Expense from './components/expenses/espense.component';
import CreateExpense from './components/expenses/createexpense.component';
import ExpenseEdit from './components/expenses/editexpense.component';
import ExpenseDetail from './components/expenses/expensedetails.component';

import ActivitiesContainer from './components/containers/activitiescontainer';
import Activity from './components/activities/activity.component';
import NewNote from './components/activities/newNote.component';
import NewEvent from './components/activities/newEvent.component';
import NewTask from './components/activities/newTask.component';
import NewEmail from './components/activities/newEmail.component';
import NewFax from './components/activities/newFax.component';
import NewCall from './components/activities/newCall.component';
import NewLetter from './components/activities/newLetter.component';

import DocumentsContainer from './components/containers/documentscontainer';
import Documents from './components/documents/document.component';
import DocumentAdd from './components/documents/documentAdd.component';
import DocumentDetail from './components/documents/documentDetail.component';
import DocumentEdit from './components/documents/documentEdit.component';

import TimersContainer from './components/containers/timerscontainer';
import Timer from './components/timers/timer.component';
import TimerAdd from './components/timers/timerAdd.component';
import TimerDetail from './components/timers/timerDetail.component';
import TimerEdit from './components/timers/timerEdit.component';

//renaming timer module to work log as per client
import WorklogContainer from './components/containers/worklogcontainer';
import Worklog from './components/workLogs/worklog.component';
import WorklogAdd from './components/workLogs/worklogAdd.component';
import WorklogDetail from './components/workLogs/worklogDetails.component';
import WorklogEdit from './components/workLogs/worklogEdit.component';

import CalendarContainer from './components/containers/calendarcontainer';
import Calendar from './components/calendar/calendar.component';

// const LoadableUsersContainer = Loadable({
//   loader: () => import('./components/containers/userscontainer'),
//   loading() {
//     return <div></div>
//   }
// });
// import UsersContainer from './components/containers/userscontainer';
const LoadableUserProfile = Loadable({
  loader: () => import('./components/usermanagement/userprofile.component'),
  loading() {
    return <div></div>
  }
});
// import UserProfile from './components/usermanagement/userprofile.component';
const LoadableProfile = Loadable({
  loader: () => import('./components/usermanagement/profile.component'),
  loading() {
    return <div></div>
  }
});
// import Profile from './components/usermanagement/profile.component';

const LoadableEstimateExport = Loadable({
  loader: () => import('./components/estimateExport/estimateExport.component'),
  loading() {
    return <div></div>
  }
});

const LoadableProposalExport=Loadable({
  loader: () => import('./components/proposalExport/proposalExport.component'),
  loading() {
    return <div></div>
  }
});
// import EstimateExport from './components/estimateExport/estimateExport.component';
const LoadableSettings = Loadable({
  loader: () => import('./components/containers/settingscontainer'),
  loading() {
    return <div></div>
  }
});
// import Settings from './components/containers/settingscontainer';
const LoadableDropDownLists = Loadable({
  loader: () => import('./components/settings'),
  loading() {
    return <div></div>
  }
});


function isAuthorized(nextState, replace, callback) {
  const token = localStorage.getItem('token');
  if (!token){
    replace('/signin')
  } else {
  }
    // toastr.error('Token either invalid or expired!')
 
  return callback()
}

export default (
  <Route component={App}>
    <Route path="/" component={Index}>
    {localStorage.getItem('token') == null ? <IndexRoute component={HomePage} /> : <IndexRedirect to="/home" />}
      {/* <IndexRoute component={HomePage} /> */}
      <Route path="/contacts" component={Contact} />
      <Route path="/pricing" component={Pricing} />
    </Route>
    <Route path="signin" component={Login} />
    {/* <Route path="/contacts" component={localStorage.getItem('token') == null ?Contact:Home} />
      <Route path="/pricing" component={localStorage.getItem('token') == null ?Pricing:Home} />
    </Route>
    <Route path="signin" component={localStorage.getItem('token') == null ?Login:Home} /> */}
    <Route path="/users" component={Users} onEnter={isAuthorized} />
    <Route path="/acceptinvite/:userId/:companyId" component={ResetPassword} />


    {/* Export View Routes */}
    <Route path="/export/:estimateId/estimate" component={LoadableEstimateExport} onEnter={isAuthorized} authorize={['Admin']} />
    <Route path="/export/:proposalId/proposal" component={LoadableProposalExport} onEnter={isAuthorized} authorize={['Admin']} />
    <Route>
      <Route component={Dashboard}>
        {/*Listings Routes*/}
        <Route path="/tasks" component={Tasks} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/opportunities" component={Opportunities} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/estimates" component={Estimates} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/projects" component={Projects} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/orders" component={Orders} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/invoices" component={Invoices} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/goals" component={Goals} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/tailgates" component={Tailgates} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/safetytopic" component={SafetyTopic} onEnter={isAuthorized} authorize={['Admin']} />

        {/* Home Route*/}
        <Route path="/home" component={Home} onEnter={isAuthorized} />

        {/*Companies Routes*/}
        <Route path="/company" component={LoadableCompanies} onEnter={isAuthorized} authorize={['Admin', 'Administrative']}>
          <IndexRoute component={LoadableCompany} />
          <Route path="/company/add" component={LoadableCompanyAdd} />
          <Route path="/company/:companyId" component={LoadableCompanyDetail} />
          <Route path="/company/:companyId/edit" component={LoadableCompanyEdit} />
        </Route>

        {/*Contacts Routes*/}
        <Route path="/contact" component={LoadableContacts} onEnter={isAuthorized} authorize={['Admin', 'Administrative']}>
          <IndexRoute component={LoadableContact} />
          <Route path="/contact/add" component={LoadableContactAdd} />
          <Route path="/contact/:contactId" component={LoadableContactDetail} />
          <Route path="/contact/:contactId/edit" component={LoadableContactEdit} />

          {/*Contact Options Routes*/}
          <Route path="/contactlinks/:contactId" component={LoadableLinkedContacts} />
          <Route path="/contactopportunities/:contactId" component={LoadableContactOpportunities} />
          <Route path="/contactestimates/:contactId" component={LoadableContactEstimates} />
          <Route path="/contactproposals/:contactId" component={LoadableContactProposals} />
          <Route path="/contactprojects/:contactId" component={LoadableContactProjects} />
          <Route path="/contactpos/:contactId" component={LoadableContactPos} />
          <Route path="/contactinvoices/:contactId" component={LoadableContactInvoices} />
          <Route path="/contacttimecards/:contactId" component={LoadableContactTimecards} />
          <Route path="/contactactivities/:contactId" component={LoadableContactActivities} />
          <Route path="/contactdocuments/:contactId" component={LoadableContactDocuments} />
        </Route>

        {/*Groups Routes*/}
        <Route path="/groups" component={LoadableGroupsContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={LoadableGroups} />
        </Route>

        {/*Opportunities Routes*/}
        <Route path="/opportunity" component={LoadableOpportunitiesContainer} onEnter={isAuthorized}>
          <IndexRoute component={LoadableOpportunities} authorize={['Admin', 'Opportunity Viewer', 'Opportunity Editor']} />
          <Route path="/opportunity/add" component={LoadableOpportunityAdd} authorize={['Admin', 'Opportunity Editor']} />
          <Route path="/opportunity/:opportunityId" component={LoadableOpportunityDetail} authorize={['Admin', 'Opportunity Viewer', 'Opportunity Editor']} />
          <Route path="/opportunity/:opportunityId/edit" component={LoadableOpportunityEdit} authorize={['Admin', 'Opportunity Editor']} />
        </Route>

        {/*Estimates Routes*/}
        <Route path="/estimate" component={LoadableEstimates} onEnter={isAuthorized} >
          <IndexRoute component={LoadableEstimate} authorize={['Admin', 'Estimates Viewer', 'Estimates Editor','Estimates Creator']} />
          <Route path="/estimate/add" component={LoadableEstimateAdd} authorize={['Admin', 'Estimates Editor']} />
          <Route path="/estimate/:estimateId" component={LoadableEstimateDetail} authorize={['Admin', 'Estimates Viewer', 'Estimates Editor','Estimates Creator']} />
          <Route path="/estimate/:estimateId/edit" component={LoadableEstimateEdit} authorize={['Admin', 'Estimates Editor','Estimates Creator']} />
          <Route path="/estimate/:estimateId/duplicate" component={LoadableEstimateDuplicate} authorize={['Admin', 'Estimates Editor','Estimates Creator']} />
          {/* <Route path="/estimate/add/:proposalId" component={LoadableEstimateAdd} authorize={['Admin', 'Estimates Editor']} /> */}
        </Route>

        {/*Proposals Routes*/}
        <Route path="/proposal" component={ProposalsContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Proposal} />
          <Route path="/proposal/add" component={ProposalAdd} />
          <Route path="/proposal/:proposalId" component={ProposalDetail} />
          <Route path="/proposal/:proposalId/edit" component={ProposalEdit} />
                   {/* <Route path="/estimate/add/:proposalId" component={LoadableEstimateAdd} authorize={['Admin', 'Estimates Editor']} /> */}

        </Route>

        {/*Projects Routes*/}
        <Route path="/project" component={ProjectsContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Project} />
          <Route path="/project/add" component={ProjectAdd} />
          <Route path="/project/:projectId" component={ProjectDetail} />
          <Route path="/project/:projectId/edit" component={ProjectEdit} />
          {/*Project Options Routes*/}
          <Route path="/newDaily/:projectId" component={NewDaily} />
          <Route path="/project_tracking/:projectId" component={ProjectTracking} />
          <Route path="/project_costing/:projectId" component={CostingExpenses} />
          <Route path="/project_activities/:projectId" component={ProjectActivities} />
          <Route path="/project_timers/:projectId" component={ProjectTimers} />
          <Route path="/project_documents/:projectId" component={ProjectDocuments} />
          <Route path="/project_invoices/:projectId" component={ProjectInvoices} />
          <Route path="/project_dailies/:projectId" component={ProjectDailies} />
          <Route path="/project_tools/:projectId" component={ProjectTools} />
        </Route>
        {/* Account Routes */}

        <Route path="/account" component={LoadableAccount} onEnter={isAuthorized} authorize={['Admin', 'Administrative']}>
        <IndexRoute component={AccountLoad} />
        <Route path="/account/user/:userId" component={LoadableUserDetail}  />
        <Route path="/account/user/:userId/edit" component={LoadableUserEditDetail}  />
        </Route>
       

        {/*POs Routes*/}
        <Route path="/po" component={LoadablePosContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={LoadablePOrder} />
          <Route path="/po/add" component={LoadablePOAdd} />
          <Route path="/po/:poId" component={LoadablePODetail} />
          <Route path="/po/:poId/edit" component={LoadablePOEdit} />
        </Route>

        {/*Orders Routes*/}
        <Route path="/order" component={LoadableServicesContainer} onEnter={isAuthorized} >
          <IndexRoute component={LoadableOrder} authorize={['Admin', 'Service Tech']} />
          <Route path="/order/add" component={LoadableCreateOrder} authorize={['Admin']} />
          <Route path="/order/:orderId/edit" component={LoadableEditOrder} authorize={['Admin']} />
          <Route path="/order/:orderId" component={LoadableOrderDetails} authorize={['Admin', 'Service Tech']} />
        </Route>

        {/*Invoices Routes*/}
        <Route path="/invoice" component={InvoicesContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Invoice} />
          <Route path="/invoice/add" component={InvoiceAdd} />
          <Route path="/invoice/:invoiceId" component={InvoiceDetail} />
          <Route path="/invoice/:invoiceId/edit" component={InvoiceEdit} />
        </Route>

        {/*Materials Routes*/}
        <Route path="/material" component={LoadableMaterialsContainer} onEnter={isAuthorized} authorize={['Admin', 'Administrative']}>
          <IndexRoute component={LoadableItem} />
          <Route path="/material/add" component={LoadableCreateItem} />
          <Route path="/material/:materialId/edit" component={LoadableItemEdit} />
          <Route path="/material/:materialId" component={LoadableItemDetail} />
          <Route path="/importMaterials" component={LoadableImportItems} />
          {/*Items Options Routes*/}
          <Route path="/materialestimates/:materialId" component={LoadableItemEstimate} />
          <Route path="/materialorders/:materialId" component={LoadableItemOrders} />
          <Route path="/materialinvoices/:materialId" component={LoadableItemInvoices} />
          <Route path="/materialinventory/:materialId" component={LoadableItemInventory} />
          <Route path="/materialassembly/:materialId" component={LoadableItemAssembly} />
        </Route>

        {/*Expenses Routes*/}
        <Route path="/expense" component={ExpensesContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Expense} />
          <Route path="/expense/add" component={CreateExpense} />
          <Route path="/expense/:expenseId/edit" component={ExpenseEdit} />
          <Route path="/expense/:expenseId" component={ExpenseDetail} />
        </Route>

        {/*Activities Routes*/}
        <Route path="/activity" component={ActivitiesContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Activity} />
          <Route path="/note/add" component={NewNote} />
          <Route path="/event/add" component={NewEvent} />
          <Route path="/task/add" component={NewTask} />
          <Route path="/email/add" component={NewEmail} />
          <Route path="/fax/add" component={NewFax} />
          <Route path="/call/add" component={NewCall} />
          <Route path="/letter/add" component={NewLetter} />
        </Route>

        {/*Documents Routes*/}
        <Route path="/document" component={DocumentsContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Documents} />
          <Route path="/document/add" component={DocumentAdd} />
          <Route path="/document/:documentId" component={DocumentDetail} />
          <Route path="/document/:documentId/edit" component={DocumentEdit} />
        </Route>

        {/*Timers Routes*/}
        <Route path="/timer" component={TimersContainer} onEnter={isAuthorized}>
          <IndexRoute component={Timer}  authorize={['Admin','Technician']}/>
          <Route path="/timer/add" component={TimerAdd} authorize={['Admin','Technician']} />
          <Route path="/timer/:timerId" component={TimerDetail} authorize={['Admin','Technician']}/>
          <Route path="/timer/:timerId/edit" component={TimerEdit}  authorize={['Admin','Technician']}/>
        </Route>



        
        {/*Work Log Routes*/}
        <Route path="/worklog" component={WorklogContainer} onEnter={isAuthorized}>
          <IndexRoute component={Worklog}  authorize={['Admin','Technician']}/>
          <Route path="/worklog/add" component={WorklogAdd} authorize={['Admin','Technician']} />
          <Route path="/worklog/:worklogId" component={WorklogDetail} authorize={['Admin','Technician']}/>
          <Route path="/worklog/:worklogId/edit" component={WorklogEdit}  authorize={['Admin','Technician']}/>
        </Route>

        {/*Calendar Routes*/}
        <Route path="/calendar" component={CalendarContainer} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={Calendar} />
        </Route>

        {/*Settings Routes*/}
        <Route path="/dropDowns" component={LoadableSettings} onEnter={isAuthorized} authorize={['Admin']}>
          <IndexRoute component={LoadableDropDownLists} />
        </Route>

        {/*User Routes*/}
        <Route path="/user/:profileId" component={LoadableUserProfile} onEnter={isAuthorized} authorize={['Admin']} />
        <Route path="/profile/:profileId" component={LoadableProfile} onEnter={isAuthorized} />
      </Route>
    </Route>
    <Route path="*" component={ErrorPage} />
  </Route>
);
