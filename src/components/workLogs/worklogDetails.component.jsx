import React, { PropTypes } from 'react';
import { Link } from 'react-router';
// import * as timerAction from '../../actions/timerActions';
import * as worklogAction from '../../actions/worklogAction';
import { connect } from 'react-redux';
import moment from 'moment';
import * as functions from '../common/functions';
import { bindActionCreators } from 'redux';
import '../../styles/bootstrap-fileinput.css';
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';
import Select from 'react-select';
// import Editable from 'react-x-editable';//Using it for custom inline edit fields

var projectData = [];
class WorklogDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			worklogData: [],
			showBrowserHeaders: false,
			editProjectSO: false,
			editStatus: false,
			projectOptions: [],
			status: '',

		};
	}

	componentWillMount() {
		var data1 = {
			parent: 'Work Logs',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data1);
		if (localStorage.roleName == 'Admin') {
			this.setState({
				showBrowserHeaders: true
			});
		} else {
			this.setState({
				showBrowserHeaders: false
			});
		}
	}

	componentDidMount() {
		var worklogId = {
			companyId: localStorage.companyId,
			workLogId: this.props.params.worklogId
		};
		this
			.props
			.actions
			.getWorklogDetails(worklogId);
		functions.showLoader('worklog_detail');
	}

	handleDelete() {
		$('#worklog_delete').modal('show');
	}

	deleteWorklogHandler() {
		if (this.props.params.worklogId) {
			$('#worklog_delete').modal('hide');
			// functions.showLoader('worklog_detail');
			var data = {
				workLogId: this.props.params.worklogId
			};
			this.props.actions.deleteWorklog(data);
		}
	}
	componentWillReceiveProps(nextProps) {
		// var project = [{id:'addOther',label:'Add Other'}];
		var project = [];

		if (nextProps.worklogDetails.length != 0) {
			let projectObj = {
				id: nextProps.worklogDetails.projectId ? nextProps.worklogDetails.projectId._id : nextProps.worklogDetails.serviceOrderId ? nextProps.worklogDetails.serviceOrderId._id : nextProps.worklogDetails.otherValueId._id,
				value: nextProps.worklogDetails.projectId ? nextProps.worklogDetails.projectId._id : nextProps.worklogDetails.serviceOrderId ? nextProps.worklogDetails.serviceOrderId._id : nextProps.worklogDetails.otherValueId._id,
				label: nextProps.worklogDetails.projectId ? nextProps.worklogDetails.projectId.title : nextProps.worklogDetails.serviceOrderId ? nextProps.worklogDetails.serviceOrderId.orderNumber : nextProps.worklogDetails.otherValueId.otherTitle
			};
			this.setState({
				worklogData: nextProps.worklogDetails,
				status: nextProps.worklogDetails.status,
				projectValue: projectObj
			});


			$('div#worklog_detail').unblock();
		}
		if (nextProps.projectList.length != 0) {
			projectData = nextProps.projectList;
			var projectList = nextProps
				.projectList
				.map(function (list, index) {
					var obj = {
						id: list._id,
						label: list.title ? list.title : list.orderNumber ? list.orderNumber : list.otherTitle
					};
					project.push(obj);
				}.bind(this));

			this.setState({ projectOptions: project });
		}
	}
	handleProjectChange(value) {
		if (value == null) {
			this.setState({ projectValue: value });
		} else if (value.id == 'addOther') {
			$('#select-addType').modal('show');
		} else {
			this.setState({ projectValue: value, editProjectSO: false });
			var currentData = projectData.filter((project, index) => {
				if (value.id === project._id) {
					return project;
				}
			});
			let selectedProject = currentData[0];
			let data = {
				companyId: localStorage.companyId,
				workLogId: this.props.params.worklogId,
				projectId: selectedProject
			};
			this.props.actions.worklogInlineEdit(data);
		}

	}

	onInputProjectChange(value) {
		var data = {
			title: value,
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getProjectList(data);
	}

	handleProjectBlur() {
		if(!this.state.projectValue){
			toastr.error('This Field is required!');
		}

		// this.setState({ editProjectSO: false });
		// this.props.actions.clearSelects();
	}
	handleStatusBlur() {
		this.setState({ editStatus: false });
		this.props.actions.clearSelects();
	}
	handleChange(e) {
		let newStatus = e.target.value;
		this.setState({ editStatus: false });
		let data = {
			companyId: localStorage.companyId,
			workLogId: this.props.params.worklogId,
			status: newStatus
		};
		this.props.actions.worklogInlineEdit(data);
	}
	render() {
		var worklogData = this.state.worklogData;
		return (
			<div>
				<div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#timer-add" data-toggle="tab"> Work Log </a>
							</li>
							<li>
								<a href="#worklog-moreinfo" data-toggle="tab"> More Info </a>
							</li>
							<div className="text-right">
								<Link to="/worklog" className="btn btn-sm btn-circle red">
									Cancel </Link>&nbsp;&nbsp;
								<button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
									Delete </button>&nbsp;&nbsp;
								<Link to={'/worklog/' + this.props.params.worklogId + '/edit'} className="btn btn-sm btn-circle green">
									Edit </Link>
							</div>
						</ul>
					</div>
					<div className="portlet light bordered" id="worklog_detail">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="timer-add">
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">General Details</span>
										</div>
									</div>
									<form role="form">
										<div className="form-body">
											<div className="row">
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static"> {localStorage.userName} </div>
														<label htmlFor="User">User</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">

														{this.state.editProjectSO ? <div className="select-outer"><Select
															className="form-control form-control-static"
															// disabled={this.state.disabled}
															value={this.state.projectValue}
															placeholder="Type to search"
															name="project"
															options={this.state.projectOptions}
															onChange={this.handleProjectChange}
															onInputChange={this.onInputProjectChange}
															onBlur={this.handleProjectBlur} />
														<label htmlFor="Project">Project/SO</label>
														{/* <span onClick={() => { this.setState({ editProjectSO: false }); }} className='ico-inp-common  fa fa-close'></span> */}
														</div>
															: <div>
																<div onClick={() => { this.setState({ editProjectSO: true }); }} className="form-control form-control-static">{worklogData.projectId && worklogData.projectId.title != '' ? <u className='dottedUnderline'>{worklogData.projectId.title}</u> : worklogData.serviceOrderId && worklogData.serviceOrderId.orderNumber != 0 ? <u className='dottedUnderline'>{worklogData.serviceOrderId.orderNumber}</u> : worklogData.otherValueId && worklogData.otherValueId.otherTitle != '' ? <u className='dottedUnderline'>{worklogData.otherValueId.otherTitle}</u> : '-'}</div>
																<label htmlFor="Project">Project/SO</label>
															</div>}
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{this.state.editStatus ?
															<div>
																<div className="work_log_custom_radio form-control form-control-static">
																	<input name='status' type="radio" value="1" defaultChecked={this.state.status == 1 ? true : false} onChange={this.handleChange} /><label>Check In</label>
																	<input name='status' type="radio" value="0" className="check_out_radio" defaultChecked={this.state.status == 0 ? true : false} onChange={this.handleChange} /><label>Check Out</label>
																	<span onClick={() => { this.setState({ editStatus: false }); }} className='ico-inp-common  fa fa-close'></span>
																</div>
																<label htmlFor="status">Check In/Out</label>
															</div> : <div>
																<div onClick={() => { this.setState({ editStatus: true }); }} className="form-control form-control-static"> {this.state.status == 1 ? 'Checked In' : 'Checked Out'} </div>
																<label htmlFor="status">Check In/Out</label>
															</div>
														}
													</div>
												</div>
											</div>
										</div>
									</form>
									{this.state.showBrowserHeaders ?
										<div>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Browser Headers</span>
												</div>
											</div>
											<form role="form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.browserDetails ? worklogData.browserDetails.userAgent : '-'} </div>
																<label htmlFor="agent">User Agent</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.browserDetails ? worklogData.browserDetails.IP : '-'} </div>
																<label htmlFor="ip">IP Address</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.browserDetails ? worklogData.browserDetails.browserName : '-'} </div>
																<label htmlFor="browser">Browser Name</label>
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
										: ''}
								</div>
								<div className="tab-pane" id="worklog-moreinfo">
									<div className="portlet-title tabbable-line">
										<div className="caption">
											<span className="caption-subject font-dark bold uppercase">Other Details</span>
										</div>
									</div>
									<div className="portlet-body">
										<div className="tab-content">
											<form action="#" className="horizontal-form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-4">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">{worklogData.companyEmployeeId ? worklogData.companyEmployeeId.firstname + ' ' + worklogData.companyEmployeeId.lastname : ''}</div>
																<label htmlFor="createdBy">Created By</label>
															</div>
														</div>
														<div className="col-md-2">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">{worklogData.modifiedDate ? moment(worklogData.createdAt).format('ddd, MMM D, YYYY') : '-'}</div>
																<label htmlFor="createdOn">On</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.worklogNumber ? worklogData.worklogNumber : '-'} </div>
																<label htmlFor="workLogNum">Worklog #</label>
															</div>
														</div>
														<div className="col-md-4">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.modifiedBy ? worklogData.modifiedBy : '-'} </div>
																<label htmlFor="modifiedBy">Modified By</label>
															</div>
														</div>
														<div className="col-md-2">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static"> {worklogData.modifiedDate ? moment(worklogData.modifiedDate).format('ddd, MMM D, YYYY') : '-'}</div>
																<label htmlFor="modifiedOn">On</label>
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<DeleteModal
					deleteModalId="worklog_delete"
					deleteUserHandler={this.deleteWorklogHandler} />
			</div >

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		worklogDetails: state.worklog.worklogDetails,
		projectList: state.worklog.projectList,
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(worklogAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(WorklogDetail);