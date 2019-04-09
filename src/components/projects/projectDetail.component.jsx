import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import * as functions from '../common/functions';
import * as projectActions from '../../actions/projectActions';
import * as datatable from '../../scripts/table-datatables-buttons';
import '../../styles/bootstrap-fileinput.css';
import DeleteModal from '../common/deleteModal.component.js';
import autoBind from 'react-autobind';

class ProjectDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			projectDetails: '',
			roleDetails: [],
			memoList: []
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.projectDetail) {
			var projectstate = JSON.parse(JSON.stringify(nextProps.projectDetail.projectdetail));
			var roleState = JSON.parse(JSON.stringify(nextProps.projectDetail.roleList));
			this.setState({
				projectDetails: projectstate,
				roleDetails: roleState,
				memoList: projectstate.memo ? projectstate.memo.reverse() : []
			});
			$('div#project_detail').unblock();
		}
	}

	componentWillMount() {
		var projectId = {
			projectId: this.props.params.projectId
		};
		this.props.actions.getProjectDetails(projectId);

		var data = {
			parent: 'Projects',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data);

		setTimeout(function () {
			datatable
				.ProjectTable
				.init();
		}, 2000);
	}

	componentDidMount() {
		functions.showLoader('project_detail');
	}

	handleMemoAdd() {
		let memoText = ReactDOM.findDOMNode(this.refs.projectMemo).value.trim();
		if (memoText !== '') {
			let memoData = {
				projectId: this.props.params.projectId,
				message: memoText,
				userName: localStorage.userName,
			};
			this.props.actions.addProjMemos(memoData);
			let currentMemo = {
				message: memoText,
				userName: localStorage.userName,
				createdAt: moment()

			};
			let currentState = this.state.memoList;
			currentState.unshift(currentMemo);
			this.setState({ memoList: currentState });
			var memo_list = $('#project_memos').DataTable();
			memo_list.destroy();
			setTimeout(function () {
				datatable.ProjectTable.init();
			}, 2000);
			$('#proj_memos').modal('hide');
		}
		else {
			toastr.error('Please enter a valid memo.');
		}
	}

	handleDelete() {
		$('#project_delete').modal('show');
	}

	deleteProjectHandler() {
		if (this.props.params.projectId) {
			var projectId = {
				projectId: this.props.params.projectId
			};
			$('#project_delete').modal('hide');
			functions.showLoader('project_detail');
			this.props.actions.deleteProject(projectId);
		}
	}

	render() {
		var projectDetailData = this.state.projectDetails;
		let priority = '-';
		let stage = '-';
		let duration = null;
		if (projectDetailData) {
			let from = moment(projectDetailData.startDate, moment.ISO_8601); // format in which you have the date
			let to = moment(projectDetailData.endDate, moment.ISO_8601);     // format in which you have the date

			/* using diff */
			duration = to.diff(from, 'days');
		}

		if (projectDetailData) {
			if (projectDetailData.priorityId == 1) {
				priority = 'Normal';
			}
			else if (projectDetailData.priorityId == 2) {
				priority = 'High';
			}
			else if (projectDetailData.priorityId == 3) {
				priority = 'Low';
			}
		}
		if (projectDetailData) {
			if (projectDetailData.stageId == 1) {
				stage = 'Open';
			}
			else if (projectDetailData.stageId == 2) {
				stage = 'In-Progress';
			}
			else if (projectDetailData.stageId == 3) {
				stage = 'Closed';
			}
		}
		var roleData = this
			.state
			.roleDetails
			.map(function (role, index) {
				let roleType = '';
				if (role.roleType == 1) {
					roleType = 'Project Manager';
				}
				else if (role.roleType == 2) {
					roleType = 'Lead Tech';
				}
				return <tr key={index}>
					<td>{roleType}</td>
					<td>{role.firstname + ' ' + role.lastname}</td>
				</tr>;
			}.bind(this));

		let memos = this.state.memoList.map(function (memo, index) {
			return (
				<tr key={index}>
					<td>{memo.userName}</td>
					<td>{moment(memo.createdAt).format('LLL')}</td>
					<td>{memo.message}</td>
				</tr>
			);
		});

		return (
			<div>
				{projectDetailData
					?
					<div>
						<div className="portlet-title tabbable-line">
							<ul className="nav nav-tabs">
								<li className="active">
									<a href="#project-add" data-toggle="tab"> Project </a>
								</li>
								<li>
									<a href="#project-moreinfo" data-toggle="tab"> More Info </a>
								</li>
								<li>
									<a href="#project-memos" data-toggle="tab">
                                        Memos
									</a>
								</li>
								<div className="text-right">
									<Link to="/project" className="btn btn-sm btn-circle red">
                                        Cancel </Link>&nbsp;&nbsp;
									<button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                        Delete </button>&nbsp;&nbsp;
									<Link to={'/project/' + this.props.params.projectId + '/edit'} className="btn btn-sm btn-circle green">
                                        Edit </Link>&nbsp;&nbsp;

									<div className="btn-group">
										<a className="btn btn-sm btn-circle blue" href="javascript:;" data-toggle="dropdown">
											<span className="hidden-xs"> More Options </span>
											<i className="fa fa-angle-down"></i>
										</a>
										<ul className="dropdown-menu pull-right" >
											<li >
												<Link to={'/project_tracking/' + this.props.params.projectId} className="tool-action">
                                                    Production Tracking</Link>
											</li>
											<li >
												<Link to={'/project_costing/' + this.props.params.projectId} className="tool-action">
                                                    Expenses</Link>
											</li>
											<li >
												<Link to={'/project_activities/' + this.props.params.projectId} className="tool-action">
                                                    Activities</Link>
											</li>
											<li >
												<Link to={'/project_timers/' + this.props.params.projectId} className="tool-action">
                                                    Timers</Link>
											</li>
											<li >
												<Link to={'/project_documents/' + this.props.params.projectId} className="tool-action">
                                                    Documents</Link>
											</li>
											<li >
												<Link to={'/project_invoices/' + this.props.params.projectId} className="tool-action">
                                                    Invoices</Link>
											</li>
											<li >
												<Link to={'/project_dailies/' + this.props.params.projectId} className="tool-action">
                                                    Dailies</Link>
											</li>
											<li >
												<Link to={'/project_tools/' + this.props.params.projectId} className="tool-action">
                                                    Tools</Link>
											</li>
										</ul>
									</div></div>
							</ul>
						</div>
						<div className="portlet light bordered" id="project_detail">
							<div className="portlet-body">
								<div className="tab-content">
									<div className="tab-pane active" id="project-add">
										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Project Info</span>
											</div>
										</div>
										<form role="form">
											<div className="form-body">
												<div className="row">
													<div className="col-md-7">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {projectDetailData.customerId ? projectDetailData.customerId.companyName : '-'} </div>
															<label htmlFor="form_control_1">Company</label>
														</div>
													</div>
													<div className="col-md-5">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.individualId ? projectDetailData.individualId.firstname + ' ' + projectDetailData.individualId.lastname : '-'}</div>
															<label htmlFor="form_control_1">Individual</label>
														</div>
													</div>
													<div className="col-md-7">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {projectDetailData.title ? projectDetailData.title : '-'} </div>
															<label htmlFor="form_control_1">Title</label>
														</div>
													</div>
													<div className="col-md-5">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.description ? projectDetailData.description : '-'}</div>
															<label htmlFor="form_control_1">Description</label>
														</div>
													</div>
													<div className="col-md-7">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {projectDetailData.categoryId ? projectDetailData.categoryId.categoryName : '-'} </div>
															<label htmlFor="form_control_1">Category</label>
														</div>
													</div>
													<div className="col-md-5">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{priority}</div>
															<label htmlFor="form_control_1">Priority</label>
														</div>
													</div>
													<div className="col-md-7">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.projectNumber ? projectDetailData.projectNumber : '-'}</div>
															<label htmlFor="form_control_1">Project #</label>
														</div>
													</div>
													<div className="col-md-5">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.departmentId ? projectDetailData.departmentId.departmentName : '-'}</div>
															<label htmlFor="form_control_1">Department</label>
														</div>
													</div>
													<div className="col-md-7">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.projectRate ? '$' : ''}{projectDetailData.projectRate ? projectDetailData.projectRate : '-'}</div>
															<label htmlFor="form_control_1">Project Rate</label>
														</div>
													</div>
												</div>
											</div>
										</form>
										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Roles Info</span>
											</div>
										</div>
										<form role="form">
											<div className="form-body">
												<div className="row">
													<div className="col-md-12">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="table-container table-responsive">
																{this.state.roleDetails.length==0?'-' :<table className="table table-striped table-bordered table-hover">
																	<thead >
																		<tr>
																			<th>Contact</th>
																			<th>Role</th>
																		</tr>
																	</thead>
																	<tbody>
																		{roleData}
																	</tbody>
																</table>}
															</div>
														</div>
													</div>
												</div>
											</div>
										</form>
										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Status Info</span>
											</div>
										</div>
										<form role="form">
											<div className="form-body">
												<div className="row">
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {projectDetailData.startDate ? moment(projectDetailData.startDate, moment.ISO_8601).format('L') : '-'} </div>
															<label htmlFor="form_control_1">Start Date</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static"> {projectDetailData.endDate ? moment(projectDetailData.endDate, moment.ISO_8601).format('L') : '-'} </div>
															<label htmlFor="form_control_1">End Date</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{duration ? duration + ' ' + 'days' : '-'}</div>
															<label htmlFor="form_control_1">Duration</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{stage}</div>
															<label htmlFor="form_control_1">Stage</label>
														</div>
													</div>
													<div className="col-md-6">
														<div className="form-group form-md-line-input form-md-floating-label">
															<div className="form-control form-control-static">{projectDetailData.percentComplete ? projectDetailData.percentComplete + '%' : 0 + '%'}</div>
															<label htmlFor="form_control_1">Percent Complete</label>
														</div>
													</div>
												</div>
											</div>
										</form>
									</div>
									<div className="tab-pane" id="project-moreinfo">
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
															<div className="col-md-7">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.title ? projectDetailData.title : '-'} </div>
																	<label htmlFor="form_control_1">Project Title</label>
																</div>
															</div>
															<div className="col-md-5">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.siteAddress ? projectDetailData.siteAddress : '-'} </div>
																	<label htmlFor="form_control_1">Site Address</label>
																</div>
															</div>

															<div className="col-md-7">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.createdBy ? projectDetailData.createdBy : '-'}</div>
																	<label htmlFor="form_control_1">Created By</label>
																</div>
															</div>
															<div className="col-md-5">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.createdAt ? moment(projectDetailData.createdAt).format('LLL') : '-'}</div>
																	<label htmlFor="form_control_1">On</label>
																</div>
															</div>

															<div className="col-md-7">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.modifiedBy ? projectDetailData.modifiedBy : '-'}</div>
																	<label htmlFor="form_control_1">Modified By</label>
																</div>
															</div>
															<div className="col-md-5">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.modifiedBy ? moment(projectDetailData.updatedAt).format('LLL') : '-'}</div>
																	<label htmlFor="form_control_1">On</label>
																</div>
															</div>
															<div className="col-md-7">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.overhead ? projectDetailData.overhead : '-'}</div>
																	<label htmlFor="form_control_1">Overhead</label>
																</div>
															</div>
															<div className="col-md-5">
																<div className="form-group form-md-line-input form-md-floating-label">
																	<div className="form-control form-control-static">{projectDetailData.overhead ? projectDetailData.overhead : '-'}</div>
																	<label htmlFor="form_control_1">Overhead project</label>
																</div>
															</div>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>
									<div className="tab-pane" id="project-memos">
										<div className="portlet light portlet-fit portlet-datatable bordered">
											<div className="portlet-title">
												<div className="actions">
													<a href="#proj_memos" data-toggle="modal"
														data-backdrop="static" data-keyboard="false" className="btn btn-sm btn-circle green">
														<i className="icon-plus"></i>
                                                        Add Memo
													</a>
												</div>
											</div>
											<div className="portlet-body">
												<div className="table-container table-responsive">
													<table className="table table-striped table-bordered table-hover" id="project_memos">
														<thead >
															<tr>
																<th>User</th>
																<th>Date/Time</th>
																<th>Message</th>
															</tr>
														</thead>
														<tbody>
															{memos}
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					: null}
				<div id="proj_memos" className="modal fade" tabIndex="-1" aria-hidden="true">
					<div className="modal-dialog modal-sm">
						<div className="modal-content">
							<div className="modal-header">
								<div className="caption">
									<span className="caption-subject bold uppercase">Add Memo</span>
								</div>
							</div>
							<div className="modal-body">
								<div className="row">
									<div className="col-md-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<TextareaAutosize
												style={{ resize: 'none' }}
												className="form-control"
												rows={1}
												ref="projectMemo"
												name="projectMemo"
												id="projectMemo"
												defaultValue=''
												key=''></TextareaAutosize>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" data-dismiss="modal" className="btn dark btn-outline">Cancel</button>
								<button
									type="button"
									className="btn green"
									onClick={this.handleMemoAdd}>Save</button>
							</div>
						</div>
					</div>
				</div>
				<DeleteModal deleteModalId="project_delete" deleteUserHandler={this.deleteProjectHandler} />
			</div>

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		projectDetail: state.project.projectDetailData
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(projectActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
