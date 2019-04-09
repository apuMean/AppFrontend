import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Select from 'react-select';
import jQuery from 'jquery';
import moment from 'moment';
import TagsInput from 'react-tagsinput';
import CurrencyInput from 'react-currency-input';
import MaskedInput from 'react-text-mask';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-autosize-textarea';
import AddContactModal from '../common/newContactModal.component.js';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as loader from '../../constants/actionTypes.js';
import * as opportunityAction from '../../actions/opportunityAction';
import * as settingsActions from '../../actions/settingsActions';
import * as layout from '../../scripts/app';
import * as appValid from '../../scripts/app';
import * as validate from '../common/validator';
import '../../styles/bootstrap-fileinput.css';
// import 'react-tagsinput/react-tagsinput.css';
// import '../../styles/react-tagsinput.css';
import '../../../assets/react-tagsinput.css';
import autoBind from 'react-autobind';
import * as functions from '../common/functions';
import Autosuggest from 'react-autosuggest';
import * as message from '../../constants/messageConstants';
import { valueMask } from '../../constants/customMasks';
class OpportunityEdit extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			DateDisplay: '',
			EstDateDisplay: '',
			ActDateDisplay: '',
			ActStartDateDisplay: '',
			EstStartDateDisplay: '',
			addOther: '',
			companyValue: '',
			individualValue: '',
			disabled: false,
			companyOptions: [],
			companyNoResult: 'Search for Client',
			individualOptions: [],
			opportunityDetail: [],
			salesRepOptions: [],
			salesRepNoResult: 'Search for Sales Rep',
			endUserValue: '',
			endUserOptions: [],
			endUserNoResult: 'Search for End User',
			locale: {
				'format': 'MM/DD/YYYY'
			},
			tags: [],
			noResultContact: 'Type to get contacts',
			sameCheck: false,
			clientReadOnly: false,
			gotData: false,
			gotPhoneInternet: false,
			newContactData: '',
			listState: '',
			opportunityValue: '0',
			breadcrumb: true,
			new_phone: '',
			stageId:'',
		};
	}

	componentWillMount() {
		var industryData = {
			companyId: localStorage.companyId,
			moduleType: 2,
			statusName: 'Active'
		};
		let params = {
			companyId: localStorage.companyId,
			moduleType: 2
		};
		let stageParams = {
			companyId: localStorage.companyId,
			moduleType: 1
		};
		this.props.settingsActions.getEstimateStages(stageParams);
		if (this.props.params.opportunityId) {
			var opportunityId = {
				opportunityId: this.props.params.opportunityId
			};
			this.props.actions.getOppDetailValues(opportunityId);
		}
		this.props.actions.getIndustryData(industryData);
		this.props.actions.getSuggestionList();
		this.props.settingsActions.getOpportunitySource(params);
      
	}

	componentDidMount() {
		appValid
			.FormValidationMd
			.init();

		const locale = locale;
		functions.showLoader('update_opportunity');
	}

	componentWillReceiveProps(nextProps) {
		var company = [];
		var endUser = [];
		var individual = [];
		var salesReps = [];
		var phoneDetail = '';
		var internetDetail = '';
		var number = '';
		var mail = '';

		if (this.state.listState === 'I') {
			// get individual list
			var individualList = nextProps
				.individualList
				.map(function (ind, index) {
					var obj = {
						id: ind._id,
						label: ind.firstname + ' ' + ind.lastname
					};
					individual.push(obj);
				}.bind(this));
		}
		else if (this.state.listState === 'C') {
			// get company Contact list
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
		else if (this.state.listState === 'E') {
			// get end users list
			var endUserList = nextProps.endUserList.map(function (list, index) {
				var obj = {
					id: list._id,
					label: list.companyName
				};
				endUser.push(obj);
			}.bind(this));
		}
		else if (this.state.listState === 'S') {
			// get sales rep list
			var salesRep = nextProps
				.salesRepList
				.map(function (salesRep, index) {
					var obj = {
						id: salesRep._id,
						label: salesRep.firstname + ' ' + salesRep.lastname
					};
					salesReps.push(obj);
				}.bind(this));
		}

		// phone and internet according to company
		if (nextProps.companyPhoneInternet.length != 0 && !this.state.gotPhoneInternet) {
			var phoneDetail = nextProps
				.companyPhoneInternet[0]
				.ContactPhoneInfo
				.map(function (phone) {
					if (phone.isPrimary) {
						number = phone.phone;
					}
				}.bind(this));
			var internetDetail = nextProps
				.companyPhoneInternet[0]
				.ContactInternetInfo
				.map(function (internet) {
					if (internet.isPrimary) {
						mail = internet.internetvalue;
					}
				}.bind(this));

			var str = number;
			var newStr = str.replace(/_/g, '');
			number = newStr;

			this.setState({
				companyPhone: number,
				companyInternet: mail,
			});
		}

		// show selected company
		if (company.length == 0 && nextProps.opportunityDetail && !this.state.gotData) {
			var selCompany = {
				id: nextProps.opportunityDetail.companyContactId,
				label: nextProps.opportunityDetail.CompanyName
			};

			this.setState({ companyValue: selCompany });
		}

		// show selected end user
		if (endUser.length == 0 && nextProps.opportunityDetail.endUser && !this.state.gotData) {
			var selEndUser = {
				id: nextProps.opportunityDetail.endUser._id,
				label: nextProps.opportunityDetail.endUser.companyName
			};

			this.setState({ endUserValue: selEndUser });
		}

		// show selected individual
		if (individual.length == 0 && nextProps.opportunityDetail && nextProps.opportunityDetail.individualName != '' && !this.state.gotPhoneInternet && nextProps.opportunityDetail.individualUserId) {
			var selIndividual = {
				id: nextProps.opportunityDetail.individualUserId._id,
				label: nextProps.opportunityDetail.individualUserId.firstname + ' ' + nextProps.opportunityDetail.individualUserId.lastname
			};
			// company.push(selCompany); shows phone and mail
			number = nextProps.opportunityDetail.ContactPhoneInfo.length != 0
				? nextProps.opportunityDetail.ContactPhoneInfo[0].phone
				: '';
			mail = nextProps.opportunityDetail.ContactInternetInfo.length != 0
				? nextProps.opportunityDetail.ContactInternetInfo[0].internetvalue
				: '';

			var str = number;
			var newStr = str.replace(/_/g, '');
			number = newStr;

			this.setState({
				individualValue: selIndividual,
				companyPhone: number,
				companyInternet: mail,
			});
		}

		// show selected salsRep
		if (salesReps.length == 0 && nextProps.opportunityDetail && nextProps.opportunityDetail.SalesRepId != '' && !this.state.gotData) {
			var selSalesRep = {
				id: nextProps.opportunityDetail.SalesRepId._id,
				label: nextProps.opportunityDetail.SalesRepId.firstname + ' ' + nextProps.opportunityDetail.SalesRepId.lastname,
			};
			this.setState({ salesRepValue: selSalesRep });
		}
		// dates
		if (nextProps.opportunityDetail) {
			this.setState({
				DateDisplay: moment(nextProps.opportunityDetail.createdAt).format('MM/DD/YYYY'),
				ActDateDisplay: nextProps.opportunityDetail.actCloseDate ? nextProps.opportunityDetail.actCloseDate : '',
				ActStartDateDisplay: nextProps.opportunityDetail.actStartDate ? nextProps.opportunityDetail.actStartDate : '',
				EstDateDisplay: nextProps.opportunityDetail.estCloseDate ? nextProps.opportunityDetail.estCloseDate : '',
				EstStartDateDisplay: nextProps.opportunityDetail.estStartDate ? nextProps.opportunityDetail.estStartDate : '',
				tags: nextProps.opportunityDetail.tags ? nextProps.opportunityDetail.tags : [],
				opportunityValue: nextProps.opportunityDetail.value,
				gotData: true,
				stageId:nextProps.opportunityDetail.stageId
			});
			$('div#update_opportunity').unblock();
		}
		if (nextProps.newCreatedContact && this.state.newContactData === 'N') {
			let individual = {
				id: nextProps.newCreatedContact.id,
				label: nextProps.newCreatedContact.label
			};

			var str = nextProps.newCreatedContact.phone;
			var newStr = str.replace(/_/g, '');

			this.setState({
				individualValue: individual,
				companyPhone: newStr,
				companyInternet: nextProps.newCreatedContact.mail,
				newContactData: ''
			});
		}
		let oppState = nextProps.opportunityDetail;
		if (this.state.breadcrumb && oppState.title) {
			var data = {
				parent: <Link to='/opportunity'>Opportunities</Link>,
				childone: oppState.title,
				childtwo: ''
			};
			this.props.breadCrumb(data);
			this.state.breadcrumb = false;
		}
		this.setState({
			salesRepOptions: salesReps,
			companyOptions: company,
			endUserOptions: endUser,
			individualOptions: individual,
			opportunityDetail: oppState
		});

		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
		layout
			.FormValidationMd
			.init();
	}

	handleTagsChange(tags) {
		let uniqueTag = [];
		tags.forEach(function (item) {
			if (uniqueTag.indexOf(item) < 0) {
				uniqueTag.push(item);
			}
		});
		this.setState({ tags: uniqueTag });
	}
	handleStageChange(e){
		let val=e.target.value.trim();
		this.setState({stageId:val});
	}

	handleValueChange(e) {
		let value = e.target.value.trim();
		this.setState({ opportunityValue: value ? value.replace('$', '') : '' });
	}

	handleCompanyChange(value) {
		this.setState({
			companyValue: value,
			individualValue: '',
			companyPhone: '',
			companyInternet: '',
			noResultContact: 'Type to get contacts',
			companyOptions: [],
			individualOptions: [],
			salesRepOptions: [],
			endUserOptions: []
		});
	}

	handleSalesRepChange(value) {
		this.setState({
			salesRepValue: value,
			salesRepNoResult: 'Search for Sales Rep',
			companyOptions: [],
			individualOptions: [],
			salesRepOptions: [],
			endUserOptions: [],
			gotPhoneInternet: false
		});
	}

	handleIndividualChange(value) {
		this.setState({
			individualValue: value,
			companyOptions: [],
			individualOptions: [],
			salesRepOptions: [],
			endUserOptions: [],
			noResultContact: 'Type to get contacts',
			gotPhoneInternet: false
		});

		if (value) {
			var data = {
				contactId: value.id
			};
			this
				.props
				.actions
				.getCompanyPhoneInternet(data);
		}
		else {
			this.setState({
				companyPhone: '',
				companyInternet: '',
			});
		}
	}

	handleEndUserChange(value) {
		if (this.state.sameCheck) {
			this.setState({
				endUserValue: value,
				companyValue: value,
				companyOptions: [],
				individualOptions: [],
				salesRepOptions: [],
				endUserOptions: [],
				endUserNoResult: 'Search for End User',
				gotPhoneInternet: false
			});
		}
		else {
			this.setState({
				endUserValue: value,
				companyOptions: [],
				individualOptions: [],
				salesRepOptions: [],
				endUserOptions: [],
				endUserNoResult: 'Search for End User',
				gotPhoneInternet: false
			});
		}
	}

	onInputChangeIndividual(value) {
		this.setState({
			gotData: true,
			gotPhoneInternet: true,
			companyOptions: [],
			// individualOptions: [],
			salesRepOptions: [],
			endUserOptions: [],
			listState: 'I'
		});
		if (value === '') {
			this.setState({
				individualOptions: [],
				noResultContact: 'Type to get contacts'
			});
		}
		else {
			this.setState({ gotData: true });
			if (this.state.companyValue && this.state.companyValue.id) {
				var data = {
					firstname: value,
					companyId: localStorage.companyId,
					contactId: this.state.companyValue.id
				};
				this.props.actions.getIndividualData(data);
				this.setState({ noResultContact: 'Search for contacts or click plus icon to create one' });
			}
			else if (value === '') {
				this.setState({ noResultContact: 'Search for contacts or click plus icon to create one' });
			}
			else {
				this.setState({ noResultContact: 'Please select a client first' });
			}
		}
	}

	onInputChangeSalesRep(value) {
		this.setState({
			gotData: true,
			gotPhoneInternet: true,
			companyOptions: [],
			individualOptions: [],
			// salesRepOptions:[],
			endUserOptions: [],
			listState: 'S'
		});
		if (value === '') {
			this.setState({
				salesRepOptions: [],
				salesRepNoResult: 'Search for Sales Rep'
			});
		}
		else {
			this.setState({
				gotData: true,
				salesRepNoResult: 'No results found'
			});
			var data = {
				firstname: value,
				companyId: localStorage.companyId
			};
			this.props.actions.getSalesRepData(data);
		}
	}

	onInputChange(value) {
		this.setState({
			gotData: true,
			gotPhoneInternet: true,
			// companyOptions: [],
			individualOptions: [],
			salesRepOptions: [],
			endUserOptions: [],
			listState: 'C'
		});
		if (value === '') {
			this.setState({
				companyOptions: [],
				companyNoResult: 'Search for Client'
			});
		}
		else {
			this.setState({ gotData: true });
			var data = {
				companyName: value,
				companyId: localStorage.companyId
			};
			this.props.actions.getCompanyList(data);
		}
	}

	onEndUserInputChange(value) {
		this.setState({
			gotData: true,
			gotPhoneInternet: true,
			companyOptions: [],
			individualOptions: [],
			salesRepOptions: [],
			listState: 'E'
			// endUserOptions:[],
		});
		if (value === '') {
			this.setState({
				endUserNoResult: 'Search for End User',
				endUserOptions: []
			});
		}
		else {
			this.setState({
				gotData: true,
				endUserNoResult: 'No results found'
			});
			var data = {
				companyName: value,
				companyId: localStorage.companyId
			};
			this.props.actions.getEndUserList(data);
		}
	}

	selectOther(type, e) {
		ReactDOM
			.findDOMNode(this.refs.add_value)
			.value = '';
		if (e.target.value == 'other') {
			e.target.selectedIndex = '0';
			this.setState({ addOther: type });
			$('#select-other').modal('show');
		}
	}

	handleAddOtherPopup(e) {
		toastr.remove();
		e.preventDefault();
		var name = ReactDOM
			.findDOMNode(this.refs.add_value)
			.value;
		var type = this.state.addOther;
		if (name.trim()) {
			switch (type) {
			case 'Industry':
				this
					.props
					.actions
					.addOtherIndustry(name);
				break;
			case 'Department':
				this
					.props
					.actions
					.addOtherDepartment(name);
				break;
			case 'Stage':
				this
					.props
					.actions
					.addOtherSource(name);
				break;
			default:
				break;
			}
			$('#select-other').modal('hide');
		} else {
			toastr.error(message.REQUIRED_INDUSTRY);
		}

	}

	handleDateEvent(event, picker) {

		var displayDate = picker
			.startDate
			.format('MM/DD/YYYY');
		this.setState({ DateDisplay: displayDate });
	}
	handleEstDateEvent(event, picker) {
		toastr.remove();
		var displayDate = picker.startDate.format('MM/DD/YYYY');
		if (this.state.EstStartDateDisplay) {
			let from = moment(this.state.EstStartDateDisplay, 'MM/DD/YYYY'); // format in which you have the date
			let to = moment(displayDate, 'MM/DD/YYYY');     // format in which you have the date\
			let duration = to.diff(from, 'days');
			if (duration >= 1) {
				this.setState({ EstDateDisplay: displayDate });
			}
			else {
				toastr.error(message.CLOSE_DATE_GREATER);
				this.setState({ EstDateDisplay: '' });
			}
		} else {
			this.setState({ EstDateDisplay: displayDate });
		}
	}
	handleActDateEvent(event, picker) {
		var displayDate = picker
			.startDate
			.format('MM/DD/YYYY');
		this.setState({ ActDateDisplay: displayDate });
	}
	handleActStartDateEvent(event, picker) {
		var displayDate = picker
			.startDate
			.format('MM/DD/YYYY');
		this.setState({ ActStartDateDisplay: displayDate });
	}
	handleEstStartDateEvent(event, picker) {
		toastr.remove();
		var displayDate = picker.startDate.format('MM/DD/YYYY');
		if (this.state.EstDateDisplay) {
			let from = moment(displayDate, 'MM/DD/YYYY'); // format in which you have the date
			let to = moment(this.state.EstDateDisplay, 'MM/DD/YYYY');     // format in which you have the date
			let duration = to.diff(from, 'days');
			if (duration >= 1) {
				this.setState({ EstStartDateDisplay: displayDate });
			}
			else {
				toastr.error(message.START_DATE_SMALLER);
				this.setState({ EstStartDateDisplay: '' });
			}
		}
		else {
			this.setState({ EstStartDateDisplay: displayDate });
		}
	}
	handleSameCheck(e) {
		toastr.remove();
		if (e.target.checked) {
			if (this.state.endUserValue) {
				this.setState({
					companyValue: this.state.endUserValue,
					individualValue: '',
					individualOptions: [],
					companyPhone: '',
					companyInternet: '',
					sameCheck: true,
					clientReadOnly: true
				});
			}
			else {
				toastr.error(message.REQUIRED_END_USER);
			}
		}
		else {
			this.setState({
				sameCheck: false,
				clientReadOnly: false
			});
		}
	}
	handleNewContactModal() {
		// ReactDOM.findDOMNode(this.refs.new_company).value = '';
		toastr.remove();
		if (this.state.companyValue) {
			this.setState({ new_phone: '' });
			$('#add-contact').modal({ backdrop: 'static', keyboard: false });
		}
		else {
			toastr.error(message.REQUIRED_CLIENT);
		}
	}
	handleContactAdd() {
		toastr.remove();
		if (jQuery('#add_other_contact').valid()) {
			let phoneVal = ReactDOM.findDOMNode(this.refs.contactChild.refs.new_phone).value;
			let phoneLen = phoneVal ? validate.removeSpecialCharSpace(phoneVal) : '';
			let phone = [];
			let mail = [];
			let phoneData = {
				phonetype: 'Work',
				phone: ReactDOM.findDOMNode(this.refs.contactChild.refs.new_phone).value.trim(),
				isPrimary: true
			};
			phone.push(phoneData);
			let emailData = {
				internetType: 'Work',
				internetvalue: ReactDOM.findDOMNode(this.refs.contactChild.refs.new_email).value.trim(),
				isPrimary: true
			};
			mail.push(emailData);
			let contactData = {
				userId: localStorage.userId,
				companyId: localStorage.companyId,
				phone: phone,
				internet: mail,
				companyName: this.state.companyValue.label,
				companyContactId: this.state.companyValue.id,
				firstname: ReactDOM.findDOMNode(this.refs.contactChild.refs.first_name).value.trim(),
				lastname: ReactDOM.findDOMNode(this.refs.contactChild.refs.last_name).value.trim(),
				statusId: localStorage.statusNameId,
				userType: 2,
				createdBy: localStorage.userName
			};
			if (phoneLen.length >= 11 && phoneLen.includes('x')) {
				let currentPhone = phoneLen.substring(0, phoneLen.indexOf('x'));
				if (currentPhone.length < 10) {
					toastr.error(message.VALID_PHONE);
				} else {
					this.setState({
						newContactData: 'N',
						noResultContact: 'No records found',
						gotData: true
					});
					this.props.actions.addOtherContact(contactData);
					$('#add-contact').modal('hide');
				}
			}
			else if (phoneLen.length >= 11) {
				this.setState({
					newContactData: 'N',
					noResultContact: 'No records found',
					gotData: true
				});
				this.props.actions.addOtherContact(contactData);
				$('#add-contact').modal('hide');
			} else {
				toastr.error(message.VALID_PHONE);
			}
		}
	}
	handleContactPhoneChange(e) {
		this.setState({ new_phone: e.target.value });
	}
	opportunityHandler() {
		toastr.remove();
		let res = this.state.opportunityValue;
		let val = (parseFloat(this.state.opportunityValue).toFixed(2));
		let valLen = (val.toString()).length;
		if (jQuery('#createOpportunityOne').valid()) {
			if (valLen && valLen > 10) {
				toastr.error(message.VALUE_LIMIT);
			} else {
				if (res != '0') {
					functions.showLoader('update_opportunity');
					var oppDetails = {
						opportunityId: this.props.params.opportunityId,
						userId: localStorage.userId,
						companyId: localStorage.companyId,
						contactId: this.state.companyValue
							? this.state.companyValue.id
							: '',
						endUser: this.state.endUserValue
							? this.state.endUserValue.id
							: '',
						title: ReactDOM
							.findDOMNode(this.refs.opp_title)
							.value,
						estCloseDate: this.state.EstDateDisplay,
						actCloseDate: this.state.ActDateDisplay,
						actStartDate: this.state.ActStartDateDisplay,
						estStartDate: this.state.EstStartDateDisplay,
						individualId: this.state.individualValue
							? this.state.individualValue.id
							: '',
						industryId: ReactDOM.findDOMNode(this.refs.industry).value,
						salesRep: this.state.salesRepValue
							? this.state.salesRepValue.id
							: '',
						priorityId: parseInt(ReactDOM.findDOMNode(this.refs.priority).value),
						probabilityId: parseInt(ReactDOM.findDOMNode(this.refs.probability).value),
						description: ReactDOM
							.findDOMNode(this.refs.description)
							.value,
						stageId: this.state.stageId,
						value: this.state.opportunityValue !== '0' ? parseInt(this.state.opportunityValue) : 0.00,
						modifiedBy: localStorage.userName,
						source: ReactDOM.findDOMNode(this.refs.source).value,
						sourceDetails: ReactDOM.findDOMNode(this.refs.sourcedetail).value,
						endUser: this.state.endUserValue
							? this.state.endUserValue.id
							: '',
						tags: this.state.tags
					};
					this.props.actions.updateOpportunity(oppDetails, this.props.params.opportunityId);
				} else {
					toastr.error(message.VALID_VALUE);
				}
			}
		}
	}
	render() {
		let self = this;
		var oppData = this.state.opportunityDetail;
  
		var individual = [];
		let departmentId = '';
		let industryId = '';
		let salesRepId = '';

		var industry = this.props.industryList
			.map(function (industry, index) {
				industryId = oppData.industryId ? oppData.industryId._id : '';
				return <option value={industry._id} key={index}>{industry.industryName}</option>;
			}.bind(this));

		function states() {
			return self.props.suggestionlist;
		}

		let opportunitySources = this.props.sourceList
			.map(function (opportunitySources, index) {
				return <option value={opportunitySources._id} key={index}>{opportunitySources.sourceName}</option>;
			}.bind(this));
		let estimateStagesData = this.props.estimateStages
			.map(function (stage, index) {
				return <option key={stage._id} value={stage._id}>{stage.stageName}</option>;
			}.bind(this));

		function AutoCompleteRenderInput({ addTag, ...props }) {
			const handleOnChange = (e, { newValue, method }) => {
				if (method === 'enter') {
					e.preventDefault();
				} else {
					props.onChange(e);
				}
			};

			const inputValue = (props.value && props.value.trim().toLowerCase()) || '';
			const inputLength = inputValue.length;

			let suggestions = states().filter((state) => {
				return state.name.toLowerCase().slice(0, inputLength) === inputValue;
			});

			return (
				<Autosuggest
					ref={props.ref}
					suggestions={suggestions}
					shouldRenderSuggestions={(value) => value && value.trim().length > 0}
					getSuggestionValue={(suggestion) => suggestion.name}
					renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
					inputProps={{ ...props, onChange: handleOnChange }}
					onSuggestionSelected={(e, { suggestion }) => {
						addTag(suggestion.name);
					}}
					onSuggestionsClearRequested={() => { }}
					onSuggestionsFetchRequested={() => { }}
				/>

			);
		}


		return (
			<div>
				<div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#opportunity-add" data-toggle="tab">
                                    Opportunity
								</a>
							</li>
							<div className="text-right">
								<Link to={'/opportunity/' + this.props.params.opportunityId} className="btn red">
                                    Cancel </Link>&nbsp;&nbsp;
								<button type="button" className="btn blue" onClick={this.opportunityHandler}>Save</button>
							</div>
						</ul>
					</div>
					<div className="portlet light bordered" id="update_opportunity">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="opportunity-add">
									<form role="form" id="createOpportunityOne">
										<div className="form-body">
											<div className="row">
												<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
													<div className="form-group form-md-floating-label">
														<label htmlFor="sales_rep">Sales Rep<span className="required">*</span></label>
														<Select
															disabled={this.state.disabled}
															value={this.state.salesRepValue}
															placeholder="Sales rep"
															name=""
															noResultsText={this.state.salesRepNoResult}
															options={this.state.salesRepOptions}
															onChange={this.handleSalesRepChange}
															onInputChange={this.onInputChangeSalesRep} />
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select className="form-control edited" ref="source" name="source" defaultValue={oppData.source ? oppData.source._id ? oppData.source._id : '1' : '1'}
															key={oppData.source ? oppData.source._id ? oppData.source._id : '1' : '1'}>
															{/* <option value="1">Referral</option>
                                                            <option value="2">RFP</option> */}
															{opportunitySources}
														</select>
														<label htmlFor="source">Source</label>
													</div>
												</div>
												<div className="col-lg-6 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															defaultValue={oppData.sourceDetails}
															key={oppData.sourceDetails}
															name="sourcedetail"
															ref="sourcedetail"></TextareaAutosize>
														<label htmlFor="description">Source Detail</label>
													</div>
												</div>
												<div className="col-lg-10 col-md-8 col-sm-9 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<input
															type="text"
															className="form-control"
															ref="opp_title"
															defaultValue={oppData.title}
															key={oppData.title}
															name="opp_title" />
														<label htmlFor="opp_title">Title<span className="required">*</span>
														</label>
													</div>
												</div>
												<div className="col-lg-2 col-md-4 col-sm-3 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<input
															type="text"
															className="form-control"
															ref="opp_no"
															disabled={true}
															defaultValue={oppData.opportunityNumber}
															key={oppData.opportunityNumber}
															name="opp_no" />
														<label htmlFor="opp_no">Opportunity #</label>
													</div>
												</div>
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={3}
															defaultValue={oppData.description}
															key={oppData.description}
															name="description"
															ref="description"></TextareaAutosize>
														<label htmlFor="description">Description<span className="required">*</span>
														</label>
													</div>
												</div>
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TagsInput className="custom-tag" renderInput={AutoCompleteRenderInput} value={this.state.tags} onChange={this.handleTagsChange} />
													</div>
												</div>
												{/* <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TagsInput renderInput={AutoCompleteRenderInput} value={this.state.tags} onChange={this.handleTagsChange} />
                                                </div>
                                            </div> */}
											</div>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Details</span>
												</div>
											</div>
											<div className="row">
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select
															className="form-control edited"
															defaultValue={oppData.priorityId}
															key={oppData.priorityId}
															ref="priority"
															name="priority">
															<option value="1">Normal</option>
															<option value="2">High</option>
															<option value="3">Low</option>
														</select>
														<label htmlFor="priority">Priority</label>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select
															className="form-control edited"
															value={this.state.stageId}
															key={this.state.stageId}
															onChange={this.handleStageChange}
															ref="stage"
															name="stage">
															{estimateStagesData}
														</select>
														<label htmlFor="stage">Stage</label>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select
															className="form-control edited"
															defaultValue={oppData.probabilityId}
															key={oppData.probabilityId}
															ref="probability"
															name="probability">
															<option value="0">0 %</option>
															<option value="1">10 %</option>
															<option value="2">20 %</option>
															<option value="3">30 %</option>
															<option value="4">40 %</option>
															<option value="5">50 %</option>
															<option value="6">60 %</option>
															<option value="7">70 %</option>
															<option value="8">80 %</option>
															<option value="9">90 %</option>
															<option value="10">100 %</option>
														</select>
														<label htmlFor="probability">Probability</label>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														{/* <CurrencyInput
                                                            className="form-control"
                                                            prefix="$"
                                                            value={this.state.opportunityValue}
                                                            onChangeEvent={this.handleValueChange}
                                                        /> */}
														<MaskedInput
															mask={valueMask}
															className="form-control"
															guide={false}
															name="value"
															id="value"
															ref="value"
															htmlFor="value"
															value={this.state.opportunityValue}
															onChange={this.handleValueChange}
														/>
														<label htmlFor="value">Value<span className="required">*</span>
														</label>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group  form-md-floating-label">
														<label htmlFor="estimated_close_date">Estimated Start Date</label>
														<DateRangePicker
															showDropdowns={true}
															singleDatePicker
															minDate={moment()}
															onApply={this.handleEstStartDateEvent}>
															<div className="input-group date form_datetime">
																<input
																	type="text"
																	className="selected-date-range-btn"
																	size="16"
																	readOnly={true}
																	className="form-control"
																	defaultValue={this.state.EstStartDateDisplay}
																	key={this.state.EstStartDateDisplay}
																	id="estimated_start_date" />
																<span className="input-group-btn">
																	<button className="btn default date-set calendar-shadow-none" type="button">
																		<i className="fa fa-calendar"></i>
																	</button>
																</span>
															</div>
														</DateRangePicker>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-floating-label">
														<label htmlFor="estimated_close_date">Estimated Close Date</label>
														<DateRangePicker
															showDropdowns={true}
															singleDatePicker
															minDate={moment()}
															startDate={this.state.EstDateDisplay ? this.state.EstDateDisplay : moment()}
															locale={this.state.locale}
															onApply={this.handleEstDateEvent}>
															<div className="input-group date form_datetime">
																<input
																	type="text"
																	className="selected-date-range-btn"
																	size="16"
																	readOnly={true}
																	className="form-control"
																	defaultValue={this.state.EstDateDisplay}
																	key={this.state.EstDateDisplay}
																	id="estimated_close_date"
																	name="" />
																<span className="input-group-btn">
																	<button className="btn default date-set calendar-shadow-none" type="button">
																		<i className="fa fa-calendar"></i>
																	</button>
																</span>
															</div>
														</DateRangePicker>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-floating-label">
														<label htmlFor="actual_close_date">Actual Start Date</label>
														<DateRangePicker
															showDropdowns={true}
															singleDatePicker
															minDate={moment()}
															locale={this.state.locale}
															startDate={this.state.ActStartDateDisplay ? this.state.ActStartDateDisplay : moment()}
															onApply={this.handleActStartDateEvent}>
															<div className="input-group date form_datetime">
																<input
																	type="text"
																	className="selected-date-range-btn"
																	size="16"
																	readOnly={true}
																	className="form-control"
																	defaultValue={this.state.ActStartDateDisplay}
																	key={this.state.ActStartDateDisplay} />
																<span className="input-group-btn">
																	<button className="btn default date-set calendar-shadow-none" type="button">
																		<i className="fa fa-calendar"></i>
																	</button>
																</span>
															</div>
														</DateRangePicker>
													</div>
												</div>
												<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
													<div className="form-group form-md-floating-label">
														<label htmlFor="actual_close_date">Actual Close Date</label>
														<DateRangePicker
															showDropdowns={true}
															singleDatePicker
															minDate={moment()}
															locale={this.state.locale}
															startDate={this.state.ActDateDisplay ? this.state.ActDateDisplay : moment()}
															onApply={this.handleActDateEvent}>
															<div className="input-group date form_datetime">
																<input
																	type="text"
																	className="selected-date-range-btn"
																	size="16"
																	readOnly={true}
																	className="form-control"
																	defaultValue={this.state.ActDateDisplay}
																	key={this.state.ActDateDisplay} />
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
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Customer</span>
												</div>
											</div>
											<div className="row">
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-floating-label">
														<label htmlFor="company">End User</label>
														<Select
															disabled={this.state.disabled}
															value={this.state.endUserValue}
															placeholder="End user"
															name=""
															noResultsText={this.state.endUserNoResult}
															options={this.state.endUserOptions}
															onChange={this.handleEndUserChange}
															onInputChange={this.onEndUserInputChange} />
													</div>
												</div>
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div
														className="form-group form-md-line-input form-md-floating-label"
														id="opp_industry">
														<select
															className="form-control edited"
															onChange={this
																.selectOther
																.bind(this, 'Industry')}
															ref="industry"
															defaultValue={industryId}
															key={industryId}
															name="industry">
															<option value="0">Select</option>
															{industry}
															<option value="other">Add Other</option>
														</select>
														<label htmlFor="industry">Industry
														</label>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="company">Client<span className="required">*</span></label>
														<label className="pull-right" htmlFor="company">
															<input style={{ margin: '0px' }} onClick={this.handleSameCheck} type="checkbox" id='same' name="same" />Same as end user</label>
														<Select
															disabled={this.state.clientReadOnly}
															value={this.state.companyValue}
															placeholder="Client"
															name=""
															noResultsText={this.state.companyNoResult}
															options={this.state.companyOptions}
															onChange={this.handleCompanyChange}
															onInputChange={this.onInputChange} />
													</div>
												</div>
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="individual">Contact</label>
														<span className="pull-right">
															<i className="fa fa-plus-circle fa-2x"
																aria-hidden="true" onClick={this.handleNewContactModal}></i></span>
														<Select
															disabled={this.state.disabled}
															value={this.state.individualValue}
															placeholder="contact"
															name=""
															noResultsText={this.state.noResultContact}
															options={this.state.individualOptions}
															onChange={this.handleIndividualChange}
															onInputChange={this.onInputChangeIndividual} />
													</div>
												</div>
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<input
															type="text"
															className="form-control"
															id="phone"
															disabled={true}
															value={this.state.companyPhone}
															name="phone" />
														<label htmlFor="phone">Phone</label>
													</div>
												</div>
												<div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<input
															type="text"
															className="form-control"
															id="internet"
															disabled={true}
															value={this.state.companyInternet}
															name="internet" />
														<label htmlFor="internet">Internet</label>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
								<div
									id="select-other"
									className="modal fade bs-modal-sm"
									tabIndex="-1"
									aria-hidden="true">
									<div className="modal-dialog modal-sm">
										<div className="modal-content">
											<div className="modal-header">
												<div className="actions">
													<h5 className="modal-title">Add {this.state.addOther}</h5>
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
													className="btn green"
													id="send-invite-button"
													onClick={this.handleAddOtherPopup}>Done</button>
											</div>
										</div>
									</div>
								</div>
								<AddContactModal
									addContactModalId="add-contact"
									companyValue={this.state.companyValue}
									contactAddhandler={this.handleContactAdd}
									ref='contactChild'
									phoneValue={this.state.new_phone}
									handleContactPhoneChange={this.handleContactPhoneChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

		);

	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		opportunityDetail: state.opportunity.oppDetailData,
		industryList: state.opportunity.industryList,
		companyList: state.opportunity.companyList,
		endUserList: state.opportunity.endUserList,
		companyPhoneInternet: state.opportunity.companyPhoneInternet,
		salesRepList: state.opportunity.salesRepList,
		individualList: state.opportunity.individualList,
		newCreatedContact: state.opportunity.createdContact,
		suggestionlist: state.opportunity.suggestionlist,
		sourceList: state.opportunity.sourceList,
		estimateStages: state.opportunity.estimateStages
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		settingsActions: bindActionCreators(settingsActions, dispatch),
		actions: bindActionCreators(opportunityAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(OpportunityEdit);