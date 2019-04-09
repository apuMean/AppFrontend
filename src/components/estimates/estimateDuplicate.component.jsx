import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import autoBind from 'react-autobind';
import MaskedInput from 'react-text-mask';
import { RIEInput, RIETextArea, RIENumber, RIESelect } from 'riek';
import TextareaAutosize from 'react-autosize-textarea';
import * as loader from '../../constants/actionTypes.js';
import * as createContactAction from '../../actions/createContactAction';
import * as estimateActions from '../../actions/estimateActions';
import * as itemActions from '../../actions/itemAction';
import * as settingsActions from '../../actions/settingsActions';
import * as types from '../../constants/actionTypes';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import * as validate from '../common/validator';
import _ from 'lodash';
import jQuery from 'jquery';
import LaddaButton, { XS, ZOOM_IN } from 'react-ladda';
import AddRevision from '../common/addRevisionModal.component';
import DeleteModal from '../common/deleteModal.component';
import ConfirmModal from '../common/confirmModal.component';
import '../../styles/bootstrap-fileinput.css';
import AddContactModal from '../common/newContactModal.component.js';
import moment from 'moment';
import AddItemModal from '../common/addItemModal.component';
import ConfirmationModal from '../common/confirmationModal.component';
import * as functions from '../common/functions';
import AddMaterial from '../common/materialAddModal';
import AddShipping from '../common/shippingAddModal';
import AddHeader from '../common/headerAddModal';
import AddLabor from '../common/laborAddModal';
import SingleSelect from '../shared/SingleSelect';
import SingleInput from '../shared/SingleInput';
import RevisionModal from './revisionNameModal';
import { taxRateMask } from '../../constants/customMasks';
import * as message from '../../constants/messageConstants';
import RichTextEditor from 'react-rte';

