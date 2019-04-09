import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as dashboardActions from '../../actions/dashboardActions';
import * as app from '../../scripts/app';
import * as authorize from '../authorization/roleTypes';
import RoleAwareComponent from '../authorization/roleaware.component';
import '../../styles/layout.css';
import moment from 'moment';
import Cookies from 'universal-cookie';
 
const cookies = new Cookies();
//landing page presentational component
class Dashboard extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		this.state = {
			breadCrumb: {
				parent: '',
				childone: '',
				childtwo: ''
			},
			profileId: ''
		};
		this._logout = this._logout.bind(this);
		this.handleBreadCrumbsDashboard = this.handleBreadCrumbsDashboard.bind(this);
		this.handleProfile = this.handleProfile.bind(this);
	}
	componentDidMount() {
		$('.page-sidebar-menu li a').click(function(){
			var windowWidth = $(window).width();
			if(windowWidth < 992){
				$('.menu-toggler').click();
			}
		});
		const user = JSON.parse(localStorage.getItem('user'));
		let profile = user.companyEmployeeId;
		this.setState({ profileId: profile });
		app.App.init();
		app.Layout.init();
	}

	handleProfile() {

	}

	_logout(event) {
		event.preventDefault();
		cookies.remove('token');      
		localStorage.clear();
		browserHistory.push('/signin');
	}

	handleBreadCrumbsDashboard(data) {

		this.setState({ breadCrumb: data });
	}

	render() {
		let formStyle={
			overflow:'visible'
		};
		let inlineStyle=this.props.location.pathname=='/worklog/add'?formStyle:{};
		var parent = <li>
			{this.state.breadCrumb.parent}
		</li>;
		var childone = <li>
			{this.state.breadCrumb.childone}
		</li>;
		var childtwo = <li>
			{this.state.breadCrumb.childtwo}
		</li>;
		var children = React.Children.map(this.props.children, function (child) {
			return React.cloneElement(child, {
				breadCrumbs: this.handleBreadCrumbsDashboard.bind(this)
			});
		}.bind(this));
		return (
			<div className="page-md">
				<header className="page-header">
					<nav className="navbar" role="navigation">
						<div className="container-fluid">
							{/* Header and search */}
							<div className="havbar-header">
							
								{/* 							
							  <div className="content-header-menu">
								<button type="button" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
									<span className="toggle-icon">
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
									</span>
								</button>

							</div>  */}

								<Link to='/home' id="index" className="navbar-brand">
									<img src={require('../../img/login.png')} alt="Logo" />
								</Link>	
								<div className="topbar-actions">
									{/* <form className="search-form" method="GET">
										<div className="input-group">
											<input type="text" className="form-control" placeholder="Search" name="query" />
											<span className="input-group-btn">
												<a href="javascript:;" className="btn md-skip submit">
													<i className="fa fa-search"></i>
												</a>
											</span>
										</div>
									</form> */}
									<div className="btn-group-img btn-group">
										<button type="button" className="btn btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
											<img src={require('../../img/avatar-default.png')} alt="" />
										</button>
										<ul className="dropdown-menu-v2" role="menu">
											{/* {this.shouldBeVisible(authorize.userAuthorize) ? <li>
                                                <Link to='/users'>
                                                    <i className="icon-user"></i> Users
                                                </Link>
                                            </li> : null} */}
											{this.shouldBeVisible(authorize.userAuthorize) ? <li>
												<Link to='/account'>
													<i className="icon-user"></i> Users
												</Link>
											</li> : null}
											<li>
												<Link to={'/profile/' + this.state.profileId}>
													<i className="icon-user"></i> Profile
												</Link>
											</li>
											<li>
												{/* <Link to="/account" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/account') ? 'none' : '' }}>
                                            <i className="icon-folder"></i>
                                            <span className="title">User Management</span>
                                        </Link> */}
											</li>
											<li>
												<a href="" onClick={this._logout}>
													<i className="icon-key" onClick={this._logout}></i> Sign out
												</a>
											</li>
										</ul>
									</div>
								</div>

							</div>
						</div>
					</nav>
				</header>
				
				<div className="container-fluid">
					<div className="page-content page-content-popup">
						<div className="page-content-fixed-header">
							<ul className="page-breadcrumb hidden-xs">
								{this.state.breadCrumb.parent ? parent : ''}
								{this.state.breadCrumb.childone ? childone : ''}
								{this.state.breadCrumb.childtwo ? childtwo : ''}
							</ul>
							 <div className="content-header-menu">
								<button type="button" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
									<span className="toggle-icon">
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
									</span>
								</button>

							</div> 
						</div>
						<div className="page-sidebar-wrapper">
							<div className="page-sidebar navbar-collapse collapse">
								<ul className="page-sidebar-menu  page-header-fixed " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
									{/* {this.shouldBeVisible(authorize.listingAuthorize) ? <li className={(location.pathname === '/opportunities' || location.pathname === '/app' || location.pathname === '/estimates'
                                        || location.pathname === '/projects' || location.pathname === '/orders' || location.pathname === '/invoices'
                                        || location.pathname === '/goals' || location.pathname === '/tailgates' || location.pathname === '/safetytopic') ? 'nav-item active open' : 'nav-item'}>

                                        <a href="javascript:;" className="nav-link nav-toggle">
                                            <i className="icon-home"></i>
                                            <span className="title">Dashboard</span>
                                            <span className={(location.pathname === '/opportunities' || location.pathname === '/tasks' || location.pathname === '/estimates'
                                                || location.pathname === '/projects' || location.pathname === '/orders' || location.pathname === '/invoices'
                                                || location.pathname === '/goals' || location.pathname === '/tailgates' || location.pathname === '/safetytopic') ? 'arrow open' : 'arrow'}></span>
                                        </a>
                                        <ul className="sub-menu" style={{
                                            display: (location.pathname === '/opportunities' || location.pathname === '/tasks' || location.pathname === '/estimates'
                                                || location.pathname === '/projects' || location.pathname === '/orders' || location.pathname === '/invoices'
                                                || location.pathname === '/goals' || location.pathname === '/tailgates' || location.pathname === '/safetytopic') ? 'block' : 'none'
                                        }}>
                                            <li className={location.pathname === '/opportunities' && 'nav-item start active open'}>
                                                <Link to="/opportunities" className="nav-link " style={{ pointerEvents: (location.pathname === '/opportunities') ? 'none' : '' }}>
                                                    <i className="icon-trophy"></i>
                                                    <span className="title">Opportunities</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/estimates' && 'nav-item start active open'}>
                                                <Link to="/estimates" className="nav-link " style={{ pointerEvents: (location.pathname === '/estimates') ? 'none' : '' }}>
                                                    <i className="icon-calculator"></i>
                                                    <span className="title">Estimates</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/orders' && 'nav-item start active open'}>
                                                <Link to="/orders" className="nav-link " style={{ pointerEvents: (location.pathname === '/orders') ? 'none' : '' }}>
                                                    <i className="icon-basket"></i>
                                                    <span className="title">Service Orders</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/projects' && 'nav-item start active open'}>
                                                <Link to="/projects" className="nav-link " style={{ pointerEvents: (location.pathname === '/projects') ? 'none' : '' }}>
                                                    <i className="icon-folder"></i>
                                                    <span className="title">Projects</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/invoices' && 'nav-item start active open'}>
                                                <Link to="/invoices" className="nav-link " style={{ pointerEvents: (location.pathname === '/invoices') ? 'none' : '' }}>
                                                    <i className="icon-doc"></i>
                                                    <span className="title">Invoices</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/tasks' && 'nav-item start active open'}>
                                                <Link to="/tasks" className="nav-link " style={{ pointerEvents: (location.pathname === '/tasks') ? 'none' : '' }}>
                                                    <i className="icon-menu"></i>
                                                    <span className="title">Tasks</span>
                                                </Link>
                                            </li>
                                            <li className={location.pathname === '/goals' && 'nav-item start active open'}>
                                                <Link to="/goals" className="nav-link " style={{ pointerEvents: (location.pathname === '/goals') ? 'none' : '' }}>
                                                    <i className="icon-pin"></i>
                                                    <span className="title">Goals</span>
                                                </Link>
                                            </li>
                                            <li className={(location.pathname === '/tailgates' || location.pathname === '/safetytopic') && 'nav-item start active open'}>
                                                <Link to="/tailgates" className="nav-link " style={{ pointerEvents: (location.pathname === '/tailgates') ? 'none' : '' }}>
                                                    <i className="icon-speech"></i>
                                                    <span className="title">Tailgates</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li> : null} */}
									<li className={location.pathname === '/home' ? 'nav-item active open' : 'nav-item'}>
										<Link to="/home" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/home') ? 'none' : '' }}>
											<i className="icon-home"></i>
											<span className="title">Home</span>
										</Link>
									</li>
									{this.shouldBeVisible(authorize.companiesAuthorize) ? <li className={(location.pathname === '/company' || location.pathname === '/company/add' ||
                                        location.pathname === '/company/' + this.props.params.companyId || location.pathname === '/company/' + this.props.params.companyId + '/edit' || location.pathname === '/contactlinks/' + this.props.params.contactId) ? 'nav-item active open' : 'nav-item'}>
										<Link to="/company" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/company') ? 'none' : '' }}>
											<i className="icon-briefcase"></i>
											<span className="title">Companies</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.contactsAuthorize) ? <li className={(location.pathname === '/contact' || location.pathname === '/contact/add' ||
                                        location.pathname === '/contact/' + this.props.params.contactId || location.pathname === '/contact/' + this.props.params.contactId + '/edit' || location.pathname === '/contactlinks/' + this.props.params.contactId) ? 'nav-item active open' : 'nav-item'}>
										<Link to="/contact" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/contact') ? 'none' : '' }}>
											<i className="icon-call-end"></i>
											<span className="title">Contacts</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.materialsAuthorize) ? <li className={(location.pathname === '/material' || location.pathname === '/material/add' ||
                                        location.pathname === '/material/' + this.props.params.itemId + '/edit' || location.pathname === '/material/' + this.props.params.materialId) ? 'nav-item active open' : 'nav-item'}>
										<Link to="/material" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/material') ? 'none' : '' }}>
											<i className="icon-list"></i>
											<span className="title">Materials</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.opportunitiesAuthorize) ? <li className={(location.pathname === '/opportunity' || location.pathname === '/opportunity/add' ||
                                        location.pathname === '/opportunity/' + this.props.params.opportunityId || location.pathname === '/opportunity/' + this.props.params.opportunityId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/opportunity" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/opportunity') ? 'none' : '' }}>
											<i className="icon-trophy"></i>
											<span className="title">Opportunities</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.estimatesAuthorize) ? <li className={(location.pathname === '/estimate' || location.pathname === '/estimate/add' ||
                                        location.pathname === '/estimate/' + this.props.params.estimateId || location.pathname === '/estimate/' + this.props.params.estimateId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/estimate" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/estimate') ? 'none' : '' }}>
											<i className="icon-calculator"></i>
											<span className="title">Estimates</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.ordersViewAuthorize) ? <li className={(location.pathname === '/order' || location.pathname === '/order/add' ||
                                        location.pathname === '/order/' + this.props.params.orderId + '/edit' || location.pathname === '/order/' + this.props.params.orderId) ? 'nav-item active open' : 'nav-item'}>
										<Link to="/order" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/order') ? 'none' : '' }}>
											<i className="icon-basket"></i>
											<span className="title">Service Orders</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.poAuthorize) ? <li className={(location.pathname === '/po' || location.pathname === '/po/add' ||
                                        location.pathname === '/po/' + this.props.params.poId || location.pathname === '/po/' + this.props.params.poId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/po" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/po') ? 'none' : '' }}>
											<i className="icon-wallet"></i>
											<span className="title">Purchase Orders</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.proposalsAuthorize) ? <li className={(location.pathname === '/proposal' || location.pathname === '/proposal/add' ||
                                        location.pathname === '/proposal/' + this.props.params.proposalId || location.pathname === '/proposal/' + this.props.params.proposalId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/proposal" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/proposal') ? 'none' : '' }}>
											<i className="icon-envelope-letter"></i>
											<span className="title">Proposals</span>
										</Link>
									</li> : null}
									{this.shouldBeVisible(authorize.projectsAuthorize) ? <li className={(location.pathname === '/project' || location.pathname === '/project/add' ||
                                        location.pathname === '/project/' + this.props.params.projectId || location.pathname === '/project/' + this.props.params.projectId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/project" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/project') ? 'none' : '' }}>
											<i className="icon-folder"></i>
											<span className="title">Projects</span>
										</Link>
									</li> : null}
									{/* {this.shouldBeVisible(authorize.projectsAuthorize) ? <li className={(location.pathname === '/account' || location.pathname === '/account/add' ||
                                        location.pathname === '/account/' + this.props.params.projectId || location.pathname === '/account/' + this.props.params.projectId + '/edit') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/account" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/account') ? 'none' : '' }}>
                                            <i className="icon-folder"></i>
                                            <span className="title">Account</span>
                                        </Link>
                                    </li> : null} */}
									{/* {this.shouldBeVisible(authorize.invoicesAuthorize) ? <li className={(location.pathname === '/invoice' || location.pathname === '/invoice/add' ||
                                        location.pathname === '/invoice/' + this.props.params.invoiceId || location.pathname === '/invoice/' + this.props.params.invoiceId + '/edit') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/invoice" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/invoice') ? 'none' : '' }}>
                                            <i className="icon-credit-card"></i>
                                            <span className="title">Invoices</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.expensesAuthorize) ? <li className={(location.pathname === '/expense' || location.pathname === '/expense/add' ||
                                        location.pathname === '/expense/' + this.props.params.expenseId + '/edit' || location.pathname === '/expense/' + this.props.params.expenseId) ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/expense" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/expense') ? 'none' : '' }}>
                                            <i className="icon-credit-card"></i>
                                            <span className="title">Expenses</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.timersAuthorize) ? <li className={(location.pathname === '/timer' || location.pathname === '/timer/add' ||
                                        location.pathname === '/timer/' + this.props.params.timerId || location.pathname === '/timer/' + this.props.params.timerId + '/edit') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/timer" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/timer') ? 'none' : '' }}>
                                            <i className="icon-clock"></i>
                                            <span className="title">Timers</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.calendarAuthorize) ? <li className={(location.pathname === '/calendar') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/calendar" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/calendar') ? 'none' : '' }}>
                                            <i className="icon-calendar"></i>
                                            <span className="title">Calendar</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.activitiesAuthorize) ? <li className={(location.pathname === '/activity') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/activity" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/activity') ? 'none' : '' }}>
                                            <i className="icon-rocket"></i>
                                            <span className="title">Activities</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.documentsAuthorize) ? <li className={(location.pathname === '/document' || location.pathname === '/document/add' ||
                                        location.pathname === '/document/' + this.props.params.documentId || location.pathname === '/document/' + this.props.params.documentId + '/edit') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/document" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/document') ? 'none' : '' }}>
                                            <i className="icon-docs"></i>
                                            <span className="title">Documents</span>
                                        </Link>
                                    </li> : null}
                                    {this.shouldBeVisible(authorize.groupsAuthorize) ? <li className={(location.pathname === '/groups') ? 'nav-item active open' : 'nav-item'}>
                                        <Link to="/groups" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/groups') ? 'none' : '' }}>
                                            <i className="icon-list"></i>
                                            <span className="title">Groups</span>
                                        </Link>
									</li> : null} */}
									{this.shouldBeVisible(authorize.timersAuthorize) ? <li className={(location.pathname === '/worklog' || location.pathname === '/worklog/add' ||
                                        location.pathname === '/worklog/' + this.props.params.timerId || location.pathname === '/worklog/' + this.props.params.timerId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/worklog" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/worklog') ? 'none' : '' }}>
											<i className="icon-clock"></i>
											<span className="title">Work Log</span>
										</Link>
									</li> : null}
									{/* {this.shouldBeVisible(authorize.timersAuthorize) ? <li className={(location.pathname === '/timer' || location.pathname === '/timer/add' ||
                                        location.pathname === '/timer/' + this.props.params.timerId || location.pathname === '/timer/' + this.props.params.timerId + '/edit') ? 'nav-item active open' : 'nav-item'}>
										<Link to="/timer" className="nav-link nav-toggle" style={{ pointerEvents: (location.pathname === '/timer') ? 'none' : '' }}>
											<i className="icon-clock"></i>
											<span className="title">Timers</span>
										</Link>
									</li> : null} */}
									{this.shouldBeVisible(authorize.listingAuthorize) ? [<h5 className="bold" style={{ marginLeft: '20px' }}>ADMIN</h5>,
										<li className={(location.pathname === '/dropDowns') ? 'nav-item active open' : 'nav-item'}>
											<a href="javascript:;" className="nav-link nav-toggle">
												<i className="icon-settings"></i>
												<span className="title">Settings</span>
												<span className={(location.pathname === '/dropDowns') ? 'arrow open' : 'arrow'}></span>
											</a>
											<ul className="sub-menu" style={{
												display: (location.pathname === '/dropDowns') ? 'block' : 'none'
											}}>
												<li className={location.pathname === '/dropDowns' && 'nav-item start active open'}>
													<Link to="/dropDowns" className="nav-link " style={{ pointerEvents: (location.pathname === '/dropDowns') ? 'none' : '' }}>
														{/* <i className="icon-trophy"></i> */}
														<span className="title">Dropdown / List Options</span>
													</Link>
												</li>
											</ul>
										</li>] : null}
								</ul>
							</div>
						</div>
						<div className="page-fixed-main-content"  style={inlineStyle}>
							{children}
						</div>
						<p className="copyright-v2">
							{moment().year() == '2017' ? '2017' : '2017 - ' + moment().year()} &copy; Hive
						</p>
						<a href="#index" className="go2top">
							<i className="icon-arrow-up"></i>
						</a>
					</div>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		crumbs: state.dashboards
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dashboardActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
