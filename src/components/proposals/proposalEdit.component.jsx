import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import * as loader from '../../constants/actionTypes.js';
import * as appValid from '../../scripts/app';
import * as proposalActions from '../../actions/proposalActions';
import * as estimateActions from '../../actions/estimateActions';
import jQuery from 'jquery';
import * as functions from '../common/functions';
import '../../styles/bootstrap-fileinput.css';
import autoBind from 'react-autobind';
import TextareaAutosize from 'react-autosize-textarea';
import AddContactModal from '../common/newContactModal.component';
// import AddContactModal from '../common/newProposalContactModal.component';
import AddCompanyModal from '../common/newCompanyModal.component';
import * as message from '../../constants/messageConstants';
import * as validate from '../common/validator';
import AddHeader from '../common/headerAddModal';
import DeleteModal from '../common/deleteModal.component';
import AddEstimate from '../common/addEstimateModal';
import ViewEstimate from '../common/viewEstimateModal';
import { browserHistory } from 'react-router';
import * as layout from '../../scripts/app';


class ProposalEdit extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			disabled: false,
			customerValue: '',
			individualValue: '',
			salesRepValue:'',
			customerOptions: [],
			estimateOptions: [],
			individualOptions: [],
			templateOptions: [],
			individualData: '',
			proposalDetails: '',
			individualFlag: true,
			estimateData:[],
			contactAddType: '',
			parentCompany: '',
			new_phone: '',
			query: '',
			newContactData: '',
			modalName: '',
			itemDeleteIndex: '',
			proposalNumber:'',
			salesRepOptions: [],
			breadcrumb:true,
			abc:true,
			selectedEstimateDetail:''
		};
	}

	componentWillMount() {
		var proposalId = {
			proposalId: this.props.params.proposalId
		};
		this
			.props
			.actions
			.getProposalDetails(proposalId);

		var code = {
			code: localStorage.tempCode
		};
		var subject = {
			subject: 'Proposal'
		};
		// this.props.actions.getEmailTemplate(code);
		// this.props.actions.getEmailTemplateList(subject);

		var data = {
			parent: 'Proposals',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data);
		this.handleSalesSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getSalesRepData(this.state.query);
			}
		}, 350);
		this.handleItemSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				// this.props.actions.getEstimates(this.state.query);
				this.props.actions.getEstimates(this.state.query);
			}
		}, 350);
	}


	componentDidMount() {
		functions.showLoader('create_proposal');
	}

	componentWillUpdate(nextProps, nextState) {
		let self = this;
		let sortId = 'sortable';
		let droppedIndex = 0;
		if (self.state.itemTab == 'active') {
			sortId = 'sortable';
		} else if (self.state.materialTab == 'active') {
			sortId = 'sortable1';
		} else if (self.state.laborTab == 'active') {
			sortId = 'sortable2';
		}
		$('#' + sortId).sortable({
			handle: '.handle',
			update: function (event, ui) {
				let reorderArray = [];
				let idsInOrder = $('#' + sortId).sortable('toArray', { attribute: 'data-id' });
				idsInOrder.map(function (i) {
					reorderArray.push(nextState.estimateData[i]);
				});
				reorderArray.forEach(function (val, index) {
					breakme: if (index > droppedIndex) {
						if (!val.headerName) {
							val.header = reorderArray[droppedIndex].headerName;
						}
						else if (val.headerName) {
							droppedIndex = 0;
							break breakme;
						}
					}
				});
				self.setState({ estimateData: reorderArray });
				$('#' + sortId).sortable('cancel');
			},
			change: function (event, ui) {
				let currentIndex = ui.placeholder.index();
				if (currentIndex > -1) {
					droppedIndex = currentIndex;
				}
			}
		});
	}
	async componentWillReceiveProps(nextProps,props) {
        
		var customer = [];
		var individual = [];
		var estimate = [];
		var address = '';
		var individualData = '';
		var salesReps=[];
		var proposalstate=[];
		if(nextProps.selectedEstimate.length!=0){		
			this.setState({selectedEstimateDetail:nextProps.selectedEstimate});			
		}
		if (nextProps.newEstimate) {
			let data = {
				estimateId: nextProps.newEstimate.estimateId,
				companyId: localStorage.companyId
			};
			this.props.actions.getEstimateById(data);
		}
		if (nextProps.salesRepList.length != 0) {
			let salesRep = nextProps
				.salesRepList
				.map(function (salesRep, index) {
                    
					let obj = {
						id: salesRep._id,
						label: salesRep.firstname + ' ' + salesRep.lastname
					};
					salesReps.push(obj);
				}.bind(this));
		}
		this.setState({ salesRepOptions: salesReps });
        


		if (nextProps.customerList.length != 0 || nextProps.individualList.length != 0 ||  nextProps.estimateDataList.length !=0) {
            
			if (nextProps.customerList.length != 0) {
				var customerList = nextProps
					.customerList
					.map(function (list, index) {
						var obj = {
							id: list._id,
							label: list.companyName
						};
						customer.push(obj);
					}.bind(this));
			}

			if (nextProps.individualList.length != 0 && this.state.individualFlag) {
				var individualList = nextProps
					.individualList
					.map(function (list, index) {
						var obj = {
							id: list._id,
							label: list.firstname + ' ' + list.lastname,
							firstname: list.firstname,
							lastname: list.lastname,
						};
						individual.push(obj);
						individualData = obj;
					}.bind(this));
				this.setState({ individualData: individualData });
			}

			if (nextProps.estimateDataList.length !== 0) {
				let estimateDataList = this.state.query ? nextProps.estimateDataList : [];
				this.setState({
					estimateOptions: estimateDataList
				});
			} else {
				this.setState({
					estimateOptions: []
				});
			}
       
			this.setState({
				customerOptions: customer,
				individualOptions: individual              
			});
		}
		else {
			if (await nextProps.proposalDetail.length!=0) {
				proposalstate = JSON.parse(JSON.stringify(nextProps.proposalDetail.proposaldetail));
				var addressstate = JSON.parse(JSON.stringify(nextProps.proposalDetail.addressdata));
				// this._updateStateFromProps(nextProps.proposalDetail.proposaldetail);
				var cvalue = {
					id: proposalstate.customerId ? proposalstate.customerId._id : '',
					label: proposalstate.customerId.companyName
				};
				var ivalue = {
					id: proposalstate.individualId ? proposalstate.individualId._id : '',
					label: proposalstate.individualId.firstname + ' ' + proposalstate.individualId.lastname,
					firstname: proposalstate.individualId.firstname,
					lastname: proposalstate.individualId.lastname,
				};
				var evalue = {
					id: proposalstate.estimateId ? proposalstate.estimateId._id : '',
					label: proposalstate.estimateId ? proposalstate.estimateId.estimateNumber : '',
					opportunityId: proposalstate.opportunityId ? proposalstate.opportunityId._id : '',
					title: proposalstate.opportunityId ? proposalstate.opportunityId.title : '',
				};
				let svalue={
					id: proposalstate.salesRep ? proposalstate.salesRep._id : '',
					label: proposalstate.salesRep ?proposalstate.salesRep.firstname + ' ' + proposalstate.salesRep.lastname:''
				};
				var individualVal = ivalue;
				var addressObj = '';
				addressstate ? addressObj = {
					mapAddress: addressstate.mapAddress1 + ',' + addressstate.mapAddress2,
					city: addressstate.city,
					state: addressstate.state,
					zip: addressstate.zip,
				} : '';


				this.setState({
					proposalDetails: proposalstate,
					customerValue: proposalstate.customerId ? cvalue : '',
					individualValue: proposalstate.individualId ? ivalue : '',
					salesRepValue:proposalstate.salesRep?svalue:'',
					estimateData:proposalstate.proposedEstimates?proposalstate.proposedEstimates:null,
					individualData: proposalstate.individualId ? individualVal : '',
				});
                
			}
			//this has latest estimte list

			if (await nextProps.createProposalData != undefined && this.state.abc) {
				let proposalstate = JSON.parse(JSON.stringify(nextProps.createProposalData));
				this.setState({
					estimateData: JSON.parse(JSON.stringify(proposalstate.estimates)),
					abc:false
				});
			}

			if (nextProps.companyCreated && this.state.newContactData === 'C') {
				let customer = {
					value: nextProps.companyCreated.id,
					label: nextProps.companyCreated.label
				};
				this.setState({
					customerValue: customer,
					newContactData: ''
				});
			}
			if (nextProps.newSalesCreated && this.state.newContactData === 'S') {
				let salesrep = {
					value: nextProps.newSalesCreated.id,
					label: nextProps.newSalesCreated.label
				};
				this.setState({
					salesRepValue: salesrep,
					newContactData: ''
				});
			}
			if (this.state.breadcrumb && proposalstate.proposalNumber) {
				var data = {
					parent: <Link to='/proposal'>Proposals</Link>,
					childone: ('#' + proposalstate.proposalNumber) + ' (' + (proposalstate.customerId.companyName ? proposalstate.customerId.companyName : proposalstate.customerId.companyName) + ')',
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}
			if(await nextProps.newEstimateDetail.length!==0  && nextProps.newEstimateDetail!==this.props.newEstimateDetail){
				let newEstimate = nextProps.newEstimateDetail ? JSON.parse(JSON.stringify(nextProps.newEstimateDetail)) : [];
				let estimateId = newEstimate._id;
				let estimateNumber =newEstimate.estimateNumber;
				let estimateName = newEstimate.estimateName;
				let status = newEstimate.status ? newEstimate.status : '';
	
				let estimateTotalCount = parseFloat(newEstimate.estimateTotal[0].totalEstimate);
				let estimateTaxCount = parseFloat(newEstimate.estimateTotal[0].taxTotal);
				let total = estimateTotalCount - estimateTaxCount;
	
				let itemData = {
					estimateId: estimateId,
					estimateNumber: estimateNumber,
					estimateName: estimateName,
					status: status,
					total: total
				};
	
				let currentItemState = this.state.estimateData;
				currentItemState.push(itemData);
				this.setState({
					estimateData: currentItemState,
					estimateOptions: []
				});
			}
		}
		
	
		$('div#create_proposal').unblock();
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
        
	}
	handleCustomerChange(value) {
		this.setState({
			customerValue: value,
			individualValue: '',
			individualData: '',
			customerOptions: [],
			individualOptions: [],
			individualFlag: false
		});
		if(value){
			let data = {
				contactId: value.id
			};
              
			this
				.props
				.actions
				.getCompanyAddress(data);
		}
	}

	handleIndividualChange(value) {
		this.setState({ individualValue: value });
	}
	handleSalesRepChange(value) {
		this.setState({
			salesRepValue: value,
			salesRepNoResult: 'Search for Sales Rep',
			salesRepOptions: []
		});
	}
	handleParentCompanyChange(value) {
		this.setState({ parentCompany: value });
	}
	handleSelectsBlur() {
		this.props.actions.clearSelects();
	}
	handleDelete(index) {
		this.setState({ itemDeleteIndex: index });
		$('#estimate_delete').modal('show');
	}

	deleteEstimate() {
		if (this.state.itemDeleteIndex !== '') {
			$('#estimate_delete').modal('hide');
			let currentState = this.state.estimateData;
			breakme: for (let i = 0; i < currentState.length; i++) {
				if (i > this.state.itemDeleteIndex) {
					if (!currentState[i].headerName) {
						currentState[i].header = '';
					}
					else if (currentState[i].headerName) {
						break breakme;
					}
				}
			}
			currentState.splice(this.state.itemDeleteIndex, 1);
			this.setState({
				estimateData: currentState,
				itemDeleteIndex: ''
			});
		}
	}
	onCustomerInputChange(value) {
		var data = {
			companyName: value,
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getCompanyList(data);
	}

	onIndividualInputChange(value) {
		this.setState({ individualFlag: true });
		var data = {
			firstname: value,
			companyId: localStorage.companyId
		};
		this
			.props
			.actions
			.getIndividualList(data);
	}
	onInputChangeSalesRep(value) {
		this.setState({
			gotData: true,
			companyOptions: [],
			individualOptions: [],
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
			let data = {
				firstname: value,
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleSalesSearchDebounced();
		}
	}
	handleNewIndividualModal(dataType) {
		toastr.remove();
		if (this.state.customerValue) {
			this.setState({ contactAddType: dataType, new_phone: '' });
			$('#add-contact').modal({ backdrop: 'static', keyboard: false });
		}
		else {
			toastr.error(message.REQUIRED_CUSTOMER);
		}
	}
	handleNewCustomerModal(dataType) {
		toastr.remove();
		ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value = '';
		this.setState({ contactAddType: dataType, parentCompany: '' });
		$('#add-company').modal({ backdrop: 'static', keyboard: false });
	}

	handleEstimateDetailModal(estimateId){
		let eId = {
			estimateId: estimateId._id
		};
		this
			.props
			.estimatesActions
			.getEstimateDetails(eId);
		$('#estimate_view').modal('show');
	}
	closeViewEstimate(){
		$('#estimate_view').modal('hide');	
	}

	handleCompanyAdd() {
		toastr.remove();
		let companyName = ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value.trim();
		if (companyName) {
			let data = {
				userId: localStorage.userId,
				companyId: localStorage.companyId,
				parentContactId: this.state.parentCompany ? this.state.parentCompany.id : '',
				companyName: companyName,
				userType: 1,
				statusId: localStorage.statusNameId,
				createdBy: localStorage.userName
			};
			this.setState({ newContactData: 'C' });
			this.props.actions.addOtherCompany(data);
			$('#add-company').modal('hide');
		}
		else {
			toastr.error('Please fill in a valid company name.');
		}
	}
	handleContactPhoneChange(e) {
		this.setState({ new_phone: e.target.value });
	}

	// handleContactAdd() {
	// 	toastr.remove();
	// 	if (jQuery('#add_proposal_contact').valid()) {
	// 		let phoneVal = ReactDOM.findDOMNode(this.refs.contactChild.refs.new_phone).value;
	// 		let phoneLen = phoneVal ? validate.removeSpecialCharSpace(phoneVal) : '';
	// 		let phone = [];
	// 		let mail = [];
	// 		let phoneData = {
	// 			phonetype: 'Work',
	// 			phone: ReactDOM.findDOMNode(this.refs.contactChild.refs.new_phone).value.trim(),
	// 			isPrimary: true
	// 		};
	// 		phone.push(phoneData);
	// 		let emailData = {
	// 			internetType: 'Work',
	// 			internetvalue: ReactDOM.findDOMNode(this.refs.contactChild.refs.new_email).value.trim(),
	// 			isPrimary: true
	// 		};
	// 		mail.push(emailData);
	// 		let contactData = {
	// 			userId: localStorage.userId,
	// 			companyId: localStorage.companyId,
	// 			phone: phone,
	// 			internet: mail,
	// 			companyName: this.state.customerValue.label,
	// 			companyContactId: this.state.customerValue.id,
	// 			firstname: ReactDOM.findDOMNode(this.refs.contactChild.refs.first_name).value.trim(),
	// 			lastname: ReactDOM.findDOMNode(this.refs.contactChild.refs.last_name).value.trim(),
	// 			statusId: localStorage.statusNameId,
	// 			userType: 2,
	// 			createdBy: localStorage.userName
	// 		};
	// 		if (phoneLen.length >= 11 && phoneLen.includes('x')) {
	// 			let currentPhone = phoneLen.substring(0, phoneLen.indexOf('x'));
	// 			if (currentPhone.length < 10) {
	// 				toastr.error(message.VALID_PHONE);
	// 			}
	// 			else {
	// 				if (this.state.contactAddType == 'SALES') {
	// 					contactData.isSalesRep = true;
	// 					this.setState({ newContactData: 'S' });
	// 				}
	// 				else {
	// 					this.setState({ newContactData: 'N' });
	// 				}
	// 				this.props.actions.addOtherContact(contactData, this.state.contactAddType);
	// 				$('#add-contact').modal('hide');
	// 			}
	// 		}
	// 		else if (phoneLen.length >= 11) {
	// 			if (this.state.contactAddType == 'SALES') {
	// 				contactData.isSalesRep = true;
	// 				this.setState({ newContactData: 'S' });
	// 			}
	// 			else {
	// 				this.setState({ newContactData: 'N' });
	// 			}
	// 			this.props.actions.addOtherContact(contactData, this.state.contactAddType);
	// 			$('#add-contact').modal('hide');
	// 		} else {
	// 			toastr.error(message.VALID_PHONE);
	// 		}
	// 	}
	// }
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
				companyName: this.state.customerValue.label,
				companyContactId: this.state.customerValue.id,
				firstname: ReactDOM.findDOMNode(this.refs.contactChild.refs.first_name).value.trim(),
				lastname: ReactDOM.findDOMNode(this.refs.contactChild.refs.last_name).value.trim(),
				statusId: localStorage.statusNameId,
				userType: 2,
				createdBy: localStorage.userName
			};
			if(phoneVal!==''){
				if (phoneLen.length >= 11 && phoneLen.includes('x')) {
					let currentPhone = phoneLen.substring(0, phoneLen.indexOf('x'));
					if (currentPhone.length < 10) {
						toastr.error(message.VALID_PHONE);
					}
					else {
						if (this.state.contactAddType == 'SALES') {
							contactData.isSalesRep = true;
							this.setState({ newContactData: 'S' });
						}
						else {
							this.setState({ newContactData: 'N' });
						}
						this.props.actions.addOtherContact(contactData, this.state.contactAddType);
						$('#add-contact').modal('hide');
					}
				}
				else if (phoneLen.length >= 11) {
					if (this.state.contactAddType == 'SALES') {
						contactData.isSalesRep = true;
						this.setState({ newContactData: 'S' });
					}
					else {
						this.setState({ newContactData: 'N' });
					}
					this.props.actions.addOtherContact(contactData, this.state.contactAddType);
					$('#add-contact').modal('hide');
				} else {
					toastr.error(message.VALID_PHONE);
				}
			}else{
				if (this.state.contactAddType == 'SALES') {
					contactData.isSalesRep = true;
					this.setState({ newContactData: 'S' });
				}
				else {
					this.setState({ newContactData: 'N' });
				}
				this.props.actions.addOtherContact(contactData, this.state.contactAddType);
				$('#add-contact').modal('hide');
			}
		}
	}

	handleModalOpen(name) {
		if(this.state.customerValue=='' || this.state.individualValue=='' || this.state.individualValue==''){
			toastr.error('Please fill in the required fields first');
		}
		else{
			let self = this;
			self.state.modalName = '';
			// self.state.laborModalValue = this.state.laborRatesData[0]._id;
			$(name).modal({ backdrop: 'static' });
			self.state.modalName = name;
		}
	}
	handlePopUpClose(type) {
		if (type === 'item') {
			this.setState({
				itemValue: '',
				estimateOptions: []
			});
			$('#estimate_add').modal('hide');
		}
		else if (type === 'newItem') {
			ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_manufacturer).value = '';
			this.setState({
				manufacturerValue: '',
				manufacturerList: []
			});
			$('#create_estimate').modal('hide');
		}
	}
	onItemInputChange(e) {
		let currentValue = e.target.value.trim();
		if (currentValue) {
			let data = {
				searchText: currentValue,
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleItemSearchDebounced();
		}
		else {
			this.setState({ estimateOptions: [], query: '' });
		}
	}
	handleEstimateSubmit(index) {

		let estimateId = this.state.estimateOptions[index]._id;
		let estimateNumber = this.state.estimateOptions[index].estimateNumber;
		let estimateName = this.state.estimateOptions[index].estimateName;
		let status = this.state.estimateOptions[index].status ? this.state.estimateOptions[index].status : '';


		let estimateTotalCount =parseFloat(this.state.estimateOptions[index].estimateTotal[0].totalEstimate); 
		let estimateTaxCount =parseFloat(this.state.estimateOptions[index].estimateTotal[0].taxTotal); 
		let total= estimateTotalCount -estimateTaxCount;
    
		let itemData = {
			estimateId: estimateId,
			estimateNumber: estimateNumber,
			estimateName: estimateName,
			status: status,
			total: total
		};
		let currentItemState = this.state.estimateData;
		currentItemState.push(itemData);
        
		this.setState({
			estimateData: currentItemState,
			estimateOptions: []
		});
		$('#estimate_add').modal('hide');
	}

	estimateForm(type){
		$('#estimate_add').modal('hide');
		// here save current proposal
		if(!this.state.customerValue || !this.state.individualValue || !this.state.salesRepValue){
			toastr.error(message.REQUIRED_FIELDS);
		}else
		{
			let proposalData = {
				customerId: this.state.customerValue.value ? this.state.customerValue.value:this.state.customerValue.id,
				customerName: this.state.customerValue ? this.state.customerValue.label : '',
				individualId: this.state.individualValue.value ? this.state.individualValue.value:this.state.individualValue.id ,
				individualName: this.state.individualValue ? this.state.individualValue.label : '',
				projectName: ReactDOM.findDOMNode(this.refs.projectName).value.trim() ? ReactDOM.findDOMNode(this.refs.projectName).value.trim() : '',
				projectLocation: ReactDOM.findDOMNode(this.refs.projectLocation).value.trim() ? ReactDOM.findDOMNode(this.refs.projectLocation).value.trim() : '',
				summary: ReactDOM.findDOMNode(this.refs.summary).value.trim() ? ReactDOM.findDOMNode(this.refs.summary).value.trim() : '',
				note: ReactDOM.findDOMNode(this.refs.note).value.trim() ? ReactDOM.findDOMNode(this.refs.note).value.trim() : '',
				salesRepId: this.state.salesRepValue.value ? this.state.salesRepValue.value:this.state.salesRepValue.id,
				salesRepName: this.state.salesRepValue ? this.state.salesRepValue.label : '',
				estimates: this.state.estimateData ? this.state.estimateData : '',
				proposalNumber:this.state.proposalNumber?this.state.proposalNumber:'',
				redirectValue:'/proposal/' + this.props.params.proposalId + '/edit'
			};
	
			functions.showLoader('create_proposal');
			this.props.actions.ProposalforEstimate(proposalData);
			browserHistory.push('/estimate/add');
		}
      
	}
	createItemHandler() {
		// $('#confirm_id').modal('show');
		$('#create_estimate').modal('show');
	}
	proposalHandler() {
		// if(this.state.estimateData.length==0){
		// 	toastr.error('Please add atleast one estimate to proceed');
		// }else 
		if(!this.state.customerValue || !this.state.individualValue || !this.state.salesRepValue){
			toastr.error(message.REQUIRED_FIELDS);
		}else
		{
			let proposalData = {
				companyId: localStorage.companyId,
				customerId: this.state.customerValue.value ? this.state.customerValue.value:this.state.customerValue.id,
				companyName: this.state.customerValue ? this.state.customerValue.label : '',
				individualId: this.state.individualValue.value ? this.state.individualValue.value:this.state.individualValue.id ,
				individualName: this.state.individualValue ? this.state.individualValue.label : '',
				projectName: ReactDOM.findDOMNode(this.refs.projectName).value.trim() ? ReactDOM.findDOMNode(this.refs.projectName).value.trim() : '',
				projectLocation: ReactDOM.findDOMNode(this.refs.projectLocation).value.trim() ? ReactDOM.findDOMNode(this.refs.projectLocation).value.trim() : '',
				summary: ReactDOM.findDOMNode(this.refs.summary).value.trim() ? ReactDOM.findDOMNode(this.refs.summary).value.trim() : '',
				note: ReactDOM.findDOMNode(this.refs.note).value.trim() ? ReactDOM.findDOMNode(this.refs.note).value.trim() : '',
				salesRepId: this.state.salesRepValue.value ? this.state.salesRepValue.value:this.state.salesRepValue.id,
				salesRepName: this.state.salesRepValue ? this.state.salesRepValue.label : '',
				estimates: this.state.estimateData ? this.state.estimateData : '',
				proposalId:this.state.proposalDetails._id
			};
    
			functions.showLoader('create_proposal');
			this.props.actions.updateProposal(proposalData,this.props.params.proposalId);
		}
	}
	render() {
		let countItem = 0;
		let estimateTabData = this
			.state
			.estimateData
			.map(function (i, index) {
				countItem = countItem + 1;
				// if (i.itemTypeId === 1) {
				return (
					<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td style={{ textAlign: 'center' }}>{countItem}</td>
						<td>{i.estimateNumber ? i.estimateNumber : '-'}</td>
						<td>{i.estimateName ? i.estimateName : '-'}</td>
						<td>{i.total ? '$' : ''}{i.total ? i.total : '-'}</td>
						<td>{i.status ? i.status : '-'}</td>

						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}
							>
								<i className="fa fa-trash-o"></i>
							</span>
							<span className="btn btn-icon-only yellow"
								onClick={this.handleEstimateDetailModal.bind(this, i.estimateId)}
							>
								<i className="fa fa-eye"></i>
							</span>
						</td>
					</tr>
				);
			}.bind(this));

		let searchedItems = this.state.estimateOptions
			.map(function (i, index) {
				return <tr key={index}>
					<td>{i.estimateNumber ? i.estimateNumber : '-'}</td>
					<td>{i.estimateName ? i.estimateName : '-'}</td>
					<td>{i.companyName ? i.companyName : '-'}</td>
					<td>{i.salesRepFirst ? i.salesRepFirst : '-'}&nbsp;&nbsp;{i.salesRepLast ? i.salesRepLast : ''}</td>
					<td><button type="button" className="btn btn-xs green"
						onClick={this.handleEstimateSubmit.bind(this, index)}
					>Select Estimate</button>
					</td>
				</tr>;
			}.bind(this));
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<i className="icon-users "></i>
						<span
							className="caption-subject bold uppercase"
							style={{
								'fontSize': '17px'
							}}>Proposal</span>
					</div>
					<div className="form-actions noborder text-right">
						<Link to={'/proposal/' + this.props.params.proposalId} className="btn red">
                            Cancel
						</Link>&nbsp;&nbsp;
						<button type="button"  onClick={this.proposalHandler.bind(this)} className="btn blue">Save</button>
					</div>
				</div>
				<hr></hr>
				<div className="portlet light bordered" id="create_proposal">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="proposal-add">
								<form role="form" id="createProposal">
									<div className="form-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="customer">Proposal For<span className="required">*</span></label>
													{this.state.customerValue ? null  :<span className="pull-right">
														<i className="fa fa-plus-circle fa-2x" onClick={this.handleNewCustomerModal.bind(this, 'COMPANY')}
															aria-hidden="true"></i></span>}
													<Select
														disabled={this.state.disabled}
														value={this.state.customerValue}
														name="customer"
														id="customer"
														options={this.state.customerOptions}
														onChange={this.handleCustomerChange}
														onInputChange={this.onCustomerInputChange}
													/>
												</div>
											</div>

											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="individual">Attn<span className="required">*</span></label>
													{this.state.individualValue ? null  :<span className="pull-right">
														<i className="fa fa-plus-circle fa-2x" onClick={this.handleNewIndividualModal.bind(this, 'INDIVIDUAL')}
															aria-hidden="true"></i></span>}
													<Select
														disabled={this.state.disabled}
														value={this.state.individualValue}
														name="individual"
														id="individual"
														options={this.state.individualOptions}
														onChange={this.handleIndividualChange}
														onInputChange={this.onIndividualInputChange}
													/>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }}
														className="form-control"
														rows={1}
														ref="projectName"
														name="projectName"
														defaultValue={this.state.proposalDetails.projectName?this.state.proposalDetails.projectName:''}
														key={this.state.proposalDetails.projectName?this.state.proposalDetails.projectName:''}
													>
													</TextareaAutosize>
													<label htmlFor="projectName">Project Name</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }}
														className="form-control"
														rows={1}
														ref="projectLocation"
														name="projectLocation"
														defaultValue={this.state.proposalDetails.projectLocation?this.state.proposalDetails.projectLocation:''}
														key={this.state.proposalDetails.projectLocation?this.state.proposalDetails.projectLocation:''}
													></TextareaAutosize>
													<label htmlFor="projectLocation">Project Location</label>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }}
														className="form-control"
														rows={1}
														ref="summary"
														name="summary"
														defaultValue={this.state.proposalDetails.summary?this.state.proposalDetails.summary:''}
														key={this.state.proposalDetails.summary?this.state.proposalDetails.summary:''}
													></TextareaAutosize>
													<label htmlFor="summary">Summary</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<TextareaAutosize
														style={{ resize: 'none' }}
														className="form-control"
														rows={1}
														ref="note"
														name="note"
														defaultValue={this.state.proposalDetails.note?this.state.proposalDetails.note:''}
														key={this.state.proposalDetails.note?this.state.proposalDetails.note:''}
													></TextareaAutosize>
													<label htmlFor="note">Note</label>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="salesperson">Salesperson<span className="required">*</span></label>
													{this.state.salesRepValue ? null  :<span className="pull-right">
														<i className="fa fa-plus-circle fa-2x" onClick={this.handleNewIndividualModal.bind(this, 'SALES')}
															aria-hidden="true" ></i></span>}
													<Select
														disabled={this.state.disabled}
														value={this.state.salesRepValue}
														placeholder="Sales Rep"
														noResultsText={this.state.salesRepNoResult}
														name="salesperson"
														id="salesperson"
														options={this.state.salesRepOptions}
														onChange={this.handleSalesRepChange}
														onInputChange={this.onInputChangeSalesRep}
													/>
												</div>
											</div>
											<div className="clearfix"></div>
										</div>
									</div>
								</form>
							</div>
						</div>

						<div className="portlet light portlet-fit portlet-datatable bordered">
							<div className="portlet light box-shadow-none">
								<div className="portlet-title tabbable-line">
									<div className="caption">
										<i className="icon-share font-dark"></i>
										<span className="caption-subject font-dark bold uppercase">Estimates</span>
									</div>

								</div>

								<div className="portlet-body">
									<div className="tab-content">
										{/* <div className={'tab-pane' + ' ' + this.state.itemTab} id="portlet_tab1"> */}
										<div className="row">
											<div className="col-md-12">
												<div className="table-container table-responsive" style={{ overflow: 'auto' }}>
													<table className="table table-striped table-bordered" id="lineitem">
														<thead >
															<tr>
																<th className="items"></th>
																<th className="items">#</th>
																<th className="items">Estimate #</th>
																<th className="items">Name</th>
																<th className="rowtotal">Total</th>
																<th className="items">Status</th>
																<th className="items"></th>
															</tr>
														</thead>
														<tbody id="sortable">
															{estimateTabData}
														</tbody>
														{/* {this.state.estimateData.length != 0 ? <tfoot>
                                                            <tr>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                </td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                </td>
                                                                <td style={{ textAlign: 'right' }}>
                                                                </td>
                                                                <td></td>
                                                            </tr>
                                                        </tfoot> : null} */}
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject font-dark bold">Add Estimate:</span>
									</div>&nbsp;&nbsp;
									<a onClick={this.handleModalOpen.bind(this, '#estimate_add')}
										data-backdrop="static" data-keyboard="false"
										className="btn btn-sm btn-circle blue">
										<i className="icon-plus"></i>
                                        Estimate
									</a>&nbsp;&nbsp;
									{/* <a onClick={this.handleModalOpen.bind(this, '#subheader_add')}
                                                data-backdrop="static" data-keyboard="false"
                                                className="btn btn-sm btn-circle yellow">
                                                <i className="icon-plus"></i>
                                                Sub-Header
                                        </a> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				<AddContactModal
					addContactModalId="add-contact"
					companyValue={this.state.customerValue}
					contactAddhandler={this.handleContactAdd}
					ref='contactChild'
					phoneValue={this.state.new_phone}
					handleContactPhoneChange={this.handleContactPhoneChange}
				/>
				<AddCompanyModal
					addCompanyModalId="add-company"
					companyAddhandler={this.handleCompanyAdd}
					ref='companyChild'
					customerValue={this.state.parentCompany}
					customerOptions={this.state.customerOptions}
					handleCustomerChange={this.handleParentCompanyChange}
					handleSelectsBlur={this.handleSelectsBlur}
					onCompanyInputChange={this.onCustomerInputChange}
				/>
				<DeleteModal deleteModalId="estimate_delete" deleteUserHandler={this.deleteEstimate} />
		
				<AddEstimate
					title='Add Estimate'
					estimateAddId="estimate_add"
					onItemInputChange={this.onItemInputChange}
					itemOptions={this.state.estimateOptions}
					searchedItems={searchedItems}
					handlePopUpClose={this.handlePopUpClose.bind(this, 'item')}
					createItemHandler={this.createItemHandler.bind(this, 'item')}   
					estimateForm={this.estimateForm.bind(this, 'item')}                 
				/>
				<ViewEstimate
					estimateViewId='estimate_view'
					handlePopUpClose={this.closeViewEstimate}
					estimateData={this.state.selectedEstimateDetail?this.state.selectedEstimateDetail:null}
					title='Estimate Detail'
				/>				
			</div>
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		customerList: state.proposal.customerList,
		individualList: state.proposal.individualList,		
		salesRepList: state.opportunity.salesRepList,
		companyCreated: state.proposal.companyCreated,
		newIndividualCreated: state.proposal.individualCreated,
		newSalesCreated: state.estimate.salesCreated,
		estimateDataList: state.proposal.estimateDataList,
		createProposalData: state.proposal.createPrposalData,
		newEstimate: state.estimate.newEstimate,
		proposalDetail: state.proposal.proposalDetail,
		newEstimateDetail:state.proposal.newEstimateDetail,
		selectedEstimate: state.estimate.estimateDetails

	};
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(proposalActions, dispatch),
		estimatesActions: bindActionCreators(estimateActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ProposalEdit);