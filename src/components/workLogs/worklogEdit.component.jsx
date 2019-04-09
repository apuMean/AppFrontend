import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import jQuery from 'jquery';
import moment from 'moment';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import * as worklogAction from '../../actions/worklogAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/bootstrap-fileinput.css';
import autoBind from 'react-autobind';
import * as msg from '../../constants/messageConstants';
import * as functions from '../common/functions';
import AddOtherProjectSOModal from '../common/addOtherProjectSOModal';


var projectData=[];

class WorklogEdit extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			disabled: false,
			worklogData: '',
			contactValue: '',
			contactOptions: [],
			projectValue: '',
			projectOptions: [],
			itemValue: '',
			itemOptions: [],
			startDate: '',
			endDate: '',
			hoursRt: 8,
			selectedProject:'',
			status:'',
		};
	}

	componentWillMount() {
		// functions.showLoader('update_timer');
		// $('div#update_timer').block({
		// 	message: loader.GET_LOADER_IMAGE,
		// 	css: {
		// 		width: '25%'
		// 	},
		// 	overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
		// });

		var data1 = {
			parent: 'Work Logs',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data1);

		var worklogId = {
			companyId: localStorage.companyId,
			workLogId: this.props.params.worklogId
		};
		this
			.props
			.actions
			.getWorklogDetails(worklogId);
			
	}
	componentDidMount() {
		appValid
			.FormValidationMd
			.init();
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);


		// var timerId = {
		// 	companyId: localStorage.companyId,
		// 	timerId: this.props.params.worklogId
		// };
		// this
		// 	.props
		// 	.actions
		// 	.getTimerDetailValues(timerId);
	}
	componentDidUpdate() {
		// this.triggerLabel();
       
	}
	componentWillReceiveProps(nextProps) {
		var contact = [];
		// var project = [];
		var project = [{id:'addOther',label:'Add Other'}];
		var item = [];

		// contact
		if(nextProps.projectList){
			projectData=nextProps.projectList;
			var projectList = nextProps
				.projectList
				.map(function (list, index) {
					var obj = {
						id: list._id,
						label:list.title?list.title:list.orderNumber?list.orderNumber:list.otherTitle
					};
					project.push(obj);
				}.bind(this));
			this.setState({ projectOptions: project });
		}
		if(nextProps.worklogDetails.length!=0){
			this.setState({worklogData:nextProps.worklogDetails});
			this.setState({startDate:moment(nextProps.worklogDetails.createdAt).format('MM-DD-YYYY h:mm:ss a')});

			let projectObj = {
				id: nextProps.worklogDetails.projectId?nextProps.worklogDetails.projectId._id:nextProps.worklogDetails.serviceOrderId?nextProps.worklogDetails.serviceOrderId._id:nextProps.worklogDetails.otherValueId._id,
				_id: nextProps.worklogDetails.projectId?nextProps.worklogDetails.projectId._id:nextProps.worklogDetails.serviceOrderId?nextProps.worklogDetails.serviceOrderId._id:nextProps.worklogDetails.otherValueId._id,
				label: nextProps.worklogDetails.projectId?nextProps.worklogDetails.projectId.title:nextProps.worklogDetails.serviceOrderId?nextProps.worklogDetails.serviceOrderId.orderNumber	:nextProps.worklogDetails.otherValueId.otherTitle
			};

			// let isChecked=this.state.worklogData?this.state.worklogData.status==1?true:false:false;

			this.setState({
				projectValue: projectObj,
				selectedProject:nextProps.worklogDetails.projectId?nextProps.worklogDetails.projectId:nextProps.worklogDetails.serviceOrderId?nextProps.worklogDetails.serviceOrderId:nextProps.worklogDetails.otherValueId,
				status:nextProps.worklogDetails.status
			});
		}

		if(nextProps.addOther.length!=0){
			let obj={
				id:nextProps.addOther._id,
				label:nextProps.addOther.otherTitle
			};
			let selectedObj={
				_id:nextProps.addOther._id,
				otherTitle:nextProps.addOther.otherTitle
			};
			this.setState({
				projectValue:obj,
				selectedProject:selectedObj});

		}
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
			layout
				.FormValidationMd
				.init();
		}, 400);
	}
	triggerLabel() {
		var totalHrs = ReactDOM.findDOMNode(this.refs.totalHr).value.trim();
		if (totalHrs) {
			var hrs = ReactDOM.findDOMNode(this.refs.totalHr);
			hrs.className += ' edited';
		}
	}
	handleContactChange(value) {

		this.setState({ contactValue: value });
	}

	onInputContactChange(value) {
		var data = {
			firstname: value,
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getIndividualData(data);
	}

	handleProjectChange(value) {
		if(value==null){
			this.setState({ projectValue: value });
		}else if(value.id=='addOther'){
			$('#select-addType').modal('show');
		}else{
			this.setState({ projectValue: value });
			var currentData=projectData.filter((project, index) =>{
				if(value.id===project._id){
					return project;
				}
			});
			this.setState({selectedProject:currentData[0]});
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

	handleItemChange(value) {

		this.setState({ itemValue: value });
	}

	onInputItemChange(value) {
		if (this.state.projectValue && this.state.projectValue.id) {
			var data = {
				itemName: value,
				projectId: this.state.projectValue.id
			};
			this
				.props
				.actions
				.getItemData(data);
		}
	}

	handleStartDate(event, picker) {
		// debugger
		var displayDate = picker
			.startDate
			.format('MM-DD-YYYY h:mm:ss a');
		this.setState({ startDate: displayDate });
		layout
			.FloatLabel
			.init();

		var validator = jQuery('#createWorklog').validate();
		validator.element('#startDateTime');
		jQuery('span[id^="startDateTime-error"]').remove();

	}
	handleChange(e) {	
		this.setState({status: e.target.value});
	}



	updateWorklogHandler() {
		if(this.state.selectedProject){
			if (jQuery('#createWorklog').valid()) {
			
				$('div#update_timer').block({
					message: loader.GET_LOADER_IMAGE,
					css: {
						width: '25%'
					},
					overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
				});
				var startDate = this
					.state
					.startDate
					.split(' ');
				var workLogDetails = {
					workLogId: this.props.params.worklogId,
					companyId: localStorage.companyId,
					companyEmployeeId: localStorage.employeeId,
					modifiedBy:localStorage.userName,
					modifiedDate:moment().format('ddd, MMM D, YYYY'),
					modifiedTime:moment().format('LT'),
					status:this.state.status,
					projectId:this.state.selectedProject,
					// checkInOutTime:this.state.startDate,
					checkInOutDate: startDate[0],
					checkInOutTime: startDate[1]
				};
				this
					.props
					.actions
					.updateWorklog(workLogDetails);
			}
		}else{
			toastr.error(msg.UPDATE_WORKLOG);

		}
	}
	handleAddOtherPopup(e){
		if (jQuery('#addOtherProjectType').valid()) {
			toastr.remove();
			e.preventDefault();
			let name = ReactDOM.findDOMNode(this.refs.addType.refs.add_value).value;
			$('#select-addType').modal('hide');
			let data={
				userId: localStorage.employeeId,
				companyId: localStorage.companyId,
				title:name
			};
			this.props.actions.addOtherOption(data);
		}
		
	}


	render() {
		// let startDateValue=moment(this.state.worklogData.createdAt).format('MM-DD-YYYY h:mm:ss a');
		// let isChecked=this.state.worklogData?this.state.worklogData.status==1?true:false:false;
		return (
			<div>
				{this.state.worklogData ? <div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#timer-add" data-toggle="tab">
                                    Work Log
								</a>
							</li>
							{/*<li>
                                    <a href="#timer-moreinfo" data-toggle="tab">
                                        More Info
                                        </a>
                                </li>*/}
							<div className="form-actions noborder text-right">
								<Link to={'/worklog/' + this.props.params.worklogId} className="btn red">
                                        Cancel
								</Link>&nbsp;&nbsp;
								<button type="button" className="btn blue" onClick={this.updateWorklogHandler}>Save</button>
							</div>
						</ul>
					</div>
					<div className="portlet light bordered" id="update_timer" ref="update_timer">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="timer-add">
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">General Details</span>
										</div>
									</div>
									<form role="form" id="createWorklog">
										<div className="form-body">
											<div className="row">
												<div className="col-md-6">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="project">Project/SO<span className="required">*</span>
														</label>
														<Select
															disabled={this.state.disabled}
															value={this.state.projectValue}
															placeholder="Type to search"
															name="project"
															options={this.state.projectOptions}
															onChange={this.handleProjectChange}
															onInputChange={this.onInputProjectChange} />
													</div>
												</div>
												<div className="col-md-6">
													
													<div className="work_log_custom_radio">					
														<input name='status' type="radio" value="1" defaultChecked={this.state.status==1?true:false} onChange={this.handleChange}/><label>Check In</label>
														<input  name='status'type="radio" value="0" className="check_out_radio" defaultChecked={this.state.status==false?true:false} onChange={this.handleChange}/><label>Check Out</label>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6">
													<div className="form-group  form-md-floating-label">
														<label htmlFor="startDateTime">Check In/Out Time<span className="required">*</span>
														</label>
														<DateRangePicker
															showDropdowns={true}
															minDate={moment()}
															timePicker={true}
															onApply={this.handleStartDate}
															singleDatePicker>
															<div className="input-group date form_datetime">
																<input
																	type="text"
																	className="selected-date-range-btn"
																	size="16"
																	readOnly={true}
																	name="startDateTime"
																	id="startDateTime"
																	className="form-control"
																	defaultValue={this.state.startDate}
																	key={this.state.startDate} />
																<span className="input-group-btn">
																	<button className="btn default date-set calendar-shadow-none" type="button">
																		<i className="fa fa-calendar"></i>
																	</button>
																</span>
															</div>
														</DateRangePicker>
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
					: null}
				<AddOtherProjectSOModal
					modalId="select-addType"
					ref="addType"
					addType={this.state.addType}
					handleAddOtherPopup={this.handleAddOtherPopup}
				/>

			</div >

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return { 
		worklogDetails: state.worklog.worklogDetails,
		projectList: state.worklog.projectList,
		addOther:state.worklog.addOther };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(worklogAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(WorklogEdit);