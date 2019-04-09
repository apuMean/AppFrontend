import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';
import * as loader from '../../constants/actionTypes.js';
import * as dashboardActions from '../../actions/dashboardActions';
import * as createContactAction from '../../actions/createContactAction';
import GridFilter from '../common/gridFilter.component';
import CompanyRow from './companyRow.component';
import GridPager from '../common/paging.component';
import { browserHistory } from 'react-router';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class Companies extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			Data: {
				contact: [],
				totalcount: 0,
				sortColumnName: null,
				sortOrder: null,
				page: 1,
				per_page: 20,
				companySearchText: ''
			}
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Companies',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);
	}

	componentDidMount() {
		functions.showLoader('contacts_list');
	}

	componentWillReceiveProps(nextProps) {
		const el = findDOMNode(this.refs.contacts_list);
		if (nextProps.createcontact.contact.length != 0) {
			let contactState = JSON.parse(JSON.stringify(nextProps.createcontact));
			this.setState({ Data: contactState });
			setTimeout(function () {
				$(el).unblock();
			}, 2000);
		}
		else if (nextProps.createcontact.contact.length == 0) {
			let contactState = JSON.parse(JSON.stringify(nextProps.createcontact));
			this.setState({ Data: contactState });
			setTimeout(function () {
				$(el).unblock();
			}, 5000);
		}
	}

	getCompanyData() {

		functions.showLoader('contacts_list');

		var params = {
			companyId: localStorage.companyId,
			userType: 1,
			per_page: this.state.Data.per_page,
			page: this.state.Data.page,
			companySearchText: this.state.Data.companySearchText
		};
		if (this.state.Data.sortColumnName) {
			params.sortColumnName = this.state.Data.sortColumnName;
		}
		if (this.state.Data.sortOrder) {
			params.sortOrder = this.state.Data.sortOrder;
		}
		this.props.actions.getContacts(params);
	}

	// function for pagination
	pageChanged(pageNumber, e) {
		this.state.Data.page = pageNumber.selected + 1;
		this.getCompanyData();
	}

	//function for sorting
	sortChanged(sortColumnName, order, e) {
		e.preventDefault();
		this.state.Data.sortColumnName = sortColumnName;
		this.state.Data.page = 1;
		this.state.Data.sortOrder = order.toString().toLowerCase() == 'asc' ? 'desc' : 'asc';
		this.getCompanyData();
	}

	// function for set sort icon on table header
	_sortClass(filterName) {
		return 'fa fa-fw ' + ((filterName == this.state.Data.sortColumnName) ? ('fa-sort-' + this.state.Data.sortOrder) : 'fa-sort');
	}


	handleDetail(id) {
		browserHistory.push('/company/' + id);
	}

	pageFilterChange(event) {
		this.state.Data.page = 1;
		this.state.Data.per_page = parseInt(event.target.value);
		this.getCompanyData();
	}

	searchChange(e) {
		e.preventDefault();
		var d = this.state.Data;
		d.companySearchText = e.target.value;
		this.setState({
			Data: d
		});

		if (!e.target.value) {
			this.getCompanyData();
		}
	}

	_search(event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			this.getCompanyData();
		}
	}

	render() {
		var rows = [];
		this.state.Data.contact.forEach(function (company) {
			rows.push(<CompanyRow key={company._id} company={company} handleDetail={this.handleDetail.bind(this, company._id)} />);
		}.bind(this));

		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" >
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Companies</span>
					</div>

					<div className="actions">
						<Link to="/company/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i> Add Company </Link>
					</div>
				</div>
				<div className="portlet-body" id="contacts_list" ref="contacts_list">
					<GridFilter
						per_page={this.state.Data.per_page}
						handlePagingChange={this.pageFilterChange}
						handleSearchChange={this.searchChange}
						searchText={this.state.Data.companySearchText}
						_search={this._search}
					/>
					<div className="table-container table-responsive portlet_body_table_div" >
						<table className="table table-striped table-bordered table-hover">
							<thead>
								<tr>
									<th
										onClick={this.sortChanged.bind(this, 'insensitivecompanyName', this.state.Data.sortOrder)}>
                                        Name
										<i className={this._sortClass('insensitivecompanyName')}></i>
									</th>
									<th>
                                        Phone
									</th>
									<th>
                                        Email
									</th>
									<th>
                                        Address
									</th>
								</tr>
							</thead>
							{/* <tbody>{rows}</tbody> */}
							{this.state.Data.contact.length==0?<tbody><tr><td style={{textAlign:'center'}} colSpan="4">No matching records found</td></tr></tbody>:<tbody>{rows}</tbody>}

						</table>
						<div className="pull-right">
							<ReactPaginate
								previousLabel={'previous'}
								nextLabel={'next'}
								breakLabel={<a>...</a>}
								breakClassName={'break-me'}
								marginPagesDisplayed={2}
								pageRangeDisplayed={this.state.Data.totalcount >= 10 ? 10 : this.state.Data.totalcount}
								pageCount={this.state.Data.totalcount}
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
	return { createcontact: state.createcontact.contactList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		contactactions: bindActionCreators(createContactAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Companies);
