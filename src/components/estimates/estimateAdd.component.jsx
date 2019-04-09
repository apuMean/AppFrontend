import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import autoBind from 'react-autobind';
import MaskedInput from 'react-text-mask';
import _ from 'lodash';
import AddContactModal from '../common/newContactModal.component';
import AddCompanyModal from '../common/newCompanyModal.component';
import { RIEInput, RIETextArea, RIENumber, RIESelect } from 'riek';
import TextareaAutosize from 'react-autosize-textarea';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as createContactAction from '../../actions/createContactAction';
import * as estimateActions from '../../actions/estimateActions';
import * as opportunityAction from '../../actions/opportunityAction';
import * as settingsActions from '../../actions/settingsActions';
import * as itemActions from '../../actions/itemAction';
import * as proposalActions from '../../actions/proposalActions';
import * as validate from '../common/validator';
import * as types from '../../constants/actionTypes';
import * as appValid from '../../scripts/app';
import * as layout from '../../scripts/app';
import SingleInput from '../shared/SingleInput';
import DeleteModal from '../common/deleteModal.component';
import jQuery from 'jquery';
import '../../styles/bootstrap-fileinput.css';
import moment from 'moment';
import AddItemModal from '../common/addItemModal.component';
import ConfirmationModal from '../common/confirmationModal.component';
import * as functions from '../common/functions';
import AddMaterial from '../common/materialAddModal';
import AddShipping from '../common/shippingAddModal';
import AddHeader from '../common/headerAddModal';
import AddLabor from '../common/laborAddModal';
import * as message from '../../constants/messageConstants';
import { taxRateMask } from '../../constants/customMasks';
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
class EstimateAdd extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			supplierData: [],
			itemPricedData: [],
			showItemSearch: {
				display: 'none'
			},
			taxRate: 1.8,
			disabled: false,
			itemDetails: [],
			items: [],
			companyValue: '',
			individualValue: '',
			proposalValue: '',
			projectValue: '', itemValue: '',
			opportunityValue: '',
			salesrepValue: '',
			companyPhone: '',
			companyInternet: '',
			addressDetails: {
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
			itemOptions: [],
			estimateTotal: '',
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
			newItemAdded: '',
			newItemAddFlag: false,
			newAddedSupplier: '',
			manufacturerList: [],
			manufacturerValue: '',
			modalName: '',
			new_phone: '',
			query: '',
			customerValue: '',
			laborModalValue: '',
			estimateNumber: '',
			proposedServiceValue: RichTextEditor.createEmptyValue(),
			pageRedirect: ''
		};
	}

	componentDidMount() {
		appValid.FormValidationMd.init();

		if (localStorage.contactEstId) {
			let contact = {
				contactId: localStorage.contactEstId
			};
			this
				.props
				.contactactions
				.getContact(contact);
		}
		if (localStorage.oppEstId) {
			let opportunityId = {
				opportunityId: localStorage.oppEstId
			};
			this
				.props
				.oppActions
				.getOppDetailValues(opportunityId);
		}
		if (this.props.params.proposalId) {
			let proposalId = {
				proposalId: this.props.params.proposalId
			};
			this.props.actions.getProposalDetails(proposalId);
		}

		let self = this;
		let pageId = document.getElementById('create_estimate');
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

	componentWillMount() {
		let companyId = {
			companyId: localStorage.companyId
		};
		let params = {
			companyId: localStorage.companyId,
			moduleType: 1
		};

		this.props.actions.getLaborRates(companyId, types.GET_LABOR_RATE);
		this.props.actions.getOpportunityList(companyId);
		this.props.actions.getProjectData(companyId);
		this.props.actions.getProposalData(companyId);
		this.props.actions.getEstimateNo(companyId);
		this.props.settingsActions.getEstimateStages(params);

		let data = {
			parent: 'Estimates',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
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
				this.props.contactactions.getCompanyList(this.state.query);
			}
		}, 350);


	}

	componentWillUnmount() {
		localStorage.setItem('contactEstId', '');
		localStorage.setItem('oppEstId', '');
	}


	componentWillReceiveProps(nextProps) {
		let company = [];
		let project = [];
		let individual = [];
		let salesrep = [];
		let opportunity = [];
		let item = [];
		let laborData = [];
		let addressDetail = '';
		let addr = {
			mapAddress1: '',
			mapAddress2: '',
			city: '',
			state: '',
			zip: ''
		};
		let currentProposalId = '';
		if (localStorage.contactEstId && company.length == 0 && individual.length == 0) {
			if (nextProps.createcontact) {
				let addrss = nextProps.createcontact.addressInfo[0];
				addr = {
					mapAddress1: addrss.mapAddress1,
					mapAddress2: addrss.mapAddress2,
					city: addrss.city,
					state: addrss.state,
					zip: addrss.zip
				};

				if (nextProps.createcontact.userType == '2') {
					let companyVal = {
						value: nextProps.createcontact.companyContactId,
						label: nextProps.createcontact.companyName
					};
					let individualVal = {
						value: nextProps.createcontact._id,
						label: nextProps.createcontact.firstname + ' ' + nextProps.createcontact.lastname
					};

					this.setState({ companyValue: companyVal, individualValue: individualVal });

				} else if (nextProps.createcontact.userType == '1') {
					let companyVal = {
						value: nextProps.createcontact._id,
						label: nextProps.createcontact.companyName
					};
					this.setState({ companyValue: companyVal, addressDetails: addr });
				}
				if (nextProps.createcontact.opportunitiesInfo.length > 0) {
					this.setState({ addressDetails: addr });
				} else {
					toastr.error(message.CREATE_OPPORTUNITY);
				}
			}
		}

		let projectList = nextProps
			.projectList
			.map(function (list, index) {
				let obj = {
					id: list._id,
					label: list.title
				};
				project.push(obj);
			}.bind(this));

		let companyList = nextProps
			.companyList
			.map(function (list, index) {
				let obj = {
					value: list._id,
					label: list.companyName
				};
				company.push(obj);
			}.bind(this));
		let individualList = nextProps
			.individualList
			.map(function (list, index) {
				let obj = {
					value: list._id,
					label: list.firstname + ' ' + list.lastname
				};
				individual.push(obj);
			}.bind(this));
		let salesrepList = nextProps
			.salesRepList
			.map(function (list, index) {
				let obj = {
					value: list._id,
					label: list.firstname + ' ' + list.lastname
				};
				salesrep.push(obj);
			}.bind(this));

		let opportunityList = nextProps
			.opportunityList
			.map(function (list, index) {
				let obj = {
					id: list._id,
					label: list.opportunityNumber,
					// label: list.title,
					customerId: list.contactId
				};
				opportunity.push(obj);
			}.bind(this));

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
					rate: localStorage.laborRate ? localStorage.laborRate : list.rate
					// rate: list.rate
				};
				laborData.push(obj);
			}.bind(this));

		if (nextProps.itemList.length !== 0) {
			let itemList = this.state.query ? nextProps.itemList : [];
			this.setState({
				itemOptions: itemList
			});
		} else {
			this.setState({
				itemOptions: []
			});
		}
		if (nextProps.companyPhoneInternet.length != 0) {
			addressDetail = nextProps
				.companyPhoneInternet
				.map(function (address, index) {
					if (address.isPrimary) {
						addr = address.mapAddress1 + ' , ' + address.mapAddress2 + ' , ' + address.city + ' , ' + address.state + ' , ' + address.zip;
					}
				}.bind(this));
			this.setState({ addressDetails: addr });
		}

		if (nextProps.contactDetails) {

			let contactDetailState = JSON.parse(JSON.stringify(nextProps.contactDetails));
			let res = contactDetailState
				.addressInfo
				.find(function (d) {
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
				label: contactDetailState.companyName
			};
			this.setState({ companyValue: obj });
			this.setState({ addressDetails: addr });

		}

		if (nextProps.companyCreated && this.state.newContactData === 'C') {
			let customer = {
				value: nextProps.companyCreated.id,
				label: nextProps.companyCreated.label
			};
			this.setState({
				companyValue: customer,
				newContactData: ''
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

			this.setState({
				newItemAddFlag: false
			});
			this.state.newItemAdded = newItemAdded;
			this.handleLineItemAdd('', newAddedSupplier);
		}

		if (nextProps.estimateNo) {
			this.setState({ estimateNumber: nextProps.estimateNo });
		}
		if (nextProps.createProposalData != undefined) {
			let prevRoute = nextProps.createProposalData.redirectValue;
			// debugger
			let proposalstate = JSON.parse(JSON.stringify(nextProps.createProposalData));
			let cvalue = {
				value: proposalstate.customerId ? proposalstate.customerId : '',
				label: proposalstate.customerName
			};

			let ivalue = {
				value: proposalstate.individualId ? proposalstate.individualId : '',
				label: proposalstate.individualName
			};
			// let svalue = {
			// 	value: proposalstate.salesRepId ? proposalstate.salesRepId : '',
			// 	label: proposalstate.salesRepName
			// };
			// currentProposalId=proposalstate._id;
			this.setState({
				companyValue: cvalue,
				individualValue: ivalue,
				// salesrepValue:svalue,
				disabled: true,
				pageRedirect: prevRoute
			});
		}


		this.setState({
			companyOptions: company,
			projectOptions: nextProps.projectList,
			proposalOptions: nextProps.proposalList,
			individualOptions: individual,
			salesrepOptions: salesrep,
			opportunityOptions: nextProps.opportunityList,
			laborRatesData: laborData,
			manufacturerList: nextProps.ManufacturerList
		});
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
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
		// debugger
		this.setState({ proposedServiceValue: value });
	}
	handleIndividualChange(value) {
		this.setState({ individualValue: value });
	}

	// handleCompanyChange(value) {
	//     debugger;
	//     if (value) {
	//         this.setState({ companyValue: value })
	//         let data = {
	//             contactId: value.id
	//         }
	//         this.props.actions.getCustomerDetails(data);
	//     }
	//     else {
	//         this.setState({ companyValue: '', individualValue: '', addressDetails: '' })
	//     }
	// }

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
			// ReactDOM.findDOMNode(this.refs.name.refs.name).value = currentData.title;
			ReactDOM.findDOMNode(this.refs.name.refs.name).value = currentData.opportunityNumber;
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
			ReactDOM.findDOMNode(this.refs.name.refs.name).value = '';
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

	handleItemChange(value) {

		this.setState({ itemValue: value });
		// this.setState({ unitPriceValue: value.unitPrice });
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 200);
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

	handleLaborChange(index, select) {

		let currentLabor = select.laborType;
		// let currentLabor = this.state.laborRatesData.find(o => o.value === value);
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
		let mOurCost = currentSupplier.dealerPrice ? parseFloat(currentSupplier.dealerPrice) : 0;
		let mOurCostExtended = mOurCost * quantity;
		let mMarkup = ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value).toFixed(1) : ((30).toFixed(1));
		let mCost = mOurCost + ((mMarkup / 100) * mOurCost);
		let mExtended = quantity * mCost;
		let mTax = ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * mExtended) : 0;
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
		$('#lineitem_add').modal('hide');
		$('#supplier_add').modal('hide');

	}

	updateLineItemsTable(index, dataType, e) {
		if (dataType == 'QTY') {
			let quantity = parseInt(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.quantity = quantity;
			currentRowItem.mOurCostExtended = currentRowItem.mOurCost * quantity;
			currentRowItem.mExtended = currentRowItem.mCost * quantity;
			currentRowItem.mTax = currentRowItem.mTaxable ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.lHoursExtended = currentRowItem.lHours * quantity;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'DESC') {
			let description = e.data;
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.itemName = description;

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'HOURS') {

			let hours = parseFloat(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.lHours = hours.toFixed(2);
			currentRowItem.lHoursExtended = currentRowItem.lHours * currentRowItem.quantity;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
			currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'LABOR' || dataType == 'RATE') {
			let rate = parseInt(e.data);
			if (dataType == 'RATE') {
				localStorage.setItem('laborRate', rate);
			}
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.lRate = rate;
			currentRowItem.lExtended = currentRowItem.lHoursExtended * currentRowItem.lRate;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;
			currentRowItem.unit = currentRowItem.lRate * currentRowItem.lHours;
			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });

		}
	}

	isTaxableUpdate(index, dataType, e) {
		if (!functions.checkValidMarkAndTax(parseFloat(ReactDOM.findDOMNode(this.refs.defaultMarkup).value.trim()), parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value.trim()))) {
			toastr.error(message.MARKUP_TAXRATE_VALID);
		}
		else {
			if (dataType == 'TAXABLE') {
				let taxable = e.target.checked;
				let currentRowData = this.state.itemPricedData;
				let currentRowItem = this.state.itemPricedData[index];
				currentRowItem.mTaxable = taxable;
				currentRowItem.mTax = taxable ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0;
				currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
				currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

				currentRowData.splice(index, 1, currentRowItem);
				this.setState({ itemPricedData: currentRowData });
			}
		}
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
		}
		else if (markup == 0) {
			ReactDOM.findDOMNode(this.refs.defaultMarkup).value = '0';
		}
		else if (isNaN(markup) || markup == '') {
			ReactDOM.findDOMNode(this.refs.defaultMarkup).value = '30';
		}
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 200);
	}

	handleGlobalTaxRate(e) {
		let taxrate = ReactDOM.findDOMNode(this.refs.taxRate).value;
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

	onChangeMarkupCost(index, dataType, e) {

		if (dataType == 'MARKUP') {
			let markup = parseFloat(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.mMarkup = validate.numberWithCommas((markup).toFixed(2));
			// if (currentRowItem.mMarkup == 0) {
			// 	currentRowItem.mCost = currentRowItem.mOurCost + currentRowItem.mOurCost;
			// } else {
			// 	currentRowItem.mCost = currentRowItem.mOurCost + ((currentRowItem.mMarkup / 100) * currentRowItem.mOurCost);
			// }
			currentRowItem.mCost = currentRowItem.mOurCost + ((currentRowItem.mMarkup / 100) * currentRowItem.mOurCost);
			currentRowItem.mExtended = currentRowItem.quantity * currentRowItem.mCost;
			currentRowItem.mTax = currentRowItem.mTaxable ? ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0 : 0;
			currentRowItem.mTaxExtended = currentRowItem.mExtended + currentRowItem.mTax;
			currentRowItem.rowTotal = currentRowItem.mTaxExtended + currentRowItem.lExtended;

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'COST') {

			let cost = parseFloat(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.mCost = cost;
			currentRowItem.mMarkup = (((currentRowItem.mCost - currentRowItem.mOurCost) / currentRowItem.mOurCost) * 100).toFixed(2);
			currentRowItem.mExtended = (currentRowItem.quantity * currentRowItem.mCost);
			currentRowItem.mTax = currentRowItem.mTaxable ? ReactDOM.findDOMNode(this.refs.taxRate).value ? ((parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) / 100) * currentRowItem.mExtended) : 0 : 0;
			currentRowItem.mTaxExtended = (currentRowItem.mExtended + currentRowItem.mTax);
			currentRowItem.rowTotal = (currentRowItem.mTaxExtended + currentRowItem.lExtended);

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'OURCOST') {
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			let ourCost = parseFloat(e.data);
			currentRowItem.mOurCost = ourCost;
			currentRowItem.mOurCostExtended = ourCost * currentRowItem.quantity;
			currentRowItem.mCost = ourCost + ((currentRowItem.mMarkup / 100) * ourCost);

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
	}

	handleNewContactModal(dataType) {
		toastr.remove();
		if (this.state.companyValue) {
			this.setState({ contactAddType: dataType, new_phone: '' });
			$('#add-contact').modal({ backdrop: 'static', keyboard: false });
		}
		else {
			toastr.error(message.REQUIRED_CUSTOMER);
		}
	}

	handleNewCompanyModal(dataType) {
		toastr.remove();
		ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value = '';
		this.setState({ contactAddType: dataType, customerValue: '' });
		$('#add-company').modal({ backdrop: 'static', keyboard: false });
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
			if (phoneVal !== '') {
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
			} else {
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
			toastr.error(message.REQUIRED_CUSTOMER);
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
			this.setState({ itemPricedData: currentState });
			$('#shipping_add').modal('hide');
		}
	}

	handleLaborAdd(e) {
		toastr.remove();
		let laborTypeId = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_type).value;
		let initialLaborType = this.state.laborRatesData.find(o => o._id === laborTypeId);
		let itemDesc = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_description).value.trim();
		// let quantity = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_quantity).value.trim();
		let quantity = 1;
		let laborHours = ReactDOM.findDOMNode(this.refs.labr_desc.refs.labor_hours).value.trim();

		if (!itemDesc.trim()) {
			toastr.error(message.REQUIRED_DESCRIPTION);
			// } else if (!quantity || !(parseInt(quantity) > 0)) {
			//     toastr.error(message.VALID_QUANTITY);
			// } else if (!laborHours || !(parseFloat(laborHours) > 0)) {
		} else if (!laborHours || !(parseFloat(laborHours) > 0)) {
			toastr.error(message.VALID_LABOR_HOURS);
		} else if (initialLaborType) {
			let lHoursExtended = (parseInt(quantity)) * ((parseFloat(laborHours)).toFixed(2));
			let labor = laborHours ? (parseFloat(laborHours)).toFixed(2) : 0;
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
				laborTypeName: this.state.laborRatesData.length != 0 ? initialLaborType.laborType : '',
				displayLaborName: this.state.laborRatesData.length != 0 ? initialLaborType.displayName : '',
				lType: this.state.laborRatesData.length != 0 ? initialLaborType._id : '',
				lHours: labor,
				lExtended: this.state.laborRatesData.length != 0 ? (initialLaborType.rate * lHoursExtended) : 0,
				lHoursExtended: lHoursExtended,
				lRate: this.state.laborRatesData.length != 0 ? initialLaborType.rate : '',
				rowTotal: 0,
				header: '',
				unit: this.state.laborRatesData.length != 0 ? (initialLaborType.rate * labor) : 0,
				itemTypeId: 2
			};
			let currentItemState = this.state.itemPricedData.slice();
			currentItemState.push(pricedData);
			this.setState({
				itemPricedData: currentItemState,
				itemTab: '',
				materialTab: '',
				laborTab: 'active'
			});
			$('#labor_add').modal('hide');
		}
		else {
			toastr.error(message.ERROR_OCCURRED);
		}
	}

	updateDesc(index, dataType, e) {

		if (dataType == 'DESC') {
			let description = e.data;
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.itemName = description;

			currentRowData.splice(index, 1, currentRowItem);
			this.setState({ itemPricedData: currentRowData });
		}
		else if (dataType == 'ROWTOTAL') {
			let total = parseInt(e.data);
			let currentRowData = this.state.itemPricedData;
			let currentRowItem = this.state.itemPricedData[index];
			currentRowItem.rowTotal = total;

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
			this.setState({
				itemPricedData: currentState,
				itemDeleteIndex: ''
			});
		}
	}

	createItemHandler() {
		// $('#confirm_id').modal('show');
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
		$('#add_item').modal('show');
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
		let markup = parseFloat(ReactDOM.findDOMNode(this.refs.defaultMarkup).value.trim());
		let taxrate = parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value.trim());
		if (isNaN(number) || number < 0) {
			return false;
		}
		else if (!functions.checkValidMarkAndTax(markup, taxrate)) {
			return false;
		}
		else {
			return number;
		}
	}
	isStringValidMarkup(string) {
		let number = parseInt(string);
		if (isNaN(number) || number < 0)
			return false;
		// return number this was not applicable for 0 cause it was considered false so returned true.
		return true;
	}
	isStringValidLabor(string) {
		let number = parseFloat(string);
		let markup = ReactDOM.findDOMNode(this.refs.defaultMarkup).value.trim();
		let taxrate = ReactDOM.findDOMNode(this.refs.taxRate).value.trim();
		if (isNaN(number) || number < 0) {
			return false;
		}
		else if (!functions.checkValidMarkAndTax(markup, taxrate)) {
			return false;
		}
		else {
			return (number.toString());
		}
	}

	// isStringNumber(string) {
	//     let number = parseInt(string)
	//     if (isNaN(number) || number <= 0) return false;
	//     return number;
	// }

	formatInteger(number) {
		return number.toString();
	}

	handleModalOpen(name) {
		let self = this;
		self.state.modalName = '';
		self.state.laborModalValue = this.state.laborRatesData[0]._id;
		$(name).modal({ backdrop: 'static' });
		self.state.modalName = name;
	}

	handleContactPhoneChange(e) {
		this.setState({ new_phone: e.target.value });
	}

	handleCustomerChange(value) {
		this.setState({ customerValue: value });
	}

	handleCompanyAdd() {
		toastr.remove();
		let companyName = ReactDOM.findDOMNode(this.refs.companyChild.refs.new_customer).value.trim();
		if (companyName) {
			let data = {
				userId: localStorage.userId,
				companyId: localStorage.companyId,
				parentContactId: this.state.customerValue ? this.state.customerValue.id : '',
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

	handleModalLabor(e) {
		this.setState({ laborModalValue: e.target.value });
	}
	// 	emptyState(e){
	// this.props.actions.emptyState();
	// 	}
	estimateHandler(e) {

		e.preventDefault();
		if (jQuery('#createEstimate').valid()) {
			if (this.state.itemPricedData.length != 0) {
				let items = [];
				let itemsTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.rowTotal : prev, 0);
				let taxExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
				let materialCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
				let ourCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
				let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
				let materialExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mExtended : prev, 0);
				let taxTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTax : prev, 0);
				let hoursExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHoursExtended : prev, 0);
				let laborExtendedTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
				let rateTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lRate : prev, 0);
				let shippingTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId === 3) ? prev + next.rowTotal : prev, 0);
				let markupTotal = materialExtendedTotal - mOurCostExtTotal;
				let materialCost = taxExtendedTotal;
				let laborCost = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
				// let markupPercent = ((materialExtendedTotal - markupTotal) / markupTotal) * 100;
				let markupPercent = ((materialExtendedTotal / mOurCostExtTotal) - 1) * 100;
				let grandTotal = materialExtendedTotal + laborExtendedTotal + taxTotal + shippingTotal;

				let estimateData = {
					companyId: localStorage.companyId,
					customerId: this.state.companyValue ? this.state.companyValue.value : '',
					estimateName: ReactDOM.findDOMNode(this.refs.name.refs.name).value.trim(),
					opportunityId: this.state.opportunityValue ? this.state.opportunityValue : '',
					individualId: this.state.individualValue ? this.state.individualValue.value : '',
					proposalId: this.state.proposalValue ? this.state.proposalValue : '',
					projectId: this.state.projectValue ? this.state.projectValue : '',
					billingAddress1: ReactDOM.findDOMNode(this.refs.billAdd1).value.trim(),
					billingAddress2: ReactDOM.findDOMNode(this.refs.billAdd2).value.trim(),
					billingcity: ReactDOM.findDOMNode(this.refs.billCity.refs.billCity).value.trim(),
					billingstate: ReactDOM.findDOMNode(this.refs.billState.refs.billState).value.trim(),
					billingzip: ReactDOM.findDOMNode(this.refs.billZip.refs.billZip).value.trim(),
					shippingAddress1: ReactDOM.findDOMNode(this.refs.shipAdd1).value.trim(),
					shippingAddress2: ReactDOM.findDOMNode(this.refs.shipAdd2).value.trim(),
					shippingcity: ReactDOM.findDOMNode(this.refs.shipCity.refs.shipCity).value.trim(),
					shippingstate: ReactDOM.findDOMNode(this.refs.shipState.refs.shipState).value.trim(),
					shippingzip: ReactDOM.findDOMNode(this.refs.shipZip.refs.shipZip).value.trim(),
					note: ReactDOM.findDOMNode(this.refs.note).value.trim(),
					// proposedServices: ReactDOM.findDOMNode(this.refs.proposed_services).toString("html"),
					proposedServices: this.state.proposedServiceValue.toString('html'),
					salesRep: this.state.salesrepValue ? this.state.salesrepValue.value : '',
					stage: ReactDOM.findDOMNode(this.refs.stageType).value,
					createdBy: localStorage.userName,
					revisionName: 'Rev0',
					item: this.state.itemPricedData,
					laborCost: laborCost,
					materialCost: materialCost,
					revisionNotes: ReactDOM.findDOMNode(this.refs.revisionNotes).value.trim(),
					//Totals Section
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
					taxRate: ReactDOM.findDOMNode(this.refs.taxRate).value ? parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) : 0,
					markUp: ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value) : 0,
					estimateNumber: this.state.estimateNumber
				};
				functions.showLoader('create_estimate');

				this.props.actions.createEstimate(estimateData, this.state.pageRedirect);

			}
			else {

				let estimateData = {
					companyId: localStorage.companyId,
					customerId: this.state.companyValue ? this.state.companyValue.value : '',
					estimateName: ReactDOM.findDOMNode(this.refs.name.refs.name).value.trim(),
					opportunityId: this.state.opportunityValue ? this.state.opportunityValue : '',
					individualId: this.state.individualValue ? this.state.individualValue.value : '',
					proposalId: this.state.proposalValue ? this.state.proposalValue : '',
					projectId: this.state.projectValue ? this.state.projectValue : '',
					billingAddress1: ReactDOM.findDOMNode(this.refs.billAdd1).value.trim(),
					billingAddress2: ReactDOM.findDOMNode(this.refs.billAdd2).value.trim(),
					billingcity: ReactDOM.findDOMNode(this.refs.billCity.refs.billCity).value.trim(),
					billingstate: ReactDOM.findDOMNode(this.refs.billState.refs.billState).value.trim(),
					billingzip: ReactDOM.findDOMNode(this.refs.billZip.refs.billZip).value.trim(),
					shippingAddress1: ReactDOM.findDOMNode(this.refs.shipAdd1).value.trim(),
					shippingAddress2: ReactDOM.findDOMNode(this.refs.shipAdd2).value.trim(),
					shippingcity: ReactDOM.findDOMNode(this.refs.shipCity.refs.shipCity).value.trim(),
					shippingstate: ReactDOM.findDOMNode(this.refs.shipState.refs.shipState).value.trim(),
					shippingzip: ReactDOM.findDOMNode(this.refs.shipZip.refs.shipZip).value.trim(),
					note: ReactDOM.findDOMNode(this.refs.note).value.trim(),
					// proposedServices: ReactDOM.findDOMNode(this.refs.proposed_services).toString("html"),
					proposedServices: this.state.proposedServiceValue.toString('html'),
					salesRep: this.state.salesrepValue ? this.state.salesrepValue.value : '',
					stage: ReactDOM.findDOMNode(this.refs.stageType).value,
					createdBy: localStorage.userName,
					revisionName: 'Rev0',
					revisionNotes: ReactDOM.findDOMNode(this.refs.revisionNotes).value.trim(),
					//Totals Section
					taxRate: ReactDOM.findDOMNode(this.refs.taxRate).value ? parseFloat(ReactDOM.findDOMNode(this.refs.taxRate).value) : 0,
					markUp: ReactDOM.findDOMNode(this.refs.defaultMarkup).value ? parseInt(ReactDOM.findDOMNode(this.refs.defaultMarkup).value) : 0,
					estimateNumber: this.state.estimateNumber
				};
				functions.showLoader('create_estimate');

				this.props.actions.createEstimate(estimateData, this.state.pageRedirect);
				// toastr.error(message.MIN_ITEM_ESTIMATE);
			}
			return false;
		}
	}

	render() {
		const toolbarConfig = {
			// Optionally specify the groups to display (displayed in the order listed).
			display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
			INLINE_STYLE_BUTTONS: [
				{ label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
				{ label: 'Italic', style: 'ITALIC' },
				{ label: 'Strikethrough', style: 'STRIKETHROUGH' },
				{ label: 'Underline', style: 'UNDERLINE' }
			],
			// BLOCK_TYPE_DROPDOWN: [
			//   {label: 'Normal', style: 'unstyled'},
			//   {label: 'Heading Large', style: 'header-one'},
			//   {label: 'Heading Medium', style: 'header-two'},
			//   {label: 'Heading Small', style: 'header-three'}
			// ],
			BLOCK_TYPE_BUTTONS: [
				{ label: 'Unordered List', style: 'unordered-list-item' },
				{ label: 'Ordered List', style: 'ordered-list-item' }
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
		// let markupPercent = (markupTotal * 100) / materialTotal;
		let markupPercent = ((mExtendedTotal / mOurCostExtTotal) - 1) * 100;

		total = 0;
		laborCost = 0;
		materialCost = 0;
		equipmentCost = 0;
		otherCost = 0;

		let opportunitiesData = this.state.opportunityOptions
			.map(function (opportunity, index) {
				return <option key={index} value={opportunity._id}>{opportunity.opportunityNumber}</option>;
			}.bind(this));

		let projectData = this.state.projectOptions
			.map(function (project, index) {
				return <option key={index} value={project._id}>{project.title}</option>;
			}.bind(this));

		let proposalData = this.state.proposalOptions
			.map(function (proposal, index) {
				return <option key={index} value={proposal._id}>{proposal.proposalNumber}</option>;
			}.bind(this));

		let estimateStagesData = this.props.estimateStages
			.map(function (stage, index) {
				return <option key={index} value={stage._id}>{stage.stageName}</option>;
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

		let countItem = 0;
		let countMaterial = 0;
		let countLabor = 0;
		let itemTabData = this
			.state
			.itemPricedData
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
							<td>
								<RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateLineItemsTable.bind(this, index, 'DESC')}
								/>
							</td>
							<td style={{ textAlign: 'center' }}><RIENumber
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
							<td>
								<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'DESC')}
								/>
							</td>
							<td style={{ textAlign: 'center' }}>
								<RIENumber
									validate={this.isStringValidNumber}
									activeClassName="form-control input-small"
									classEditing="form-control input-xsmall"
									value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
									change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'right' }}>$
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
							<td>
								<b>Shipping: </b><RIETextArea activeClassName="form-control input-small"
									classEditing="form-control"
									value={i.itemName ? i.itemName : 'NA'} propName="data"
									change={this.updateDesc.bind(this, index, 'DESC')}
								/>
							</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td className="unselectable">{''}</td>
							<td style={{ textAlign: 'right' }}>$
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
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td><span className="handle"><i className="fa fa-bars"></i></span></td>
							<td className="unselectable-header" colSpan="9">{i.headerName}</td>
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
						<td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td style={{ textAlign: 'center' }}><RIENumber
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
						<td style={{ textAlign: 'right' }}>
							{/* {i.mOurCost ? '$' + validate.numberWithCommas((i.mOurCost).toFixed(2)) : '$' + 0} */}
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
						<td style={{ textAlign: 'right' }}>
							<RIEInput
								validate={this.isStringValidMarkup}
								activeClassName="form-control input-small"
								classEditing="form-control input-small"
								classInvalid="invalid"
								format={this.formatInteger}
								value={i.mMarkup ? (i.mMarkup).toString() : '0'} propName="data"
								change={this.onChangeMarkupCost.bind(this, index, 'MARKUP')}
								style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'right' }}>$<RIEInput
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							format={this.formatInteger}
							value={i.mCost ? validate.numberWithCommas((i.mCost).toFixed(2)) : '$' + 0} propName="data"
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
						<td>
							<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td style={{ textAlign: 'center' }}><RIENumber
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
						<td>
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
							<td className="unselectable-header" colSpan="13">{i.headerName}</td>
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
						<td>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td style={{ textAlign: 'center' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td onClick={this.handleLineTab.bind(this, 2)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>
							{i.mTaxExtended ? '$' + validate.numberWithCommas((i.mTaxExtended).toFixed(2)) : '$' + 0}</td>
						<td>
							<RIESelect
								change={this.handleLaborChange.bind(this, index)}
								value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
								options={this.state.laborRatesData}
								propName="laborType"
							/>
						</td>
						<td style={{ textAlign: 'center' }}><RIEInput
							validate={this.isStringValidLabor}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lHours > -1 ? (i.lHours.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
						<td style={{ textAlign: 'right' }}><RIENumber
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
						<td>
							<b>Labor: </b><RIETextArea activeClassName="form-control input-small"
								classEditing="form-control"
								value={i.itemName ? i.itemName : 'NA'} propName="data"
								change={this.updateDesc.bind(this, index, 'DESC')}
							/>
						</td>
						<td style={{ textAlign: 'center' }}><RIENumber
							validate={this.isStringValidNumber}
							activeClassName="form-control input-small"
							classEditing="form-control input-xsmall"
							value={i.quantity ? (i.quantity).toString() : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'QTY')} /></td>
						<td className="unselectable">{''}</td>
						<td>
							<RIESelect
								change={this.handleLaborChange.bind(this, index)}
								value={this.state.laborRatesData.find(o => o.laborType === i.laborTypeName)}
								options={this.state.laborRatesData}
								propName="laborType"
							/>
						</td>
						<td style={{ textAlign: 'center' }}><RIENumber
							validate={this.isStringValidLabor}
							activeClassName="form-control input-small"
							classEditing="form-control input-small"
							value={i.lHours > 0 ? (i.lHours.toString()) : '0'} propName="data"
							change={this.updateLineItemsTable.bind(this, index, 'HOURS')}
							style={{ minWidth: 150, display: 'inline-block', margin: 0, padding: 0, fontSize: 15, outline: 0, border: 0 }} /></td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended ? (i.lHoursExtended).toFixed(2) : '0'}</td>
						<td style={{ textAlign: 'right' }}><RIENumber
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
						<td>
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
							<td className="unselectable-header" colSpan="11">{i.headerName}</td>
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

		let mfgList = this.state.manufacturerList.map(function (mfg) {
			return <li onClick={this.selectManufacturer.bind(this, mfg)}><a>{mfg}</a></li>;
		}.bind(this));

		return (
			<div>
				<div className="portlet-title tabbable-line">
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#estimate-add" data-toggle="tab">
								Estimate
							</a>
						</li>
						<div className="form-actions noborder text-right">
							{this.state.pageRedirect ? <Link to={this.state.pageRedirect} className="btn red" >
								Cancel
							</Link> : <Link to={localStorage.contactEstId ? '/contactestimates/' + localStorage.contactEstId : '/estimate'} className="btn red" >
									Cancel
							</Link>}&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.estimateHandler}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="create_estimate">
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
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="opportunity">Opportunity
													</label>
													<select
														value={this.state.opportunityValue}
														onChange={this.handleOpportunityChange} name="opportunity"
														className="form-control">
														<option value='0'>Select</option>
														{opportunitiesData}
													</select>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="salesrep">Sales Rep<span className="required">*</span>
													</label>
													<span className="pull-right">
														<i className="fa fa-plus-circle fa-2x"
															aria-hidden="true" onClick={this.handleNewContactModal.bind(this, 'SALES')}></i></span>
													<Select
														// disabled={this.state.disabled}
														value={this.state.salesrepValue}
														valueKey='id'
														placeholder="Sales Rep"
														name="salesrep"
														id="salesrep"
														options={this.state.salesrepOptions}
														onChange={this.handleSalesRepChange}
														onBlur={this.handleSelectsBlur}
														onInputChange={this.onSalesRepInputChange} />
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="individual">Customer<span className="required">*</span>
													</label>
													{this.state.opportunityValue || this.state.disabled ? null : <span className="pull-right">
														<i className="fa fa-plus-circle fa-2x"
															aria-hidden="true" onClick={this.handleNewCompanyModal.bind(this, 'COMPANY')}></i></span>}
													{/* disabled={this.state.opportunityValue ? true : false} */}

													<Select
														disabled={this.state.disabled}
														value={this.state.companyValue ? this.state.companyValue : this.state.companyValue}
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
													<label htmlFor="individual">Customer Contact{/**<span className="required">*</span>*/}
													</label>
													{this.state.disabled ? null : <span className="pull-right">
														<i className="fa fa-plus-circle fa-2x"
															aria-hidden="true" onClick={this.handleNewContactModal.bind(this, 'INDIVIDUAL')}></i></span>}
													<Select
														disabled={this.state.disabled}
														value={this.state.individualValue ? this.state.individualValue : this.state.individualValue}
														name="individual"
														id="individual"
														options={this.state.individualOptions}
														onFocus={this.onContactFocus}
														onChange={this.handleIndividualChange}
														onBlur={this.handleSelectsBlur}
														onInputChange={this.onIndividualInputChange} />
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Estimate Name"
													name="name"
													ref="name"
													id="name"
													htmlFor="name"
													defaultValue=""
													required={true}
												/>
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
													<label htmlFor="billAdd1">Address 1
													</label>
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
													<label htmlFor="billAdd2">Address 2
													</label>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="City"
													name="billCity"
													htmlFor="billCity"
													defaultValue={this.state.addressDetails.city}
													key={this.state.addressDetails.city}
													required={false}
													ref={'billCity'}
												/>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="State"
													name="billState"
													htmlFor="billState"
													defaultValue={this.state.addressDetails.state}
													key={this.state.addressDetails.state}
													required={false}
													ref={'billState'}
												/>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													min={0}
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Zip"
													name="billZip"
													htmlFor="billZip"
													defaultValue={this.state.addressDetails.zip}
													key={this.state.addressDetails.zip}
													required={false}
													ref={'billZip'}
												/>
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
														defaultValue=""></TextareaAutosize>
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
														defaultValue=""></TextareaAutosize>
													<label htmlFor="shipAdd2">Address 2</label>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="City"
													name="shipCity"
													htmlFor="shipCity"
													defaultValue=""
													required={false}
													ref={'shipCity'}
												/>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="State"
													name="shipState"
													htmlFor="shipState"
													defaultValue=""
													required={false}
													ref={'shipState'}
												/>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<SingleInput
													inputType="text"
													min={0}
													parentDivClass="form-group form-md-line-input form-md-floating-label"
													className="form-control"
													title="Zip"
													name="shipZip"
													htmlFor="shipZip"
													defaultValue=""
													required={false}
													ref={'shipZip'}
												/>
											</div>
										</div>
										<div className="row">
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<select
														className="form-control edited"
														id="stageType"
														ref="stageType"
														name="stageType">
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
													<label htmlFor="taxRate">Default Markup(%)</label>
												</div>
											</div>
											<div className="col-md-6 col-sm-6 col-xs-12">
												<div className="form-group form-md-line-input form-md-floating-label">
													<label htmlFor="project">Project</label>
													<select
														value={this.state.projectValue ? this.state.projectValue : ''}
														onChange={this.handleProjectChange} name="project"
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
														disabled={this.state.disabled}
														value={this.state.proposalValue ? this.state.proposalValue : ''}
														onChange={this.handleProposalChange} name="proposal"
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
														defaultValue=''>
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
                                                        defaultValue=''>
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
														onBlur={this.handleGlobalTaxRate}
													/>
													<label htmlFor="taxRate">Tax Rate(%)</label>
												</div>
											</div>
										</div>
									</div>
								</form>
								<div className="row">
									<div className="col-md-6 col-sm-6 col-xs-12" style={{ marginBottom: 10 }}>
										<label htmlFor="proposed_services">Proposed Services (visible on quote)
										</label>
										<RichTextEditor

											toolbarConfig={toolbarConfig}
											value={this.state.proposedServiceValue}
											onChange={this.onChange}
										/>
									</div>
								</div>
								<div className="portlet light portlet-fit portlet-datatable bordered">
									<div className="portlet light bordered">
										<div className="portlet-title tabbable-line">
											<div className="caption">
												<i className="icon-share font-dark"></i>
												<span className="caption-subject font-dark bold uppercase">Line Items</span>
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
																<table className="table table-striped table-bordered" id="lineitem">
																	<thead >
																		<tr>
																			<th className="items"></th>
																			<th className="items">#</th>
																			<th className="items">Mfg</th>
																			<th className="items">Model No</th>
																			<th className="items">Part No</th>
																			<th className="items">Desc</th>
																			<th className="items">Qty</th>
																			<th className="material" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)} > Material</th>
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
																<table className="table table-striped table-bordered" id="lineitem">
																	<thead >
																		<tr>
																			<th className="items" rowSpan="2"></th>
																			<th className="items" rowSpan="2">#</th>
																			<th className="items" rowSpan="2">Item</th>
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
																<table className="table table-striped table-bordered" id="lineitem">
																	<thead >
																		<tr>
																			<th className="items" rowSpan="2"></th>
																			<th className="items" rowSpan="2">#</th>
																			<th className="items" rowSpan="2">Item</th>
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
														defaultValue="">
													</TextareaAutosize>
													<label htmlFor="revisionNotes">Revision Notes
													</label>
												</div>
											</div>
										</div>

										{/* Total section starts*/}
										{this.state.itemPricedData.length !== 0 ? < div className="row">
											<div className="col-md-4">
												<table className="table table-striped table-bordered">
													<caption className="font-dark bold uppercase">Material</caption>
													<tbody>
														<tr>
															<th colSpan="1">Cost</th>
															<td style={{ textAlign: 'right' }}>
																${totalCost ? validate.numberWithCommas((totalCost).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Our Cost Ext Total</th>
															<td style={{ textAlign: 'right' }}>
																${mOurCostExtTotal ? validate.numberWithCommas((mOurCostExtTotal).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Tax</th>
															<td style={{ textAlign: 'right' }}>
																${totalTax ? validate.numberWithCommas((totalTax).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Shipping</th>
															<td style={{ textAlign: 'right' }}>
																${totalShipping ? validate.numberWithCommas((totalShipping).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Total</th>
															<td style={{ textAlign: 'right' }}>
																${materialTotal ? validate.numberWithCommas((materialTotal).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Markup %</th>
															<td style={{ textAlign: 'right' }}>
																{markupPercent ? (markupPercent).toFixed(2) : 0}%</td>
														</tr>
														<tr>
															<th colSpan="1">Markup Total</th>
															<td style={{ textAlign: 'right' }}>
																${markupTotal ? validate.numberWithCommas((markupTotal).toFixed(2)) : 0}</td>
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
															<td style={{ textAlign: 'right' }}>${totalRate ? validate.numberWithCommas((totalRate).toFixed(2)) : 0}</td>
														</tr>
														{this.state.expandTotal ? laborTotalMore : null}
														<tr>
															<th colSpan="1">Hours&nbsp;<span onClick={this.handleExpand.bind(this, 'HOURS')} style={{ color: 'blue', cursor: 'pointer' }}>{this.state.expandHours ? ' (less...)' : '(more...)'}</span></th>
															<td style={{ textAlign: 'right' }}>{totalHours ? totalHours : 0}</td>
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
															<td style={{ textAlign: 'right' }}>
																${mExtendedTotal ? validate.numberWithCommas((mExtendedTotal).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Labor</th>
															<td style={{ textAlign: 'right' }}>${totalRate ? validate.numberWithCommas((totalRate).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Tax</th>
															<td style={{ textAlign: 'right' }}>
																${totalTax ? validate.numberWithCommas((totalTax).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th colSpan="1">Shipping</th>
															<td style={{ textAlign: 'right' }}>
																${totalShipping ? validate.numberWithCommas((totalShipping).toFixed(2)) : 0}</td>
														</tr>
														<tr>
															<th className="caption-subject font-dark bold uppercase" colSpan="1">Grand Total</th>
															<td style={{ textAlign: 'right' }}>
																${validate.numberWithCommas((mExtendedTotal + totalRate + totalTax + totalShipping).toFixed(2))}
															</td>
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
								title='New Line Item'
								materialAddId="lineitem_add"
								onItemInputChange={this.onItemInputChange}
								itemOptions={this.state.itemOptions}
								searchedItems={searchedItems}
								handlePopUpClose={this.handlePopUpClose.bind(this, 'item')}
								createItemHandler={this.createItemHandler.bind(this, 'item')} />

							<AddHeader ref="head_txt" headerAddId="subheader_add" handleHeaderAdd={this.handleHeaderAdd} />

							<AddShipping ref="ship_desc" shippingAddId="shipping_add" handleShippingAdd={this.handleShippingAdd} />

							<AddLabor
								key='labor_add'
								ref="labr_desc"
								laborAddId="labor_add"
								handleLaborAdd={this.handleLaborAdd}
								laborOptions={this.state.laborRatesData}
								laborValue={this.state.laborModalValue ? this.state.laborModalValue : (this.state.laborRatesData.length ? this.state.laborRatesData[0]._id : '')}
								handleModalLabor={this.handleModalLabor}
							/>

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
							<AddCompanyModal
								addCompanyModalId="add-company"
								companyAddhandler={this.handleCompanyAdd}
								ref='companyChild'
								customerValue={this.state.customerValue}
								customerOptions={this.state.companyOptions}
								handleCustomerChange={this.handleCustomerChange}
								handleSelectsBlur={this.handleSelectsBlur}
								onCompanyInputChange={this.onCompanyInputChange}
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
							<ConfirmationModal
								confirmationId="confirm_id"
								confirmationTitle=""
								confirmationText="Are you sure you want to create a new item in the database ?"
								confirmationHandler={this.confirmationHandler} />
						</div>
					</div>
				</div>
			</div >
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		estimateNo: state.estimate.estimateNo,
		estimateCreate: state.estimate.estimateCreate,
		companyList: state.estimate.companyList,
		projectList: state.estimate.projectList,
		proposalList: state.estimate.proposalList,
		companyPhoneInternet: state.estimate.companyPhoneInternet,
		salesRepList: state.estimate.salesRepList,
		individualList: state.estimate.individualList,
		opportunityList: state.estimate.opportunityList,
		itemList: state.estimate.itemList,
		createcontact: state.createcontact.contactData,
		opportunityDetail: state.opportunity.oppDetailData,
		itemDetail: state.itemCreation.itemDetailData,
		contactDetails: state.estimate.contactDetails,
		laborRates: state.estimate.laborRates,
		newIndividualCreated: state.estimate.individualCreated,
		newSalesCreated: state.estimate.salesCreated,
		newCreatedItem: state.estimate.newCreatedItem,
		companyCreated: state.estimate.companyCreated,
		ManufacturerList: state.estimate.manufacturerList,
		estimateStages: state.estimate.estimateStages,
		proposalDetail: state.estimate.proposalDetail,
		createProposalData: state.proposal.createPrposalData

	};
}

// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(estimateActions, dispatch),
		contactactions: bindActionCreators(createContactAction, dispatch),
		oppActions: bindActionCreators(opportunityAction, dispatch),
		itemaction: bindActionCreators(itemActions, dispatch),
		settingsActions: bindActionCreators(settingsActions, dispatch),
		// propActions:bindActionCreators(proposalActions,dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(EstimateAdd);   