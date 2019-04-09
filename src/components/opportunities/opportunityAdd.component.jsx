import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Select from 'react-select';
import jQuery from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CurrencyInput from 'react-currency-input';
import MaskedInput from 'react-text-mask';
import TagsInput from 'react-tagsinput';
import AutoCompleteRenderInput from '../shared/AutoCompleteInput';
import moment from 'moment';
import TextareaAutosize from 'react-autosize-textarea';
import AddContactModal from '../common/newContactModal.component.js';
import * as loader from '../../constants/actionTypes.js';
import * as opportunityAction from '../../actions/opportunityAction';
import * as createContactAction from '../../actions/createContactAction';
import * as settingsActions from '../../actions/settingsActions';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import * as validate from '../common/validator';
import autoBind from 'react-autobind';
// import 'react-tagsinput/react-tagsinput.css';
import '../../../assets/react-tagsinput.css';
// import '../../styles/react-tagsinput.css';
import * as functions from '../common/functions';
import Autosuggest from 'react-autosuggest';
import * as message from '../../constants/messageConstants';
import { valueMask } from '../../constants/customMasks';

class OpportunityAdd extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            DateDisplay: moment().format('MM/DD/YYYY'),
            EstDateDisplay: '',
            EstStartDateDisplay: '',
            addOther: '',
            disabled: false,
            companyValue: '',
            individualValue: '',
            companyPhone: '',
            companyInternet: '',
            companyOptions: [],
            companyNoResult: 'Search for Client',
            salesRepValue: '',
            individualOptions: [],
            salesRepOptions: [],
            salesRepNoResult: 'Search for Sales Rep',
            endUserValue: '',
            endUserOptions: [],
            endUserNoResult: 'Search for End User',
            tags: [],
            noResultContact: "No records found",
            sameCheck: false,
            clientReadOnly: false,
            gotData: false,
            newContactData: '',
            listState: '',
            opportunityValue: '0',
            new_phone: '',
            query: ''
        }
    }

    componentWillMount() {
        let industryData = {
            companyId: localStorage.companyId,
            moduleType: 2,
            statusName: "Active"
        }
        if (localStorage.contactOppId) {

            let contact = {
                contactId: localStorage.contactOppId
            }
            this
                .props
                .contactactions
                .getContact(contact);
        }
        let params = {
            companyId: localStorage.companyId,
            moduleType: 2
        }
        let stageParams = {
            companyId: localStorage.companyId,
            moduleType: 1
        }
        this.props.actions.getIndustryData(industryData);
        this.props.actions.getSuggestionList();
        this.props.settingsActions.getOpportunitySource(params);
        this.props.settingsActions.getEstimateStages(stageParams);
        let data = {
            parent: 'Opportunities',
            childone: '',
            childtwo: ''
        };
        this.props.breadCrumb(data);
        this.handleSalesSearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.actions.getSalesRepData(this.state.query);
            }
        }, 350);

    }
    componentWillReceiveProps(nextProps) {
        let company = [];
        let endUser = [];
        let individual = [];
        let salesReps = [];
        let phoneDetail = '';
        let internetDetail = '';
        let number = '';
        let mail = '';

        if (localStorage.contactOppId && company.length == 0 && individual.length == 0 && !this.state.gotData) {
            if (nextProps.createcontact) {
                if (nextProps.createcontact.userType == "2") {
                    let companyVal = {
                        id: nextProps.createcontact.companyContactId,
                        label: nextProps.createcontact.companyName
                    }
                    let individualVal = {
                        id: nextProps.createcontact._id,
                        label: nextProps.createcontact.firstname + ' ' + nextProps.createcontact.lastname
                    }
                    number = nextProps.createcontact.phoneInfo[0].phone,
                        mail = nextProps.createcontact.internetInfo.length != 0
                            ? nextProps.createcontact.internetInfo[0].internetvalue
                            : ''

                    let str = number;
                    let newStr = str.replace(/_/g, "");
                    number = newStr;

                    this.setState({
                        companyValue: companyVal,
                        individualValue: individualVal,
                        companyPhone: number,
                        companyInternet: mail
                    })

                } else if (nextProps.createcontact.userType == "1") {
                    let companyVal = {
                        id: nextProps.createcontact._id,
                        label: nextProps.createcontact.companyName
                    }
                    this.setState({ companyValue: companyVal })
                }
            }
        }

        if (nextProps.newCreatedContact && this.state.newContactData === 'N') {
            let individual = {
                id: nextProps.newCreatedContact.id,
                label: nextProps.newCreatedContact.label
            }

            let str = nextProps.newCreatedContact.phone;
            let newStr = str.replace(/_/g, "");

            this.setState({
                individualValue: individual,
                companyPhone: newStr,
                companyInternet: nextProps.newCreatedContact.mail,
                newContactData: ''
            })
        }

        if (this.state.listState === 'I') {
            // get individual list
            let individualList = nextProps
                .individualList
                .map(function (ind, index) {
                    let obj = {
                        id: ind._id,
                        label: ind.firstname + ' ' + ind.lastname
                    }
                    individual.push(obj)
                }.bind(this));
        }
        else if (this.state.listState === 'C') {
            // get company Contact list
            let companyList = nextProps
                .companyList
                .map(function (list, index) {
                    let obj = {
                        id: list._id,
                        label: list.companyName
                    }
                    company.push(obj)
                }.bind(this));
        }
        else if (this.state.listState === 'E') {
            // get end users list
            let endUserList = nextProps.endUserList.map(function (list, index) {
                let obj = {
                    id: list._id,
                    label: list.companyName
                }
                endUser.push(obj)
            }.bind(this));
        }
        else if (this.state.listState === 'S') {
            // get sales rep list
            let salesRep = nextProps
                .salesRepList
                .map(function (salesRep, index) {
                    let obj = {
                        id: salesRep._id,
                        label: salesRep.firstname + ' ' + salesRep.lastname
                    }
                    salesReps.push(obj)
                }.bind(this));
        }

        if (nextProps.companyPhoneInternet.length != 0 && !this.state.gotData) {
            phoneDetail = nextProps
                .companyPhoneInternet[0]
                .ContactPhoneInfo
                .map(function (phone) {
                    if (phone.isPrimary) {
                        number = phone.phone;
                    }
                }.bind(this))
            internetDetail = nextProps
                .companyPhoneInternet[0]
                .ContactInternetInfo
                .map(function (internet) {
                    if (internet.isPrimary) {
                        mail = internet.internetvalue;
                    }
                }.bind(this))

            let str = number;
            let newStr = str.replace(/_/g, "");
            number = newStr;

            this.setState({ companyPhone: number, companyInternet: mail })
        }
        this.setState({
            salesRepOptions: salesReps,
            companyOptions: company,
            endUserOptions: endUser,
            individualOptions: individual
        })
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
    }
    componentDidMount() {
        appValid
            .FormValidationMd
            .init();
    }
    componentWillUnmount() {
        localStorage.setItem("contactOppId", '');
    }
    handleTagsChange(tags) {
        let uniqueTag = [];
        tags.forEach(function (item) {
            if (uniqueTag.indexOf(item) < 0) {
                uniqueTag.push(item);
            }
        });
        this.setState({ tags: uniqueTag })
    }
    handleValueChange(e) {
        let value = e.target.value.trim()
        this.setState({ opportunityValue: value ? value.replace('$', '') : '' });
    }
    handleCompanyChange(value) {
        this.setState({
            companyValue: value,
            individualValue: '',
            companyOptions: [],
            individualOptions: [],
            companyPhone: '',
            companyInternet: '',
            noResultContact: 'Search for contact or click plus icon to create one'
        })
    }
    handleEndUserChange(value) {
        if (this.state.sameCheck) {
            this.setState({
                endUserValue: value,
                companyValue: value,
                endUserOptions: [],
                endUserNoResult: 'Search for End User'
            })
        }
        else {
            this.setState({
                endUserValue: value,
                endUserOptions: [],
                endUserNoResult: 'Search for End User'
            })
        }
    }
    handleSalesRepChange(value) {
        this.setState({
            salesRepValue: value,
            salesRepNoResult: 'Search for Sales Rep',
            salesRepOptions: []
        })
    }
    handleIndividualChange(value) {
        this.setState({
            individualValue: value,
            gotData: false,
            individualOptions: [],
            companyPhone: '',
            companyInternet: '',
            noResultContact: 'There are no contacts for this client, click plus icon to create one'
        });

        if (value) {
            let data = {
                contactId: value.id
            }
            this
                .props
                .actions
                .getCompanyPhoneInternet(data)
        }
    }
    onInputChangeIndividual(value) {
        this.setState({
            gotData: true,
            companyOptions: [],
            salesRepOptions: [],
            endUserOptions: [],
            listState: 'I'
        })
        if (value === '' && !this.state.companyValue) {
            this.setState({
                individualOptions: [],
                noResultContact: 'Please select a client first'
            })
        }
        else {
            this.setState({ gotData: true })
            if (this.state.companyValue && this.state.companyValue.id) {
                let data = {
                    firstname: value,
                    companyId: localStorage.companyId,
                    contactId: this.state.companyValue.id
                }
                this.props.actions.getIndividualData(data);
                this.setState({ noResultContact: 'Search for contact or click plus icon to create one' })
            }
            else if (value === "") {
                this.setState({ noResultContact: 'Search for contact or click plus icon to create one' })
            }
            else {
                this.setState({ noResultContact: 'Please select a client first' })
            }
        }
    }
    onInputChangeSalesRep(value) {
        this.setState({
            gotData: true,
            companyOptions: [],
            individualOptions: [],
            endUserOptions: [],
            listState: 'S'
        })
        if (value === '') {
            this.setState({
                salesRepOptions: [],
                salesRepNoResult: 'Search for Sales Rep'
            })
        }
        else {
            this.setState({
                gotData: true,
                salesRepNoResult: 'No results found'
            })
            let data = {
                firstname: value,
                companyId: localStorage.companyId
            }
            this.setState({ query: data });
            this.handleSalesSearchDebounced();
        }
    }
    onInputChange(value) {
        this.setState({
            gotData: true,
            individualOptions: [],
            salesRepOptions: [],
            endUserOptions: [],
            listState: 'C'
        })
        if (value === '') {
            this.setState({
                companyOptions: [],
                companyNoResult: 'Search for Client'
            })
        }
        else {
            this.setState({ gotData: true })
            let data = {
                companyName: value,
                companyId: localStorage.companyId
            }
            this.props.actions.getCompanyList(data)
        }
    }
    onEndUserInputChange(value) {
        this.setState({
            gotData: true,
            companyOptions: [],
            individualOptions: [],
            salesRepOptions: [],
            listState: 'E'
        })
        if (value === '') {
            this.setState({
                endUserNoResult: 'Search for End User',
                endUserOptions: []
            })
        }
        else {
            this.setState({
                gotData: true,
                endUserNoResult: 'No results found'
            })
            let data = {
                companyName: value,
                companyId: localStorage.companyId
            }
            this.props.actions.getEndUserList(data)
        }
    }
    selectOther(type, e) {
        ReactDOM
            .findDOMNode(this.refs.add_value)
            .value = "";
        if (e.target.value == "other") {
            e.target.selectedIndex = "0";
            this.setState({ addOther: type });
            $('#select-other').modal('show');
        }
    }
    handleAddOtherPopup(e) {
        toastr.remove();
        e.preventDefault();
        let name = ReactDOM.findDOMNode(this.refs.add_value).value.trim();
        if (name) {
            let type = this.state.addOther;
            switch (type) {
                case "Department":
                    this.props.actions.addOtherDepartment(name);
                    break;
                case "Industry":
                    this.props.actions.addOtherIndustry(name);
                    break;
                case "Stage":
                    this.props.actions.addOtherSource(name);
                    break;
                default:
                    break;
            }
            $('#select-other').modal('hide');
        } else {
            toastr.error(message.REQUIRED_INDUSTRY);
        }
    }
    handleEstDateEvent(event, picker) {
        toastr.remove();
        let displayDate = picker.startDate.format('MM/DD/YYYY');
        if (this.state.EstStartDateDisplay) {
            let from = moment(this.state.EstStartDateDisplay, 'MM/DD/YYYY'); // format in which you have the date
            let to = moment(displayDate, 'MM/DD/YYYY');     // format in which you have the date\
            let duration = to.diff(from, 'days');
            if (duration >= 1) {
                this.setState({ EstDateDisplay: displayDate });
            }
            else {
                toastr.error(message.CLOSE_DATE_GREATER)
                this.setState({ EstDateDisplay: '' });
            }
        } else {
            this.setState({ EstDateDisplay: displayDate });
        }
    }
    handleEstStartDateEvent(event, picker) {
        toastr.remove();
        let displayDate = picker.startDate.format('MM/DD/YYYY');
        if (this.state.EstDateDisplay) {
            let from = moment(displayDate, 'MM/DD/YYYY'); // format in which you have the date
            let to = moment(this.state.EstDateDisplay, 'MM/DD/YYYY');     // format in which you have the date
            let duration = to.diff(from, 'days');
            if (duration >= 1) {
                this.setState({ EstStartDateDisplay: displayDate });
            }
            else {
                toastr.error(message.START_DATE_SMALLER)
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
                    sameCheck: true,
                    clientReadOnly: true
                })
            }
            else {
                toastr.error(message.REQUIRED_END_USER)
            }
        }
        else {
            this.setState({
                sameCheck: false,
                clientReadOnly: false
            })
        }
    }
    handleNewContactModal() {
        toastr.remove();
        if (this.state.companyValue) {
            this.setState({ new_phone: "" })
            $('#add-contact').modal({ backdrop: 'static', keyboard: false });
        }
        else {
            toastr.error(message.REQUIRED_CLIENT)
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
            }
            if (phoneLen.length >= 11 && phoneLen.includes("x")) {
                let currentPhone = phoneLen.substring(0, phoneLen.indexOf('x'));
                if (currentPhone.length < 10) {
                    toastr.error(message.VALID_PHONE);
                } else {
                    this.setState({
                        newContactData: 'N',
                        noResultContact: 'No records found',
                        gotData: true
                    })
                    this.props.actions.addOtherContact(contactData);
                    $('#add-contact').modal('hide');
                }
            }
            else if (phoneLen.length >= 11) {
                this.setState({
                    newContactData: 'N',
                    noResultContact: 'No records found',
                    gotData: true
                })
                this.props.actions.addOtherContact(contactData);
                $('#add-contact').modal('hide');
            } else {
                toastr.error(message.VALID_PHONE);
            }
        }
    }
    onContactFocus() {
        toastr.remove();
        if (this.state.companyValue.id) {
            console.log(this.state.companyValue.id)
        }
        else {
            toastr.error(message.REQUIRED_CLIENT)
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
                if (res !== '0') {
                    functions.showLoader('create_opportunity');
                    let opportunityDetails = {
                        companyId: localStorage.companyId,
                        contactId: this.state.companyValue
                            ? this.state.companyValue.id
                            : '',
                        title: ReactDOM
                            .findDOMNode(this.refs.opp_title)
                            .value,
                        // opportunityNumber: parseInt(ReactDOM.findDOMNode(this.refs.opp_no).value),
                        estCloseDate: this.state.EstDateDisplay,
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
                        stageId: ReactDOM.findDOMNode(this.refs.stage).value,
                        value: this.state.opportunityValue !== '0' ? parseInt(this.state.opportunityValue) : 0.00,
                        createdBy: localStorage.userName,
                        tags: this.state.tags,
                        source: ReactDOM.findDOMNode(this.refs.source).value,
                        sourceDetails: ReactDOM.findDOMNode(this.refs.sourcedetail).value,
                        endUser: this.state.endUserValue
                            ? this.state.endUserValue.id
                            : '',
                    }

                    this.props.actions.createOpportunity(opportunityDetails);
                } else {
                    toastr.error(message.VALID_OPPORTUNITY_VALUE)
                }
            }
        }
    }
    render() {
        let self = this;
        let industry = this.props.industryList
            .map(function (industry, index) {
                return <option value={industry._id} key={index}>{industry.industryName}</option>;
            }.bind(this));
        let opportunitySources = this.props.sourceList
            .map(function (opportunitySources, index) {
                return <option value={opportunitySources._id} key={index}>{opportunitySources.sourceName}</option>;
            }.bind(this));
        let estimateStagesData = this.props.estimateStages
            .map(function (stage, index) {
                return <option key={index} value={stage._id}>{stage.stageName}</option>;
            }.bind(this));
        function states() {
            return self.props.suggestionlist
        }

        function AutoCompleteRenderInput({ addTag, ...props }) {
            const handleOnChange = (e, { newValue, method }) => {
                if (method === 'enter') {
                    e.preventDefault()
                } else {
                    props.onChange(e)
                }
            }

            const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
            const inputLength = inputValue.length

            let suggestions = states().filter((state) => {
                return state.name.toLowerCase().slice(0, inputLength) === inputValue
            })

            return (
                <Autosuggest
                    ref={props.ref}
                    suggestions={suggestions}
                    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                    getSuggestionValue={(suggestion) => suggestion.name}
                    renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
                    inputProps={{ ...props, onChange: handleOnChange }}
                    onSuggestionSelected={(e, { suggestion }) => {
                        addTag(suggestion.name)
                    }}
                    onSuggestionsClearRequested={() => { }}
                    onSuggestionsFetchRequested={() => { }}
                />

            );
        }

        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#opportunity-add" data-toggle="tab">
                                Opportunity
                                    </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={localStorage.contactOppId ? '/contactopportunities/' + localStorage.contactOppId : "/opportunity"} className="btn red">
                                Cancel
                            </Link>&nbsp;&nbsp;
                            <button type="button" className="btn blue" onClick={this.opportunityHandler}>Save</button>
                        </div>
                    </ul>
                </div>
                <div className="portlet light bordered" id="create_opportunity">
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="opportunity-add">
                                <form role="form" id="createOpportunityOne">
                                    <div className="form-body">
                                        {/* <div className="alert alert-danger display-hide validation_summary">
                                            You have some form errors. Please check below.<button className="close" data-close="alert"></button>
                                        </div> */}
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                                                <div className="form-group form-md-floating-label">
                                                    <label htmlFor="sales_rep">Sales Rep<span className="required">*</span></label>
                                                    <Select
                                                        disabled={this.state.disabled}
                                                        value={this.state.salesRepValue}
                                                        placeholder="Sales Rep"
                                                        noResultsText={this.state.salesRepNoResult}
                                                        name=""
                                                        options={this.state.salesRepOptions}
                                                        onChange={this.handleSalesRepChange}
                                                        onInputChange={this.onInputChangeSalesRep} />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="source" name="source">
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
                                                        name="sourcedetail"
                                                        ref="sourcedetail"></TextareaAutosize>
                                                    <label htmlFor="description">Source Detail</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        ref="opp_title"
                                                        defaultValue=""
                                                        name="opp_title" />
                                                    <label htmlFor="opp_title">Title<span className="required">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <TextareaAutosize
                                                        style={{ resize: 'none' }}
                                                        className="form-control"
                                                        rows={3}
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
                                        </div>
                                        <div className="portlet-title">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">Details</span>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="priority" name="priority">
                                                        <option value="1">Normal</option>
                                                        <option value="2">High</option>
                                                        <option value="3">Low</option>
                                                    </select>
                                                    <label htmlFor="priority">Priority</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="stage" name="stage">
                                                        {estimateStagesData}
                                                    </select>
                                                    <label htmlFor="stage">Stage</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited" ref="probability" name="probability">
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
                                                        selectAllOnFocus={false}
                                                        decimalSeparator="."
                                                        thousandSeparator=","
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
                                                <div className="form-group  form-md-floating-label">
                                                    <label htmlFor="estimated_close_date">Estimated Close Date</label>
                                                    <DateRangePicker
                                                        showDropdowns={true}
                                                        singleDatePicker
                                                        minDate={moment()}
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
                                                                id="estimated_close_date" />
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
                                                        noResultsText={this.state.endUserNoResult}
                                                        searchingText="No results found"
                                                        name=""
                                                        options={this.state.endUserOptions}
                                                        onChange={this.handleEndUserChange}
                                                        onInputChange={this.onEndUserInputChange} />
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <select className="form-control edited"
                                                        ref="industry" name="industry"
                                                        onChange={this.selectOther.bind(this, "Industry")}>
                                                        <option value="0">Select</option>
                                                        {industry}
                                                        <option value="other">Add Other</option>
                                                    </select>
                                                    <label htmlFor="priority">Industry</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <label htmlFor="company">Client<span className="required">*</span></label>
                                                    <label className="pull-right" htmlFor="company">
                                                        <input style={{ margin: "0px" }} onClick={this.handleSameCheck} type="checkbox" id='same' name="same" /><span style={{ paddingLeft: "5px" }}>Same as end user</span></label>
                                                    <Select
                                                        disabled={this.state.clientReadOnly}
                                                        value={this.state.companyValue}
                                                        placeholder="Client"
                                                        noResultsText={this.state.companyNoResult}
                                                        name=""
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
                                                        placeholder="Contact"
                                                        noResultsText={this.state.noResultContact}
                                                        name=""
                                                        options={this.state.individualOptions}
                                                        onChange={this.handleIndividualChange}
                                                        onFocus={this.onContactFocus}
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
                                                    <label htmlFor="internet">Email</label>
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

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        opportunityCreate: state.opportunity.opportunityCreate,
        companyList: state.opportunity.companyList,
        endUserList: state.opportunity.endUserList,
        industryList: state.opportunity.industryList,
        companyPhoneInternet: state.opportunity.companyPhoneInternet,
        salesRepList: state.opportunity.salesRepList,
        individualList: state.opportunity.individualList,
        createcontact: state.createcontact.contactData,
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
        actions: bindActionCreators(opportunityAction, dispatch),
        settingsActions: bindActionCreators(settingsActions, dispatch),
        contactactions: bindActionCreators(createContactAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(OpportunityAdd);