import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import * as projectActions from '../../actions/projectActions';
import * as createContactAction from '../../actions/createContactAction';
import jQuery from 'jquery';
import '../../styles/bootstrap-fileinput.css';
import autoBind from 'react-autobind';
import MaskedInput from 'react-text-mask';
import { priceMask } from '../../constants/customMasks';
import * as message from '../../constants/messageConstants';

class ProjectAdd extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			disabled: false,
			companyValue: '',
			individualValue: '',
			individualRoleValue: '',
			estimateValue: '',
			companyOptions: [],
			individualOptions: [],
			addType: 'Add',
			projectStartDate: '',
			projectEndDate: '',
			locale: {
				'format': 'MM/DD/YYYY'
			},
			categorydropDown: [],
			departmentdropDown: [],
			projectRoles: [],
			rate:''
		};
	}

	componentWillMount() {
		var data = {
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getProjectDropdowns(data);

		var data1 = {
			parent: 'Projects',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data1);
	}

	componentDidMount() {
		appValid
			.FormValidationMd
			.init();

		if (localStorage.contactProjId) {

			var contact = {
				contactId: localStorage.contactProjId
			};
			this
				.props
				.contactactions
				.getContact(contact);
		}
	}

	componentWillUnmount() {
		localStorage.setItem('contactProjId', '');
	}

	componentWillReceiveProps(nextProps) {
		var company = [];
		var individual = [];

		if (localStorage.contactProjId && company.length == 0 && individual.length == 0) {
			if (nextProps.createcontact) {
				if (nextProps.createcontact.userType == '2') {
					var companyVal = {
						id: nextProps.createcontact.companyContactId,
						label: nextProps.createcontact.companyName
					};
					var individualVal = {
						id: nextProps.createcontact._id,
						label: nextProps.createcontact.firstname + ' ' + nextProps.createcontact.lastname
					};

					this.setState({ companyValue: companyVal, individualValue: individualVal });

				} else if (nextProps.createcontact.userType == '1') {
					var companyVal = {
						id: nextProps.createcontact._id,
						label: nextProps.createcontact.companyName
					};
					this.setState({ companyValue: companyVal });
				}
			}
		}

		if (nextProps.categoryDrop.length != 0) {
			this.setState({ categorydropDown: nextProps.categoryDrop });
		}
		if (nextProps.departmentDrop.length != 0) {
			this.setState({ departmentdropDown: nextProps.departmentDrop });
		}
		if (nextProps.companyList.length != 0) {
			var companyList = nextProps
				.companyList
				.map(function (list, index) {
					var obj = {
						id: list._id,
						label: list.companyName
					};
					company.push(obj);
				}.bind(this));
		}

		if (nextProps.individualList.length != 0) {
			var individualList = nextProps
				.individualList
				.map(function (list, index) {
					var obj = {
						id: list._id,
						label: list.firstname + ' ' + list.lastname,
						firstname: list.firstname,
						lastname: list.lastname,
						title: list.title
					};
					individual.push(obj);
				}.bind(this));
		}

		this.setState({ companyOptions: company, individualOptions: individual });

		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
	}

	handleCompanyChange(value) {
		if (value) {
			this.setState({ companyValue: value });
	
		}
		else {
			this.setState({ companyValue: '', individualValue: '',});
		}

		// this.setState({ companyValue: value });
	}

	handleIndividualChange(value) {
		this.setState({ individualValue: value });
		// this.setState({ individualData: value });
	}

	handleIndividualRoleChange(value) {
		this.setState({ individualRoleValue: value });
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
		// this.setState({ individualData: value });
	}

	onCompanyInputChange(value) {

		if (value.trim()) {
			let data = {
				companyName: value,
				companyId: localStorage.companyId
			};
			// this.setState({ query: data });
			this
				.props
				.actions
				.getCompanyList(data);
		}
		else {
			this.props.actions.clearSelects();
			this.setState({ individualOptions: []});
		}
		
	}

	onIndividualInputChange(value) {

		var contactId = this.state.companyValue.id;
		if (contactId) {
			var data = {
				firstname: value,
				companyId: localStorage.companyId,
				contactId: contactId
			};
			this
				.props
				.actions
				.getIndividualList(data);
		}

	}

	selectOtherType(type, e) {
		ReactDOM
			.findDOMNode(this.refs.add_value)
			.value = '';
		if (e.target.value == 'other') {
			e.target.selectedIndex = '0';
			this.setState({ addType: type });
			$('#select-addType').modal('show');
		}
	}

	handleAddOtherPopup(e) {
		e.preventDefault();
		var name = ReactDOM
			.findDOMNode(this.refs.add_value)
			.value;
		var type = this.state.addType;
		switch (type) {
		case 'Category':
			this
				.props
				.actions
				.addOtherCategory(name);
			break;
		case 'Department':
			this
				.props
				.actions
				.addOtherDepartment(name);
			break;
		default:
			break;
		}

	}

	handleStartDateEvent(event, picker) {
		var displayDate = picker.startDate.format('MM/DD/YYYY');
		if (this.state.projectEndDate) {
			let from = moment(displayDate, 'MM/DD/YYYY'); // format in which you have the date
			let to = moment(this.state.projectEndDate, 'MM/DD/YYYY');     // format in which you have the date
			/* using diff */
			let duration = to.diff(from, 'days');
			if (duration >= 1) {
				this.setState({ projectStartDate: displayDate });
				var validator = jQuery('#createProject').validate();
				validator.element('#endDate');
				jQuery('span[id^="endDate-error"]').remove();
			}
			else {
				toastr.error('Start date should be smaller then end date.');
				this.setState({ projectStartDate: '' });
			}
		}
		else {
			this.setState({ projectStartDate: displayDate });
			var validator = jQuery('#createProject').validate();
			validator.element('#startDate');
			jQuery('span[id^="startDate-error"]').remove();
		}
	}

	handleEndDateEvent(event, picker) {
		var displayDate = picker.startDate.format('MM/DD/YYYY');

		if (this.state.projectStartDate) {
			let from = moment(this.state.projectStartDate, 'MM/DD/YYYY'); // format in which you have the date
			let to = moment(displayDate, 'MM/DD/YYYY');     // format in which you have the date
			/* using diff */
			let duration = to.diff(from, 'days');
			if (duration >= 1) {
				this.setState({ projectEndDate: displayDate });
				var validator = jQuery('#createProject').validate();
				validator.element('#endDate');
				jQuery('span[id^="endDate-error"]').remove();
			}
			else {
				toastr.error('End date should be greater than start date.');
				this.setState({ projectEndDate: '' });
			}
		}
		else {
			toastr.error('Please select start date first.');
			this.setState({ projectEndDate: '' });
		}
	}

	addProjectRole() {
		var data = {
			contactId: this.state.individualRoleValue.id,
			firstname: this.state.individualRoleValue.firstname,
			lastname: this.state.individualRoleValue.lastname,
			roleType: parseInt(ReactDOM.findDOMNode(this.refs.roleType).value)
		};
		if (data.contactId) {
			var roleIndex = this.state.projectRoles.map((o) => o.roleType).indexOf(data.roleType);
			var nameIndex = this.state.projectRoles.map((o) => o.firstname).indexOf(data.firstname);
			if (roleIndex < 0 && nameIndex < 0) {
				this.state.projectRoles.push(data);
				var updatedData = this.state.projectRoles;
				this.setState({ projectRoles: updatedData });
				this.setState({ individualRoleValue: '' });
				this.setState({ individualOptions: [] });
			}
			else {
				toastr.error('This role has been already added');
			}
		}
	}

	removeProjectRole() {
		this
			.state
			.projectRoles
			.splice(index, 1);
		this.setState({ projectRoles: this.state.projectRoles });
	}
	handleValueChange(e) {
		let value = e.target.value;
		this.setState({ rate: value ? value.replace('$', '') : '' });
	}
	projectHandler() {
		let rate=(ReactDOM.findDOMNode(this.refs.projectRate.inputElement).value).replace(/[^0-9.]/g, '');
		var projectData = {
			companyId: localStorage.companyId,
			individualId: this.state.individualValue.id,
			customerId: this.state.companyValue.id,
			title: ReactDOM
				.findDOMNode(this.refs.title)
				.value,
			description: ReactDOM
				.findDOMNode(this.refs.description)
				.value,
			categoryId: ReactDOM
				.findDOMNode(this.refs.category)
				.value,
			priorityId: ReactDOM
				.findDOMNode(this.refs.priority)
				.value,
			stageId: parseInt(ReactDOM.findDOMNode(this.refs.stage).value),
			startDate: this.state.projectStartDate,
			endDate: this.state.projectEndDate,
			percentComplete: parseInt(ReactDOM.findDOMNode(this.refs.percentComplete).value),
			departmentId: ReactDOM
				.findDOMNode(this.refs.department)
				.value,
			// projectRate: parseInt(ReactDOM.findDOMNode(this.refs.projectRate).value),
			projectRate: parseInt(rate),

			role: this.state.projectRoles,
			createdBy: localStorage.userName
		};
		if (jQuery('#createProject').valid()) {
			if (this.state.projectRoles.length == 0) {
				toastr.error('Please add atleast one role first');
			} else {
				$('div#create_project').block({
					message: loader.GET_LOADER_IMAGE,
					css: {
						width: '25%'
					},
					overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
				});
				this
					.props
					.actions
					.createProject(projectData);
			}
		}
	}
	onIndividualFocus() {
		toastr.remove();
		if (this.state.companyValue) {}
		else {
			toastr.error(message.REQUIRED_CUSTOMER);
		}
	}
	render() {
		var roleData = this
			.state
			.projectRoles
			.map(function (role, index) {
				let roleType = '';
				if (role.roleType == 1) {
					roleType = 'Project Manager';
				}
				else if (role.roleType == 2) {
					roleType = 'Lead Tech';
				}
				return <tr key={index}>
					<td>{role.firstname + ' ' + role.lastname}</td>
					<td>{roleType}</td>
					<td><input
						type="button"
						className="btn btn-primary"
						value="Remove"
						onClick={this
							.removeProjectRole
							.bind(this, index)} /></td>
				</tr>;
			}.bind(this));

		var contactdepartment = this
			.state
			.departmentdropDown
			.map(function (department, index) {
				return <option value={department._id} key={index}>{department.departmentName}</option>;
			}.bind(this));

		var contactcategory = this
			.state
			.categorydropDown
			.map(function (category, index) {
				return <option value={category._id} key={index}>{category.categoryName}</option>;
			}.bind(this));
		return (
			<div>
				<div className="portlet-title tabbable-line">
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#project-add" data-toggle="tab">
                                Project
							</a>
						</li>
						<div className="form-actions noborder text-right">
							<Link to={localStorage.contactProjId ? 'contactprojects' : '/project'} className="btn red">
                                Cancel
							</Link>&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.projectHandler}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="create_project">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="project-add">
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject bold uppercase">Project Info</span>
									</div>
								</div>
								<form role="form" id="createProject">
									<div className="form-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="Company">Company<span className="required">*</span></label>
													<Select
														disabled={this.state.disabled}
														value={this.state.companyValue}
														name="Company"
														id="Company"
														options={this.state.companyOptions}
														onChange={this.handleCompanyChange}
														onInputChange={this.onCompanyInputChange}
														backspaceRemoves={true}
														clearable={true} />
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="individual">Individual<span className="required">*</span></label>
													<Select
														disabled={this.state.disabled}
														value={this.state.individualValue}
														name="individual"
														id="individual"
														options={this.state.individualOptions}
														onFocus={this.onIndividualFocus}
														onChange={this.handleIndividualChange}
														onInputChange={this.onIndividualInputChange}
														backspaceRemoves={true}
														clearable={true} />
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<input
														type="text"
														className="form-control"
														id="title"
														ref="title"
														name="title"
														defaultValue="" />
													<label htmlFor="title">Title<span className="required">*</span></label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<input
														type="text"
														className="form-control"
														id="description"
														name="description"
														ref="description"
														defaultValue="" />
													<label htmlFor="description">Description</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select
														className="form-control edited"
														onChange={this
															.selectOtherType
															.bind(this, 'Category')}
														ref="category"
														id="category"
														name="category">

														<option value="0">Select</option>
														{contactcategory}
														<option value="other">Add Other</option>
													</select>
													<label htmlFor="category">Category<span className="required">*</span></label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select
														className="form-control edited"
														id="priority"
														name="priority"
														ref="priority">
														<option value="1">Normal</option>
														<option value="2">High</option>
														<option value="3">Low</option>
													</select>
													<label htmlFor="form_control_1">Priority</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select
														className="form-control edited"
														onChange={this
															.selectOtherType
															.bind(this, 'Department')}
														ref="department"
														id="department"
														name="department">

														<option value="0">Select</option>
														{contactdepartment}
														<option value="other">Add Other</option>
													</select>
													<label htmlFor="department">Department<span className="required">*</span></label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													{/* <input
                                                        type="number"
                                                        className="form-control"
                                                        id="projectRate"
                                                        name="projectRate"
                                                        ref="projectRate"
                                                        defaultValue="" /> */}
													<MaskedInput
														mask={priceMask}
														className="form-control"
														guide={false}
														id="projectRate"
														name="projectRate"
														ref="projectRate"
														defaultValue=''
													/>
													<label htmlFor="projectRate">Project Rate($)<span className="required">*</span></label>
												</div>
											</div>
										</div>

										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Roles Info</span>
											</div>
										</div>
										<div className="col-md-10">
											<div className="row">
												<div className="col-md-6">
													<div className="form-group form-md-line-input form-md-floating-label">
														<Select
															disabled={this.state.disabled}
															value={this.state.individualRoleValue}
															placeholder="Select Contact"
															name="individual_role"
															id="individual_role"
															options={this.state.individualOptions}
															onChange={this.handleIndividualRoleChange}
															onInputChange={this.onIndividualInputChange} />
													</div>
												</div>
												{/*<div className="col-md-6">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            className="form-control"
                                                            id="individualrole"
                                                            ref="individualrole"
                                                            name="individualrole"
                                                            disabled
                                                            defaultValue={this.state.individualRoleValue.title}
                                                            key={this.state.individualRoleValue.title} />
                                                        <label htmlFor="individualrole">Role</label>
                                                    </div>
                                                </div>*/}
												<div className="col-md-6">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select className="form-control edited" id="roleType" ref="roleType">
															<option value="1">Project Manager</option>
															<option value="2">Lead Tech</option>
														</select>
													</div>
												</div>
											</div>
										</div>
										<div
											className="col-md-2"
											style={{
												marginTop: '30px'
											}}>
											<a onClick={this.addProjectRole}>
												<input type="button" className="btn btn-primary" value="Add Role" />
											</a>
										</div>
										<div className="row">
											<div className="portlet light portlet-fit portlet-datatable bordered">
												<div className="portlet-body">
													<div className="table-container table-responsive">
														<table className="table table-striped table-bordered table-hover" id="sample_3">
															<thead>
																<tr>
																	<th>Contact</th>
																	<th>Role</th>
																	<th>Action</th>
																</tr>
															</thead>
															<tbody>
																{roleData}
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>

										<div className="portlet-title">
											<div className="caption">
												<span className="caption-subject bold uppercase">Status Info</span>
											</div>
										</div>

										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-floating-label">
													<label htmlFor="startDate">Start Date<span className="required">*</span></label>
													<DateRangePicker
														showDropdowns={true}
														singleDatePicker
														onApply={this.handleStartDateEvent}
														locale={this.state.locale}
														minDate={moment()}>
														<div className="input-group date form_datetime">
															<input
																type="text"
																className="selected-date-range-btn"
																size="16"
																name="startDate"
																id="startDate"
																className="form-control"
																defaultValue={this.state.projectStartDate}
																key={this.state.projectStartDate}
																readOnly={true} />

															<span className="input-group-btn">
																<button className="btn default date-set calendar-shadow-none" type="button">
																	<i className="fa fa-calendar"></i>
																</button>
															</span>
														</div>
													</DateRangePicker>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-floating-label">
													<label htmlFor="endDate">End Date<span className="required">*</span></label>
													<DateRangePicker
														showDropdowns={true}
														singleDatePicker
														onApply={this.handleEndDateEvent}
														locale={this.state.locale}
														minDate={moment()}>
														<div className="input-group date form_datetime">
															<input
																type="text"
																className="selected-date-range-btn"
																size="16"
																name="endDate"
																id="endDate"
																className="form-control"
																defaultValue={this.state.projectEndDate}
																key={this.state.projectEndDate}
																readOnly={true} />
															<span className="input-group-btn">
																<button className="btn default date-set calendar-shadow-none" type="button">
																	<i className="fa fa-calendar"></i>
																</button>
															</span>
														</div>
													</DateRangePicker>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select className="form-control edited" id="stage" ref="stage" name="stage">
														<option value="1">Open</option>
														<option value="2">In-Progress</option>
														<option value="3">Closed</option>
													</select>
													<label htmlFor="stage">Stage</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<input
														type="number"
														className="form-control"
														id="percentComplete"
														name="percentComplete"
														ref="percentComplete"
														defaultValue={0}
														placeholder=" "
														min={0} />
													<label htmlFor="percentComplete">Percent Complete</label>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div
					id="select-addType"
					className="modal fade bs-modal-sm"
					tabIndex="-1"
					aria-hidden="true">
					<div className="modal-dialog modal-sm">
						<div className="modal-content">
							<div className="modal-header">
								<div className="actions">
									<h5 className="modal-title">Add {this.state.addType}</h5>
								</div>
							</div>
							<div className="modal-body">
								<input
									type="text"
									className="form-control"
									id="add_value"
									name="add_value"
									ref="add_value"
									defaultValue="" />
							</div>
							<div className="modal-footer">
								<button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
								<button
									type="button"
									data-dismiss="modal"
									className="btn green"
									id="send-invite-button"
									onClick={this.handleAddOtherPopup}>Done</button>
							</div>
						</div>
					</div>
				</div>
			</div >

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return { categoryDrop: state.project.projectDropdowns.categoryInfo, departmentDrop: state.project.projectDropdowns.Department, companyList: state.project.companyList, individualList: state.project.individualList, createcontact: state.createcontact.contactData };
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(projectActions, dispatch),
		contactactions: bindActionCreators(createContactAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectAdd);