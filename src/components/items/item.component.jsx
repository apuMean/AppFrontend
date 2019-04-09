import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as itemAction from '../../actions/itemAction.js';
import * as dashboardActions from '../../actions/dashboardActions';
import * as config from '../../../tools/config';
import GridFilter from '../common/gridFilter.component';
import ItemRow from './itemRow.component';
import GridPager from '../common/paging.component';
import { browserHistory } from 'react-router';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class Item extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			Data: {
				item: [],
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
			parent: 'Materials',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
		// this.getItemData();
	}

	componentDidMount() {
	}

	getItemData() {

		functions.showLoader('itemList');
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
		this.props.itemActions.getItemsList(params);
	}

	componentWillReceiveProps(nextProps) {
		let self = this;
		const el = findDOMNode(self.refs.itemList);

		let itemState = JSON.parse(JSON.stringify(nextProps.itemList));
		this.setState({ Data: itemState });
		setTimeout(function () {
			$(el).unblock();
		}, 2000);

	}

	// function for pagination
	pageChanged(pageNumber, e) {
		// e.preventDefault();
		this.state.Data.page = pageNumber.selected + 1;
		this.getItemData();
	}

	//function for sorting
	sortChanged(sortColumnName, order, e) {
		e.preventDefault();
		this.state.Data.sortColumnName = sortColumnName;
		this.state.Data.page = 1;
		this.state.Data.sortOrder = order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc';
		this.getItemData();
	}

	// function for set sort icon on table header
	_sortClass(filterName) {
		return 'fa fa-fw ' + ((filterName == this.state.Data.sortColumnName) ? ('fa-sort-' + this.state.Data.sortOrder) : 'fa-sort');
	}

	handleDetail(id) {
		// let currentData = this.state.itemData[index];
		browserHistory.push('/material/' + id);
	}

	pageFilterChange(event) {
		this.state.Data.page = 1;
		this.state.Data.per_page = parseInt(event.target.value);
		this.getItemData();
	}

	searchChange(e) {
		e.preventDefault();
		var d = this.state.Data;
		d.searchText = e.target.value;
		this.setState({
			Data: d
		});

		if (!e.target.value) {
			this.getItemData();
		}
	}

	_search(event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			this.getItemData();
		}
	}

	render() {
		var rows = [];
		this.state.Data.item.forEach(function (item) {
			rows.push(<ItemRow key={item._id} item={item} handleDetail={this.handleDetail.bind(this, item._id)} />);
		}.bind(this));
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Materials</span>
					</div>

					<div className="actions">
						<Link to="/importMaterials" className="btn btn-sm btn-circle green">Import Materials </Link>&nbsp;&nbsp;&nbsp;
						<Link to="/material/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i> Add Material </Link>
					</div>
				</div>
				<div className="portlet-body" id="itemList" ref="itemList">
					<GridFilter
						per_page={this.state.Data.per_page}
						handlePagingChange={this.pageFilterChange}
						handleSearchChange={this.searchChange}
						searchText={this.state.Data.searchText}
						_search={this._search}
					/>
					<div className="table-container table-responsive portlet_body_table_div">
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th
										onClick={this.sortChanged.bind(this, 'manufacturer', this.state.Data.sortOrder)}>
                                        Mfg
										<i className={this._sortClass('manufacturer')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'modal', this.state.Data.sortOrder)}>
                                        Model
										<i className={this._sortClass('modal')}></i>
									</th>
									<th style={{ width: '10%' }}
										onClick={this.sortChanged.bind(this, 'partNumber', this.state.Data.sortOrder)}>
                                        Part No
										<i className={this._sortClass('partNumber')}></i>
									</th>
									<th
										onClick={this.sortChanged.bind(this, 'itemName', this.state.Data.sortOrder)}>
                                        Name
										<i className={this._sortClass('itemName')}></i>
									</th>
								</tr>
							</thead>
							
							{this.state.Data.item.length==0?<tbody><tr><td style={{textAlign:'center'}} colSpan="4">No matching records found</td></tr></tbody>:<tbody>{rows}</tbody>}
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
								initialPage={this.state.Data.page - 1} />
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
		itemList: state.itemCreation.itemList
	};
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		itemActions: bindActionCreators(itemAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Item);
