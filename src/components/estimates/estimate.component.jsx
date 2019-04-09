import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import RoleAwareComponent from '../authorization/roleaware.component';
// import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as estimateActions from '../../actions/estimateActions';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import autoBind from 'react-autobind';
import * as appValid from '../../scripts/app';
import jQuery from 'jquery';
import CreateEstimateModal from '../common/createEstimateWithNameModal.jsx';
import ReactDOM from 'react-dom';
import GridFilter from '../common/gridFilter.component';
import ReactPaginate from 'react-paginate';

class Estimates extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			estimateData: '',
			estId: '',
			deleteIndex: '',
			newEstimateName: '',
			estimateNumber: '',
			Data: {
				estimates: [],
				totalcount: 0,
				sortColumnName: null,
				sortOrder: null,
				page: 1,
				per_page: 20,
				searchText: ''
			},
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Estimates',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.estimatedata.length != 0) {
			var estimatestate = JSON.parse(JSON.stringify(nextProps.estimatedata));
			this.setState({
				Data: estimatestate
			});
			$('div#estimates_list').unblock();
		} else if (nextProps.estimatedata.length == 0) {
			setTimeout(function () {
				$('div#estimates_list').unblock();
			}, 2000);
		}
		if (nextProps.estimateNo) {
			this.setState({ estimateNumber: nextProps.estimateNo });
		}
	}
	handleDetail(index) {
		let currentData = this.state.Data.estimate[index];
		browserHistory.push('/estimate/' + currentData._id);
	}
	emptyState(e) {
		this.props.estimateactions.emptyState();
	}
	handleModalOpen() {
		var companyId = {
			companyId: localStorage.companyId
		};
		this.props.estimateactions.getEstimateNo(companyId);
		$('#create_estimate').modal('show');
		appValid.FormValidationMd.init();
	}
	handleModalClose() {
		$('#create_estimate').modal('hide');
		ReactDOM.findDOMNode(this.refs.ename.refs.ename).value = '';
	}
	handleInputChange(e) {
		this.setState({ newEstimateName: e.target.value.trim() });
	}
	saveEstimateName() {
		if (jQuery('#estimateName').valid()) {
			let data = {
				companyId: localStorage.companyId,
				createdBy: localStorage.userName,
				userId:localStorage.userId,
				estimateName: this.state.newEstimateName,
				estimateNumber: this.state.estimateNumber,
				item: [],
				revisionName: 'Rev0',
			};
			$('#create_estimate').modal('hide');
			this.props.estimateactions.saveEstimate(data);
		}
	}

	getEstimateData() {
		functions.showLoader('estimates_list');
		
		var params = {
			companyId: localStorage.companyId,
			per_page: this.state.Data.per_page,
			page: this.state.Data.page,
			searchText: this.state.Data.searchText
		};
		if(localStorage.roleName=='Estimates Creator'){
			params.userId=localStorage.userId;
		}
		if (this.state.Data.sortColumnName) {
			params.sortColumnName = this.state.Data.sortColumnName;
		}
		if (this.state.Data.sortOrder) {
			params.sortOrder = this.state.Data.sortOrder;
		}
		this.props.estimateactions.getEstimates(params);
	}
	// function for pagination
	pageChanged(pageNumber, e) {
		// e.preventDefault();
		this.state.Data.page = pageNumber.selected + 1;
		this.getEstimateData();
	}

	//function for sorting
	sortChanged(sortColumnName, order, e) {
		e.preventDefault();
		this.state.Data.sortColumnName = sortColumnName;
		this.state.Data.page = 1;
		this.state.Data.sortOrder = order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc';
		this.getEstimateData();
	}

	// function for set sort icon on table header
	_sortClass(filterName) {
		return 'fa fa-fw ' + ((filterName == this.state.Data.sortColumnName) ? ('fa-sort-' + this.state.Data.sortOrder) : 'fa-sort');
	}


	pageFilterChange(event) {
		this.state.Data.page = 1;
		this.state.Data.per_page = parseInt(event.target.value);
		this.getEstimateData();
	}

	searchChange(e) {
		e.preventDefault();
		var d = this.state.Data;
		d.searchText = e.target.value;
		this.setState({
			Data: d
		});
		if (!e.target.value) {
			this.getEstimateData();
		}
	}

	_search(event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			this.getEstimateData();
		}
	}

	render() {
		var estimatedata = this.state.Data.estimate;
		if (estimatedata) {
			if (estimatedata.length != 0) {
				var estimatesList = estimatedata.map(function (estimate, index) {
					return <tr key={index} onClick={this.handleDetail.bind(this, index)}>
						<td>{estimate.estimateNumber}</td>
						<td>{estimate.estimateName ? estimate.estimateName : '-'}</td>
						<td>{Object.keys(estimate.customerId).length != 0 ? estimate.customerId.companyName : '-'}</td>
						<td>{Object.keys(estimate.salesRep).length != 0 ? estimate.salesRep.firstname + ' ' + estimate.salesRep.lastname : '-'}</td>
						<td>{moment(estimate.createdAt).format('L')}</td>
					</tr>;
				}.bind(this));
			}
			else {
				estimatesList = <tr><td style={{ textAlign: 'center' }} colSpan="5">No matching records found</td></tr>;
			}
		} else {
			estimatesList = <tr><td style={{ textAlign: 'center' }} colSpan="5">No matching records found</td></tr>;
		}
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="estimates_list">

				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Estimates</span>
					</div>
					{/* {this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <div className="actions">
						<Link to="/estimate/add" className="btn btn-sm btn-circle green" onClick={this.emptyState}>
							<i className="icon-plus"></i> New Estimate </Link>
					</div> : null} */}
					{this.shouldBeVisible(authorize.estimatesEditorAuthorize) ? <div className="actions">
						<button className="btn btn-sm btn-circle green" onClick={this.handleModalOpen}>
							<i className="icon-plus"></i> New Estimate </button>
					</div> : null}
				</div>
				
				<div className="portlet-body">
					<GridFilter
						per_page={this.state.Data.per_page}
						handlePagingChange={this.pageFilterChange}
						handleSearchChange={this.searchChange}
						searchText={this.state.Data.searchText}
						_search={this._search}
					/>
					<div className="table-container table-responsive portlet_body_table_div">
						<table className="table table-striped table-bordered table-hover" id="estimates_table">
							<thead >
								<tr>
									<th onClick={this.sortChanged.bind(this, 'estimateNumber', this.state.Data.sortOrder)}>
										Estimate #
										<i className={this._sortClass('estimateNumber')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'estimateName', this.state.Data.sortOrder)}>
										Estimate Name
										<i className={this._sortClass('estimateName')}></i>
									</th>
									<th onClick={this.sortChanged.bind(this, 'customerId', this.state.Data.sortOrder)}>
										Company
										<i className={this._sortClass('customerId')}></i></th>
									<th onClick={this.sortChanged.bind(this, 'salesRep', this.state.Data.sortOrder)}>
										Sales Rep
										<i className={this._sortClass('salesRep')}></i></th>
									<th onClick={this.sortChanged.bind(this, 'createdAt', this.state.Data.sortOrder)}>
										Date
										<i className={this._sortClass('createdAt')}></i></th>
								</tr>
							</thead>
							<tbody>
								{estimatesList}
							</tbody>
						</table>
						<div className="pull-right">
							<ReactPaginate
								previousLabel={'previous'}
								nextLabel={'next'}
								breakLabel={<a>...</a>}
								breakClassName={'break-me'}
								marginPagesDisplayed={2}
								pageRangeDisplayed={5}
								pageCount={this.state.Data.totalcount - 1}
								onPageChange={this.pageChanged}
								containerClassName={'pagination'}
								subContainerClassName={'pages pagination'}
								activeClassName={'active'}
								forcePage={this.state.Data.page - 1}
								initialPage={this.state.Data.page - 1}
							/>
						</div>
					</div>
				</div>
				<CreateEstimateModal
					modalId='create_estimate'
					title='Create New Estimate'
					handleModalClose={this.handleModalClose}
					inputChange={this.handleInputChange}
					saveEstimateName={this.saveEstimateName}
					ref="ename" />
			</div>
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return {
		estimatedata: state.estimate.estimateList,
		createProposalData: state.proposal.createPrposalData,
		estimateNo: state.estimate.estimateNo
	};
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		estimateactions: bindActionCreators(estimateActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Estimates);
