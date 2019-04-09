import React from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import { IndustriesDrop } from './industriesDrop.component';
import { OpportunitySourcesDrop } from './opportunitySourcesDrop.component';
import { LaborRatesDrop } from './laborRatesDrop.component';
import { ServiceOrderTypes } from './serviceOrderTypes.component';
import { EstimateStages } from './estimateStages.component';
import * as layout from '../../scripts/app';
import autoBind from 'react-autobind';
import BlockUi from 'react-block-ui';
import * as functions from '../common/functions';
// import { browserHistory } from 'react-router';
import * as types from '../../constants/actionTypes';
import * as estimateActions from '../../actions/estimateActions';
import * as orderActions from '../../actions/orderActions';
import * as settingsActions from '../../actions/settingsActions';
import SetDropdownModal from './setDropdownModal.component';
import DeleteDropdownModal from './deleteDropdownModal.component';
import LaborRateUpdateModal from './laborRateUpdateModal.component';

//Dropdowns and lists at application level

class DropDownLists extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			industries: [],
			opportunitySources: [],
			serviceOrderTypes: [],
			laborRates: [],
			estimateStagesList: [],
			pageIndex: 1,
			title: 'Opportunity Industries',
			modalIsOpen: false,
			modalTitle: '',
			isDeleteModalOpen: false,
			editable: false,
			editData: null,
			editId: null,
			laborRateModal: false,
			laborEditable: false,
			blocking: true
		};
	}
	componentDidMount() {
		functions.showLoader('setting_compo');    
	}

	componentWillMount() {
		//  
		let data = {
			parent: 'Dropdowns / Lists',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
		let industryData = {
			companyId: localStorage.companyId,
			moduleType: 2
		};
		let params = {
			companyId: localStorage.companyId,
			moduleType: 2
		};
		let estimateParams = {
			companyId: localStorage.companyId,
			moduleType: 1
		};
		this.props.actions.getDropIndustries(industryData);
		this.props.actions.getOpportunitySource(params);
		this.props.actions.getEstimateStages(estimateParams);
		this.props.estimateActions.getLaborRates(params, types.GET_LABOR_RATE_FOR_ADMIN);
		this.props.orderAction.getOrderTypes(params);
	}

	componentWillReceiveProps(nextProps) {
		if ((nextProps.industryList !== this.props.industryList)) {
			this.setState({ industries: nextProps.industryList, blocking: false });
		}
		if ((nextProps.sourceList !== this.props.sourceList)) {
			this.setState({ opportunitySources: nextProps.sourceList });
		}
		if ((nextProps.laborRates !== this.props.laborRates)) {
			this.setState({ laborRates: nextProps.laborRates });
		}
		if ((nextProps.orderTypeList !== this.props.orderTypeList)) {
			this.setState({ serviceOrderTypes: nextProps.orderTypeList });
		}
		if ((nextProps.estimateStages !== this.props.estimateStages)) {
			this.setState({ estimateStagesList: nextProps.estimateStages });
		}
		const el = findDOMNode(this.refs.setting_compo);
		setTimeout(function () {
			$(el).unblock();
		},1500);
	}

	getSelectedPage(index) {
		switch (index) {
		case 1:
			return <IndustriesDrop industries={this.state.industries} handleEdit={this.handleEdit} handleDelete={this.openDeleteModal} />; // deletee={this.openDeleteModal}
		case 2:
			return <OpportunitySourcesDrop sources={this.state.opportunitySources} handleEdit={this.handleEdit} handleDelete={this.openDeleteModal} />;
		case 3:
			return <LaborRatesDrop laborRates={this.state.laborRates} handleEdit={this.handleEdit} handleDelete={this.openDeleteModal} />;
		case 4:
			return <ServiceOrderTypes serviceOrderTypes={this.state.serviceOrderTypes} handleEdit={this.handleEdit} handleDelete={this.openDeleteModal} />;
		case 5:
			return <EstimateStages estimateStagesList={this.state.estimateStagesList} handleEdit={this.handleEdit} handleDelete={this.openDeleteModal} />;
		default:
			return 'Sorry you are not authorized in this page';
		}
	}

	handleActiveChange(index, title, e) {
		this.setState({
			pageIndex: index,
			title: title
		});
	}

	closeaddDropModal() {
		this.setState({
			modalIsOpen: false,
			editData: null,
			editable: false,
			editId: null
		});
	}

	closeLaborRateModal() {

		this.setState({
			laborRateModal: false,
			editData: null,
			laborEditable: false,
			editId: null
		});
	}

	closeDeleteDropModal() {
		this.setState({ isDeleteModalOpen: false, editId: null });
	}

	openModal(title) {

		if (title.title === 'Labor Rates') {
			this.setState({ laborRateModal: true, modalTitle: title });
		}
		else {
			this.setState({ modalIsOpen: true, modalTitle: title });
		}
	}

	openDeleteModal(e, index, id) {

		this.setState({ isDeleteModalOpen: true, editId: id });
	}

	handleEdit(e, index) {

		let value = null;
		let editId = null;
		let currentData = null;

		switch (this.state.title) {
		case 'Opportunity Industries':
			currentData = this.state.industries.slice();
			value = currentData[index].industryName;
			editId = currentData[index]._id;
			this.setState({ editData: value, editable: true, modalIsOpen: true, editId: editId });
			break;
		case 'Opportunity Sources':
			currentData = this.state.opportunitySources.slice();
			value = currentData[index].sourceName;
			editId = currentData[index]._id;
			this.setState({ editData: value, editable: true, modalIsOpen: true, editId: editId });
			break;
		case 'Service Order Type':
			currentData = this.state.serviceOrderTypes.slice();
			value = currentData[index].orderTypeName;
			editId = currentData[index]._id;
			this.setState({ editData: value, editable: true, modalIsOpen: true, editId: editId });
			break;
		case 'Estimate Stage':
			currentData = this.state.estimateStagesList.slice();
			value = currentData[index].stageName;
			editId = currentData[index]._id;
			this.setState({ editData: value, editable: true, modalIsOpen: true, editId: editId });
			break;
		case 'Labor Rates':
			currentData = this.state.laborRates.slice();
			value = currentData[index];
			editId = currentData[index]._id;
			this.setState({ editData: value, laborEditable: true, laborRateModal: true, editId: editId });
			break;
		}
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 100);
	}

	deleteDropHandler(e, index) {

		let value = {};
		let companyId = localStorage.companyId;
		switch (this.state.title) {
		case 'Opportunity Industries':
			value = {
				industryId: this.state.editId,
				companyId: companyId
			};
			this.props.actions.deleteDropIndustries(value);
			this.closeDeleteDropModal();
			break;
		case 'Opportunity Sources':
			value = {
				sourceId: this.state.editId,
				companyId: companyId
			};
			this.props.actions.deleteOpportunitySource(value);
			this.closeDeleteDropModal();
			break;
		case 'Service Order Type':
			value = {
				typeId: this.state.editId,
				companyId: companyId
			};
			this.props.actions.deleteOrderType(value);
			this.closeDeleteDropModal();
			break;
		case 'Estimate Stage':
			value = {
				stageId: this.state.editId,
				companyId: companyId
			};
			this.props.actions.deleteAppStage(value);
			this.closeDeleteDropModal();
			break;
		case 'Labor Rates':
			value = {
				laborId: this.state.editId,
				companyId: companyId
			};
			this.props.actions.deleteLaborRate(value);
			this.closeDeleteDropModal();
			break;
		}
	}

	saveDropHandler(data) {

		let value = {};
		switch (this.state.title) {
		case 'Opportunity Industries':
			value = {
				industryName: data,
				companyId: localStorage.companyId,
				moduleType: 2
			};
			if (this.state.editId) {
				value.industryId = this.state.editId;
			}
			this.state.editId ? this.props.actions.updateDropIndustries(value) : this.props.actions.addDropIndustries(value);
			this.closeaddDropModal();
			break;
		case 'Opportunity Sources':
			value = {
				sourceName: data,
				companyId: localStorage.companyId,
				moduleType: 2
			};
			if (this.state.editId) {
				value.sourceId = this.state.editId;
			}
			this.state.editId ? this.props.actions.updateOpportunitySource(value) : this.props.actions.addOpportunitySource(value);
			this.closeaddDropModal();
			break;
		case 'Service Order Type':
			value = {
				orderTypeName: data,
				companyId: localStorage.companyId,
				moduleType: 2
			};
			if (this.state.editId) {
				value.typeId = this.state.editId;
			}
			this.state.editId ? this.props.actions.updateOrderType(value) : this.props.actions.addOrderType(value);
			this.closeaddDropModal();
			break;
		case 'Estimate Stage':
			value = {
				stageName: data,
				companyId: localStorage.companyId,
				moduleType: 1
			};
			if (this.state.editId) {
				value.stageId = this.state.editId;
			}
			this.state.editId ? this.props.actions.updateEstimateStage(value) : this.props.actions.addEstimateStage(value);
			this.closeaddDropModal();
			break;
		case 'Labor Rates':
			value = data;
			if (this.state.editId) {
				value.laborId = this.state.editId;
			}
			this.state.editId ? this.props.actions.updateLaborRate(value) : this.props.actions.addLaborRate(value);
			this.closeLaborRateModal();
			break;
		default:
			alert('Not a correct action');
		}
	}

	render() {
		return (
			<div className="row" id="setting_compo" ref='setting_compo'>
				<div className="col-md-12">
					<div className="todo-ui">
						<div className="todo-sidebar">
							<div className="portlet light bordered">
								<div className="portlet-title">
									<div className="caption" data-toggle="collapse" data-target=".todo-project-list-content">
										<span className="caption-subject font-green-sharp bold uppercase">Dropdown / Lists </span>
										<span className="caption-helper visible-sm-inline-block visible-xs-inline-block">Click to view lists</span>
									</div>
								</div>
								<div className="portlet-body todo-project-list-content">
									<div className="todo-project-list">
										<ul className="nav nav-stacked">
											<li className={this.state.pageIndex === 1 ? 'drop-down-active' : ''} onClick={this.handleActiveChange.bind(this, 1, 'Opportunity Industries')}>
												<a href="javascript:;">
													<span className="badge badge-info"> {this.state.industries.length} </span>Opportunity Industries
												</a>
											</li>
											<li className={this.state.pageIndex === 2 ? 'drop-down-active' : ''} onClick={this.handleActiveChange.bind(this, 2, 'Opportunity Sources')}>
												<a href="javascript:;">
													<span className="badge badge-info"> {this.state.opportunitySources.length} </span> Opportunity Sources
												</a>
											</li>
											<li className={this.state.pageIndex === 3 ? 'drop-down-active' : ''} onClick={this.handleActiveChange.bind(this, 3, 'Labor Rates')}>
												<a href="javascript:;">
													<span className="badge badge-info"> {this.state.laborRates.length} </span> Labor Rates
												</a>
											</li>
											<li className={this.state.pageIndex === 4 ? 'drop-down-active' : ''} onClick={this.handleActiveChange.bind(this, 4, 'Service Order Type')}>
												<a href="javascript:;">
													<span className="badge badge-info"> {this.state.serviceOrderTypes.length} </span> Service Order Type
												</a>
											</li>
											<li className={this.state.pageIndex === 5 ? 'drop-down-active' : ''} onClick={this.handleActiveChange.bind(this, 5, 'Estimate Stage')}>
												<a href="javascript:;">
													<span className="badge badge-info"> {this.state.estimateStagesList.length} </span> Estimate Stage
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
						<div className="todo-content">
							<div className="portlet light bordered">
								<div className="portlet-title">
									<div className="caption">
										<i className="icon-bar-chart font-green-sharp hide"></i>
										<span className="caption-subject font-green-sharp bold uppercase">{this.state.title}</span>
									</div>
									<div className="actions">
										<button onClick={() => {
											var title = this.state.title;
											this.openModal({ title });
										}}
										className="btn btn-sm btn-circle green">
											<i className="icon-plus"></i>{this.state.title} </button>
									</div>
								</div>
								<BlockUi tag="div" blocking={this.state.blocking}>
									<div className="portlet-body">
										{this.getSelectedPage(this.state.pageIndex ? this.state.pageIndex : 1)}
									</div>
								</BlockUi>
							</div>
						</div>
					</div>
				</div>
				<SetDropdownModal
					modalIsOpen={this.state.modalIsOpen}
					closeModal={this.closeaddDropModal}
					title={this.state.title}
					saveHandler={this.saveDropHandler}
					editable={this.state.editable}
					editData={this.state.editData}
				/>
				<LaborRateUpdateModal
					modalIsOpen={this.state.laborRateModal}
					closeModal={this.closeLaborRateModal}
					title={this.state.title}
					saveHandler={this.saveDropHandler}
					editable={this.state.laborEditable}
					editData={this.state.editData}
				/>
				<DeleteDropdownModal
					modalIsOpen={this.state.isDeleteModalOpen}
					closeModal={this.closeDeleteDropModal}
					title={this.state.title}
					deleteHandler={this.deleteDropHandler}
				/>
			</div>
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		industryList: state.settings.industryList,
		sourceList: state.settings.sourceList,
		laborRates: state.settings.laborRates,
		orderTypeList: state.settings.orderTypesData,
		estimateStages: state.settings.estimateStages
	};
}
// this.props.______
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(settingsActions, dispatch),
		estimateActions: bindActionCreators(estimateActions, dispatch),
		orderAction: bindActionCreators(orderActions, dispatch),
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(DropDownLists);