let CompanyValue = [];
let OpportunityValue = [];
let SalesRepValue = [];
let IndividualValue = [];
let total = 0;
let laborCost = 0;
let materialCost = 0;
let equipmentCost = 0;
let otherCost = 0;
let currentCompanyValue = '';
class EstimateDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			supplierData: [],
			itemPricedData: [],
			taxRate: 1.8,
			disabled: false,
			items: [],
			companyValue: '',
			individualValue: '',
			proposalValue: '',
			projectValue: '',
			opportunityValue: '',
			salesrepValue: '',
			itemValue: '',
			companyPhone: '',
			addressDetails: {
				mapAddress1: '',
				mapAddress2: '',
				city: '',
				state: '',
				zip: ''
			},
			shipAddressDetails: {
				mapAddress1: '',
				mapAddress2: '',
				city: '',
				state: '',
				zip: ''
			},
			companyOptions: [],
			salesrepOptions: [],
			opportunityOptions: [],
			individualOptions: [],
			proposalOptions: [],
			projectOptions: [],
			estimateDetails: '',
			itemDetails: [],
			itemOptions: [],
			unitPriceValue: '',
			laborRatesData: [],
			laborTypeId: '',
			contactAddType: '',
			newContactData: '',
			laborTotalMore: [],
			laborHoursMore: [],
			expandTotal: false,
			expandHours: false,
			expandType: '',
			defaultMarkup: 30,
			defaultTaxRate: 9,
			itemTab: 'active',
			materialTab: '',
			laborTab: '',
			itemDeleteIndex: '',
			revisedItems: [],
			revisionNo: 0,
			isCheckedEmpty: false,
			isCheckedDuplicate: true,
			itemNotExists: true,
			currentRevisionId: '',
			newItemAdded: '',
			newItemAddFlag: false,
			newAddedSupplier: '',
			manufacturerList: [],
			manufacturerValue: '',
			breadcrumb: true,
			modalName: '',
			new_phone: '',
			query: '',
			revisionName: '',
			revisionNotes: '',
			estimateNumber: '',
			proposedServiceValue:RichTextEditor.createEmptyValue(),
			pvalue: ''
		};

	}

	componentWillMount() {
		let companyId = {
			companyId: localStorage.companyId
		};
		let estimateId = {
			estimateId: this.props.params.estimateId
		};
		let params = {
			companyId: localStorage.companyId,
			moduleType: 1
		};
		this.props.actions.getEstimateDetails(estimateId);
		this.props.actions.getLaborRates(companyId, types.GET_LABOR_RATE);
		this.props.actions.getOpportunityList(companyId);
		this.props.actions.getProjectData(companyId);
		this.props.actions.getProposalData(companyId);
		this.props.actions.getRevisionList(estimateId);
		this.props.actions.getEstimateNo(companyId);
		this.props.settingsActions.getEstimateStages(params);
		this.handleItemSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getItemData(this.state.query, types.GET_EST_ITEM);
			}
		}, 350);
		this.handleSalesSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getSalesRepData(this.state.query);
			}
		}, 350);
		this.handleContactSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getIndividualData(this.state.query);
			}
		}, 350);
		this.handleCompanySearchDebounced = _.debounce(function () {

			if (this.state.query) {
				this.props.actions.getCompanyList(this.state.query);
			}
		}, 350);
	}

	componentDidMount() {
		appValid
			.FormValidationMd
			.init();
		functions.showLoader('update_estimate');
		let self = this;
		let pageId = document.getElementById('update_estimate');
		if (pageId) {
			pageId.addEventListener('keydown', function (event) {
				const key = event.key;
				if (key === 'Escape') {
					if (self.state.modalName) {
						$(self.state.modalName).modal('hide');
					}
				} else if (key === 'Enter') {
					// event.preventDefault()
					if (self.state.modalName == '#subheader_add') {
						self.handleHeaderAdd();
					} else if (self.state.modalName == '#shipping_add') {
						self.handleShippingAdd();
					} else if (self.state.modalName == '#labor_add') {
						self.handleLaborAdd();
					}
				}
			});
		}
		$('body').on('hidden.bs.modal', function () {
			self.state.modalName = '';
		});
	}

	componentWillReceiveProps(nextProps) {

		let project = [];
		let proposal = [];
		let individual = [];
		let company = [];
		let salesrep = [];
		let opportunity = [];
		let laborData = [];
		let addressDetail = '';
		let addr = {
			mapAddress1: '',
			mapAddress2: '',
			city: '',
			state: '',
			zip: ''
		};
		let shipAddr = {
			mapAddress1: '',
			mapAddress2: '',
			city: '',
			state: '',
			zip: ''
		};
		let item = [];

		if (nextProps.updatedName) {
			let res = this.state.revisedItems.findIndex(o => o._id === nextProps.updatedName.estimateItemId);
			let currentRevisionState = this.state.revisedItems.slice();
			let itemsData = currentRevisionState[res].lineItems;
			let itemIndex = itemsData.findIndex(o => o._id === nextProps.updatedName.lineItemId);
			currentRevisionState[res].lineItems[itemIndex].spin = false;
			currentRevisionState[res].lineItems[itemIndex].itemName = nextProps.updatedName.itemName;
			this.setState({ revisedItems: currentRevisionState });
		}

		if (nextProps.companyList.length == 0 && nextProps.individualList.length == 0 && nextProps.salesRepList.length == 0) {
			if (nextProps.estimateDetail.length != 0) {

				let estimatestate = JSON.parse(JSON.stringify(nextProps.estimateDetail.estimateDetails));
				if (this.state.breadcrumb && estimatestate.estimateNumber) {
					let company=estimatestate.customerId?' (' + estimatestate.customerId.companyName + ')':'';
					let data = {
						parent: <Link to='/estimate'>Estimates</Link>,
						childone: ('#' + estimatestate.estimateNumber) + company,
						childtwo: ''
					};
					this.props.breadCrumb(data);
					this.state.breadcrumb = false;
				}
				let	customerObj = {
					value: estimatestate.customerId?estimatestate.customerId._id:'',
					label: estimatestate.customerId?estimatestate.customerId.companyName:''
				};
				let projectObj = {
					id: estimatestate.projectId ? estimatestate.projectId._id : '',
					label: estimatestate.projectId ? estimatestate.projectId.title : ''
				};
				let proposalObj = {
					id: estimatestate.proposalId ? estimatestate.proposalId._id : '',
					label: estimatestate.proposalId ? estimatestate.proposalId.proposalNumber : ''
				};
				let individualObj = {
					value: estimatestate.individualId ? estimatestate.individualId._id : '',
					label: estimatestate.individualId ? estimatestate.individualId.firstname + ' ' + estimatestate.individualId.lastname : ''
				};
				let opportunityObj = {
					id: estimatestate.opportunityId ? estimatestate.opportunityId._id : '',
					label: estimatestate.opportunityId ? estimatestate.opportunityId.title : '',
					customerId: estimatestate.opportunityId ? estimatestate.opportunityId.contactId : ''
				};
				let salesRepObj = {
					value: estimatestate.salesRep ? estimatestate.salesRep._id : '',
					label: estimatestate.salesRep ?estimatestate.salesRep.firstname + ' ' + estimatestate.salesRep.lastname:''
				};
				let addr = {
					mapAddress1: estimatestate.billingAddress1,
					mapAddress2: estimatestate.billingAddress2,
					city: estimatestate.billingcity,
					state: estimatestate.billingstate,
					zip: estimatestate.billingzip
				};
				let shipAddr = {
					mapAddress1: estimatestate.shippingAddress1,
					mapAddress2: estimatestate.shippingAddress2,
					city: estimatestate.shippingcity,
					state: estimatestate.shippingstate,
					zip: estimatestate.shippingzip
				};
				// if(estimatestate.length!=0){
				//     var res = estimatestate.proposedServices.toString('html');
				//     this.setState({
				//         proposedServiceValue: RichTextEditor.createValueFromString(res, 'html')
				//     });
				// }
				this.setState({
					estimateDetails: estimatestate,
					companyValue: customerObj,
					projectValue: projectObj.id ? projectObj.id : '',
					proposalValue: proposalObj.id ? proposalObj.id : '',
					individualValue: individualObj.value ? individualObj : '',
					opportunityValue: this.state.opportunityValue ? this.state.opportunityValue : opportunityObj.id,
					salesrepValue: salesRepObj,
					addressDetails: addr,
					shipAddressDetails: shipAddr,
					pvalue: estimatestate.proposedServices
				});
			}
		}
        
		if (this.state.revisedItems.length !== nextProps.revisionData.length) {
          
			let itemState = JSON.parse(JSON.stringify(nextProps.revisionData));
			this.setState({ revisedItems: itemState });

			let currentRevisedItem = [];

			if (this.state.itemNotExists) {
				currentRevisedItem = itemState[0].lineItems;
				if(this.state.pvalue){
					if (itemState[0].revisionName == 'Rev0') {
						this.setState({
							proposedServiceValue: RichTextEditor.createValueFromString(this.state.pvalue, 'html')
						});
					} else if (itemState[0].proposedServices) {
						var res = itemState[0].proposedServices.toString('html');
						this.setState({
							proposedServiceValue: RichTextEditor.createValueFromString(res, 'html')
						});
					} else {
						this.setState({
							proposedServiceValue: RichTextEditor.createEmptyValue()
						});
					}
				}
				
				// if(itemState[0].proposedServices){
				// 	var res = itemState[0].proposedServices.toString('html');
				// 	this.setState({
				// 		proposedServiceValue: RichTextEditor.createValueFromString(res, 'html')
				// 	});
				// }else{
				// 	this.setState({
				// 		proposedServiceValue:  RichTextEditor.createEmptyValue()
				// 	});
				// }
				this.setState({
					itemPricedData: currentRevisedItem,
					itemNotExists: false,
					currentRevisionId: itemState[0]._id,
					revisionNotes: itemState[0].revisionNotes ? itemState[0].revisionNotes : ''
				});
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
				$(function () {
					$('#' + sortId).sortable({
						handle: '.handle',
						update: function (event, ui) {

							let reorderArray = [];
							let idsInOrder = $('#' + sortId).sortable('toArray', { attribute: 'data-id' });
							idsInOrder.map(function (i) {
								reorderArray.push(currentRevisedItem[i]);
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
							self.setState({ itemPricedData: reorderArray });
							self.updateRevisionItems(reorderArray);
							$('#' + sortId).sortable('cancel');
						},
						change: function (event, ui) {
							let currentIndex = ui.placeholder.index();
							if (currentIndex > -1) {
								droppedIndex = currentIndex;
							}
						}
					});
				});
			}
		}
        
		if (nextProps.estimateNo) {

			this.setState({ estimateNumber: nextProps.estimateNo });
		}

		if (nextProps.individualList.length != 0) {
			let individualList = nextProps
				.individualList
				.map(function (list, index) {
					let obj = {
						value: list._id,
						label: list.firstname + ' ' + list.lastname
					};
					individual.push(obj);
				}.bind(this));
		}


		if (nextProps.salesRepList.length != 0) {
			let salesrepList = nextProps
				.salesRepList
				.map(function (list, index) {
					let obj = {
						value: list._id,
						label: list.firstname + ' ' + list.lastname
					};
					salesrep.push(obj);
				}.bind(this));
		}

		if (nextProps.opportunityList.length != 0) {
			let opportunityList = nextProps
				.opportunityList
				.map(function (list, index) {
					let obj = {
						id: list._id,
						label: list.title,
						customerId: list.contactId
					};
					opportunity.push(obj);
				}.bind(this));
		}

		if (nextProps.laborRates.length != 0) {
			let laborList = nextProps
				.laborRates
				.map(function (list, index) {
					let obj = {
						value: list._id,
						text: list.laborType,
						_id: list._id,
						id: list._id,
						laborType: list.laborType,
						displayName: list.displayName,
						rate:localStorage.laborRate?localStorage.laborRate:list.rate
						// rate: list.rate
					};
					laborData.push(obj);
				}.bind(this));
		}

		if (nextProps.companyList.length != 0) {

			let companyList = nextProps.companyList.map(function (list, index) {
				let obj = {
					value: list._id,
					label: list.companyName
				};
				company.push(obj);
			}.bind(this));

		}
		$('div#update_estimate').unblock();

		if (nextProps.contactDetails) {

			let contactDetailState = JSON.parse(JSON.stringify(nextProps.contactDetails));
			if (currentCompanyValue != contactDetailState.companyName) {
				this.setState({ individualOptions: [] });
				currentCompanyValue = '';
			}
			let res = contactDetailState.addressInfo.find(function (d) {
				return d.isPrimary == true;
			});
			if (res) {
				addr = {
					mapAddress1: res.mapAddress1,
					mapAddress2: res.mapAddress2,
					city: res.city,
					state: res.state,
					zip: res.zip
				};
			}
			let obj = {
				value: contactDetailState._id,
				label: contactDetailState.companyName,

			};
			this.setState({
				companyValue: obj,
				addressDetails: addr
			});

		}

		if (nextProps.newIndividualCreated && this.state.newContactData === 'N') {
			let individual = {
				value: nextProps.newIndividualCreated.id,
				label: nextProps.newIndividualCreated.label
			};
			this.setState({
				individualValue: individual,
				newContactData: ''
			});
		}

		if (nextProps.newSalesCreated && this.state.newContactData === 'S') {
			let salesrep = {
				value: nextProps.newSalesCreated.id,
				label: nextProps.newSalesCreated.label
			};
			this.setState({
				salesrepValue: salesrep,
				newContactData: ''
			});
		}

		if (this.state.newItemAddFlag && nextProps.newCreatedItem) {
			let newItemAdded = {
				itemName: nextProps.newCreatedItem.itemName,
				modal: nextProps.newCreatedItem.modal,
				partNumber: nextProps.newCreatedItem.partNumber,
				manufacturer: nextProps.newCreatedItem.manufacturer,
				labourHour: 0,
				_id: nextProps.newCreatedItem._id
			};

			let newAddedSupplier = {
				itemId: nextProps.newCreatedItem._id,
				dealerPrice: this.state.newAddedSupplier ? this.state.newAddedSupplier[0].dealerPrice : 0
			};

			this.state.newItemAddFlag = false;
			this.state.newItemAdded = newItemAdded;
			this.handleLineItemAdd('', newAddedSupplier);
		}


		this.setState({
			companyOptions: company,
			projectOptions: nextProps.projectList,
			proposalOptions: nextProps.proposalList,
			individualOptions: individual,
			salesrepOptions: salesrep,
			opportunityOptions: nextProps.opportunityList,
			itemOptions: this.state.query ? nextProps.itemList : [],
			laborRatesData: laborData,
			manufacturerList: nextProps.ManufacturerList,
			revisionNo: nextProps.revisionNo ? nextProps.revisionNo : 0
		});

		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
		$(".lineitem").tableHeadFixer();

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
					reorderArray.push(nextState.itemPricedData[i]);
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
				self.setState({ itemPricedData: reorderArray });
				self.updateRevisionItems(reorderArray);
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
	onChange(value) {
		this.setState({ proposedServiceValue: value });
	}
	handleNewContactModal(dataType) {
		if (this.state.companyValue) {
			this.setState({ contactAddType: dataType, new_phone: '' });
			$('#add-contact').modal({ backdrop: 'static', keyboard: false });
		}
		else {
			toastr.error(message.REQUIRED_OPPORTUNITY_SELECT);
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
				companyContactId: this.state.companyValue.value,
				firstname: ReactDOM.findDOMNode(this.refs.contactChild.refs.first_name).value.trim(),
				lastname: ReactDOM.findDOMNode(this.refs.contactChild.refs.last_name).value.trim(),
				statusId: localStorage.statusNameId,
				userType: 2,
				createdBy: localStorage.userName
			};
			// if (phoneLen.length >= 11 && phoneLen.includes('x')) {
			// 	let currentPhone = phoneLen.substring(0, phoneLen.indexOf('x'));
			// 	if (currentPhone.length < 10) {
			// 		toastr.error(message.VALID_PHONE);
			// 	}
			// 	else {
			// 		if (this.state.contactAddType == 'SALES') {
			// 			contactData.isSalesRep = true;
			// 			this.setState({ newContactData: 'S' });
			// 		}
			// 		else {
			// 			this.setState({ newContactData: 'N' });
			// 		}
			// 		this.props.actions.addOtherContact(contactData, this.state.contactAddType);
			// 		$('#add-contact').modal('hide');
			// 	}
			// }
			// else if (phoneLen.length >= 11) {
			// 	if (this.state.contactAddType == 'SALES') {
			// 		contactData.isSalesRep = true;
			// 		this.setState({ newContactData: 'S' });
			// 	}
			// 	else {
			// 		this.setState({ newContactData: 'N' });
			// 	}
			// 	this.props.actions.addOtherContact(contactData, this.state.contactAddType);
			// 	$('#add-contact').modal('hide');
			// } else {
			// 	toastr.error(message.VALID_PHONE);
			// }
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

	onContactFocus() {
		toastr.remove();
		if (this.state.companyValue.value) {
		}
		else {
			toastr.error(message.REQUIRED_OPPORTUNITY_SELECT);
		}
	}

	handleExpand(type) {
		if (type === 'TOTAL') {
			let total = !this.state.expandTotal;
			this.setState({ expandTotal: total });
		}
		else if (type === 'HOURS') {
			let hours = !this.state.expandHours;
			this.setState({ expandHours: hours });
		}
	}
	handleSave() {
		$('#duplicate_save').modal('show');
	}
	duplicateEstimateHandler() {


		$('#duplicate_save').modal('hide');
		// functions.showLoader('companyList');
		// this.props.actions.deleteContact(this.props.params.companyId, 1);

		this.createEstimateHandler();

	}

	handleIndividualChange(value) {

		this.setState({ individualValue: value });
	}
	handleCompanyChange(e) {

		if (e) {
			this.setState({ companyValue: e });
			let data = {
				contactId: e.value
			};
			this.props.actions.getCustomerDetails(data);
		}
		else {
			this.setState({ companyValue: '', individualValue: '', addressDetails: '' });
		}
	}
	onCompanyInputChange(value) {

		if (value.trim()) {
			let data = {
				companyName: value,
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleCompanySearchDebounced();
		}
		else {
			this.props.actions.clearSelects();
			this.setState({ individualOptions: [], query: '', companyOptions: [] });
		}
	}

	handleSelectsBlur() {
		this.props.actions.clearSelects();
	}

	handleProposalChange(e) {
		let proposalId = e.target.value;
		if (proposalId !== '' && proposalId != '0') {
			this.setState({ proposalValue: proposalId });
		}
		else {
			this.setState({ proposalValue: '' });
		}
	}

	handleProjectChange(e) {
		let projectId = e.target.value;
		if (projectId !== '' && projectId != '0') {
			this.setState({ projectValue: projectId });
		}
		else {
			this.setState({ projectValue: '' });
		}
	}

	handleOpportunityChange(e) {
		let individual = '';
		let opportunityId = e.target.value;
		if (opportunityId !== '' && opportunityId != '0') {
			this.setState({ opportunityValue: e.target.value });
			let currentData = this.state.opportunityOptions.find(o => o._id === e.target.value);
			ReactDOM.findDOMNode(this.refs.name).value = currentData.title;
			let data = {
				contactId: currentData.contactId
			};
			if (currentData.individualId) {
				individual = {
					value: currentData.individualId._id,
					label: currentData.individualId.firstname + ' ' + currentData.individualId.lastname
				};
			}
			this.props.actions.updateOpportunityState();
			this.props.actions.getCustomerDetails(data);
			this.setState({
				individualValue: individual,
				individualOptions: [],
				companyValue: '',
				addressDetails: ''
			});
		}
		else {
			this.props.actions.updateOpportunityState();
			ReactDOM.findDOMNode(this.refs.name).value = '';
			this.setState({
				opportunityValue: '',
				individualValue: '',
				individualOptions: [],
				companyValue: '',
				addressDetails: ''
			});
		}
	}

	handleSalesRepChange(value) {
		this.setState({ salesrepValue: value });
	}

	handlePopUpClose(type) {
		if (type === 'item') {
			this.setState({
				itemValue: '',
				itemOptions: []
			});
			$('#lineitem_add').modal('hide');
		}
		else if (type === 'supplier') {
			$('#supplier_add').modal('hide');
		}
		else if (type === 'newItem') {
			ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_manufacturer).value = '';
			this.setState({
				manufacturerValue: '',
				manufacturerList: []
			});
			$('#add_item').modal('hide');
		}
	}

	onIndividualInputChange(value) {
		let contactId = this.state.companyValue.value;
		if (contactId) {
			if (value.trim()) {
				let data = {
					firstname: value,
					companyId: localStorage.companyId,
					contactId: contactId
				};
				this.setState({ query: data });
				this.handleContactSearchDebounced();
			}
			else {
				this.props.actions.clearSelects();
				this.setState({ individualOptions: [], query: '' });
			}
		}
	}

	onSalesRepInputChange(value) {
		if (value.trim()) {
			let data = {
				firstname: value,
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleSalesSearchDebounced();
		}
		else {
			this.props.actions.clearSelects();
			this.setState({ salesrepOptions: [], query: '' });
		}
	}

	onItemInputChange(e) {
		let currentValue = e.target.value.trim();
		if (currentValue) {
			let data = {
				itemName: currentValue,
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleItemSearchDebounced();
		}
		else {
			this.setState({ itemOptions: [], query: '' });
		}
	}

	handleItemSubmit(index) {
		let currentdata = this.state.itemOptions[index];
		if (currentdata.suppliersInfo.length === 1) {
			let data = currentdata.suppliersInfo[0];
			this.handleLineItemAdd(index, data);
		}
		else if (currentdata.suppliersInfo) {
			this.setState({ supplierData: currentdata.suppliersInfo });
			$('#supplier_add').modal({ backdrop: 'static', keyboard: false });
		}
	}

	handleLineItemAdd(index, currentSupplierData) {
		let currentSupplier = '';
		let currentSelectedItem = '';
		if (currentSupplierData === '') {
			currentSupplier = this.state.supplierData[index];
		}
		else {
			currentSupplier = currentSupplierData;
		}

		if (index !== '') {
			currentSelectedItem = this.state.itemOptions.find(o => o._id === currentSupplier.itemId);
		} else {
			currentSelectedItem = this.state.newItemAdded;
		}

		//Calculations for line items
		// let itemTypeId = 1;
		let itemMfg = currentSelectedItem.manufacturer;
		let partNo = currentSelectedItem.partNumber;
		let modal = currentSelectedItem.modal;
		let itemName = currentSelectedItem.itemName;
		let quantity = 1;

		let mTaxable = true;
		// let mOurCost = currentSupplier.dealerPrice ? parseInt(currentSupplier.dealerPrice) : 0;
		let mOurCost = currentSupplier.dealerPrice ? parseFloat(currentSupplier.dealerPrice) : 0;
		let mOurCostExtended = mOurCost * quantity;
		let mMarkup = ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value).toFixed(1) : ((30).toFixed(1));
		let mCost = mOurCost + ((mMarkup / 100) * mOurCost);
		let mExtended = quantity * mCost;
		let mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * mExtended) : 0;
		let mTaxExtended = mExtended + mTax;

		let laborTypeName = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].laborType : '';
		let displayLaborName = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].displayName : '';
		let lType = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0]._id : '';
		let lHours = currentSelectedItem.labourHour ? parseInt(currentSelectedItem.labourHour) : 0;
		let lHoursExtended = lHours * quantity;
		let lRate = this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].rate : '';
		let lExtended = lHoursExtended * lRate;

		let pricedData = {
			itemId: currentSelectedItem._id,
			itemMfg: itemMfg,
			partNo: partNo,
			modelNo: modal,
			itemName: itemName,
			quantity: quantity,
			mTaxable: mTaxable,
			mOurCost: mOurCost,
			mOurCostExtended: mOurCostExtended,
			mMarkup: mMarkup,
			mCost: mCost,
			mExtended: mExtended,
			mTax: mTax,
			mTaxExtended: mTaxExtended,
			laborTypeName: laborTypeName,
			displayLaborName: displayLaborName,
			lType: lType,
			lHours: lHours,
			lExtended: lExtended,
			lHoursExtended: lHoursExtended,
			lRate: lRate,
			rowTotal: mTaxExtended + lExtended,
			header: '',
			itemTypeId: 1,
			unit: lHours * lRate
		};

		let currentItemState = this.state.itemPricedData;
		currentItemState.push(pricedData);
		this.setState({
			itemPricedData: currentItemState,
			itemOptions: []
		});
		// this.setState({
		//     itemOptions: []
		// });
		$('#lineitem_add').modal('hide');
		$('#supplier_add').modal('hide');
		this.updateRevisionItems(currentItemState);
	}

	handleLaborAdd(e) {
		toastr.remove();
		let itemDesc = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value;
		// let quantity = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value;
		let quantity = 1;
		if (!itemDesc.trim()) {
			toastr.error(message.REQUIRED_DESCRIPTION);
		} else {
			let pricedData = {
				itemMfg: '',
				partNo: '',
				modelNo: '',
				itemName: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value,
				// quantity: ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value ? parseInt(ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value) : 1,
				quantity: quantity,
				mTaxable: false,
				mOurCost: 0,
				mOurCostExtended: 0,
				mMarkup: 0,
				mCost: 0,
				mExtended: 0,
				mTax: 0,
				mTaxExtended: 0,
				laborTypeName: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].laborType : '',
				displayLaborName: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].displayName : '',
				lType: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0]._id : '',
				lHours: 0,
				lExtended: 0,
				lHoursExtended: 0,
				lRate: this.state.laborRatesData.length != 0 ? this.state.laborRatesData[0].rate : '',
				rowTotal: 0,
				header: '',
				unit: 0,
				itemTypeId: 2
			};
			let currentItemState = this.state.itemPricedData;
			currentItemState.push(pricedData);
			this.setState({
				itemPricedData: currentItemState,
				itemTab: '',
				materialTab: '',
				laborTab: 'active'
			});
			this.updateRevisionItems(currentItemState);
			$('#labor_add').modal('hide');
		}
	}

	handleHeaderAdd(e) {
		toastr.remove();
		let subheader = ReactDOM.findDOMNode(this.refs.head_txt.refs.subheader).value;
		if (subheader.trim() !== '') {
			let currentItem = {
				header: '',
				headerName: subheader,
				itemTypeId: 4
			};
			let currentState = this.state.itemPricedData;
			currentState.push(currentItem);
			this.updateRevisionItems(currentState);
			this.setState({ itemPricedData: currentState });
			$('#subheader_add').modal('hide');
		}
		else {
			toastr.error(message.VALID_SUBHEADER);
		}
	}

	handleShippingAdd(e) {
		toastr.remove();
		let itemDesc = ReactDOM.findDOMNode(this.refs.ship_desc.refs.description).value;
		let amount = ReactDOM.findDOMNode(this.refs.ship_desc.refs.amount).value;
		if (!amount || !(parseInt(amount) > 0)) {
			toastr.error(message.VALID_AMOUNT);
		} else {
			let itemData = {
				itemTypeId: 3,
				header: '',
				rowTotal: parseInt(amount),
				itemName: itemDesc
			};
			let currentState = this.state.itemPricedData;
			currentState.push(itemData);
			this.updateRevisionItems(currentState);
			this.setState({ itemPricedData: currentState });
			$('#shipping_add').modal('hide');
		}
	}

	updateDesc(index, dataType, e) {
		if (dataType == 'DESC') {
			let description = e.data;
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.itemName = description;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'ROWTOTAL') {
			let total = parseInt(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.rowTotal = total;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if(dataType=='SUB_HEAD'){			
			let currentRowData = [];
			currentRowData = this.state.itemPricedData;
			let currentRowItem=this.state.itemPricedData[index];
			currentRowItem.headerName=e.data;
			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
	}

	updateLineItemsTable(index, dataType, e) {
		if (dataType == 'QTY') {
			let quantity = parseInt(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.quantity = quantity;
			currentRowItem.mOurCostExtended = currentRowItem.mOurCost * quantity;
			currentRowItem.mExtended = currentRowItem.mCost * quantity;
			// currentRowItem.mTax = ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended);
			currentRowItem.mTax = currentRowItem.mTaxable ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.lHoursExtended = currentRowItem.lHours * quantity;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
			currentRowData.splice(index, 1, currentRowItem);
			// let index = peoples.findIndex(p => p.attr1 == "john")

			this.updateRevisionItems(currentRowData);
		}
		else if (dataType == 'DESC') {
			let description = e.data;
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.itemName = description;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'HOURS') {
			let hours = parseFloat(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.lHours = hours;
			currentRowItem.lHoursExtended = currentRowItem.lHours * currentRowItem.quantity;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
			currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'LABOR' || dataType == 'RATE') {
			let rate = parseInt(e.data);
			if(dataType=='RATE'){
				localStorage.setItem('laborRate',rate);
			}
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.lRate = rate;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
			currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
	}

	isTaxableUpdate(index, dataType, e) {
		if (dataType == 'TAXABLE') {
			let taxable = e.target.checked;
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.mTaxable = taxable;
			currentRowItem.mTax = taxable ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
	}

	handleLineTab(tabIndex) {

		if (tabIndex === 1) {
			this.setState({ itemTab: 'active', materialTab: '', laborTab: '' });
		}
		else if (tabIndex === 2) {
			this.setState({ itemTab: '', materialTab: 'active', laborTab: '' });
		}
		else if (tabIndex === 3) {
			this.setState({ itemTab: '', materialTab: '', laborTab: 'active' });
		}

		let self = this;
		let sortId = 'sortable';
		let droppedIndex = 0;
		if (tabIndex === 1) {
			sortId = 'sortable';
		} else if (tabIndex === 2) {
			sortId = 'sortable1';
		} else if (tabIndex === 3) {
			sortId = 'sortable2';
		}
		$('#' + sortId).sortable({
			handle: '.handle',
			update: function (event, ui) {

				let reorderArray = [];
				let idsInOrder = $('#' + sortId).sortable('toArray', { attribute: 'data-id' });
				idsInOrder.map(function (i) {
					reorderArray.push(self.state.itemPricedData[i]);
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
				self.setState({ itemPricedData: reorderArray });
				self.updateRevisionItems(reorderArray);
				$('#' + sortId).sortable('cancel');
			},
			change: function (event, ui) {

				let currentIndex = ui.placeholder.index();
				if (currentIndex > 1) {
					droppedIndex = currentIndex;
				}
			}
		});
	}

	handleLaborChange(index, select) {

		let currentLabor = select.laborType;
		let currentItemData = this.state.itemPricedData;
		currentItemData[index].lType = currentLabor._id;
		currentItemData[index].displayLaborName = currentLabor.displayName;
		currentItemData[index].laborTypeName = currentLabor.laborType;
		currentItemData[index].lRate = currentLabor.rate;
		this.setState({ itemPricedData: currentItemData });
		let res = {
			data: currentLabor.rate
		};
		this.updateLineItemsTable(index, 'LABOR', res);
	}

	onChangeGlobalTaxRate(e) {
		let taxrate = e.target.value;
		this.setState({ defaultTaxRate: taxrate });
	}

	handleGlobalTaxRate(e) {
		let taxrate = parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value);
		if ((taxrate >= 0 && taxrate <= 100) && this.state.itemPricedData.length !== 0) {
			let arr = this.state.itemPricedData;
			arr.forEach(function (item, index) {
				if (item.mTaxable)
					if (item.itemTypeId == 1 || item.itemTypeId == 2) {
						arr[index].mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * arr[index].mExtended) : 0;
						arr[index].mTaxExtended = arr[index].mExtended + arr[index].mTax;
						arr[index].rowTotal = arr[index].mTaxExtended + arr[index].lExtended;
					}
			}.bind(this));
			this.setState({
				itemPricedData: arr,
				defaultTaxRate: taxrate
			});
			this.updateRevisionItems(arr);
		}
		else if (isNaN(taxrate) || taxrate == '') {
			ReactDOM.findDOMNode(this.refs.taxRate).value = '9';
		}
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 200);
	}

	onChangeGlobalMarkup(e) {
		let markup = e.target.value;
		this.setState({ defaultMarkup: markup });
	}

	handleGlobalMarkup(e) {
		let markup = parseFloat(ReactDOM.findDOMNode(this.refs.defaultMarkup).value);
		if ((markup >= 0 && markup <= 100) && this.state.itemPricedData.length !== 0) {
			let arr = this.state.itemPricedData;
			arr.forEach(function (item, index) {
				if (item.itemTypeId == 1 || item.itemTypeId == 2) {
					arr[index].mMarkup = arr[index].mMarkup;
					arr[index].mCost = arr[index].mOurCost + ((arr[index].mMarkup / 100) * arr[index].mOurCost);
					arr[index].mExtended = arr[index].quantity * arr[index].mCost;
					arr[index].mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * arr[index].mExtended) : 0;
					arr[index].mTaxExtended = arr[index].mExtended + arr[index].mTax;
					arr[index].rowTotal = arr[index].mTaxExtended + arr[index].lExtended;
				}
			}.bind(this));
			this.setState({
				itemPricedData: arr,
				defaultMarkup: markup
			});
			this.updateRevisionItems(arr);
		}
		else if (markup == 0) {
			ReactDOM.findDOMNode(this.refs.defaultMarkup).value = '0';
		}
		else if (isNaN(markup)|| markup == '') {
			ReactDOM.findDOMNode(this.refs.defaultMarkup).value = '30';
		}
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 200);
	}

	onChangeMarkupCost(index, dataType, e) {
		if (dataType == 'MARKUP') {
			let markup = parseInt(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.mMarkup = validate.numberWithCommas((markup).toFixed(2));
			currentRowItem.mCost = currentRowItem.mOurCost + ((currentRowItem.mMarkup / 100) * currentRowItem.mOurCost);
			currentRowItem.mExtended = currentRowItem.quantity * currentRowItem.mCost;
			// currentRowItem.mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
			currentRowItem.mTax = currentRowItem.mTaxable ? ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0 : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'COST') {
			let cost = parseFloat(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.mCost = cost;
			currentRowItem.mMarkup = (((currentRowItem.mCost - currentRowItem.mOurCost) / currentRowItem.mOurCost) * 100);
			currentRowItem.mExtended = currentRowItem.quantity * currentRowItem.mCost;
			// currentRowItem.mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
			currentRowItem.mTax = currentRowItem.mTaxable ? ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0 : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

			currentRowData.splice(index, 1, currentRowItem);
			this.updateRevisionItems(currentRowData);
			this.setState({ itemPricedData: currentRowData });
		}
		else if(dataType=='OURCOST'){
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			let ourCost=parseFloat(e.data);
			currentRowItem.mOurCost=ourCost;
			currentRowItem.mOurCostExtended=ourCost*currentRowItem.quantity;
			currentRowItem.mCost=ourCost+((currentRowItem.mMarkup/100)*ourCost);

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
	}

	handleDelete(index) {
		this.setState({ itemDeleteIndex: index });
		$('#lineItem_delete').modal('show');
	}


	deletePricedItem() {
		if (this.state.itemDeleteIndex !== '') {
			$('#lineItem_delete').modal('hide');
			let currentState = this.state.itemPricedData;

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
			this.updateRevisionItems(currentState);
			// this.setState({
			//     itemPricedData: currentState,
			//     itemDeleteIndex: ''
			// })
			this.setState({
				itemPricedData: currentState,
				itemDeleteIndex: ''
			});
		}
	}

	getRevision(event, index) {
		let revisionType = event.target.value;
		if (revisionType == 'newRevision') {
			this.props.actions.getRevisionCount({ estimateId: this.props.params.estimateId });
			let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
			event.target.selectedIndex = res;
			let currentData = this.state.revisedItems;
			let currentRevisionLength = currentData.length;
			this.setState({
				isCheckedEmpty: false,
				isCheckedDuplicate: true,
				// revisionNo: currentRevisionLength
			});
			$('#add_revision').modal({ backdrop: 'static', keyboard: false });
		}
		else if (revisionType == 'nameRevision') {
			let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
			event.target.selectedIndex = res;
			let currentData = this.state.revisedItems;
			this.setState({ revisionName: currentData[res].revName ? currentData[res].revName : '' });
			$('#name_revision').modal({ backdrop: 'static', keyboard: false });
		}
		else if (revisionType == 'deleteRevision') {
			let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
			event.target.selectedIndex = res;
			let data = {
				revisionItemId: this.state.currentRevisionId
			};
			this.setState({ itemNotExists: true });
			this.props.actions.deleteRevision(data, res);
		}
		else {
			let currentRevisedList = this.state.revisedItems;
			let currentPricedData = this.state.revisedItems.find(o => o._id === revisionType);
			if(currentPricedData.revisionName=='Rev0'){
				this.setState({
					proposedServiceValue: RichTextEditor.createValueFromString(this.state.pvalue, 'html')
				});
			}else if(currentPricedData.proposedServices){
				var res = currentPricedData.proposedServices.toString('html');
				this.setState({
					proposedServiceValue: RichTextEditor.createValueFromString(res, 'html')
				});
			}else{
				this.setState({
					proposedServiceValue:  RichTextEditor.createEmptyValue()
				});
			}
			this.setState({
				itemPricedData: currentPricedData.lineItems,
				currentRevisionId: revisionType,
				revisionNotes: currentPricedData.revisionNotes ? currentPricedData.revisionNotes : ''
			});
		}
	}

	handleRadioUpdate(radioType, e) {
		if (radioType === 'EMPTY') {
			this.setState({
				isCheckedEmpty: true,
				isCheckedDuplicate: false
			});
		}
		else if (radioType === 'DUPLICATE') {
			this.setState({
				isCheckedEmpty: false,
				isCheckedDuplicate: true
			});
		}
	}

	updateRevisionItems(data) {
		let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
		let revisionName = this.state.revisedItems[res].revisionName;
		let currentRevised = this.state.revisedItems;
		currentRevised[res].lineItems = data;
		this.setState({
			revisedItems: currentRevised
		});

		let itemsTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
		let taxExtendedTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
		let materialCostTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
		let ourCostTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
		let mOurCostExtTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
		let materialExtendedTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
		let taxTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
		let hoursExtendedTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
		let laborExtendedTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		let rateTotal = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);
		let shippingTotal = data.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
		let markupTotal = materialExtendedTotal - mOurCostExtTotal;
		let materialCost = taxExtendedTotal;
		let laborCost = data.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		// let markupPercent = ((materialExtendedTotal - markupTotal) / markupTotal) * 100;
		let markupPercent=((materialExtendedTotal/mOurCostExtTotal)-1)*100;
		let grandTotal = materialExtendedTotal + laborExtendedTotal + taxTotal + shippingTotal;

		let revisionData = {
			revisionId: this.state.currentRevisionId,
			revisionName: revisionName,
			revisionNotes: this.state.revisionNotes,
			item: data,
			laborCost: laborCost,
			materialCost: materialCost,
			itemsTotal: itemsTotal,
			ourCostTotal: ourCostTotal,
			materialExtendedTotal: materialExtendedTotal,
			taxTotal: taxTotal,
			taxExtendedTotal: taxExtendedTotal,
			hoursExtendedTotal: hoursExtendedTotal,
			rateTotal: rateTotal,
			laborExtendedTotal: laborExtendedTotal,
			materialCostTotal: materialCostTotal,
			shippingTotal: shippingTotal,
			markUpPercent: markupPercent,
			markUpTotal: markupTotal,
			laborCost: laborCost,
			materialCost: materialCost,
			totalEstimate: grandTotal,
			modifiedBy: localStorage.userName,
			taxRate: ReactDOM.findDOMNode(this.refs.taxRate).value ? parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) : 0,
			markUp: ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value) : 0
		};

		// this.props.actions.updateEstimateRevision(revisionData);
	}

	addRevisionhandler() {

		if (this.state.isCheckedDuplicate) {
			if (ReactDOM.findDOMNode(this.refs.revised.refs.revision_name).value !== '0') {
				let currentRevisionId = ReactDOM.findDOMNode(this.refs.revised.refs.revision_name).value;
				let currentRevisedData = this.state.revisedItems.find(o => o._id === currentRevisionId);
				let revisionData = {
					companyId: localStorage.companyId,
					estimateId: this.props.params.estimateId,
					revisionName: 'Rev' + (this.state.revisionNo ? this.state.revisionNo : 0),
					item: currentRevisedData.lineItems,
					proposedServices:this.state.proposedServiceValue.toString('html')

				};
				this.setState({ itemNotExists: true });
				$('#add_revision').modal('hide');
				this.props.actions.addOtherRevision(revisionData, 2);
				let estimateId = {
					estimateId: this.props.params.estimateId
				};
				// this.props.actions.getRevisionList(estimateId);
			}
			else {
				toastr.error(message.SELECT_REVISION);
			}
		}
		else if (this.state.isCheckedEmpty) {
			let revisionData = {
				companyId: localStorage.companyId,
				estimateId: this.props.params.estimateId,
				revisionName: 'Rev' + this.state.revisionNo,
				item: [],
				proposedServices:this.state.proposedServiceValue.toString('html')

			};
			this.setState({ itemNotExists: true });
			$('#add_revision').modal('hide');
			this.props.actions.addOtherRevision(revisionData, 2);
		}
	}

	handleRevisionExport() {
		if (this.state.revisedItems.length != 0) {
			let res = this.state.currentRevisionId;
			if (res) {
				let data = {
					revisionId: res
				};
				this.props.actions.getExportedRevision(data);
			}
			else {
				toastr.error(message.LINE_ITEMS_EMPTY);
			}
		}
	}

	createItemHandler() {
		$('#add_item').modal('show');
	}

	addItemHandler() {
		if (jQuery('#add_other_item').valid()) {
			let itemName = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_name).value.trim();
			let modalNo = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_modalNo).value.trim();
			let partNo = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_partNo).value.trim();
			let mfg = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.item_manufacturer).value.trim();
			let supplierName = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.supplierName).value.trim();
			let listPrice = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.listPrice).value.trim();
			let dealerPrice = ReactDOM.findDOMNode(this.refs.itemEstimate.refs.dealerPrice).value.trim();

			let supplier = [{
				supplierName: supplierName,
				listPrice: listPrice.replace(/[^0-9.]/g, ''),
				dealerPrice: dealerPrice.replace(/[^0-9.]/g, ''),
				priceDate: moment(),
			}];

			let itemDetails = {
				companyId: localStorage.companyId,
				itemName: itemName,
				modal: modalNo,
				partNumber: partNo,
				manufacturer: mfg,
				itemStatus: 'Active',
				suppliers: supplier,
				createdBy: localStorage.userName
			};
			this.setState({ newAddedSupplier: supplier, newItemAddFlag: true });
			this.props.itemaction.createItemNew(itemDetails);
			$('#add_item').modal('hide');
			$('#lineitem_add').modal('hide');
		}
	}

	confirmationHandler() {
		$('#confirm_id').modal('hide');
	}

	getManufacturerList(e) {
		if (e.target.value && e.target.value.trim()) {
			this.setState({ manufacturerValue: e.target.value });
			let val = {
				companyId: localStorage.companyId,
				manufacturer: e.target.value.trim()
			};
			this.props.actions.getManufacturerList(val);
		} else {
			this.setState({ manufacturerList: [], manufacturerValue: '' });
		}
	}

	selectManufacturer(val) {
		this.setState({ manufacturerValue: val, manufacturerList: [] });
	}

	isStringValidNumber(string) {
		let number = parseInt(string);
		if (isNaN(number) || number < 0)
			return false;
		return number;
	}

	isStringValidLabor(string) {
		let number = parseFloat(string);
		if (isNaN(number) || number < 0) {
			return false;
		}
		else {
			return (number.toString());
		}
	}

	formatInteger(number) {
		return number.toString();
	}

	handleModalOpen(name) {
		let self = this;
		self.state.modalName = '';
		$(name).modal({ backdrop: 'static' });
		self.state.modalName = name;
	}

	handleContactPhoneChange(e) {
		this.setState({ new_phone: e.target.value });
	}

	revisionChangeHandler(e) {
		this.setState({ revisionName: e.target.value });
	}

	revisionNameHandler(type, e) {
		// let e1 = ReactDOM.findDOMNode(this.refs.name_revision);
		let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
		let currentData = this.state.revisedItems;
		if (type == 'SAVE') {
			if (this.state.revisionName.trim()) {
				let data = {
					revName: this.state.revisionName,
					revisionId: this.state.currentRevisionId
				};
				this.props.actions.renameRevision(data);
				currentData[res].revName = this.state.revisionName;
				this.setState({ revisedItems: currentData });
				$('#name_revision').modal('hide');
			}
			else {
				toastr.remove();
				toastr.error('Please enter a valid name for revision.');
			}
		}
		else if (type == 'REMOVE') {
			let data = {
				revName: '',
				revisionId: this.state.currentRevisionId
			};
			this.props.actions.renameRevision(data);
			currentData[res].revName = '';
			this.setState({ revisedItems: currentData });
			$('#name_revision').modal('hide');
		}
		else {
			this.setState({ revisionName: '' });
			$('#name_revision').modal('hide');
		}

	}

	getRevisionHeading() {
		let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
		let number = this.state.revisedItems[res].revisionName;
		let name = this.state.revisedItems[res].revName;
		let heading = '- ' + number + (name ? ' - ' + name : '');
		return heading;
	}

	onRevisionNoteChange(e) {
		this.setState({ revisionNotes: e.target.value });
	}

	handleRevisionNoteUpdate() {
		let revisionNote = this.state.revisionNotes;
		let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
		let currentState = this.state.revisedItems.slice();
		currentState[res].revisionNotes = revisionNote;
		this.updateRevisionItems(currentState[res].lineItems);
	}

	handleItemRefresh(id, lineItemId, index, e) {
		let res = this.state.revisedItems.findIndex(o => o._id === this.state.currentRevisionId);
		let currentRevisionState = this.state.revisedItems.slice();
		currentRevisionState[res].lineItems[index].spin = true;
		this.setState({ revisedItems: currentRevisionState });
		let data = {
			itemId: id,
			lineItemId: lineItemId,
			estimateItemId: this.state.currentRevisionId
		};
		this.props.actions.refreshLineItemName(data);
	}

	createEstimateHandler() {

		if (jQuery('#createEstimate').valid()) {

			// if (this.state.revisedItems.length != 0) {
			let itemsTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
			let taxExtendedTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
			let materialCostTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
			let ourCostTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
			let mOurCostExtTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
			let materialExtendedTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
			let taxTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
			let hoursExtendedTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
			let laborExtendedTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
			let rateTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);
			let shippingTotal = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
			let markupTotal = materialExtendedTotal - mOurCostExtTotal;
			let materialCost = taxExtendedTotal;
			let laborCost = this.state.revisedItems[0].lineItems.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
			if ((materialExtendedTotal == 0 && markupTotal == 0) || markupTotal == 0 || materialExtendedTotal == 0) {
				var markupPercent = 0;
			}
			else {// var markupPercent = ((materialExtendedTotal - markupTotal) / markupTotal) * 100;
				var markupPercent=((materialExtendedTotal/mOurCostExtTotal)-1)*100;
			}
			let grandTotal = materialExtendedTotal + laborExtendedTotal + taxTotal + shippingTotal;
			let items = this.state.revisedItems[0].lineItems;
			let estimateData = {
				companyId: localStorage.companyId,
				customerId: this.state.companyValue ? this.state.companyValue.value : '',
				estimateName: ReactDOM.findDOMNode(this.refs.name).value.trim(),
				opportunityId: this.state.opportunityValue ? this.state.opportunityValue : '',
				individualId: this.state.individualValue ? this.state.individualValue.value : '',
				proposalId: this.state.proposalValue ? this.state.proposalValue : '',
				projectId: this.state.projectValue ? this.state.projectValue : '',
				billingAddress1: ReactDOM.findDOMNode(this.refs.billAdd1).value.trim(),
				billingAddress2: ReactDOM.findDOMNode(this.refs.billAdd2).value.trim(),
				billingcity: ReactDOM.findDOMNode(this.refs.billCity).value.trim(),
				billingstate: ReactDOM.findDOMNode(this.refs.billState).value.trim(),
				billingzip: ReactDOM.findDOMNode(this.refs.billZip).value.trim(),
				shippingAddress1: ReactDOM.findDOMNode(this.refs.shipAdd1).value.trim(),
				shippingAddress2: ReactDOM.findDOMNode(this.refs.shipAdd2).value.trim(),
				shippingcity: ReactDOM.findDOMNode(this.refs.shipCity).value.trim(),
				shippingstate: ReactDOM.findDOMNode(this.refs.shipState).value.trim(),
				shippingzip: ReactDOM.findDOMNode(this.refs.shipZip).value.trim(),
				note: ReactDOM.findDOMNode(this.refs.note).value.trim(),
				// proposedServices: ReactDOM.findDOMNode(this.refs.proposed_services).value.trim(),
				proposedServices:this.state.proposedServiceValue.toString('html'),
				salesRep: this.state.salesrepValue ? this.state.salesrepValue.value : '',
				stage: ReactDOM.findDOMNode(this.refs.stageType).value,
				createdBy: localStorage.userName,
				revisionName: 'Rev0',
				item: items,
				revisionNotes: this.state.revisionNotes,
				taxRate: ReactDOM.findDOMNode(this.refs.taxRate).value ? parseInt(ReactDOM.findDOMNode(this.refs.taxRate).value) : 0,
				markUp: ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value) : 0,
				estimateNumber: this.state.estimateNumber,

				laborCost: laborCost,
				materialCost: materialCost,
				itemsTotal: itemsTotal,
				ourCostTotal: ourCostTotal,
				materialExtendedTotal: materialExtendedTotal,
				taxTotal: taxTotal,
				taxExtendedTotal: taxExtendedTotal,
				hoursExtendedTotal: hoursExtendedTotal,
				rateTotal: rateTotal,
				laborExtendedTotal: laborExtendedTotal,
				materialCostTotal: materialCostTotal,
				shippingTotal: shippingTotal,
				markUpPercent: markupPercent,
				markUpTotal: markupTotal,
				totalEstimate: grandTotal,
			};

			functions.showLoader('update_estimate');
			this
				.props
				.actions
				.createEstimate(estimateData);
			setTimeout(function () {

				$('div#update_estimate').unblock();
			}, 200);
			// }
			// else {
			// 	toastr.remove();
			// 	toastr.error(message.MIN_ITEM_ESTIMATE);
			// }
		}
	}

	render() {
		const toolbarConfig = {
			// Optionally specify the groups to display (displayed in the order listed).
			display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
			INLINE_STYLE_BUTTONS: [
				{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
				{label: 'Italic', style: 'ITALIC'},
				{label:'Strikethrough',style:'STRIKETHROUGH'},
				{label: 'Underline', style: 'UNDERLINE'}
			],
			// BLOCK_TYPE_DROPDOWN: [
			//   {label: 'Normal', style: 'unstyled'},
			//   {label: 'Heading Large', style: 'header-one'},
			//   {label: 'Heading Medium', style: 'header-two'},
			//   {label: 'Heading Small', style: 'header-three'}
			// ],
			BLOCK_TYPE_BUTTONS: [
				{label: 'Unordered List', style: 'unordered-list-item'},
				{label: 'Ordered List', style: 'ordered-list-item'}
			]
		};
		let clonedItemData = JSON.parse(JSON.stringify(this.state.itemPricedData));
		//Totals for Items,Materials,Labor 
		let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
		let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		let grandTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
		let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
		let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
		let mExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
		let mTaxTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
		let lHoursExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
		let lExtended = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		let lHoursTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
		let lRateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);

		//Totals Section
		let totalCost = mExtendedTotal;
		let totalTax = mTaxTotal;
		let totalShipping = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
		let markupTotal = mExtendedTotal - mOurCostExtTotal;
		// let markupPercent = ((materialTotal - markupTotal) / markupTotal) * 100;
		let markupPercent=((mExtendedTotal/mOurCostExtTotal)-1)*100;

		let estimateDetailData = this.state.estimateDetails;
		let stageData = '';
		let classData = '';

		if (estimateDetailData.length != 0) {
			if (estimateDetailData.class == 1) {
				classData = 'Demo-Class';
			} else {
				classData = '-';
			}
		}

		if (estimateDetailData.length != 0) {
			if (estimateDetailData.stage == 1) {
				stageData = 'Pre-Approved';
			}
			else if (estimateDetailData.stage == 2) {
				stageData = 'Approved';
			}
			else if (estimateDetailData.stage == 3) {

				stageData = 'In-Progress';
			}
			else if (estimateDetailData.stage == 4) {
				stageData = 'Dead';
			}
			else if (estimateDetailData.stage == 5) {
				stageData = 'In-Complete';
			}
			else if (estimateDetailData.stage == 6) {
				stageData = 'Complete';
			}
			else {
				stageData = '-';
			}
		}


		let countItem = 0;
		let countMaterial = 0;
		let countLabor = 0;

		let itemTabData = this.state.itemPricedData
			.map(function (i, index) {
				if (i.itemTypeId == 1) {
					countItem = countItem + 1;
				} else if (i.itemTypeId == 2) {
					countItem = countItem + 1;
				} else if (i.itemTypeId == 3) {
					countItem = countItem + 1;
				} else if (i.itemTypeId == 4) {
					countItem = countItem;
				}
				if (i.itemTypeId === 1) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td style={{ textAlign: 'center' }}>{countItem}</td>
							<td>{i.itemMfg}</td>
							<td>{i.modelNo ? i.modelNo : '-'}</td>
							<td>{i.partNo ? i.partNo : '-'}</td>
							<td style={{ textAlign: 'center', color: '#3598dc' }}>
								<RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateLineItemsTable.bind(this, index, 'DESC')}
								/>
								<LaddaButton className="pull-right refresh-icon-button"
									loading={i.spin}
									onClick={this.handleItemRefresh.bind(this, i.itemId, i._id, index)}
									data-color="#000"
									data-size={XS}
									data-style={ZOOM_IN}
									data-spinner-size={20}
									data-spinner-color="#000"
									data-spinner-lines={12}
								>
									<i className="icon-refresh font-dark"></i>
								</LaddaButton>
							</td>
							<td style={{ textAlign: 'center', color: '#3598dc' }}><RIENumber
								validate={this.isStringValidNumber}
								activeClassName="form-control input-small"
								classEditing="form-control input-xsmall"
								value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
								change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
							<td onClick={this.handleLineTab.bind(this, 2)}
								style={{ textAlign: 'right', cursor: 'pointer' }}>
								{i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}
							</td>
							<td onClick={this.handleLineTab.bind(this, 3)}
								style={{ textAlign: 'right', cursor: 'pointer' }}>
								{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
							<td style={{ textAlign: 'right' }}>
								{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>
					);
				}
				else if (i.itemTypeId === 2) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td style={{ textAlign: 'center' }}>{countItem}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'center', color: '#3598dc' }}>
								<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'DESC')}
								/>
							</td>
							<td style={{ textAlign: 'center', color: '#3598dc' }}><RIENumber
								validate={this.isStringValidNumber}
								activeClassName="form-control input-small"
								classEditing="form-control input-xsmall"
								value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
								change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'right', color: '#3598dc' }}>$
								<RIEInput activeClassName="form-control input-xsmall"
									classEditing="form-control"
									value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
									change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
								/>
							</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>
					);
				}
				else if (i.itemTypeId === 3) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td style={{ textAlign: 'center' }}>{countItem}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'center', color: '#3598dc' }}>
								<b>Shipping</b>:<RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'DESC')}
								/>
							</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'right', color:'#3598dc' }}>$
								<RIEInput activeClassName="form-control input-xsmall"
									classEditing="form-control"
									value={i.rowTotal ? validate.numberWithCommas((i.rowTotal).toFixed(2)) : '0'} propName="data"
									change={this.updateDesc.bind(this, index, 'ROWTOTAL')}
								/>
							</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td className="unselectable-header" colSpan="9" style={{  color: '#3598dc' }}>
								<RIEInput activeClassName="form-control input-xlarge"
									classEditing="form-control"
									value={i.headerName ? i.headerName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'SUB_HEAD')}
								/>
								{/* {i.headerName} */}
							</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>
					);
				}
			}.bind(this));

		let materialTabData = this
			.state
			.itemPricedData
			.map(function (i, index) {
				if (i.itemTypeId == 1) {
					countMaterial = countMaterial + 1;
				} else if (i.itemTypeId == 2) {
					countMaterial = countMaterial + 1;
				} else if (i.itemTypeId == 3) {
					countMaterial = countMaterial + 1;
				} else if (i.itemTypeId == 4) {
					countMaterial = countMaterial;
				}
				if (i.itemTypeId === 1) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td onClick={this.handleLineTab.bind(this, 1)} style={{ textAlign: 'right', cursor: 'pointer' }}>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td style={{ textAlign: 'center',color: '#3598dc'}}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td style={{ textAlign: 'center' }}>
							<div className="md-checkbox" style={{ marginLeft: '8px' }}>
								<input type="checkbox" id={index}
									className="md-check"
									checked={i.mTaxable} value={i.mTaxable}
									onChange={this.isTaxableUpdate.bind(this, index, 'TAXABLE')}
									style={{ minWidth: 60 }} />
								<label htmlFor={index}>
									<span className="inc"></span>
									<span className="check"></span>
									<span className="box"></span>
								</label>
							</div>
						</td>
						{/* <td style={{ textAlign: 'right' }}>
                            {i.mOurCost ? '$' + validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0}</td> */}
						<td style={{ textAlign: 'right', color: '#3598dc' }}>
                            $<RIEInput
								disabled={false}
								validate={this.isStringValidNumber}
								activeClassName="form-control input-small"
								classEditing="form-control input-small"
								format={this.formatInteger}
								value={i.mOurCost ? validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0} propName="data"
								change={this.onChangeMarkupCost.bind(this, index, 'OURCOST')}
								style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} />
						</td>
						<td style={{ textAlign: 'right' }}>
							{i.mOurCostExtended ? '$' + validate.numberWithCommas((i.mOurCostExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}><RIEInput
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							format={this.formatInteger}
							value={i.mMarkup ? (i.mMarkup.toString()) : '0'} propName="data"
							change={this.onChangeMarkupCost.bind(this, index, 'MARKUP')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}>$<RIEInput
							validate={this.isStringValidNumber}
							format={this.formatInteger}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.mCost ? (i.mCost).toFixed(2) : '$' + 0} propName="data"
							change={this.onChangeMarkupCost.bind(this, index, 'COST')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'right' }}>
							{i.mExtended ? '$' + validate.numberWithCommas((i.mExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.mTax ? '$' + validate.numberWithCommas((i.mTax).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}</td>
						<td onClick={this.handleLineTab.bind(this, 3)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>
							{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 2) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}>
							<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td style={{ textAlign: 'center', color: '#3598dc' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td style={{ textAlign: 'right' }}>
							{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}
						</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 3) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}>
							<b>Shipping: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td className="unselectable-header" colSpan="13" style={{  color: '#3598dc' }}>
								<RIEInput activeClassName="form-control input-xlarge"
									classEditing="form-control"
									value={i.headerName ? i.headerName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'SUB_HEAD')}
								/>
								{/* {i.headerName} */}
							</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>
					);
				}
			}.bind(this));

		let laborTabData = this
			.state
			.itemPricedData
			.map(function (i, index) {
				if (i.itemTypeId == 1) {
					countLabor = countLabor + 1;
				} else if (i.itemTypeId == 2) {
					countLabor = countLabor + 1;
				} else if (i.itemTypeId == 3) {
					countLabor = countLabor + 1;
				} else if (i.itemTypeId == 4) {
					countLabor = countLabor;
				}
				if (i.itemTypeId === 1) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countLabor ? countLabor : ''}</td>
						<td onClick={this.handleLineTab.bind(this, 1)} style={{ textAlign: 'right', cursor: 'pointer' }}>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td style={{ textAlign: 'center', color: '#3598dc' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td onClick={this.handleLineTab.bind(this, 2)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>
							{i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ color: '#3598dc' }}>
							<RIESelect
								change={this.handleLaborChange.bind(this, index)}
								value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
								options={this.state.laborRatesData}
								propName="laborType"
							/>
						</td>
						<td style={{ textAlign: 'center',color: '#3598dc'}}><RIEInput
							validate={this.isStringValidLabor}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lHours > -1 ? (i.lHours.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
						<td style={{ textAlign: 'right' ,color: '#3598dc'}}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'RATE')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'right' }}>
							{i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 2) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countLabor ? countLabor : ''}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}>
							<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td style={{ textAlign: 'center', color:'#3598dc' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td className="unselectable">{''}</td>
						<td style={{color:'#3598dc'}}>
							<RIESelect
								change={this.handleLaborChange.bind(this, index)}
								value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
								options={this.state.laborRatesData}
								propName="laborType"
							/>
						</td>
						<td style={{ textAlign: 'center', color: '#3598dc' }}><RIENumber
							validate={this.isStringValidLabor}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lHours > 0 ? (i.lHours.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lRate ? (i.lRate.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'RATE')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'right' }}>
							{i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 3) {
					return (<tr key={index} data-id={index}>
						<td><span className="handle"><i className="fa fa-bars"></i></span></td>
						<td>{countLabor ? countLabor : ''}</td>
						<td style={{ textAlign: 'right', color: '#3598dc' }}>
							<b>Shipping: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
						<td>
							<span className="btn btn-icon-only red"
								onClick={this.handleDelete.bind(this, index)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td className="unselectable-header" colSpan="11" style={{ color: '#3598dc' }}>
								<RIEInput activeClassName="form-control input-xlarge"
									classEditing="form-control"
									value={i.headerName ? i.headerName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'SUB_HEAD')}
								/>
								{/* {i.headerName} */}
							</td>
							<td>
								<span className="btn btn-icon-only red"
									onClick={this.handleDelete.bind(this, index)}>
									<i className="fa fa-trash-o"></i>
								</span>
							</td>
						</tr>
					);
				}
			}.bind(this));


		let sum = [];
		clonedItemData.forEach(function (o) {
			let existing = sum.filter(function (i) {
				if (i.itemTypeId !== 3 && i.itemTypeId !== 4) {
					return i.laborTypeName === o.laborTypeName;
				}
			})[0];
			if (!existing) {
				sum.push(o);
			}
			else {
				// existing.lHours += o.lHours;
				existing.lHours = parseFloat(existing.lHours) + parseFloat(o.lHours);
				existing.lExtended += o.lExtended;
			}
		});
		let totalHours = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + parseFloat(next.lHours) : prev, 0);
		let totalRate = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);

		let laborTotalMore = sum.map(function (labor, index) {
			if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
				return <tr key={index}>
					<th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
					<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((labor.lExtended).toFixed(2))}</td>
				</tr>;
			}
		}.bind(this));

		let laborHoursMore = sum.map(function (labor, index) {
			if (labor.itemTypeId !== 3 && labor.itemTypeId !== 4) {
				return <tr key={index}>
					<th colSpan="1" style={{ textAlign: 'right' }}>-{labor.laborTypeName}</th>
					<td style={{ textAlign: 'right' }}>{labor.lHours}</td>
				</tr>;
			}
		}.bind(this));

		let searchedItems = this.state.itemOptions
			.map(function (i, index) {
				return <tr key={index}>
					<td>{i.manufacturer ? i.manufacturer : '-'}</td>
					<td>{i.modal ? i.modal : '-'}</td>
					<td>{i.partNumber ? i.partNumber : '-'}</td>
					<td>{i.itemName ? i.itemName : '-'}</td>
					<td><button type="button" className="btn btn-xs green" onClick={this.handleItemSubmit.bind(this, index)}>Select item</button>
					</td>
				</tr>;
			}.bind(this));
		let supplierData = this.state.supplierData
			.map(function (supplier, index) {
				return <tr key={index}>
					<td>{supplier.supplierName ? supplier.supplierName : '-'}</td>
					<td>{supplier.dealerPrice ? supplier.dealerPrice : '-'}</td>
					<td>{supplier.listPrice ? supplier.listPrice : '-'}</td>
					<td>{supplier.demoPrice ? supplier.demoPrice : '-'}</td>
					<td><button type="button" className="btn btn-xs green" onClick={this.handleLineItemAdd.bind(this, index, '')}>Select supplier</button>
					</td>
				</tr>;
			}.bind(this));
		let opportunitiesData = this.state.opportunityOptions
			.map(function (opportunity, index) {
				return <option key={index} value={opportunity._id}>{opportunity.title}</option>;
			}.bind(this));

		let projectData = this.state.projectOptions
			.map(function (project, index) {
				return <option key={index} value={project._id}>{project.title}</option>;
			}.bind(this));

		let proposalData = this.state.proposalOptions
			.map(function (proposal, index) {
				return <option key={index} value={proposal._id}>{proposal.proposalNumber}</option>;
			}.bind(this));

		let revisionList = this.state.revisedItems
			.map(function (revision, index) {
				return <option key={index} value={revision._id}>{revision.revisionName + (revision.revName ? ' - ' + revision.revName : '')}</option>;
			}.bind(this));

		let mfgList = this.state.manufacturerList.map(function (mfg) {
			return <li onClick={this.selectManufacturer.bind(this, mfg)}><a>{mfg}</a></li>;
		}.bind(this));

		let estimateStagesData = this.props.estimateStages
			.map(function (stage, index) {
				return <option key={index} value={stage._id}>{stage.stageName}</option>;
			}.bind(this));
		return (
			<div>
				<div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#estimate-add" data-toggle="tab">
                                    Estimate
								</a>
							</li>
							{/* <div className="text-right" style={{ position: 'fixed', right: '50px', zIndex: '99' }}> */}
							<div className="text-right">
								<Link to={'/estimate/' + this.props.params.estimateId} className="btn red">
                                    Cancel </Link>&nbsp;&nbsp;
								<button type="button" className="btn blue" onClick={this.handleSave.bind(this, index)}>Save</button>
								{/* createEstimateHandler */}
							</div>
						</ul>
					</div>
					<div className="portlet light bordered" id="update_estimate">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="estimate-add">
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">General Details</span>
										</div>
									</div>
									<form role="form" id="createEstimate">
										<div className="form-body">
											<div className="row">
												<div className="col-md-6 col-sm-6 col-xs-12">
													<SingleSelect
														parentDivClass={'form-group form-md-line-input form-md-floating-label'}
														defaultValue={this.state.opportunityOptions.length ? this.state.opportunityValue : ''}
														key={this.state.opportunityOptions.length ? this.state.opportunityValue : ''}
														className='form-control edited'
														handleOnChange={this.handleOpportunityChange}
														title='Opportunity'
														name='opportunity'
														options={opportunitiesData}
														ref='opportunity'
														id='opportunity'
														htmlFor='opportunity'
														placeholder='Select'
														required={false}
														defaultSelect={true}
														other={false}
													/>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="salesrep">Sales Rep<span className="required">*</span></label>
														<span className="pull-right">
															<i className="fa fa-plus-circle fa-2x"
																aria-hidden="true" onClick={this.handleNewContactModal.bind(this, 'SALES')}></i></span>
														<Select
															disabled={this.state.disabled}
															value={this.state.salesrepValue}
															placeholder="Sales Rep"
															name="salesrep"
															id="salesrep"
															options={this.state.salesrepOptions}
															onBlur={this.handleSelectsBlur}
															onChange={this.handleSalesRepChange}
															onInputChange={this.onSalesRepInputChange}
														/>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													{/* <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="customer"
                                                            name="customer"
                                                            defaultValue={this.state.companyValue.label ? this.state.companyValue.label : ""}
                                                            key={this.state.companyValue.label}
                                                            onChange={this.handleCompanyChange}
                                                           />
                                                           removed disabled from above 
                                                        <label htmlFor="customer">Customer<span className="required">*</span></label>
                                                    </div> */}
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="individual">Customer<span className="required">*</span>
														</label>
														{this.state.opportunityValue ? null : <span className="pull-right">
															<i className="fa fa-plus-circle fa-2x"
																aria-hidden="true"></i></span>}
														{/* disabled={this.state.opportunityValue ? true : false} */}
														{/* onClick={this.handleNewCompanyModal.bind(this, 'COMPANY')} */}
														<Select
															value={this.state.companyValue}
															name="company"
															id="company"
															options={this.state.companyOptions}
															onChange={this.handleCompanyChange}
															onBlur={this.handleSelectsBlur}
															onInputChange={this.onCompanyInputChange} />
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="individual">Customer Contact</label>
														<span className="pull-right">
															<i className="fa fa-plus-circle fa-2x"
																aria-hidden="true" onClick={this.handleNewContactModal.bind(this, 'INDIVIDUAL')}></i></span>
														<Select
															disabled={this.state.disabled}
															value={this.state.individualValue}
															placeholder="Individual"
															name="individual"
															id="individual"
															options={this.state.individualOptions}
															onFocus={this.onContactFocus}
															onChange={this.handleIndividualChange}
															onBlur={this.handleSelectsBlur}
															onInputChange={this.onIndividualInputChange}
														/>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<input
															type="text"
															className="form-control"
															id="name"
															name="name"
															ref="name"
															defaultValue={this.state.estimateDetails.estimateName ? this.state.estimateDetails.estimateName : ''}
															key={this.state.estimateDetails.estimateName ? this.state.estimateDetails.estimateName : ''} />
														<label htmlFor="name">Estimate Name<span className="required">*</span></label>
													</div>
												</div>
											</div>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Billing Address</span>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="billAdd1"
															name="billAdd1"
															defaultValue={this.state.addressDetails.mapAddress1}
															key={this.state.addressDetails.mapAddress1}></TextareaAutosize>
														<label htmlFor="billAdd1">Address 1</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="billAdd2"
															name="billAdd2"
															defaultValue={this.state.addressDetails.mapAddress2}
															key={this.state.addressDetails.mapAddress2}></TextareaAutosize>
														<label htmlFor="billAdd2">Address 2</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="billCity"
															name="billCity"
															defaultValue={this.state.addressDetails.city}
															key={this.state.addressDetails.city}></TextareaAutosize>
														<label htmlFor="billCity">City</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="billState"
															name="billState"
															defaultValue={this.state.addressDetails.state}
															key={this.state.addressDetails.state}></TextareaAutosize>
														<label htmlFor="billState">State</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="billZip"
															name="billZip"
															defaultValue={this.state.addressDetails.zip}
															key={this.state.addressDetails.zip}></TextareaAutosize>
														<label htmlFor="billZip">Zip</label>
													</div>
												</div>
											</div>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Shipping Address</span>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="shipAdd1"
															name="shipAdd1"
															defaultValue={this.state.shipAddressDetails.mapAddress1}
															key={this.state.shipAddressDetails.mapAddress1}
														></TextareaAutosize>
														<label htmlFor="shipAdd1">Address 1</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="shipAdd2"
															name="shipAdd2"
															defaultValue={this.state.shipAddressDetails.mapAddress2}
															key={this.state.shipAddressDetails.mapAddress2}
														></TextareaAutosize>
														<label htmlFor="shipAdd2">Address 2</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="shipCity"
															name="shipCity"
															defaultValue={this.state.shipAddressDetails.city}
															key={this.state.shipAddressDetails.city}
														></TextareaAutosize>
														<label htmlFor="shipCity">City</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="shipState"
															name="shipState"
															defaultValue={this.state.shipAddressDetails.state}
															key={this.state.shipAddressDetails.state}
														></TextareaAutosize>
														<label htmlFor="shipState">State</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="shipZip"
															name="shipZip"
															defaultValue={this.state.shipAddressDetails.zip}
															key={this.state.shipAddressDetails.zip}
														></TextareaAutosize>
														<label htmlFor="shipZip">Zip</label>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<select className="form-control edited" id="stageType" ref="stageType" defaultValue={this.state.estimateDetails.stage ? this.state.estimateDetails.stage._id ? this.state.estimateDetails.stage._id : '1' : '1'} key={this.state.estimateDetails.stage ? this.state.estimateDetails.stage._id ? this.state.estimateDetails.stage._id : '1' : '1'}>
															{/* <option value="1">Pre-Approved</option>
                                                            <option value="2">Approved</option>
                                                            <option value="3">In-Progress</option>
                                                            <option value="4">Dead</option>
                                                            <option value="5">In-Complete</option>
                                                            <option value="6">Complete</option> */}
															{estimateStagesData}
														</select>
														<label htmlFor="stage">Stage</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<MaskedInput
															mask={taxRateMask}
															className="form-control"
															guide={false}
															name="defaultMarkup"
															id="defaultMarkup"
															ref="defaultMarkup"
															htmlFor="defaultMarkup"
															value={this.state.defaultMarkup}
															onBlur={this.handleGlobalMarkup}
														/>
														<label htmlFor="defaultMarkup">Default Markup(%)</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="project">Project</label>
														<select
															key={this.state.projectValue}
															value={this.state.projectValue ? this.state.projectValue : ''}
															onChange={this.handleProjectChange}
															className="form-control">
															<option value='0'>Select</option>
															{projectData}
														</select>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<label htmlFor="proposal">Proposal</label>
														<select
															key={this.state.proposalValue ? this.state.proposalValue : ''}
															value={this.state.proposalValue ? this.state.proposalValue : ''}
															onChange={this.handleProposalChange}
															className="form-control">
															<option value='0'>Select</option>
															{proposalData}
														</select>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={1}
															ref="note"
															name="note"
															defaultValue={this.state.estimateDetails.note ? this.state.estimateDetails.note : ''}
															key={this.state.estimateDetails.note ? this.state.estimateDetails.note : '-'}
														>
														</TextareaAutosize>
														<label htmlFor="note">Estimate Notes
														</label>
													</div>
												</div>
												{/* <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <TextareaAutosize
                                                            style={{ resize: 'none' }}
                                                            className="form-control"
                                                            rows={6}
                                                            ref="proposed_services"
                                                            name="proposed_services"
                                                            defaultValue={this.state.estimateDetails.proposedServices ? this.state.estimateDetails.proposedServices : ''}
                                                            key={this.state.estimateDetails.proposedServices ? this.state.estimateDetails.proposedServices : '-'}
                                                        >
                                                        </TextareaAutosize>
                                                    </div>
                                                </div> */}
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<MaskedInput
															mask={taxRateMask}
															className="form-control"
															guide={false}
															name="taxRate"
															id="taxRate"
															ref="taxRate"
															htmlFor="taxRate"
															value={this.state.defaultTaxRate}
															onBlur={this.handleGlobalTaxRate} />
														<label htmlFor="taxRate">Tax Rate(%)</label>
													</div>
												</div>
											</div>
										</div>
									</form>
									<div className="row">
										<div className="col-md-6 col-sm-6 col-xs-12" style={{    marginBottom: 10 }}>
											<label htmlFor="proposed_services">Proposed Services (visible on quote)</label>
											<RichTextEditor
												toolbarConfig={toolbarConfig}
												value={this.state.proposedServiceValue}
												onChange={this.onChange}
												className="Summernote"
												id="summernote" />
										</div>
									</div>                                
									<div className="portlet light portlet-fit portlet-datatable bordered">
										<div className="portlet light bordered">
											<div className="portlet-title tabbable-line">
												<div className="caption">
													<i className="icon-share font-dark"></i>
													<span className="caption-subject font-dark bold uppercase">Line Items</span>
												</div>
												{this.state.revisedItems.length != 0 ?
													[<label key="0"
														style={{ margin: '10px 0px 0px 10px' }}
														className="font-dark bold">
														{this.getRevisionHeading()}
													</label>,
													<button key="1" onClick={this.handleRevisionExport}
														className="btn green-haze btn-circle btn-sm pull-right"
														style={{ marginTop: '13px', marginLeft: '8px' }}>
                                                        Export
													</button>]
													: null}
												<div className="form-group pull-right"
													style={{ width: '15%', marginTop: '5px' }}>
													<select className="form-control"
														defaultValue={this.state.currentRevisionId}
														key={this.state.currentRevisionId}
														onChange={this.getRevision}>
														{revisionList}
														<option style={{ backgroundColor: '#D3D3D3' }} value='newRevision'>Add Revision</option>
														<option style={{ backgroundColor: '#D3D3D3' }} value='nameRevision'>Name Selected Revision</option>
														{revisionList.length > 1 ? <option style={{ backgroundColor: '#D3D3D3' }} value='deleteRevision'>Delete Revision</option> : null}
													</select>
												</div>
												<ul className="nav nav-tabs">
													<li className={this.state.itemTab}>
														<a href="#portlet_tab1" data-toggle="tab" onClick={this.handleLineTab.bind(this, 1)}> Items </a>
													</li>
													<li className={this.state.materialTab}>
														<a href="#portlet_tab2" data-toggle="tab" onClick={this.handleLineTab.bind(this, 2)}> Material </a>
													</li>
													<li className={this.state.laborTab}>
														<a href="#portlet_tab3" data-toggle="tab" onClick={this.handleLineTab.bind(this, 3)}> Labor </a>
													</li>
												</ul>
											</div>
											<div className="portlet-body">
												<div className="tab-content">
													<div className={'tab-pane' + ' ' + this.state.itemTab} id="portlet_tab1">
														<div className="row">
															<div className="col-md-12">
																<div className="table-container table-responsive" style={{ overflow: 'auto' }}>
																	<table className="table table-striped table-bordered lineitem" id="lineitem">
																		<thead >
																			<tr>
																				<th className="items"></th>
																				<th className="items">#</th>
																				<th className="items">Mfg</th>
																				<th className="items">Model No</th>
																				<th className="items">Part No</th>
																				<th className="items">Desc</th>
																				<th className="items">Qty</th>
																				<th className="material" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
																				<th className="labor" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
																				<th className="rowtotal">Row Total</th>
																				<th className="items"></th>
																			</tr>
																		</thead>
																		<tbody id="sortable">
																			{itemTabData}
																		</tbody>
																		{this.state.itemPricedData.length != 0 ? <tfoot>
																			<tr>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>
																					{mExtendedTotal ? '$' + validate.numberWithCommas((mExtendedTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{laborTotal ? '$' + validate.numberWithCommas((laborTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</td>
																				<td></td>
																			</tr>
																		</tfoot> : null}
																	</table>
																</div>
															</div>
														</div>
													</div>
													<div className={'tab-pane' + ' ' + this.state.materialTab} id="portlet_tab2">
														<div className="row">
															<div className="col-md-12">
																<div className="table-container table-responsive" style={{ overflow: 'auto' }}>
																	<table className="table table-striped table-bordered lineitem" id="lineitem">
																		<thead >
																			<tr>
																				<th className="items" rowSpan="2"></th>
																				<th className="items" rowSpan="2">#</th>
																				<th className="items" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 1)}>Item</th>
																				<th className="items" rowSpan="2">Qty</th>
																				<th className="material" colSpan="8">Material</th>
																				<th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
																				<th className="rowtotal" rowSpan="2">Row Total</th>
																				<th className="items" rowSpan="2"></th>
																			</tr>
																			<tr>
																				<th className="material">Tax</th>
																				<th className="material">Our Cost</th>
																				<th className="material">Our Cost Ext</th>
																				<th className="material">Mark Up</th>
																				<th className="material">Cost</th>
																				<th className="material">Extended</th>
																				<th className="material">Tax</th>
																				<th className="material">Tax Extended</th>
																			</tr>
																		</thead>
																		<tbody id="sortable1">
																			{materialTabData}
																		</tbody>
																		{this.state.itemPricedData.length != 0 ? <tfoot>
																			<tr>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>{mOurCostExtTotal ? '$' + validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : ''}</td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>
																					{mExtendedTotal ? '$' + validate.numberWithCommas((mExtendedTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{mTaxTotal ? '$' + validate.numberWithCommas((mTaxTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{laborTotal ? '$' + validate.numberWithCommas((laborTotal).toFixed(2)) : '$' + 0}</td>
																				<td style={{ textAlign: 'right' }}>
																					{grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</td>
																				<td></td>
																			</tr>
																		</tfoot> : null}
																	</table>
																</div>
															</div>
														</div>
													</div>
													<div className={'tab-pane' + ' ' + this.state.laborTab} id="portlet_tab3">
														<div className="row">
															<div className="col-md-12">
																<div className="table-container table-responsive" style={{ overflow: 'auto' }}>
																	<table className="table table-striped table-bordered lineitem" id="lineitem">
																		<thead >
																			<tr>
																				<th className="items" rowSpan="2"></th>
																				<th className="items" rowSpan="2">#</th>
																				<th className="items" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 1)}>Item</th>
																				<th className="items" rowSpan="2">Qty</th>
																				<th className="material" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
																				<th className="labor" colSpan="6">Labor</th>
																				<th className="rowtotal" rowSpan="2">Row Total</th>
																				<th className="items" rowSpan="2"></th>
																			</tr>
																			<tr>
																				<th className="labor">Type</th>
																				<th className="labor">Hrs</th>
																				<th className="labor">Hrs Ext</th>
																				<th className="labor">Rate</th>
																				<th className="labor">Unit</th>
																				<th className="labor">Extended</th>
																			</tr>
																		</thead>
																		<tbody id="sortable2">
																			{laborTabData}
																		</tbody>
																		{this.state.itemPricedData.length != 0 ? <tfoot>
																			<tr>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>
																					{materialTotal ? '$' + validate.numberWithCommas((materialTotal).toFixed(2)) : '$' + 0}</td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'center' }}>
																					{lHoursExtended ? (lHoursExtended.toFixed(2)) : ''}</td>
																				<td style={{ textAlign: 'right' }}><span>
																					{/* {lRateTotal ? '$' + validate.numberWithCommas((lRateTotal).toFixed(2)) : '$' + 0} */}
																				</span></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}><span>
																					{lExtended ? '$' + validate.numberWithCommas((lExtended).toFixed(2)) : '$' + 0}</span></td>
																				<td style={{ textAlign: 'right' }}><span>
																					{grandTotal ? '$' + validate.numberWithCommas((grandTotal).toFixed(2)) : '$' + 0}</span></td>
																				<td></td>
																			</tr>
																		</tfoot> : null}
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject font-dark bold">Add Line Item:</span>
												</div>&nbsp;&nbsp;
												<a onClick={this.handleModalOpen.bind(this, '#lineitem_add')}
													data-backdrop="static" data-keyboard="false"
													className="btn btn-sm btn-circle green">
													<i className="icon-plus"></i>
                                                    Material
												</a>&nbsp;&nbsp;
												<a onClick={this.handleModalOpen.bind(this, '#labor_add')}
													data-backdrop="static" data-keyboard="false"
													className="btn btn-sm btn-circle blue">
													<i className="icon-plus"></i>
                                                    Labor
												</a>&nbsp;&nbsp;
												<a onClick={this.handleModalOpen.bind(this, '#subheader_add')}
													data-backdrop="static" data-keyboard="false"
													className="btn btn-sm btn-circle yellow">
													<i className="icon-plus"></i>
                                                    Sub-Header
												</a>&nbsp;&nbsp;
												<a onClick={this.handleModalOpen.bind(this, '#shipping_add')}
													data-backdrop="static" data-keyboard="false"
													className="btn btn-sm btn-circle purple">
													<i className="icon-plus"></i>
                                                    Shipping
												</a>
											</div>
											{/* Revision  notes */}
											<div className="row">
												<div className="col-md-12 col-sm-12 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<TextareaAutosize
															style={{ resize: 'none' }}
															className="form-control"
															rows={2}
															ref="revisionNotes"
															name="revisionNotes"
															value={this.state.revisionNotes}
															onChange={this.onRevisionNoteChange}
															onBlur={this.handleRevisionNoteUpdate}>
														</TextareaAutosize>
														<label htmlFor="revisionNotes">Revision Notes
														</label>
													</div>
												</div>
											</div>
											{/* Total section starts*/}
											{this.state.itemPricedData.length != 0 ? <div className="row">
												<div className="col-md-4">
													<table className="table table-striped table-bordered">
														<caption className="font-dark bold uppercase">Material</caption>
														<tbody>
															<tr>
																<th colSpan="1">Cost</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Our Cost Ext Total</th>
																<td style={{ textAlign: 'right' }}>${mOurCostExtTotal ? validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : 0}</td>
															</tr>
															<tr>
																<th colSpan="1">Tax</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Shipping</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Total</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Markup %</th>
																<td style={{ textAlign: 'right' }}>{isNaN(markupPercent) ? 0 : (markupPercent).toFixed(2)}%</td>
															</tr>
															<tr>
																<th colSpan="1">Markup Total</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((markupTotal).toFixed(2))}</td>
															</tr>
														</tbody>
													</table>
												</div>
												<div className="col-md-4">
													<table className="table table-striped table-bordered">
														<caption className="font-dark bold uppercase">Labor</caption>
														<tbody>
															<tr>
																<th colSpan="1">Total&nbsp;<span onClick={this.handleExpand.bind(this, 'TOTAL')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandTotal ? ' (less...)' : '(more...)'}</span></th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
															</tr>
															{this.state.expandTotal ? laborTotalMore : null}
															<tr>
																<th colSpan="1">Hours&nbsp;<span onClick={this.handleExpand.bind(this, 'HOURS')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandHours ? ' (less...)' : '(more...)'}</span></th>
																<td style={{ textAlign: 'right' }}>{totalHours}</td>
															</tr>
															{this.state.expandHours ? laborHoursMore : null}
														</tbody>
													</table>
												</div>
												<div className="col-md-4">
													<table className="table table-striped table-bordered">
														<caption className="font-dark bold uppercase">Total</caption>
														<tbody>
															<tr>
																<th colSpan="1">Material</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Labor</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalRate).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Tax</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalTax).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Shipping</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalShipping).toFixed(2))}</td>
															</tr>
															<tr>
																<th className="caption-subject font-dark bold uppercase" colSpan="1">Grand Total</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal + totalRate + totalTax + totalShipping).toFixed(2))}</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div> : null}
											{/* Total section ends */}
										</div>
									</div>
								</div>

								<AddMaterial
									materialAddId="lineitem_add"
									onItemInputChange={this.onItemInputChange}
									itemOptions={this.state.itemOptions}
									searchedItems={searchedItems}
									handlePopUpClose={this.handlePopUpClose.bind(this, 'item')}
									createItemHandler={this.createItemHandler.bind(this, 'item')} />

								<AddHeader ref="head_txt" headerAddId="subheader_add" handleHeaderAdd={this.handleHeaderAdd} />

								<AddShipping ref="ship_desc" shippingAddId="shipping_add" handleShippingAdd={this.handleShippingAdd} />

								<AddLabor
									ref="labr_desc"
									laborAddId="labor_add"
									handleLaborAdd={this.handleLaborAdd} />

								<div id="supplier_add" className="modal fade" tabIndex="-1" aria-hidden="true">
									<div className="modal-dialog ">
										<div className="modal-content">
											<div className="modal-header">
												<div className="caption">
													<span className="caption-subject bold uppercase">Select Supplier</span>
												</div>
											</div>
											<div className="modal-body">
												<div className="row">
													<div className="col-md-12">
														<div className="table-container table-responsive" style={{ height: '150px', overflow: 'auto' }}>
															<table className="table table-striped table-bordered">
																<thead >
																	<tr>
																		<th>Name</th>
																		<th>Dealer Price</th>
																		<th>List Price</th>
																		<th>Demo Price</th>
																		<th>Action</th>
																	</tr>
																</thead>
																<tbody>
																	{supplierData}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div className="modal-footer">
												<button
													type="button"
													className="btn dark btn-outline"
													onClick={this.handlePopUpClose.bind(this, 'supplier')}>Close</button>
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
								<AddItemModal
									mfgList={mfgList}
									onInputChange={this.getManufacturerList}
									manufacturerValue={this.state.manufacturerValue}
									itemModalId="add_item"
									addItemHandler={this.addItemHandler}
									ref="itemEstimate"
									handlePopUpClose={this.handlePopUpClose.bind(this, 'newItem')}
								/>
								<DeleteModal deleteModalId="lineItem_delete" deleteUserHandler={this.deletePricedItem} />
								<ConfirmModal duplicateModalId="duplicate_save" duplicateEstimate={this.duplicateEstimateHandler} />
								<AddRevision
									revisionModalId="add_revision"
									isCheckedDuplicate={this.state.isCheckedDuplicate}
									isCheckedEmpty={this.state.isCheckedEmpty}
									addRevision={this.addRevisionhandler}
									revisionNo={this.state.revisionNo}
									radioHandler={this.handleRadioUpdate}
									revisedItems={revisionList}
									ref={'revised'}
								/>
								<ConfirmationModal
									confirmationId="confirm_id"
									confirmationTitle=""
									confirmationText="Are you sure you want to create a new item in the database ?"
									confirmationHandler={this.confirmationHandler}
								/>
								<RevisionModal
									modalId="name_revision"
									revName={this.state.revisionName}
									revisionChangeHandler={this.revisionChangeHandler}
									revisionNameHandler={this.revisionNameHandler}
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
		estimateNo: state.estimate.estimateNo,
		companyList: state.estimate.companyList,
		projectList: state.estimate.projectList,
		proposalList: state.estimate.proposalList,
		companyPhoneInternet: state.estimate.companyPhoneInternet,
		salesRepList: state.estimate.salesRepList,
		individualList: state.estimate.individualList,
		opportunityList: state.estimate.opportunityList,
		estimateDetail: state.estimate.estimateDetails,
		itemList: state.estimate.itemList,
		itemDetail: state.itemCreation.itemDetailData,
		contactDetails: state.estimate.contactDetails,
		laborRates: state.estimate.laborRates,
		newIndividualCreated: state.estimate.individualCreated,
		newSalesCreated: state.estimate.salesCreated,
		revisionData: state.estimate.revisionData,
		newCreatedItem: state.estimate.newCreatedItem,
		ManufacturerList: state.estimate.manufacturerList,
		revisionNo: state.estimate.revisionNo,
		updatedName: state.estimate.updatedName,
		estimateStages: state.estimate.estimateStages
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(estimateActions, dispatch),
		itemaction: bindActionCreators(itemActions, dispatch),
		contactactions: bindActionCreators(createContactAction, dispatch),
		settingsActions: bindActionCreators(settingsActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(EstimateDetail);