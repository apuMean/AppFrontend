import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as poActions from '../../actions/poActions';
import * as functions from '../common/functions';
import autoBind from 'react-autobind';

class POrder extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			poData: ''
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Purchase Orders',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumb(data);

		var companyId = {
			companyId: localStorage.companyId
		};
		this
			.props
			.poactions
			.getPos(companyId);
	}

	componentDidMount() {
		functions.showLoader('po_list');
		setTimeout(function () {
			datatable
				.PoTable
				.init();
		}, 3000);
	}

	componentWillReceiveProps(nextProps) {
		const el = findDOMNode(this.refs.po_list);
		const e2 = findDOMNode(this.refs.po_table);
		if (nextProps.podata.length != 0) {
			var postate = JSON.parse(JSON.stringify(nextProps.podata));
			this.setState({ poData: postate });
			var po_list = $(e2).DataTable();
			po_list.destroy();
			setTimeout(function () {
				datatable.PoTable.init();
				$(el).unblock();
			}, 200);
		}
		else {
			setTimeout(function () {
				datatable.PoTable.init();
				$(el).unblock();
			}, 2000);
		}
	}

	handleDetail(index) {
		let currentData = this.state.poData[index];
		browserHistory.push('/po/' + currentData._id);
	}

	render() {
		let podata = this.state.poData;
		let status = '';
		let approvalStatus = '-';
		let shipVia = '';
		if (podata) {
			var poList = podata.map(function (po, index) {
				if (po.statusId == '1') {
					status = 'Open';
				} else if (po.statusId == '2') {
					status = 'Close';
				} else if (po.statusId == '3') {
					status = 'In Process';
				}
				if (po.approvalStatusId == '1') {
					approvalStatus = 'In Process';
				} else if (po.approvalStatusId == '2') {
					approvalStatus = 'Pending';
				} else if (po.approvalStatusId == '3') {
					approvalStatus = 'Approved';
				} else if (po.approvalStatusId == '4') {
					approvalStatus = 'Rejected';
				}
				if (po.shipVia == '1') {
					shipVia = 'Fed Ex';
				} else if (po.shipVia == '2') {
					shipVia = 'Amazon';
				} else {
					shipVia = '-';
				}
				return <tr key={index} onClick={this.handleDetail.bind(this, index)}>
					<td>{po.poNumber ? po.poNumber:'-'}</td>
					<td>{status ? status : '-'}</td>
					{/* <td>{approvalStatus}</td> */}
					<td>{moment(po.createdAt).format('L')}</td>
					<td>{po.vendor ? po.vendor : '-'}</td>
					<td>{po.shipDate ? po.shipDate : '-'}</td>
					<td>{shipVia ? shipVia : '-'}</td>
				</tr>;
			}.bind(this));
		}
		return (
			<div
				className="portlet light portlet-fit portlet-datatable bordered"
				id="po_list" ref="po_list">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Purchase Orders</span>
					</div>

					<div className="actions">
						<Link to="/po/add" className="btn btn-sm btn-circle green">
							<i className="icon-plus"></i>
                            Add PO
						</Link>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="po_table" ref="po_table">
							<thead >
								<tr>
									<th>PO #</th>
									<th>Status</th>
									{/* <th>Approval Status</th> */}
									<th>Date Created</th>
									<th>Vendor</th>
									<th>Ship Date</th>
									<th>Ship Via</th>
								</tr>
							</thead>
							<tbody>
								{poList}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return { podata: state.poLists.poList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		poactions: bindActionCreators(poActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(POrder);