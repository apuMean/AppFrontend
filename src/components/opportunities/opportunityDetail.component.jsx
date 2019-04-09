import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import moment from 'moment';
import { browserHistory } from 'react-router';
import DeleteModal from '../common/deleteModal.component';
import Stats from '../common/stats.component';
import RoleAwareComponent from '../authorization/roleaware.component';
import * as loader from '../../constants/actionTypes';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as opportunityAction from '../../actions/opportunityAction';
import '../../styles/bootstrap-fileinput.css';
import * as validate from '../common/validator';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import BlockUi from 'react-block-ui';
// import download from 'downloadjs';
import { ToggleListGrid } from '../common/listGridToggle.component';
import { ListViewZone } from '../common/listViewDropZone.component';
import { DropZoneActions } from '../common/dropzoneActions.component';
import { GridViewZone } from '../common/gridViewDropZone.component';
import autoBind from 'react-autobind';
import { RenameFileModal } from '../common/renameFileModal.component';
import ConfirmationDialog from '../common/confirmationDialog.component';

import lib from 'download-url-file';
import toastr from 'toastr';
let downloadFile = lib.downloadFile;

class OpportunityDetail extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			opportunityDetail: '',
			opportunityId: '',
			statsData: {
				value: '',
				probability: '',
				stage: '',
				createdAt: ''
			},
			memoList: [],
			breadcrumb: true,
			files: [],
			filesPreview: [],
			defaultList: true,
			filesTab: true,
			blocking: false,
			fileName: '',
			ext: '',
			hidden: false,
			modified: '',
			deleteType: null
		};
	}

	componentDidMount() {
		var opportunityId = {
			opportunityId: this.props.params.opportunityId
		};
		var oppEst = {
			companyId: localStorage.companyId,
			opportunityId: this.props.params.opportunityId
		};
		this
			.props
			.actions
			.getOppDetailValues(opportunityId);

		this
			.props
			.actions
			.getOppEstimates(oppEst);

		setTimeout(function () {
			datatable
				.OpportunityTable
				.init();
		}, 2000);
		functions.showLoader('opportunityList');
	}

	oppEstimate() {
		localStorage.setItem('oppEstId', this.props.params.opportunityId);
		browserHistory.push('/estimate/add');
	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		let currentStage = '';
		let currentProbability = '';
		let oppDetail = JSON.parse(JSON.stringify(nextProps.opportunityDetail));
		if (this.state.breadcrumb && oppDetail.title) {
			var data = {
				parent: <Link to='/opportunity'>Opportunities</Link>,
				childone: oppDetail.title,
				childtwo: ''
			};
			this.props.breadCrumb(data);
			this.state.breadcrumb = false;
		}
		if (nextProps.filesData.length) {
			this.setState({
				files: nextProps.filesData,
				blocking: false
			});
			$('#rename_file').modal('hide');
		}
		else {
			setTimeout(function () {
				self.setState({ blocking: false });
			}, 1000);
		}
		if (oppDetail) {            
         
			if (oppDetail.stageInfo[0].stageName == 'Complete') {
				currentStage = 100;
			} else if (oppDetail.stageInfo[0].stageName == 'In-Complete') {
				currentStage = 80;
			} else if (oppDetail.stageInfo[0].stageName == 'In-Progress') {
				currentStage = 60;
			}
			else if (oppDetail.stageInfo[0].stageName == 'Approved') {
				currentStage = 40;
			}
			else if (oppDetail.stageInfo[0].stageName == 'Pre-Approved') {
				currentStage = 20;
			}
			else if (oppDetail.stageInfo[0].stageName == 'Dead') {
				currentStage = 0;
			}

			if (oppDetail.probabilityId == 0) {
				currentProbability = 0;
			} else if (oppDetail.probabilityId == 1) {
				currentProbability = 10;
			} else if (oppDetail.probabilityId == 2) {
				currentProbability = 20;
			} else if (oppDetail.probabilityId == 3) {
				currentProbability = 30;
			} else if (oppDetail.probabilityId == 4) {
				currentProbability = 40;
			} else if (oppDetail.probabilityId == 5) {
				currentProbability = 50;
			} else if (oppDetail.probabilityId == 6) {
				currentProbability = 60;
			} else if (oppDetail.probabilityId == 7) {
				currentProbability = 70;
			} else if (oppDetail.probabilityId == 8) {
				currentProbability = 80;
			} else if (oppDetail.probabilityId == 9) {
				currentProbability = 90;
			} else if (oppDetail.probabilityId == 10) {
				currentProbability = 100;
			} else {
				currentProbability = '';
			}
			$('div#opportunityList').unblock();
		}
		let daysOpen = '';
		let currentDate = moment().format('MM/DD/YYYY');
		let createdAt = moment(oppDetail.createdAt).startOf('day').format('MM/DD/YYYY');
		let m1 = moment(createdAt, 'MM/DD/YYYY');
		let m2 = moment(currentDate, 'MM/DD/YYYY');
		daysOpen = m2.diff(m1, 'days');
		let currentStats = {
			value: oppDetail.value ? oppDetail.value.toFixed(2) : 0,
			daysOpen: daysOpen,
			probability: currentProbability,
			stage: currentStage
		};

		this.setState({
			opportunityDetail: oppDetail,
			statsData: currentStats,
			memoList: oppDetail.memo ? oppDetail.memo.reverse() : []
		});
	}

	handleDelete() {
		this.setState({ opportunityId: this.props.params.opportunityId });
		$('#opportunity_delete').modal('show');
	}

	deleteOpportunityHandler() {
		if (this.state.opportunityId) {
			$('#opportunity_delete').modal('hide');
			functions.showLoader('opportunityList');
			var data = {
				opportunityId: this.state.opportunityId
			};
			this.props.actions.deleteOpportunity(data);
		}
	}

	handleMemoAdd() {
		toastr.remove();
		let memoText = ReactDOM.findDOMNode(this.refs.oppMemo).value.trim();
		if (memoText !== '') {
			let memoData = {
				opportunityId: this.props.params.opportunityId,
				message: memoText,
				userName: localStorage.userName,
			};
			this.props.actions.addOppMemos(memoData);
			let currentMemo = {
				message: memoText,
				userName: localStorage.userName,
				createdAt: moment()

			};
			let currentState = this.state.memoList;
			currentState.unshift(currentMemo);
			this.setState({ memoList: currentState });
			var memo_list = $('#opportunity_memos').DataTable();
			memo_list.destroy();
			setTimeout(function () {
				datatable.OpportunityTable.init();
			}, 2000);
			$('#opp_memos').modal('hide');
		}
		else {
			toastr.error('Please enter a valid memo.');
		}
	}

	onDrop(acceptedFiles, rejectedFiles) {
		if (rejectedFiles.length) {
			toastr.error('Only images,documents are allowed.');
		}
		else {
			if (acceptedFiles.length <= 20) {
				this.setState({ blocking: true });
				this.props.actions.handleDrop(acceptedFiles, this.props.params.opportunityId);
			}
			else {
				toastr.error('You have reached the limit of 20 files upload at a time.');
			}
		}
	}

	onUpload(e) {
		if (e.target.files.length > 0) {
			let acceptedFiles = [];
			Array.prototype.push.apply(acceptedFiles, e.target.files);
			this.setState({ blocking: true });
			this.props.actions.handleDrop(acceptedFiles, this.props.params.opportunityId);
		}
	}

	handleFilesTab() {
		let data = {
			opportunityId: this.props.params.opportunityId
		};
		if (this.state.filesTab) {
			this.setState({ blocking: true });
			this.props.actions.getOpportunityFiles(data);
		}
	}

	toggleDropzoneView() {
		this.setState({ defaultList: !this.state.defaultList });
	}

	handleRenameClick(index, e) {
		let files = this.state.files;
		let res = files[index];
		let ext = res.filename.substr(res.filename.lastIndexOf('.') + 1);
		this.setState({
			currentFileId: res._id,
			fileName: res.filename.replace(/\.[^/.]+$/, ''),
			ext: ext,
			modified: moment(res.updatedAt).format('L')
		});
		$('#rename_file').modal();
	}

	downloadFile(index, e) {
		let files = this.state.files;
		let res = files[index];
		let headers={
			'Content-Type': 'application/json',
			'Authorization': localStorage.token
		};
		downloadFile(res.filePath);
	}

	fileNameHandler(e) {
		let value = e.target.value;
		let format = /^[a-zA-Z0-9\\b\&\(\)\-\_\[\]\\\{\}\"\,\/\?\s]*$/;
		if (format.test(value)) {
			this.setState({ fileName: e.target.value.trim() });
		}
	}

	handleRenameFile() {
		toastr.remove();
		if (this.state.fileName) {
			let data = {
				attachmentId: this.state.currentFileId,
				filename: this.state.fileName.trim() + '.' + this.state.ext
			};
			this.props.actions.renameFile(data);
		}
		else {
			toastr.error('Please enter a valid name for the file.');
		}
	}

	handleDeleteClick(index, type) {
		let files = this.state.files;
		let res = files[index];
		this.setState({
			currentFileId: res._id,
			deleteType: type
		});
		$('#file_delete').modal('show');
	}

	deleteFileHandler() {
		if (this.state.currentFileId) {
			$('#file_delete').modal('hide');
			let data = {
				attachmentId: this.state.currentFileId,
				isTemp: true
			};
			this.props.actions.deleteFile(data);
		}
	}

	restoreFile(index) {
		let files = this.state.files;
		let res = files[index];
		this.setState({
			currentFileId: res._id
		});
		$('#restore_id').modal('show');
	}

	restoreFileHandler() {
		if (this.state.currentFileId) {
			let data = {
				attachmentId: this.state.currentFileId,
				isTemp: false
			};
			this.props.actions.restoreFile(data);
			$('#restore_id').modal('hide');
		}
	}

	hideShowHandler() {
		this.setState({ hidden: !this.state.hidden });
	}

	reorderItems(event, previousIndex, nextIndex, fromId, toId) {
	}

	render() {
		let oppData = this.state.opportunityDetail;
		let priority = '';
		let source = '-';
		let phone = '-';
		let memos = null;

		if (oppData) {
			if (oppData.priorityId == 1) {
				priority = 'Normal';
			} else if (oppData.priorityId == 2) {
				priority = 'High';
			} else if (oppData.priorityId == 3) {
				priority = 'Low';
			}
			else {
				priority = '-';
			}

			if (oppData.source && oppData.source.sourceName) {
				source = oppData.source.sourceName;
			}

			if (oppData.ContactPhoneInfo.length != 0) {
				let phoneCount = validate.removeSpecialCharSpace(oppData.ContactPhoneInfo[0].phone);
				if (phoneCount.length <= 11 && phoneCount.includes('x')) {
					phone = oppData.ContactPhoneInfo[0].phone.substring(0, oppData.ContactPhoneInfo[0].phone.indexOf('x'));
				} else {
					phone = oppData.ContactPhoneInfo[0].phone;
					var str = phone;
					var newStr = str.replace(/_/g, '');
					phone = newStr;
				}
			}

			memos = this.state.memoList.map(function (memo, index) {
				return (
					<tr key={index}>
						<td>{memo.userName}</td>
						<td>{moment(memo.createdAt).format('LLL')}</td>
						<td>{memo.message}</td>
					</tr>
				);
			});
		}
		let oppEstimates = this.props.oppEstimates.map(function (est, index) {

			return (
				<tr key={index}>
					<td>{est.estimateNumber}</td>
					<td>{est.CompanyName ? est.CompanyName : '-'}</td>
					<td>{est.salesRep ? est.salesRep.firstname + ' ' + est.salesRep.lastname : ''}</td>
					<td>{moment(est.createdAt).format('MM/DD/YYYY')}</td>
				</tr>
			);
		});
		return (
			<div>
				<div>
					{this.state.statsData.value != '' ? <Stats statsData={this.state.statsData} /> : null}
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#opportunity-add" data-toggle="tab">
                                    Opportunity
								</a>
							</li>
							<li>
								<a href="#opportunity-moreinfo" data-toggle="tab">
                                    More Info
								</a>
							</li>
							<li>
								<a href="#opportunity-estimates" data-toggle="tab">
                                    Estimate
								</a>
							</li>
							<li>
								<a href="#opportunity-memos" data-toggle="tab">
                                    Memos
								</a>
							</li>
							<li>
								<a href="#opportunity-files" data-toggle="tab" onClick={this.handleFilesTab}>
                                    Files
								</a>
							</li>
							<div className="text-right">
								<Link to="/opportunity" className="btn btn-sm btn-circle red">
                                    Cancel </Link>&nbsp;&nbsp;
								{this.shouldBeVisible(authorize.opportunitiesEditorAuthorize) ? <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
                                    Delete </button> : null}&nbsp;&nbsp;
								{this.shouldBeVisible(authorize.opportunitiesEditorAuthorize) ? <Link to={'/opportunity/' + this.props.params.opportunityId + '/edit'} className="btn btn-sm btn-circle green">
                                    Edit </Link> : null}
							</div>

						</ul>
					</div>
					<div className="portlet light bordered" id="opportunityList">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="opportunity-add">
									<form role="form">
										<div className="form-body">
											<div className="row">
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.SalesRepId ? oppData.SalesRepId.firstname + ' ' + oppData.SalesRepId.lastname : '-'}
														</div>
														<label htmlFor="form_control_1">Sales Rep</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.title ? oppData.title : '-'}
														</div>
														<label htmlFor="form_control_1">Title</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.opportunityNumber ? oppData.opportunityNumber : '-'}
														</div>
														<label htmlFor="form_control_1">Opportunity #</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>
															{oppData.description}
														</div>
														<label htmlFor="form_control_1">Description</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData && oppData.tags.length ? oppData.tags.toString() : '-'}
														</div>
														<label htmlFor="tags">Tags</label>
													</div>
												</div>
											</div>
										</div>
									</form>
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">Details</span>
										</div>
									</div>
									<form role="form">
										<div className="form-body">
											<div className="row">
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{priority}
														</div>
														<label htmlFor="form_control_1">Priority</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.estStartDate ? oppData.estStartDate : '-'}
														</div>
														<label htmlFor="form_control_1">Estimated Start Date</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.estCloseDate ? oppData.estCloseDate : '-'}
														</div>
														<label htmlFor="form_control_1">Estimated Close Date</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.actStartDate ? oppData.actStartDate : '-'}
														</div>
														<label htmlFor="form_control_1">Actual Start Date</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.actCloseDate ? oppData.actCloseDate : '-'}
														</div>
														<label htmlFor="form_control_1">Actual Close Date</label>
													</div>
												</div>
											</div>
										</div>
									</form>
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">Other Details</span>
										</div>
									</div>
									<form role="form">
										<div className="form-body">
											<div className="row">
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.endUser ? oppData.endUser.companyName : '-'}
														</div>
														<label htmlFor="form_control_1">End User</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.industryId ? oppData.industryId.industryName : '-'}
														</div>
														<label htmlFor="form_control_1">Industry</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.CompanyName}
														</div>
														<label htmlFor="form_control_1">Client</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData.individualUserId ? oppData.individualUserId.firstname + ' ' + oppData.individualUserId.lastname : '-'}
														</div>
														<label htmlFor="form_control_1">Contact</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{phone}
														</div>
														<label htmlFor="form_control_1">Phone</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{oppData && oppData.ContactInternetInfo.length != 0
																? oppData.ContactInternetInfo[0].internetvalue
																: '-'}
														</div>
														<label htmlFor="form_control_1">Email</label>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
								<div className="tab-pane" id="opportunity-moreinfo">
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
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">
																	{oppData.createdBy}
																</div>
																<label htmlFor="form_control_1">Created By</label>
															</div>
														</div>
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">
																	{moment(oppData.createdAt).format('LLL')}
																</div>
																<label htmlFor="form_control_1">On</label>
															</div>
														</div>
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">
																	{oppData.modifiedBy ? oppData.modifiedBy : '-'}
																</div>
																<label htmlFor="form_control_1">Modified By</label>
															</div>
														</div>
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">
																	{oppData.modifiedBy ? moment(oppData.updatedAt).format('LLL') : '-'}
																</div>
																<label htmlFor="form_control_1">On</label>
															</div>
														</div>
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static">
																	{source ? source : '-'}
																</div>
																<label htmlFor="source">Source</label>
															</div>
														</div>
														<div className="col-md-6 col-sm-6 col-xs-12">
															<div className="form-group form-md-line-input form-md-floating-label">
																<div className="form-control form-control-static" style={{ whiteSpace: 'pre-wrap' }}>
																	{oppData.sourceDetails ? oppData.sourceDetails : '-'}
																</div>
																<label htmlFor="sourcedetails">Source Details</label>
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
								<div className="tab-pane" id="opportunity-estimates">
									<div className="portlet light portlet-fit portlet-datatable bordered">
										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Estimates</span>
											</div>
											{/* {this.shouldBeVisible(authorize.opportunitiesEditorAuthorize) ? <div className="actions">
                                                <a onClick={this.oppEstimate} className="btn btn-sm btn-circle green">
                                                    <i className="icon-plus"></i>
                                                    New Estimate
                                                        </a>
                                            </div> : null} */}
										</div>
										<div className="portlet-body">
											<div className="table-container table-responsive">
												<table className="table table-striped table-bordered table-hover" id="opportunity_estimate">
													<thead>
														<tr>
															<th>Estimate #</th>
															<th>Company</th>
															<th>Sales Rep</th>
															<th>Date</th>
															{/* <th>Title</th>
                                                            <th>Total</th> */}
														</tr>
													</thead>
													<tbody>
														{oppEstimates}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<div className="tab-pane" id="opportunity-memos">
									<div className="portlet light portlet-fit portlet-datatable bordered">
										{this.shouldBeVisible(authorize.opportunitiesEditorAuthorize) ? <div className="portlet-title">
											<div className="actions">
												<a href="#opp_memos" data-toggle="modal"
													data-backdrop="static" data-keyboard="false" className="btn btn-sm btn-circle green">
													<i className="icon-plus"></i>
                                                    Add Memo
												</a>
											</div>
										</div> : null}
										<div className="portlet-body">
											<div className="table-container table-responsive">
												<table className="table table-striped table-bordered table-hover" id="opportunity_memos">
													<thead>
														<tr>
															<th>User</th>
															<th>Date/Time</th>
															<th>Message</th>
														</tr>
													</thead>
													<tbody >
														{memos}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
								<div className="tab-pane" id="opportunity-files">
									<BlockUi tag="div" blocking={this.state.blocking} className="portlet light portlet-fit portlet-datatable bordered">
										<div className="portlet-body">
											<div className="row">
												<ToggleListGrid
													defaultView={this.state.defaultList}
													toggleDropzoneView={this.toggleDropzoneView}
													onUpload={this.onUpload}
													hideShowHandler={this.hideShowHandler}
													hidden={this.state.hidden}
												/>
											</div>
											<div className="row">
												{this.state.defaultList ?
													<ListViewZone
														dropHandler={this.onDrop}
														files={this.state.files}
														handleRenameClick={this.handleRenameClick}
														handleDeleteClick={this.handleDeleteClick}
														downloadFile={this.downloadFile}
														hidden={this.state.hidden}
														restoreFile={this.restoreFile}
													/> :
													<GridViewZone
														dropHandler={this.onDrop}
														files={this.state.files}
														handleRenameClick={this.handleRenameClick}
														handleDeleteClick={this.handleDeleteClick}
														downloadFile={this.downloadFile}
														hidden={this.state.hidden}
														restoreFile={this.restoreFile}
														reorderItems={this.reorderItems}
													/>}
												{/* <DropZoneActions
                                                    onUpload={this.onUpload}
                                                    hideShowHandler={this.hideShowHandler}
                                                    hidden={this.state.hidden}
                                                /> */}
											</div>
										</div>
									</BlockUi>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="opp_memos" className="modal fade" tabIndex="-1" aria-hidden="true">
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
												ref="oppMemo"
												name="oppMemo"
												id="oppMemo"
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
				<DeleteModal deleteModalId="opportunity_delete" deleteUserHandler={this.deleteOpportunityHandler} />
				<DeleteModal deleteModalId="file_delete" deleteUserHandler={this.deleteFileHandler} />
				<RenameFileModal
					rename_id='rename_file'
					title='Rename File'
					fileName={this.state.fileName}
					fileNameHandler={this.fileNameHandler}
					handleRenameFile={this.handleRenameFile}
					modified={this.state.modified}
				/>
				<ConfirmationDialog
					id={'restore_id'}
					title={'Restore file'}
					message={'Are you sure you want to restore this file ?'}
					confirmationHandler={this.restoreFileHandler}
				/>
			</div>
		);

	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		opportunityDetail: state.opportunity.oppDetailData,
		oppEstimates: state.opportunity.oppEstimates,
		filesData: state.opportunity.filesData
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(opportunityAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDetail);