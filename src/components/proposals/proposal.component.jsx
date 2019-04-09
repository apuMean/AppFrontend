import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { browserHistory } from 'react-router';
import * as functions from '../common/functions';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import * as proposalActions from '../../actions/proposalActions';
import autoBind from 'react-autobind';

class Proposal extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			proposalData: '',
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Proposals',
			childone: '',
			childtwo: ''
		};
		var companyId = {
			companyId: localStorage.companyId
		};
		this.props.breadCrumb(data);
		this.props.proposalactions.getProposals(companyId);
	}

	componentWillReceiveProps(nextProps) {

		if (this.props.proposalData) {
			var proposalstate = JSON.parse(JSON.stringify(nextProps.proposalData));
			this.setState({
				proposalData: proposalstate
			});
			var proposals_list = $('#proposals_table').DataTable();
			proposals_list.destroy();
			setTimeout(function () {
				datatable.ProposalTable.init();
			}, 3000);
			setTimeout(function () {
				$('div#proposals_list').unblock();
			}, 3200);
		}
	}

	componentDidMount() {
		functions.showLoader('proposals_list');
	}

	handleDetail(proposalId, code) {
		localStorage.setItem('tempCode', code);
		browserHistory.push('/proposal/' + proposalId);
	}
	emptyState(e){
		this.props.proposalactions.emptyState();
	}
	render() {
		var proposaldata = this.state.proposalData;
		if (proposaldata) {
			var proposalList = proposaldata.map(function (proposal, index) {
				return <tr key={index} onClick={this.handleDetail.bind(this, proposal._id, proposal.code)}>
					<td>{proposal.proposalNumber ? proposal.proposalNumber : '-'}</td>
					<td>{proposal.projectName ? proposal.projectName : '-'}</td>
					<td>{proposal.companyId.company ? proposal.companyId.company : '-'}</td>
					<td>{moment(proposal.createdAt).format('L')}</td>
					{/* moment(proposal.createdAt).format('MM-DD-YYYY') */}
				</tr>;
			}.bind(this));
		}
		return (
			<div className="portlet light portlet-fit portlet-datatable bordered" id="proposals_list">
				<div className="portlet-title">
					<div className="caption">
						<span className="caption-subject bold uppercase">Proposals</span>
					</div>

					<div className="actions">
						<Link to="/proposal/add" className="btn btn-sm btn-circle green" onClick={this.emptyState}>
							<i className="icon-plus" ></i> New Proposal </Link>
					</div>
				</div>
				<div className="portlet-body">
					<div className="table-container table-responsive">
						<table className="table table-striped table-bordered table-hover" id="proposals_table" >
							<thead >
								<tr>
									<th>Proposal #</th>
									<th>Project Name</th>
									<th>Company</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{proposalList}
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

	return { 
		proposalData: state.proposal.proposalData,
		createProposalData:state.proposal.createPrposalData,
	};
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dashboardActions, dispatch),
		proposalactions: bindActionCreators(proposalActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Proposal);