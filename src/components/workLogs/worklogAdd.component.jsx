import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import moment from 'moment';
import Select from 'react-select';
import * as worklogAction from '../../actions/worklogAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import '../../styles/bootstrap-fileinput.css';
import autoBind from 'react-autobind';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import * as msg from '../../constants/messageConstants';
import AddOtherProjectSOModal from '../common/addOtherProjectSOModal';

/**
 * Fetching browser and system details
 */
var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName  = navigator.appName;
var fullVersion  = ''+parseFloat(navigator.appVersion); 
var majorVersion = parseInt(navigator.appVersion,10);
var nameOffset,verOffset,ix;

// In Opera 15+, the true version is after "OPR/" 
if ((verOffset=nAgt.indexOf('OPR/'))!=-1) {
	browserName = 'Opera';
	fullVersion = nAgt.substring(verOffset+4);
}
// In older Opera, the true version is after "Opera" or after "Version"
else if ((verOffset=nAgt.indexOf('Opera'))!=-1) {
	browserName = 'Opera';
	fullVersion = nAgt.substring(verOffset+6);
	if ((verOffset=nAgt.indexOf('Version'))!=-1) 
		fullVersion = nAgt.substring(verOffset+8);
}
// In MSIE, the true version is after "MSIE" in userAgent
else if ((verOffset=nAgt.indexOf('MSIE'))!=-1) {
	browserName = 'Microsoft Internet Explorer';
	fullVersion = nAgt.substring(verOffset+5);
}
// In Chrome, the true version is after "Chrome" 
else if ((verOffset=nAgt.indexOf('Chrome'))!=-1) {
	browserName = 'Chrome';
	fullVersion = nAgt.substring(verOffset+7);
}
// In Safari, the true version is after "Safari" or after "Version" 
else if ((verOffset=nAgt.indexOf('Safari'))!=-1) {
	browserName = 'Safari';
	fullVersion = nAgt.substring(verOffset+7);
	if ((verOffset=nAgt.indexOf('Version'))!=-1) 
		fullVersion = nAgt.substring(verOffset+8);
}
// In Firefox, the true version is after "Firefox" 
else if ((verOffset=nAgt.indexOf('Firefox'))!=-1) {
	browserName = 'Firefox';
	fullVersion = nAgt.substring(verOffset+8);
}
// In most other browsers, "name/version" is at the end of userAgent 
else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
          (verOffset=nAgt.lastIndexOf('/')) ) 
{
	browserName = nAgt.substring(nameOffset,verOffset);
	fullVersion = nAgt.substring(verOffset+1);
	if (browserName.toLowerCase()==browserName.toUpperCase()) {
		browserName = navigator.appName;
	}
}
// trim the fullVersion string at semicolon/space if present
if ((ix=fullVersion.indexOf(';'))!=-1)
	fullVersion=fullVersion.substring(0,ix);
if ((ix=fullVersion.indexOf(' '))!=-1)
	fullVersion=fullVersion.substring(0,ix);

majorVersion = parseInt(''+fullVersion,10);
if (isNaN(majorVersion)) {
	fullVersion  = ''+parseFloat(navigator.appVersion); 
	majorVersion = parseInt(navigator.appVersion,10);
}
var projectData=[];
class WorklogAdd extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			disabled: false,
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
			worklogNumber:''
	
		};
	}

	componentWillMount() {
		var data1 = {
			parent: 'Work Logs',
			childone: '',
			childtwo: ''
		};
		let companyId = {
			companyId: localStorage.companyId
		};
		this.props.breadCrumb(data1);
		this.props.actions.getWorklogNo(companyId);
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

		if (localStorage.projectTimerId && localStorage.timerProjectName) {
			var obj = {
				id: localStorage.projectTimerId,
				label: localStorage.timerProjectName
			};
			this.setState({ projectValue: obj });
		}

	}
    
	componentDidUpdate() {
       
	}
	componentWillReceiveProps(nextProps) {
		var contact = [];
		var project = [{id:'addOther',label:'Add Other'}];
		var item = [];
		
		if (nextProps.worklogNo) {
			this.setState({ worklogNumber: nextProps.worklogNo });
		}
		if(nextProps.projectList.length!=0){
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
		}
		

		this.setState({ projectOptions: project });

		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
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

	
	componentWillUnmount() {
		localStorage.setItem('projectTimerId', '');
		localStorage.setItem('timerProjectName', '');
	}
	
	worklogHandler(){

		if(this.state.selectedProject && this.state.status){
			$('div#create_timer').block({
				message: loader.GET_LOADER_IMAGE,
				css: {
					width: '25%'
				},
				overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
			});
			var workLogDetails = {
				worklogNumber: this.state.worklogNumber,
				companyEmployeeId: localStorage.employeeId,
				technicianName:localStorage.userName,
				companyId: localStorage.companyId,
				currentDate:moment().format('ddd, MMM D, YYYY'),
				currentTime:moment().format('LT'),
				status:this.state.status,
				project:this.state.selectedProject,
				browserDetails:{
					browserName:browserName,
					majorVersion:majorVersion,
					fullVersion:fullVersion,
					appName:navigator.appName,
					userAgent:navigator.userAgent
				}
			};

			this
				.props
				.actions
				.createWorkLog(workLogDetails);
		}else{
			toastr.error(msg.REQUIRED_STATUS);
		}
	}
	handleChange(e) {	
		this.setState({status: e.target.value});
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
		
		var currDate=moment().format('ddd, MMM D, YYYY hh:mm a');
	
		return (
			<div>
				<div className="portlet-title tabbable-line abc">
					<ul className="nav nav-tabs portlet_title_list">
						<li className="active">
							<a href="#timer-add" data-toggle="tab">
                            Add Work Log Entry
							</a>
						</li>
						<div className="form-actions noborder text-right">
							<Link to={localStorage.projectTimerId ? '/project_timers/' + localStorage.projectTimerId : '/worklog'} className="btn red">
                                Cancel
							</Link>&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.worklogHandler}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered portlet_id_timer" id="create_timer">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="timer-add">
								<div className="portlet-title">
									<div className="caption col-md-6">
										<span className="caption-subject bold uppercase">{localStorage.userName?localStorage.userName:localStorage.companyName}</span>
									</div>
									<div className="caption col-md-6">
										<span className="caption-subject bold uppercase">{currDate}</span>
									</div>
								</div>
								<form role="form" id="createWorklog">
									<div className="form-body">
										<div className="row">
											
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="project">Project/Site<span className="required">*</span>
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
													<input name='status' type="radio" value="1" onChange={this.handleChange}/><label>Check In</label>
													<input  name='status'type="radio" value="0" className="check_out_radio" onChange={this.handleChange}/><label>Check Out</label>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<AddOtherProjectSOModal
					modalId="select-addType"
					ref="addType"
					addType={this.state.addType}
					handleAddOtherPopup={this.handleAddOtherPopup}
				/>
			</div>

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return { 
		projectList: state.worklog.projectList,
		worklogNo: state.worklog.worklogNo,
		addOther:state.worklog.addOther
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(worklogAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(WorklogAdd);