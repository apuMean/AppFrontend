import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import RoleAwareComponent from '../authorization/roleaware.component';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as opportunityAction from '../../actions/opportunityAction';
import * as dashboardActions from '../../actions/dashboardActions';
import * as functions from '../common/functions';
import * as authorize from '../authorization/roleTypes';
import autoBind from 'react-autobind';
import GridFilter from '../common/gridFilter.component';
import GridPager from '../common/paging.component';
import ReactPaginate from 'react-paginate';


let opportunityStatus = false;

class Opportunity extends RoleAwareComponent {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			oppData: [],
			Data: {
				opportunity: [],
				totalcount: 0,
				sortColumnName: null,
				sortOrder: null,
				page: 1,
				per_page: 20,
				searchText: ''
			}
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Opportunities',
			childone: '',
			childtwo: ''
		};
		
		this.props.breadCrumb(data);
		
	}

	componentDidMount() {
		// functions.showLoader('opp_list');
	}

	handleDetail(id) {
		// let currentData = this.state.Data[index];
		browserHistory.push('/opportunity/' + id);
	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		const el = findDOMNode(self.refs.opp_list);

		
	
		if (nextProps.oppList.length != 0) {
			opportunityStatus = false;
			var oppState = JSON.parse(JSON.stringify(nextProps.oppList));
			this.setState({ Data: oppState });
			opportunityStatus = true;
			// var opp_list = $('#opportunity_list').DataTable();
			// opp_list.destroy();
			setTimeout(function () {
				datatable
					.OpportunityTable
					.init();
			}, 3000);
			setTimeout(function () {
				$(el).unblock();
			}, 2000);
			// $('div#opp_list').unblock();	
			// $('itemList').unblock();		
		}   else if (nextProps.oppList.length == 0) {
			setTimeout(function () {
				datatable.OpportunityTable.init();
				$('div#opp_list').unblock();
			}, 2000);
		}
		
	}
	getOpportunityData() {
		functions.showLoader('opp_list');	
		var params = {
			companyId: localStorage.companyId,
			per_page: this.state.Data.per_page,
			page: this.state.Data.page,
			searchText: this.state.Data.searchText
		};

		if (this.state.Data.sortColumnName) {
			params.sortColumnName = this.state.Data.sortColumnName;
		}
		if (this.state.Data.sortOrder) {
			params.sortOrder = this.state.Data.sortOrder;
		}
		this.props.oppActions.getOpportunitiesList(params);
	}

	// function for pagination
	pageChanged(pageNumber, e) {
		// e.preventDefault();
		this.state.Data.page = pageNumber.selected + 1;
		this.getOpportunityData();
	}

	//function for sorting
	sortChanged(sortColumnName, order, e) {
		e.preventDefault();
		this.state.Data.sortColumnName = sortColumnName;
		this.state.Data.page = 1;
		this.state.Data.sortOrder = order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc';
		this.getOpportunityData();
	}

	// function for set sort icon on table header
	_sortClass(filterName) {
		return 'fa fa-fw ' + ((filterName == this.state.Data.sortColumnName) ? ('fa-sort-' + this.state.Data.sortOrder) : 'fa-sort');
	}


	pageFilterChange(event) {
		this.state.Data.page = 1;
		this.state.Data.per_page = parseInt(event.target.value);
		this.getOpportunityData();
	}

	searchChange(e) {
		e.preventDefault();
		var d = this.state.Data;
		d.searchText = e.target.value;
		this.setState({
			Data: d
		});

		if (!e.target.value) {
			this.getOpportunityData();
		}
	}

	_search(event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			this.getOpportunityData();
		}
	}
	render() {
		var oppList = this
			.state
			.Data.opportunity
			.map(function (opp, index) {
				// let stage;
				let priority;
				let probability;
				let daysOpen = '';
				let currentDate = moment().format('MM/DD/YYYY');
				let createdAt = moment(opp.createdAt).startOf('day').format('MM/DD/YYYY');
				let m1 = moment(createdAt, 'MM/DD/YYYY');
				let m2 = moment(currentDate, 'MM/DD/YYYY');
				daysOpen = m2.diff(m1, 'days');
		
				if (opp.probabilityId == 0) {
					probability = 0;
				} else if (opp.probabilityId == 1) {
					probability = 10;
				} else if (opp.probabilityId == 2) {
					probability = 20;
				} else if (opp.probabilityId == 3) {
					probability = 30;
				} else if (opp.probabilityId == 4) {
					probability = 40;
				} else if (opp.probabilityId == 5) {
					probability = 50;
				} else if (opp.probabilityId == 6) {
					probability = 60;
				} else if (opp.probabilityId == 7) {
					probability = 70;
				} else if (opp.probabilityId == 8) {
					probability = 80;
				} else if (opp.probabilityId == 9) {
					probability = 90;
				} else if (opp.probabilityId == 10) {
					probability = 100;
				} else {
					probability = '-';
				}

				if (opp.priorityId == 1) {
					priority = 'Normal';
				} else if (opp.priorityId == 2) {
					priority = 'High';
				} else if (opp.priorityId == 3) {
					priority = 'Low';
				}
				return <tr key={index} onClick={this.handleDetail.bind(this, opp._id)}>
					<td>{opp.opportunityNumber ? opp.opportunityNumber : '-'}</td>
					<td>{opp.title}</td>
					<td>{opp.endUser ? opp.endUser.companyName : '-'}</td>
					<td>{daysOpen >= 0 ? daysOpen : '-'}</td>
					<td>{opp.stageId?opp.stageId.stageName:'-'}</td>
					<td>{priority}</td>
					<td>{probability}</td>
					<td>{opp.salesRep ? opp.salesRep.firstname + ' ' + opp.salesRep.lastname : '-'}</td>
				</tr>;
			}.bind(this));
		return (
		
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Opportunities</span>
					</div>

					<div className="actions" id="opportunity_tools">
						{this.shouldBeVisible(authorize.opportunitiesEditorAuthorize) ? <Link to="/opportunity/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i>
                            New Opportunity
						</Link> : null}&nbsp;&nbsp;
						<a href="javascript:;" data-action="0" className="tool-action btn green btn-sm">
                            PRINT
						</a>
                        &nbsp;&nbsp;
						<a href="javascript:;" data-action="1" className="tool-action btn green btn-sm">
                            PDF
						</a>
                        &nbsp;&nbsp;
						<a href="javascript:;" data-action="2" className="tool-action btn green btn-sm">
                            CSV
						</a>
					</div>
				</div>
				<div className="portlet-body"  id="opp_list" ref="opp_list">
					<GridFilter
						per_page={this.state.Data.per_page}
						handlePagingChange={this.pageFilterChange}
						handleSearchChange={this.searchChange}
						searchText={this.state.Data.searchText}
						_search={this._search}
					/>
					<div className="table-container table-responsive portlet_body_table_div">
						<table className="table table-striped table-bordered table-hover" id="opportunity_list">
							<thead>
								<tr>
									<th style={{backgroundImage:'none !important'}} id='oppNo'
										onClick={this.sortChanged.bind(this, 'opportunityNumber', this.state.Data.sortOrder)}
									>
                                        Opportunity#
										<i className={this._sortClass('opportunityNumber')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'title', this.state.Data.sortOrder)}
									>
                                        Title
										<i className={this._sortClass('title')}></i>
									</th>
									<th style={{ width: '10%' }}
										onClick={this.sortChanged.bind(this, 'endUser', this.state.Data.sortOrder)}
									>
                                        End User
										<i className={this._sortClass('endUser')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'daysOpen', this.state.Data.sortOrder)}
									>
                                        Days Open
										<i className={this._sortClass('daysOpen')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'stage', this.state.Data.sortOrder)}
									>
                                        Stage
										<i className={this._sortClass('stage')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'priority', this.state.Data.sortOrder)}
									>
                                        Priority
										<i className={this._sortClass('priority')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'probability', this.state.Data.sortOrder)}
									>
                                        Probability
										<i className={this._sortClass('probability')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'salesRep', this.state.Data.sortOrder)}
									>
                                        Sales Rep
										<i className={this._sortClass('salesRep')}></i>
									</th>
								</tr>
							</thead>
							
							{this.state.Data.opportunity.length==0?<tbody><tr><td style={{textAlign:'center'}} colSpan="8">No matching records found</td></tr></tbody>:<tbody>{oppList}</tbody>}
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
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

	return { oppList: state.opportunity.oppList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		oppActions: bindActionCreators(opportunityAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Opportunity);