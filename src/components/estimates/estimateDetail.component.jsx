import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Router } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import * as estimateActions from '../../actions/estimateActions';
import * as orderActions from '../../actions/orderActions';

// import * as loader from '../../constants/actionTypes';
import * as validate from '../common/validator';
import * as datatable from '../../scripts/table-datatables-buttons';
import DeleteModal from '../common/deleteModal.component';
import AddRevision from '../common/addRevisionModal.component';
import RoleAwareComponent from '../authorization/roleaware.component';
import '../../styles/bootstrap-fileinput.css';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import socketIOClient from 'socket.io-client';
import * as api from '../../../tools/apiConfig';
import ConfirmationDialog from '../common/confirmationDialog.component';
import { browserHistory } from 'react-router';
import { RIESelect } from 'riek';
import * as settingsActions from '../../actions/settingsActions';
import RichTextEditor from 'react-rte';
import Select from 'react-select';
import jQuery from 'jquery';
import * as message from '../../constants/messageConstants';


/* eslint-disable */
class EstimateDetail extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			project:"Project Manager/Assigned",
			service:"Project/Site Name",
			estimateDetails: '',
			itemDetails: [],
			billAddress: '',
			shipAddress: '',
			estimateId: '',
			revisedItems: [],
			itemPricedData: [],
			expandTotal: false,
			itemTab: 'active',
			materialTab: '',
			laborTab: '',
			revisionNo: 0,
			isCheckedEmpty: false,
			isCheckedDuplicate: true,
			memoList: [],
			breadcrumb: true,
			endpoint: api.SOCKETURL,
			showWarnHead: false,
			modifierName: '',
			showEditConfirmModal: false,
			editTitle: '',
			estimateName: '',
			proposalValue: '',
			proposalOptions: [],
			projectValue: '',
			projectOptions: [],
			editProposal: false,
			editEstimateName: false,
			editProject: false,
			editStage: false,
			stageOptions: [],
			stageValue: '',
			estimateNote: '',
			editEstimateNote: false,
			editProposedService: false,
			b_add1: '',
			b_add2: '',
			b_city: '',
			b_state: '',
			b_zip: '',
			s_add1: '',
			s_add2: '',
			s_city: '',
			s_state: '',
			s_zip: '',
			editb_add1: false,
			editb_add2: false,
			editb_city: false,
			editb_state: false,
			editb_zip: false,
			edits_add1: false,
			edits_add2: false,
			edits_city: false,
			edits_state: false,
			edits_zip: false,
			salesrepOptions: [],
			salesrepValue: '',
			query: '',
			editSalesRep: false,
			companyOptions: [],
			companyValue: '',
			editCompany: false,
			individualOptions: [],
			individualValue: '',
			editContact: false,
			proposedServiceValue: RichTextEditor.createEmptyValue(),
			PMOptions: [],
			projectMngValue: '',
			projectRadioValue: '',
			orderNumber: ''

		};
	}
	// first tab
	// editProposal: false,
	// 		editEstimateName: false,
	// 		editProject: false,
	// 		editStage: false,
	// editEstimateNote: false,
	// editProposedService: false,
	// editSalesRep: false,
	// editCompany: false,
	// editContact:false,

	// Second tab
	// editb_add1: false,
	// editb_add2: false,
	// editb_city: false,
	// editb_state: false,
	// editb_zip: false,
	// edits_add1: false,
	// edits_add2: false,
	// edits_city: false,
	// edits_state: false,
	// edits_zip: false,


	componentWillReceiveProps(nextProps, props) {
		let currentRevisedItem = [];
		let salesrep = [];
		let company = [];
		let contact = [];
		let individual = [];
		let projectOpt = [];
		let PM = [];
		if (nextProps.revisionNo) {
			this.setState({ revisionNo: nextProps.revisionNo ? nextProps.revisionNo : 0 });
		}

		else if (nextProps.companyList.length == 0 && nextProps.individualList.length == 0 && nextProps.salesRepList.length == 0) {
			if (nextProps.estimateDetail.estimateDetails) {
				var estimatestate = JSON.parse(JSON.stringify(nextProps.estimateDetail.estimateDetails));
				var itemState = JSON.parse(JSON.stringify(nextProps.estimateDetail.itemLists));
				var billingAddress = estimatestate.billingAddress1 + ' '
					+ estimatestate.billingAddress2 + ' '
					+ estimatestate.billingcity + ' '
					+ estimatestate.billingstate + ' '
					+ estimatestate.billingzip;
				var shippingAddress = estimatestate.shippingAddress1 + ' '
					+ estimatestate.shippingAddress2 + ' '
					+ estimatestate.shippingcity + ' '
					+ estimatestate.shippingstate + ' '
					+ estimatestate.shippingzip;

				if (itemState.length > 0) {
					currentRevisedItem = itemState[0].lineItems;
				}
				let salesRepObj = {
					value: estimatestate.salesRep ? estimatestate.salesRep._id : '',
					label: estimatestate.salesRep ? estimatestate.salesRep.firstname + ' ' + estimatestate.salesRep.lastname : ''
				};
				let companyObj = {
					value: estimatestate.customerId ? estimatestate.customerId._id : '',
					label: estimatestate.customerId ? estimatestate.customerId.companyName : ''
				};
				let individualObj = {
					value: estimatestate.individualId ? estimatestate.individualId._id : '',
					label: estimatestate.individualId ? estimatestate.individualId.firstname + ' ' + estimatestate.individualId.lastname : ''
				};
				this.setState({
					proposalValue: estimatestate.proposalId ? estimatestate.proposalId : '',
					projectValue: estimatestate.projectId ? estimatestate.projectId : '',
					stageValue: estimatestate.stage ? estimatestate.stage : '',
					estimateName: estimatestate.estimateName,
					estimateNote: estimatestate.note,
					estimateDetails: estimatestate,
					revisedItems: itemState,
					itemPricedData: currentRevisedItem,
					// billAddress: billingAddress,
					b_add1: estimatestate.billingAddress1 ? estimatestate.billingAddress1 : '',
					b_add2: estimatestate.billingAddress2 ? estimatestate.billingAddress2 : '',
					b_city: estimatestate.billingcity ? estimatestate.billingcity : '',
					b_state: estimatestate.billingstate ? estimatestate.billingstate : '',
					b_zip: estimatestate.billingzip ? estimatestate.billingzip : '',
					// shipAddress: shippingAddress,
					s_add1: estimatestate.shippingAddress1 ? estimatestate.shippingAddress1 : '',
					s_add2: estimatestate.shippingAddress2 ? estimatestate.shippingAddress2 : '',
					s_city: estimatestate.shippingcity ? estimatestate.shippingcity : '',
					s_state: estimatestate.shippingstate ? estimatestate.shippingstate : '',
					s_zip: estimatestate.shippingzip ? estimatestate.shippingzip : '',
					salesrepValue: salesRepObj,
					companyValue: companyObj,
					individualValue: individualObj.value ? individualObj : '',
					memoList: estimatestate.memo ? estimatestate.memo.reverse() : [],
					proposedServiceValue: estimatestate.proposedServices ? RichTextEditor.createValueFromString(estimatestate.proposedServices, 'html') : RichTextEditor.createEmptyValue()
				}, () => console.log);

				if (this.state.breadcrumb && estimatestate.estimateNumber) {
					var data = {
						parent: <Link to='/estimate'>Estimates</Link>,
						childone: ('#' + estimatestate.estimateNumber) + ' (' + (estimatestate.estimateName ? estimatestate.estimateName : estimatestate.customerId.companyName) + ')',
						childtwo: ''
					};
					this.props.breadCrumb(data);
					this.state.breadcrumb = false;
				}
				$('div#estimateList').unblock();
			}
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
		if (nextProps.companyList.length != 0) {

			let companyList = nextProps.companyList.map(function (list, index) {
				let obj = {
					value: list._id,
					label: list.companyName
				};
				company.push(obj);
			}.bind(this));

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
		if (nextProps.projectList.length != 0) {
			let projectList = nextProps.projectList
				.map(function (list, index) {
					let strechLength = (list.title.length >= 50) ? '...' : ''
					let shortTitle = list.title.substr(0, 50);
					let obj = {
						_id: list._id,
						title: shortTitle + '' + strechLength
					};
					projectOpt.push(obj);
				}.bind(this));
		}
		if (nextProps.employeeList.length != 0) {
			let PMList = nextProps.employeeList
				.map((list, index) => {
					let obj = {
						value: list._id,
						label: list.firstname + ' ' + list.lastname,
						userId: list.userId
					};
					PM.push(obj);
				});
		}
		if (nextProps.orderNo) {
			this.setState({ orderNumber: nextProps.orderNo });
		}
		this.setState({
			proposalOptions: nextProps.proposalList,
			projectOptions: projectOpt,
			stageOptions: nextProps.estimateStages,
			salesrepOptions: salesrep,
			companyOptions: company,
			individualOptions: individual,
			PMOptions: PM
		})

		$(".lineitem").tableHeadFixer();

	}

	componentWillMount() {
		const socket = socketIOClient(this.state.endpoint);

		socket.on('update estimate', (username) => {
			this.setState({
				showWarnHead: true,
				modifierName: username
			});
		});
		socket.on('edit in progress', (username) => {
			let title = 'This Estimate is already been Edited by ' + username;
			this.setState({
				editTitle: title,
				showEditConfirmModal: true
			});
		});
		var estimateId = {
			estimateId: this.props.params.estimateId
		};
		this
			.props
			.actions
			.getEstimateDetails(estimateId);

		setTimeout(function () {
			datatable
				.EstimateTable
				.init();
		}, 2000);
		let companyId = {
			companyId: localStorage.companyId
		};
		let params = {
			companyId: localStorage.companyId,
			moduleType: 1
		};
		this.props.actions.getProposalData(companyId);
		this.props.actions.getProjectData(companyId);
		this.props.settingsActions.getEstimateStages(params);
		this.handleSalesSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getSalesRepData(this.state.query);
			}
		}, 350);
		this.handleCompanySearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getCompanyList(this.state.query);
			}
		}, 350);
		this.handleContactSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getIndividualData(this.state.query);
			}
		}, 350);
		this.handlePMDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getCompanyEmployeesList(this.state.query);
			}
		}, 350)


	}

	componentDidMount() {
		functions.showLoader('estimateList');
		let data = {
			companyId: localStorage.companyId
		};
		this.props.orderAction.getOrderNo(data);

	}


	handleDelete() {
		this.setState({ estimateId: this.props.params.estimateId });
		$('#estimate_delete').modal('show');
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

	deleteEstimateHandler() {
		if (this.state.estimateId) {
			$('#estimate_delete').modal('hide');
			functions.showLoader('estimateList');
			var data = {
				estimateId: this.state.estimateId
			};
			this.props.actions.deleteEstimate(data);
		}
	}
	handleProjectSOModal() {
		$('#create_project').modal('show');
	}
	handleRevisionModal() {
		this.props.actions.getRevisionCount({ estimateId: this.props.params.estimateId });
		let currentData = this.state.revisedItems;
		let currentRevisionLength = currentData.length;
		this.setState({
			isCheckedEmpty: false,
			isCheckedDuplicate: true,
			// revisionNo: currentRevisionLength
		});
		$('#add_revision').modal('show');
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
	handleRadioChange(e) {
		let selectLabel = ReactDOM.findDOMNode(this.refs.project).checked == true ? "Project Manager" : "Assigned";
		let nameLabel = ReactDOM.findDOMNode(this.refs.project).checked == true ? "Project Name" : "Site Name";
		this.setState({ projectRadioValue: e.target.value });
		this.setState({ project: selectLabel, service: nameLabel });
		
	}

	cancelCourse() {
	
		ReactDOM.findDOMNode(this.refs.project).checked = true ? this.refs.project.checked = false : this.refs.project.checked = false;
		ReactDOM.findDOMNode(this.refs.serviceorder).checked = true ? this.refs.serviceorder.checked = false : this.refs.serviceorder.checked = false;
		this.refs.projectName.value = "";
		this.setState({ projectMngValue: '' });
		this.setState({ project: "Project Manager/Assigned", service: "Project/Site Name" });
	}
	addRevisionhandler() {
		toastr.remove();
		if (this.state.isCheckedDuplicate) {
			if (ReactDOM.findDOMNode(this.refs.revised.refs.revision_name).value !== '0') {
				let currentRevisionId = ReactDOM.findDOMNode(this.refs.revised.refs.revision_name).value;
				let currentRevisedData = this.state.revisedItems.find(o => o._id === currentRevisionId);
				let revisionData = {
					companyId: localStorage.companyId,
					estimateId: this.props.params.estimateId,
					revisionName: 'Rev' + this.state.revisionNo,
					item: currentRevisedData.lineItems,
					proposedServices: this.state.proposedServiceValue.toString('html')

				};
				$('#add_revision').modal('hide');
				this.props.actions.addOtherRevision(revisionData, 1);
			}
			else {
				toastr.error('Please select a revision');
			}
		}
		else if (this.state.isCheckedEmpty) {
			let revisionData = {
				companyId: localStorage.companyId,
				estimateId: this.props.params.estimateId,
				revisionName: 'Rev' + this.state.revisionNo,
				item: [],
				proposedServices: this.state.proposedServiceValue ? this.state.proposedServiceValue.toString('html') : ''

			};
			$('#add_revision').modal('hide');
			this.props.actions.addOtherRevision(revisionData, 1);
		}
	}

	handleLineTab(tabIndex) {
		// $("#lineitem").tableHeadFixer();
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


	handleMemoAdd() {
		toastr.remove();
		let memoText = ReactDOM.findDOMNode(this.refs.estMemo).value.trim();
		if (memoText !== '') {
			let memoData = {
				estimateId: this.props.params.estimateId,
				message: memoText,
				userName: localStorage.userName,
			};
			this.props.actions.addEstMemos(memoData);
			let currentMemo = {
				message: memoText,
				userName: localStorage.userName,
				createdAt: moment()

			};
			let currentState = this.state.memoList;
			currentState.unshift(currentMemo);
			this.setState({ memoList: currentState });
			var memo_list = $('#estimate_memos').DataTable();
			memo_list.destroy();
			setTimeout(function () {
				datatable.EstimateTable.init();
			}, 2000);
			$('#est_memos').modal('hide');
		}
		else {
			toastr.error('Please enter a valid memo.');
		}
	}

	handleRevisionExport() {
		if (this.state.revisedItems.length != 0) {
			let res = this.state.revisedItems[0];
			if (res.lineItems.length != 0) {
				let data = {
					revisionId: res._id
				};
				this.props.actions.getExportedRevision(data);
			}
			else {
				toastr.error('No line items for this revision.');
			}
		}
	}

	handleMaterialDetail(materialId) {
		if (materialId) {
			window.open('/material/' + materialId, '_blank');
		}
	}

	handleEditWithSocket() {
		if (this.state.showEditConfirmModal) {
			$('#confirmEdit').modal('show');
		}
		this.setState({
			showEditConfirmModal: false
		});
	}
	EditConfirmationHandler(e) {
		e.preventDefault();
		browserHistory.push('/estimate/' + this.props.params.estimateId + '/edit');
		$('#confirmEdit').modal('hide');
	}
	handleInlineEditChange(event) {
		if (event.target.name === 'estimateName') {
			// this.setState({ ename: event.target.value });
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				estimateName: event.target.value.trim()
			}
			this.props.actions.estimateInlineEdit(estimateData);
		}
	}
	handleEstimateNameChange(e) {
		let estimateName = ReactDOM.findDOMNode(this.refs.ename).value.trim();
		if (estimateName != '') {
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				estimateName: estimateName
			}
			this.setState({ estimateName: estimateName, editEstimateName: false });
			this.props.actions.estimateInlineEdit(estimateData);

		}
		else {
			toastr.error("This Field Cannot be Empty");
		}
	}
	handleEstimateNoteChange(e) {
		let estimateNote = this.refs.note ? ReactDOM.findDOMNode(this.refs.note).value.trim() : '';
		if (estimateNote != '') {
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				note: estimateNote
			}
			this.setState({ estimateNote: estimateNote, editEstimateNote: false });
			this.props.actions.estimateInlineEdit(estimateData);
		}
	}
	handleProposedServiceChange() {
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			proposedServices: this.state.proposedServiceValue.toString('html')
		}
		this.setState({ editProposedService: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_b_Add1Change(e) {
		let add1 = ReactDOM.findDOMNode(this.refs.b_add1).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			billingAddress1: add1
		}
		this.setState({ b_add1: add1, editb_add1: false });

		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_b_Add2Change(e) {
		let add2 = ReactDOM.findDOMNode(this.refs.b_add2).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			billingAddress2: add2
		}
		this.setState({ b_add2: add2, editb_add2: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_b_CityChange(e) {
		let city = ReactDOM.findDOMNode(this.refs.b_city).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			billingcity: city
		}
		this.setState({ b_city: city, editb_city: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_b_StateChange(e) {
		let state = ReactDOM.findDOMNode(this.refs.b_state).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			billingstate: state
		}
		this.setState({ b_state: state, editb_state: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_b_ZipChange(e) {
		let zip = ReactDOM.findDOMNode(this.refs.b_zip).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			billingzip: zip
		}
		this.setState({ b_zip: zip, editb_zip: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}

	handle_s_Add1Change(e) {
		let add1 = ReactDOM.findDOMNode(this.refs.s_add1).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			shippingAddress1: add1
		}
		this.setState({ s_add1: add1, edits_add1: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_s_Add2Change(e) {
		let add2 = ReactDOM.findDOMNode(this.refs.s_add2).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			shippingAddress2: add2
		}
		this.setState({ s_add2: add2, edits_add2: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_s_CityChange(e) {
		let city = ReactDOM.findDOMNode(this.refs.s_city).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			shippingcity: city
		}
		this.setState({ s_city: city, edits_city: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_s_StateChange(e) {
		let state = ReactDOM.findDOMNode(this.refs.s_state).value.trim();
		let estimateData = {
			estimateId: this.props.params.estimateId,
			companyId: localStorage.companyId,
			shippingstate: state
		}
		this.setState({ s_state: state, edits_state: false });
		this.props.actions.estimateInlineEdit(estimateData);
	}
	handle_s_ZipChange(e) {
		let zip = ReactDOM.findDOMNode(this.refs.s_zip).value.trim();
		let zip_type = parseInt(zip);
		if ((zip.length <= 5 && zip.length >= 4) && (zip_type != NaN)) {
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				shippingzip: zip
			}
			this.setState({ s_zip: zip, edits_zip: false });
			this.props.actions.estimateInlineEdit(estimateData);
		} else {
			toastr.error("Please enter a valid zip code")
		}

	}
	handleProposalChange(e) {
		let proposalId = e.target.value;
		if (proposalId !== '' && proposalId != '0') {
			let proposal = this.state.proposalOptions.find(o => o._id === proposalId);
			this.setState({ proposalValue: proposal, editProposal: false });
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				proposalId: proposal
			}
			this.props.actions.estimateInlineEdit(estimateData);
		}
		else {
			this.setState({ proposalValue: '', editProposal: true });
		}
	}
	handleProjectChange(e) {
		let projectId = e.target.value;

		if (projectId !== '' && projectId != '0') {
			let project = this.state.projectOptions.find(o => o._id === projectId);
			this.setState({ projectValue: project, editProject: false });
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				projectId: project
			}
			this.props.actions.estimateInlineEdit(estimateData);
		}
		else {
			this.setState({ projectValue: '', editProject: true });
		}
	}
	handleStageChange(e) {
		let stageId = e.target.value;
		if (stageId !== '' && stageId != '0') {
			let stage = this.state.stageOptions.find(o => o._id === stageId);
			this.setState({ stageValue: stage, editStage: false });
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				stage: stage
			}
			this.props.actions.estimateInlineEdit(estimateData);
		}
	}

	handleSelectsBlur() {
		this.props.actions.clearSelects();
	}
	handleSalesBlur() {
		this.setState({ editSalesRep: false });
		this.props.actions.clearSelects();
	}
	handleCompanyBlur() {
		if (!this.state.companyValue) {
			toastr.error('This Field is required!');
		}

		// this.setState({ editCompany: false });
		// this.props.actions.clearSelects();
	}
	handleContactBlur() {
		this.setState({ editContact: false });
		this.props.actions.clearSelects();
	}
	handleSalesRepChange(value) {
		if (value != undefined) {
			let sales_id = value.value;
			this.setState({ salesrepValue: value, editSalesRep: false });
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				salesRep: sales_id
			}

			this.props.actions.estimateInlineEdit(estimateData);
		} else {
			this.setState({ salesrepValue: value })
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

	handleCompanyChange(e) {

		if (e) {
			this.setState({ companyValue: e, editCompany: false });
			let company = e.value;
			// let data = {
			// 	contactId: e.value
			// };
			// this.props.actions.getCustomerDetails(data);
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				customerId: company,
				individualId: ''
			}

			this.props.actions.estimateInlineEdit(estimateData);
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
	handleIndividualChange(e) {
		if (e) {
			this.setState({ individualValue: e, editContact: false });
			let contact = e.value;
			let estimateData = {
				estimateId: this.props.params.estimateId,
				companyId: localStorage.companyId,
				individualId: contact
			}

			this.props.actions.estimateInlineEdit(estimateData);
		} else {
			this.setState({ individualValue: '' });
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

	onPMInputChange(value) {
		if (value.trim()) {
			let data = {
				userName: value,
				companyId: localStorage.companyId
			}
			this.setState({ query: data });
			this.handlePMDebounced();
		} else {
			this.props.actions.clearSelects();
			this.setState({ PMOptions: [], query: '' });
		}

	}
	handlePMValueChange(e) {
		if (e) {
			this.setState({ projectMngValue: e });

		} else {
			this.setState({ projectMngValue: '' });
		}
	}
	createNewProjectSO() {
		if ((ReactDOM.findDOMNode(this.refs.projectName).value != '') && (this.state.projectMngValue.value != '' && this.state.projectMngValue.value != undefined)) {
			let pm = {
				"userName": this.state.projectMngValue.label,
				"userId": this.state.projectMngValue.userId,
				"_id": this.state.projectMngValue.value,
			}
			let employeeArray = [];
			employeeArray.push(pm);
			let data = {
				textValue: ReactDOM.findDOMNode(this.refs.projectName).value,
				employeeId: ReactDOM.findDOMNode(this.refs.project).checked == true ? this.state.projectMngValue.value : employeeArray,
				IsProject: ReactDOM.findDOMNode(this.refs.project).checked == true ? true : false,
				companyId: localStorage.companyId,
				createdBy: localStorage.userName,
				orderNumber: this.state.orderNumber,
				items: this.state.itemPricedData
			};
			this.props.actions.createNewProjectSO(data);
			ReactDOM.findDOMNode(this.refs.projectName).value = '';
			ReactDOM.findDOMNode(this.refs.project).checked = true;
			this.setState({ projectMngValue: '' })
			$('#create_project').modal('hide');
			ReactDOM.findDOMNode(this.refs.project).checked = true ? this.refs.project.checked = false : this.refs.project.checked = false;
		ReactDOM.findDOMNode(this.refs.serviceorder).checked = true ? this.refs.serviceorder.checked = false : this.refs.serviceorder.checked = false;
		this.refs.projectName.value = "";
		this.setState({ projectMngValue: '' });
		this.setState({ project: "Project Manager/Assigned", service: "Project/Site Name" });

		} else {
			toastr.error(message.REQUIRED_FIELDS);
		}
	}
	// handleRadioChange(e) {
	// 	this.setState({ projectRadioValue: e.target.value });
	// }
	onChange(value) {
		this.setState({ proposedServiceValue: value });
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
			BLOCK_TYPE_BUTTONS: [
				{ label: 'Unordered List', style: 'unordered-list-item' },
				{ label: 'Ordered List', style: 'ordered-list-item' }
			]
		};
		let clonedItemData = JSON.parse(JSON.stringify(this.state.itemPricedData));

		let materialTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mTaxExtended : prev, 0);
		let laborTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lExtended : prev, 0);
		let mOurCostTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCost : prev, 0);
		let mOurCostExtTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.mOurCostExtended : prev, 0);
		let grandTotal = this.state.itemPricedData.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + (next.mTaxExtended + next.lExtended) : prev, 0);
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
		let markupPercent = ((materialTotal - markupTotal) / markupTotal) * 100;

		let estimateDetailData = this.state.estimateDetails;
		let stageData = '-';
		let classData = '';

		if (estimateDetailData.length != 0) {
			if (estimateDetailData.class == 1) {
				classData = 'Demo-Class';
			} else {
				classData = '-';
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
					return (<tr key={index}>
						<td style={{ textAlign: 'center' }}>{countItem}</td>
						<td>{i.itemMfg}</td>
						<td >
							<a onClick={this.handleMaterialDetail.bind(this, i.itemId)}>{i.modelNo ? i.modelNo : '-'}</a>
						</td>
						<td >
							<a onClick={this.handleMaterialDetail.bind(this, i.itemId)}>{i.partNo ? i.partNo : '-'}</a>
						</td>
						<td >{i.itemName}</td>
						<td>{i.quantity}</td>
						<td
							onClick={this.handleLineTab.bind(this, 2)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
						<td
							onClick={this.handleLineTab.bind(this, 3)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended + i.lExtended).toFixed(2))}</td>
					</tr>);
				}
				else if (i.itemTypeId === 2) {
					return (<tr key={index}>
						<td style={{ textAlign: 'center' }}>{countItem}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td><b>Labor: </b>{i.itemName ? i.itemName : 'NA'}</td>
						<td>{i.quantity ? i.quantity : ''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.rowTotal).toFixed(2))}</td>
					</tr>);
				}
				else if (i.itemTypeId === 3) {
					return (<tr key={index}>
						<td style={{ textAlign: 'center' }}>{countItem}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td><b>Shipping: </b>{i.itemName ? i.itemName : 'NA'}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td className="unselectable">{''}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.rowTotal).toFixed(2))}</td>
					</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td className="unselectable-header" colSpan="9">{i.headerName ? i.headerName : 'NA'}</td>
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
					return (<tr key={index}>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td onClick={this.handleLineTab.bind(this, 1)} style={{ textAlign: 'right', cursor: 'pointer' }}>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td>{i.quantity}</td>
						<td><input type="checkbox" defaultChecked={i.mTaxable} value={i.mTaxable} disabled="disabled" /></td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mOurCost).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mOurCost).toFixed(2))}</td>
						<td>{i.mMarkup}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mCost).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mExtended).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTax).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
						<td
							onClick={this.handleLineTab.bind(this, 3)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.mTaxExtended + i.lExtended).toFixed(2))}</td>
					</tr>);
				}
				else if (i.itemTypeId === 2) {
					return (<tr key={index}>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td><b>Labor: </b>{i.itemName ? i.itemName : 'NA'}</td>
						<td>{i.quantity ? (i.quantity).toString() : '0'}</td>
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
					</tr>);
				}
				else if (i.itemTypeId === 3) {
					return (<tr key={index}>
						<td>{countMaterial ? countMaterial : ''}</td>
						<td><b>Shipping: </b>{i.itemName ? i.itemName : 'NA'}</td>
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
					</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td className="unselectable-header" colSpan="13">{i.headerName ? i.headerName : 'NA'}</td>
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
					return (<tr key={index}>
						<td>{countLabor ? countLabor : ''}</td>
						<td onClick={this.handleLineTab.bind(this, 1)} style={{ textAlign: 'right', cursor: 'pointer' }}>{i.itemMfg + ' ' + i.modelNo + ' ' + (i.partNo ? ' (' + i.partNo + ')' : null)}</td>
						<td style={{ textAlign: 'center' }}>{i.quantity}</td>
						<td onClick={this.handleLineTab.bind(this, 2)}
							style={{ textAlign: 'right', cursor: 'pointer' }}>${validate.numberWithCommas((i.mTaxExtended).toFixed(2))}</td>
						<td style={{ textAlign: 'center' }}>{i.laborTypeName ? i.laborTypeName : '-'}</td>
						<td style={{ textAlign: 'center' }}>{i.lHours}</td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lRate).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>
							{i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lExtended).toFixed(2))}</td>
						<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((i.lExtended + i.mTaxExtended).toFixed(2))}</td>
					</tr>);
				}
				else if (i.itemTypeId === 2) {
					return (<tr key={index}>
						<td>{countLabor ? countLabor : ''}</td>
						<td><b>Labor: </b>{i.itemName ? i.itemName : 'NA'}</td>
						<td style={{ textAlign: 'center' }}>{i.quantity ? (i.quantity).toString() : '0'}</td>
						<td className="unselectable">{''}</td>
						<td>{i.laborTypeName ? i.laborTypeName : ''}</td>
						<td style={{ textAlign: 'center' }}>{i.lHours ? i.lHours : '0'}</td>
						<td style={{ textAlign: 'center' }}>{i.lHoursExtended ? i.lHoursExtended : ''}</td>
						<td style={{ textAlign: 'right' }}>{i.lRate ? '$' + validate.numberWithCommas((i.lRate).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.unit ? '$' + validate.numberWithCommas((i.unit).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.lExtended ? '$' + validate.numberWithCommas((i.lExtended).toFixed(2)) : '$' + 0}</td>
						<td style={{ textAlign: 'right' }}>
							{i.rowTotal ? '$' + validate.numberWithCommas((i.rowTotal).toFixed(2)) : '$' + 0}</td>
					</tr>);
				}
				else if (i.itemTypeId === 3) {
					return (<tr key={index}>
						<td>{countLabor ? countLabor : ''}</td>
						<td><b>Shipping: </b>{i.itemName ? i.itemName : 'NA'}</td>
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
					</tr>);
				}
				else if (i.itemTypeId === 4) {
					return (
						<tr key={index} data-id={index}>
							<td className="unselectable-header" colSpan="11">{i.headerName ? i.headerName : 'NA'}</td>
						</tr>
					);
				}
			}.bind(this));

		let sum = [];
		clonedItemData.forEach(function (o) {
			var existing = sum.filter(function (i) {
				if (i.itemTypeId !== 3 && i.itemTypeId !== 4) {
					return i.laborTypeName === o.laborTypeName;
				}
			})[0];
			if (!existing) {
				sum.push(o);
			}
			else {
				existing.lHours += o.lHours;
				existing.lExtended += o.lExtended;
			}
		});
		let totalHours = sum.reduce((prev, next) => (next.itemTypeId !== 3 && next.itemTypeId !== 4) ? prev + next.lHours : prev, 0);
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

		let revisionList = this.state.revisedItems
			.map(function (revision, index) {
				return <option key={index} value={revision._id}>{revision.revisionName}</option>;
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
		let proposalData = this.state.proposalOptions
			.map(function (proposal, index) {
				return <option key={index} value={proposal._id}>{proposal.proposalNumber}</option>;
			}.bind(this));
		let projectData = this.state.projectOptions
			.map(function (project, index) {
				return <option key={index} value={project._id}>{project.title}</option>;
			}.bind(this));

		let estimateStagesData = this.props.estimateStages
			.map(function (stage, index) {
				return <option key={index} value={stage._id}>{stage.stageName}</option>;
			}.bind(this));

		return (
			<div>
				{this.state.showWarnHead ? <div className='Notify'>
					<p>This estimate has been updated by {this.state.modifierName}.  To see the latest changes, "<Link onClick={() => window.location.reload()}>click here</Link>".<button style={{ float: 'right' }} onClick={() => this.setState({ showWarnHead: false })} type="button" className="fa fa-close" aria-hidden="true"></button></p>
				</div> : ''}
				<div id="fixedButtons" className="text-right" style={{ position: 'fixed', right: '50px', zIndex: '99' }}>

					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <button onClick={this.handleProjectSOModal} className="btn btn-sm btn-circle newgreen">
						<i className="icon-plus"></i>
						Create Project/SO
			</button> : null}&nbsp;&nbsp;
					<Link to={'/estimate/' + this.props.params.estimateId + '/duplicate'} className="btn btn-sm btn-circle occuryellow">
						Duplicate Estimate
					</Link>&nbsp;&nbsp;
					<Link to={'/export/' + this.props.params.estimateId + '/estimate'} target="_blank" className="btn btn-sm btn-circle blue">
						<i className="icon-cursor"></i>
						Export
					</Link>&nbsp;&nbsp;
					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <button onClick={this.handleRevisionModal} className="btn btn-sm btn-circle purple">
						<i className="icon-plus"></i>
						Add Revision
					</button> : null}&nbsp;&nbsp;
					<Link to="/estimate" className="btn btn-sm btn-circle red">
						Cancel </Link>&nbsp;&nbsp;
					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <button className="btn btn-sm btn-circle red" onClick={this.handleDelete}>
						Delete </button> : null}&nbsp;&nbsp;
					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) && this.state.showEditConfirmModal == false ? <Link to={'/estimate/' + this.props.params.estimateId + '/edit'} onClick={this.handleEditWithSocket} className="btn btn-sm btn-circle green">
						Edit </Link> : null}

					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) && this.state.showEditConfirmModal ? <Link onClick={this.handleEditWithSocket} className="btn btn-sm btn-circle green">
						Edit </Link> : null}

				</div>
				<div>
					<div className="portlet-title tabbable-line">
						<ul className="nav nav-tabs">
							<li className="active">
								<a href="#estimate-add" data-toggle="tab"> Estimate </a>
							</li>
							<li>
								<a href="#estimate-moreinfo" data-toggle="tab"> More Info </a>
							</li>
							<li>
								<a href="#estimate-memos" data-toggle="tab">
									Memos
								</a>
							</li>
						</ul>
					</div>
					<div className="portlet light bordered" id="estimateList">
						<div className="portlet-body">
							<div className="tab-content">
								<div className="tab-pane active" id="estimate-add">
									<div className="portlet-title">
										<div className="caption">
											<span className="caption-subject bold uppercase">General Details</span>
										</div>
									</div>
									<form role="form">
										<div className="form-body">
											<div className="row">
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{/* <InlineEdit name='estimateName' optClass="form-control form-control-static" value={estimateDetailData.estimateName} key={estimateDetailData.estimateName} changeCallback={this.handleInlineEditChange} /> */}
														{this.state.editEstimateName ?
															<div className="input-ico-outer form-control form-control-static">
																{/* <input
																	type="text"
																	

																/> */}

																<TextareaAutosize
																	style={{ resize: 'none' }}
																	className="form-control"
																	id="name"
																	name="ename"
																	ref="ename"
																	defaultValue={this.state.estimateName ? this.state.estimateName : ''}
																	key={this.state.estimateName ? this.state.estimateName : ''}
																	onBlur={() => { this.setState({ editEstimateName: false }) }}
																>
																</TextareaAutosize>
																<span onClick={this.handleEstimateNameChange} className='ico-inp-common fa fa-check'></span>
																<span onClick={() => { this.setState({ editEstimateName: false }) }} className='ico-inp-common  fa fa-close'></span>
															</div>

															: <div onClick={() => {
																this.setState({
																	editEstimateName: true,
																	editProposal: false,
																	editProject: false,
																	editStage: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	editCompany: false,
																	editContact: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="form-control form-control-static">{estimateDetailData.estimateName ? <u className='dottedUnderline'>{estimateDetailData.estimateName}</u> : <u className='dottedUnderline'>-</u>}</div>}
														<label htmlFor="name" className="labels_top">Estimate Name</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{this.state.editCompany ? <div className="select-outer"><Select
															className="form-control form-control-static"
															value={this.state.companyValue}
															name="company"
															id="company"
															options={this.state.companyOptions}
															onChange={this.handleCompanyChange}
															onBlur={this.handleCompanyBlur}
															noResultsText="Search for Company"
															onInputChange={this.onCompanyInputChange} />
															<label htmlFor="customer">Customer</label>
															{/* <span onClick={() => { this.setState({ editCompany: false}) }} className='ico-inp-common  fa fa-close'></span> */}


														</div>

															: <div>
																<div onClick={() => this.setState({
																	editCompany: true,
																	editEstimateName: false,
																	editProposal: false,
																	editProject: false,
																	editStage: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	editContact: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})} className="form-control form-control-static">{this.state.companyValue && this.state.companyValue.label != "" ? <u className='dottedUnderline'>{this.state.companyValue.label}</u> : <u className='dottedUnderline'>-</u>}</div>
																<label htmlFor="customer">Customer</label>
															</div>}
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{this.state.editContact ? <div className="select-outer"><Select
															className="form-control form-control-static"
															value={this.state.individualValue}
															placeholder="Individual"
															name="individual"
															id="individual"
															options={this.state.individualOptions}
															noResultsText="Search for Contact"
															onChange={this.handleIndividualChange}
															onBlur={this.handleContactBlur}
															onInputChange={this.onIndividualInputChange}
														/>
															<label htmlFor="individual">Customer Contact</label>
															<span onClick={() => { this.setState({ editContact: false }) }} className='ico-inp-common  fa fa-close'></span>
														</div> : <div>
																<div onClick={() => this.setState({
																	editContact: true,
																	editCompany: false,
																	editEstimateName: false,
																	editProposal: false,
																	editProject: false,
																	editStage: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})} className="form-control form-control-static">{this.state.individualValue && this.state.individualValue.label != "" ? <u className='dottedUnderline'>{this.state.individualValue.label}</u> : <u className='dottedUnderline'>-</u>}
																</div>
																<label htmlFor="individual">Customer Contact</label>
															</div>}
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label min-ht-unset editable-form-outer">
														{this.state.editProposal ?
															<select
																key="proposal"
																value={this.state.proposalValue ? this.state.proposalValue._id : '-'}
																onChange={this.handleProposalChange}
																onBlur={() => { this.setState({ editProposal: false }) }}
																className="form-control form-control-static">
																<option value='0'>Select</option>
																{proposalData}
															</select> :
															<div onClick={() => {
																this.setState({
																	editProposal: true,
																	editContact: false,
																	editCompany: false,
																	editEstimateName: false,
																	editProject: false,
																	editStage: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="form-control form-control-static">{this.state.proposalValue ? <u className='dottedUnderline'>{this.state.proposalValue.proposalNumber}</u> : <u className='dottedUnderline'>-</u>}</div>
														}

														<label htmlFor="proposal">Proposal #</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label min-ht-unset editable-form-outer">
														{this.state.editProject ?
															<select
																key={this.state.projectValue}
																value={this.state.projectValue ? this.state.projectValue._id : ''}
																onChange={this.handleProjectChange}
																className="form-control form-control-static"
																onBlur={() => { this.setState({ editProject: false }) }}
															>
																<option value='0'>Select</option>
																{projectData}
															</select>
															: <div onClick={() => {
																this.setState({
																	editProject: true,
																	editContact: false,
																	editCompany: false,
																	editEstimateName: false,
																	editProposal: false,
																	editStage: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="form-control form-control-static">{this.state.projectValue ? this.state.projectValue.title : '-'}</div>
														}

														<label htmlFor="project">Project</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														<div className="form-control form-control-static"> {estimateDetailData.createdAt ? moment(estimateDetailData.createdAt).format('LLL') : '-'} </div>
														<label htmlFor="date">Date</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														<div className="form-control form-control-static"> {estimateDetailData.estimateNumber ? estimateDetailData.estimateNumber : '-'} </div>
														<label htmlFor="estimateNo">Estimate #</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{this.state.editSalesRep ? <div className="select-outer"><Select
															className="form-control form-control-static"
															value={this.state.salesrepValue}
															placeholder="Sales Rep"
															name="salesrep"
															id="salesrep"
															options={this.state.salesrepOptions}
															onBlur={this.handleSalesBlur}
															noResultsText="Search for Sales Rep"
															onChange={this.handleSalesRepChange}
															onInputChange={this.onSalesRepInputChange}
														/>
															<label htmlFor="salesrep">Sales Rep</label>
															<span onClick={() => { this.setState({ editSalesRep: false }) }} className='ico-inp-common  fa fa-close'></span>
														</div> : <div>
																<div onClick={() => {
																	this.setState({
																		editSalesRep: true,
																		editContact: false,
																		editCompany: false,
																		editEstimateName: false,
																		editProposal: false,
																		editProject: false,
																		editStage: false,
																		editEstimateNote: false,
																		editProposedService: false,
																		edits_zip: false,
																		editb_add2: false,
																		editb_add1: false,
																		editb_city: false,
																		editb_state: false,
																		editb_zip: false,
																		edits_add1: false,
																		edits_add2: false,
																		edits_city: false,
																		edits_state: false,
																	})
																}} className="form-control form-control-static">{this.state.salesrepValue && this.state.salesrepValue.label != "" ? <u className='dottedUnderline'>{this.state.salesrepValue.label}</u> : <u className='dottedUnderline'>-</u>}</div>
																<label htmlFor="salesrep">Sales Rep</label>
															</div>}

													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label min-ht-unset editable-form-outer">
														{this.state.editStage ? <select
															className="form-control form-control-static"
															id="stageType"
															ref="stageType"
															name="stageType"
															key={this.state.stageValue}
															value={this.state.stageValue ? this.state.stageValue._id : ''}
															onChange={this.handleStageChange}
															onBlur={() => { this.setState({ editStage: false }) }}
														>
															{estimateStagesData}
														</select> :
															<div onClick={() => {
																this.setState({
																	editStage: true,
																	editContact: false,
																	editCompany: false,
																	editEstimateName: false,
																	editProposal: false,
																	editProject: false,
																	editEstimateNote: false,
																	editProposedService: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="form-control form-control-static">{estimateDetailData.stage ? <u className='dottedUnderline'>{estimateDetailData.stage.stageName}</u> : <u className='dottedUnderline'>-</u>}</div>}
														<label htmlFor="stage">Stage</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														{this.state.editEstimateNote ?
															<div className="input-ico-outer form-control form-control-static">
																<TextareaAutosize
																	style={{ resize: 'none' }}
																	className="form-control"
																	rows={1}
																	ref="note"
																	name="note"
																	defaultValue={this.state.estimateNote ? this.state.estimateNote : ''}
																	key={this.state.estimateNote ? this.state.estimateNote : '-'}
																>
																</TextareaAutosize>
																<span onClick={this.handleEstimateNoteChange} className='ico-inp-common fa fa-check'></span>
																<span onClick={() => { this.setState({ editEstimateNote: false }) }} className='ico-inp-common fa fa-close'></span>
															</div> :
															<div onClick={() => {
																this.setState({
																	editEstimateNote: true,
																	editStage: false,
																	editContact: false,
																	editCompany: false,
																	editEstimateName: false,
																	editProposal: false,
																	editProject: false,
																	editProposedService: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="form-control form-control-static">{this.state.estimateNote ? <u className='dottedUnderline'>{this.state.estimateNote}</u> : <u className='dottedUnderline'>-</u>}</div>}

														<label htmlFor="opportunity">Estimate Notes</label>
													</div>
												</div>
												<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														<label style={{ marginTop: '0', fontSize: '13px', transition: 'all .2s ease', color: '#999' }} htmlFor="opportunity">Proposed Services (visible on quote)</label>
														{this.state.editProposedService ?
															<div>
																<RichTextEditor
																	toolbarConfig={toolbarConfig}
																	value={this.state.proposedServiceValue}
																	onChange={this.onChange}
																	className="Summernote"
																	id="summernote" />
																<span onClick={this.handleProposedServiceChange} className='ico-inp-common fa fa-check'></span>
																<span onClick={() => { this.setState({ editProposedService: false }) }} className='ico-inp-common fa fa-close'></span>
															</div> :
															<div onClick={() => {
																this.setState({
																	editProposedService: true,
																	editStage: false,
																	editContact: false,
																	editCompany: false,
																	editEstimateName: false,
																	editProposal: false,
																	editProject: false,
																	editEstimateNote: false,
																	editSalesRep: false,
																	edits_zip: false,
																	editb_add2: false,
																	editb_add1: false,
																	editb_city: false,
																	editb_state: false,
																	editb_zip: false,
																	edits_add1: false,
																	edits_add2: false,
																	edits_city: false,
																	edits_state: false,
																})
															}} className="proposedService dottedUnderline" dangerouslySetInnerHTML={{ __html: estimateDetailData.proposedServices }}></div>}
													</div>
												</div>
											</div>
										</div>
									</form>

									<div className="portlet light portlet-fit portlet-datatable bordered">
										{this.state.itemPricedData.length != 0 ? <div className="portlet light bordered">
											<div className="portlet-title tabbable-line">
												<div className="caption">
													<i className="icon-share font-dark"></i>
													<span className="caption-subject font-dark bold uppercase">Line Items</span>
												</div>
												{this.state.revisedItems.length != 0 ? <button onClick={this.handleRevisionExport}
													className="btn green-haze btn-circle btn-sm pull-right"
													style={{ marginTop: '13px' }}>
													Export
												</button> : null}
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
																<div className="table-container table-responsive">
																	<table className="table table-striped table-bordered lineitem" >
																		<thead >
																			<tr>
																				<th className="items">#</th>
																				<th className="items">Mfg</th>
																				<th className="items">Model No</th>
																				<th className="items">Part No</th>
																				<th className="items">Desc</th>
																				<th className="items">Qty</th>
																				<th className="material" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
																				<th className="labor" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
																				<th className="rowtotal">Row Total</th>
																			</tr>
																		</thead>
																		<tbody>
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
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((laborTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((grandTotal).toFixed(2))}</td>
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
																<div className="table-container table-responsive">
																	<table className="table table-striped table-bordered lineitem" >
																		<thead >
																			<tr>
																				<th className="items" rowSpan="2">#</th>
																				<th className="items" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 1)}>Item</th>
																				<th className="items" rowSpan="2">Qty</th>
																				<th className="material" colSpan="8">Material</th>
																				<th className="labor" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 3)}>Labor</th>
																				<th className="rowtotal" rowSpan="2">Row Total</th>
																			</tr>
																			<tr>
																				<th className="material">Taxable</th>
																				<th className="material">Our Cost</th>
																				<th className="material">Our Cost Ext</th>
																				<th className="material">Mark Up</th>
																				<th className="material">Cost</th>
																				<th className="material">Extended</th>
																				<th className="material">Tax</th>
																				<th className="material">Tax Extended</th>
																			</tr>
																		</thead>
																		<tbody>
																			{materialTabData}
																		</tbody>
																		{this.state.itemPricedData.length != 0 ? <tfoot>
																			<tr>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mOurCostTotal).toFixed(2))}</td>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mTaxTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((laborTotal).toFixed(2))}</td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((grandTotal).toFixed(2))}</td>
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
																<div className="table-container table-responsive">
																	<table className="table table-striped table-bordered lineitem" >
																		<thead >
																			<tr>
																				<th className="items" rowSpan="2">#</th>
																				<th className="items" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 1)}>Item</th>
																				<th className="items" rowSpan="2">Qty</th>
																				<th className="material" rowSpan="2" style={{ cursor: 'pointer' }} onClick={this.handleLineTab.bind(this, 2)}>Material</th>
																				<th className="labor" colSpan="6">Labor</th>
																				<th className="rowtotal" rowSpan="2">Row Total</th>
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
																		<tbody>
																			{laborTabData}
																		</tbody>
																		{this.state.itemPricedData.length != 0 ? <tfoot>
																			<tr>
																				<td></td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((materialTotal).toFixed(2))}</td>
																				<td></td>
																				<td></td>
																				<td style={{ textAlign: 'center' }}>{lHoursExtended}</td>
																				<td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((lRateTotal).toFixed(2))}</span></td>
																				<td></td>
																				<td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((lExtended).toFixed(2))}</span></td>
																				<td style={{ textAlign: 'right' }}><span>${validate.numberWithCommas((grandTotal).toFixed(2))}</span></td>
																			</tr>
																		</tfoot> : null}
																	</table>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* Revision  notes */}
											{this.state.revisedItems.length ? <div className="row">
												<div className="col-md-12 col-sm-12 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
														<div className="form-control form-control-static white_space">
															{this.state.revisedItems[0].revisionNotes ? this.state.revisedItems[0].revisionNotes : '-'}
														</div>
														<label htmlFor="revisionNotes">Revision Notes
														</label>
													</div>
												</div>
											</div> : null}

											{/* Total section starts*/}
											<div className="row">
												<div className="col-md-4">
													<table className="table table-striped table-bordered">
														<caption className="font-dark bold uppercase">Material</caption>
														<tbody>
															<tr>
																<th colSpan="1">Cost</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((totalCost).toFixed(2))}</td>
															</tr>
															<tr>
																<th colSpan="1">Our Cost Total</th>
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mOurCostTotal).toFixed(2))}</td>
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
																<td style={{ textAlign: 'right' }}>${validate.numberWithCommas((mExtendedTotal).toFixed(2))}</td>
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
											</div>
											{/* Total section ends */}
										</div> : null}
									</div>
								</div>
								<div className="tab-pane" id="estimate-moreinfo">
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
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static"> {estimateDetailData.opportunityId ? estimateDetailData.opportunityId.title : '-'} </div>
																<label htmlFor="title">Title</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static">{estimateDetailData.createdBy ? estimateDetailData.createdBy : '-'}</div>
																<label htmlFor="createdby">Created By</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static">{estimateDetailData.createdAt ? moment(estimateDetailData.createdAt).format('LLL') : '-'}</div>
																<label htmlFor="createdon">On</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static">{estimateDetailData.estimateNumber ? estimateDetailData.estimateNumber : '-'}</div>
																<label htmlFor="estimateNo">Estimate #</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static">{estimateDetailData.modifiedBy ? estimateDetailData.modifiedBy : '-'}</div>
																<label htmlFor="modifiedby">Modified By</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																<div className="form-control form-control-static">{estimateDetailData.modifiedBy ? moment(estimateDetailData.updatedAt).format('LLL') : '-'}</div>
																<label htmlFor="modifiedon">On</label>
															</div>
														</div>
													</div>
												</div>
											</form>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Billing Address Details</span>
												</div>
											</div>
											<form role="form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.editb_add1 ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="b_add1"
																			name="b_add1"
																			defaultValue={this.state.b_add1 ? this.state.b_add1 : ''}
																			key={this.state.b_add1 ? this.state.b_add1 : '-'}
																		// onBlur={() => { this.setState({ editb_add1 : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_b_Add1Change} className='ico-inp-common fa fa-check'></span>
																		<span onClick={() => { this.setState({ editb_add1: false }) }} className='ico-inp-common fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			editb_add1: true,
																			editb_add2: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.b_add1 ? <u className='dottedUnderline'>{this.state.b_add1}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="billAddr1">Address 1</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.editb_add2 ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="b_add2"
																			name="b_add2"
																			defaultValue={this.state.b_add2 ? this.state.b_add2 : ''}
																			key={this.state.b_add2 ? this.state.b_add2 : '-'}
																		// onBlur={() => { this.setState({ editb_add2 : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_b_Add2Change} className='ico-inp-common fa fa-check'></span>
																		<span onClick={() => { this.setState({ editb_add2: false }) }} className='ico-inp-common fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			editb_add2: true,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.b_add2 ? <u className='dottedUnderline'>{this.state.b_add2}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="billAddr2">Address 2</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.editb_city ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="b_city"
																			name="b_city"
																			defaultValue={this.state.b_city ? this.state.b_city : ''}
																			key={this.state.b_city ? this.state.b_city : '-'}
																		// onBlur={() => { this.setState({ editb_city : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_b_CityChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ editb_city: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			editb_city: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.b_city ? <u className='dottedUnderline'>{this.state.b_city}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">City</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.editb_state ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="b_state"
																			name="b_state"
																			defaultValue={this.state.b_state ? this.state.b_state : ''}
																			key={this.state.b_state ? this.state.b_state : '-'}
																		// onBlur={() => { this.setState({ editb_state : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_b_StateChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ editb_state: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			editb_state: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.b_state ? <u className='dottedUnderline'>{this.state.b_state} </u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">State</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.editb_zip ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="b_zip"
																			name="b_zip"
																			defaultValue={this.state.b_zip ? this.state.b_zip : ''}
																			key={this.state.b_zip ? this.state.b_zip : '-'}
																		// onBlur={() => { this.setState({ editb_zip : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_b_ZipChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ editb_zip: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			editb_zip: true,
																			edits_add1: false,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.b_zip ? <u className='dottedUnderline'>{this.state.b_zip}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">Zip</label>
															</div>
														</div>
													</div>
												</div>
											</form>
											<div className="portlet-title">
												<div className="caption">
													<span className="caption-subject bold uppercase">Shipping Address Details</span>
												</div>
											</div>
											<form role="form">
												<div className="form-body">
													<div className="row">
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.edits_add1 ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="s_add1"
																			name="s_add1"
																			defaultValue={this.state.s_add1 ? this.state.s_add1 : ''}
																			key={this.state.s_add1 ? this.state.s_add1 : '-'}
																		// onBlur={() => { this.setState({ edits_add1 : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_s_Add1Change} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ edits_add1: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			edits_add1: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.s_add1 ? <u className='dottedUnderline'>{this.state.s_add1}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="billAddr">Address 1</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.edits_add2 ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control scrollable-textarea"
																			rows={1}
																			ref="s_add2"
																			name="s_add2"
																			defaultValue={this.state.s_add2 ? this.state.s_add2 : ''}
																			key={this.state.s_add2 ? this.state.s_add2 : '-'}
																		// onBlur={() => { this.setState({ edits_add2 : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_s_Add2Change} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ edits_add2: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			edits_add2: true, editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_city: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.s_add2 ? <u className='dottedUnderline'>{this.state.s_add2}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">Address 2</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.edits_city ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="s_city"
																			name="s_city"
																			defaultValue={this.state.s_city ? this.state.s_city : ''}
																			key={this.state.s_city ? this.state.s_city : '-'}
																		// onBlur={() => { this.setState({ edits_city : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_s_CityChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ edits_city: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			edits_city: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_state: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.s_city ? <u className='dottedUnderline'>{this.state.s_city}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">City</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.edits_state ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="s_state"
																			name="s_state"
																			defaultValue={this.state.s_state ? this.state.s_state : ''}
																			key={this.state.s_state ? this.state.s_state : '-'}
																		// onBlur={() => { this.setState({ edits_state : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_s_StateChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ edits_state: false }) }} className='ico-inp-common  fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			edits_state: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_zip: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.s_state ? <u className='dottedUnderline'>{this.state.s_state}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">State</label>
															</div>
														</div>
														<div className="col-md-4 col-sm-6 col-xs-12 editable-form-outer">
															<div className="form-group form-md-line-input form-md-floating-label editable-form-outer">
																{this.state.edits_zip ?
																	<div className="input-ico-outer form-control form-control-static">
																		<TextareaAutosize
																			style={{ resize: 'none' }}
																			className="form-control"
																			rows={1}
																			ref="s_zip"
																			name="s_zip"
																			defaultValue={this.state.s_zip ? this.state.s_zip : ''}
																			key={this.state.s_zip ? this.state.s_zip : '-'}
																		// onBlur={() => { this.setState({ edits_zip : false }) }}
																		>
																		</TextareaAutosize>
																		<span onClick={this.handle_s_ZipChange} className='ico-inp-common  fa fa-check'></span>
																		<span onClick={() => { this.setState({ edits_zip: false }) }} className='ico-inp-common fa fa-close'></span>
																	</div>
																	: <div onClick={() => {
																		this.setState({
																			edits_zip: true,
																			editb_add2: false,
																			editb_add1: false,
																			editb_city: false,
																			editb_state: false,
																			editb_zip: false,
																			edits_add1: false,
																			edits_add2: false,
																			edits_city: false,
																			edits_state: false,
																			editProposedService: false,
																			editStage: false,
																			editContact: false,
																			editCompany: false,
																			editEstimateName: false,
																			editProposal: false,
																			editProject: false,
																			editEstimateNote: false,
																			editSalesRep: false
																		})
																	}} className="form-control form-control-static">{this.state.s_zip ? <u className='dottedUnderline'>{this.state.s_zip}</u> : <u className='dottedUnderline'>-</u>}</div>}
																<label htmlFor="shipAddr">Zip</label>
															</div>
														</div>
													</div>
												</div>
											</form>
										</div>
									</div>
								</div>
								<div className="tab-pane" id="estimate-memos">
									<div className="portlet light portlet-fit portlet-datatable bordered">
										{this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <div className="portlet-title">
											<div className="actions">
												<a href="#est_memos" data-toggle="modal"
													data-backdrop="static" data-keyboard="false" className="btn btn-sm btn-circle green">
													<i className="icon-plus"></i>
													Add Memo
												</a>
											</div>
										</div> : null}
										<div className="portlet-body">
											<div className="table-container table-responsive">
												<table className="table table-striped table-bordered table-hover" id="estimate_memos">
													<thead >
														<tr style={{ cursor: 'normal' }}>
															<th>User</th>
															<th>Date/Time</th>
															<th>Message</th>
														</tr>
													</thead>
													<tbody style={{ cursor: 'normal' }}>
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
				<div id="est_memos" className="modal fade" tabIndex="-1" aria-hidden="true">
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
										<div className="input-ico-outer form-group form-md-line-input form-md-floating-label editable-form-outer">
											<TextareaAutosize
												style={{ resize: 'none' }}
												className="form-control"
												rows={1}
												ref="estMemo"
												name="estMemo"
												id="estMemo"
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
				<DeleteModal deleteModalId="estimate_delete" deleteUserHandler={this.deleteEstimateHandler} />
				<AddRevision
					revisionModalId="add_revision"
					isCheckedDuplicate={this.state.isCheckedDuplicate}
					isCheckedEmpty={this.state.isCheckedEmpty}
					addRevision={this.addRevisionhandler}
					revisionNo={this.state.revisionNo}
					radioHandler={this.handleRadioUpdate}
					revisedItems={revisionList}
					ref={'revised'} />
				<ConfirmationDialog
					id={'confirmEdit'}
					title={this.state.editTitle}
					message={'Are you sure you want to continue ?'}
					confirmationHandler={this.EditConfirmationHandler}
				/>
				<div id="create_project" className="modal fade bs-modal-md" tabIndex="-1" aria-hidden="true">
					<form role="form" id="addOtherProjectType">
						<div className="modal-dialog modal-md">
							<div className="modal-content">
								<div className="modal-header">
									<button type="button" className="close" data-dismiss="modal" aria-hidden="true" ></button>
									<div className="actions">
										<h5 className="modal-title">Create New Project/SO</h5>
									</div>
								</div>
								<div className="modal-body">
								<div className="col-md-6" className="work_log_custom_radio">
										<input name='status' ref="project" type="radio" value="1" onChange={this.handleRadioChange} /><label>Project</label>
										<input name='status' ref="serviceorder" type="radio" value="0" className="check_out_radio" onChange={this.handleRadioChange} /><label>Service Order</label>
									</div>
										<div className="col-md-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<label htmlFor="projectmanager">{this.state.project}<span className="required">*</span>
											</label>
											<Select
												// disabled={this.state.disabled}
												value={this.state.projectMngValue}
												placeholder="Select Contact"
												name="individual_role"
												id="individual_role"
												options={this.state.PMOptions}
												onChange={this.handlePMValueChange}
												onInputChange={this.onPMInputChange}
											/>

										</div>
									</div>
									<div className="col-md-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<input
												type="text"
												className="form-control"
												id="projectName"
												name="projectName"
												ref="projectName"
												defaultValue="" />
											<label htmlFor="project">{this.state.service}<span className="required">*</span>
											</label>
										</div>
									</div>
								
								
								</div>

								<div className="modal-footer">
									<button type="button" data-dismiss="modal"  onClick={this.cancelCourse}className="btn dark btn-outline">Cancel</button>
									<button
										type="button"
										className="btn green"
										id="send-invite-button" onClick={this.createNewProjectSO}>Create</button>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		estimateDetail: state.estimate.estimateDetails,
		revisionNo: state.estimate.revisionNo,
		proposalList: state.estimate.proposalList,
		projectList: state.estimate.projectList,
		estimateStages: state.estimate.estimateStages,
		salesRepList: state.estimate.salesRepList,
		companyList: state.estimate.companyList,
		// contactDetails: state.estimate.contactDetails,
		individualList: state.estimate.individualList,
		employeeList: state.estimate.employeeList,
		orderNo: state.serviceOrder.orderNo,


	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(estimateActions, dispatch),
		settingsActions: bindActionCreators(settingsActions, dispatch),
		orderAction: bindActionCreators(orderActions, dispatch),

	};
}




export default connect(mapStateToProps, mapDispatchToProps)(EstimateDetail);