import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as proposalActions from '../../actions/proposalActions';
import * as functions from '../common/functions';
import DeleteModal from '../common/deleteModal.component.js';
import '../../styles/bootstrap-fileinput.css';
import autoBind from 'react-autobind';

class ProposalDetail extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			proposalDetails: '',
			propId: '',
			estimatesData: '',
			breadcrumb:true
		};
	}

	componentWillMount() {
		var proposalId = {
			proposalId: this.props.params.proposalId
		};
		this
			.props
			.actions
			.getProposalDetails(proposalId);

		var data = {
			parent: 'Proposals',
			childone: '',
			childtwo: ''
		};

		this.props.breadCrumb(data);
	}

	componentDidMount() {
		functions.showLoader('proposal_detail');
	}

	handleDelete() {
		this.setState({ propId: this.props.params.proposalId });
		$('#proposal_delete').modal('show');
	}

	deleteProposalHandler() {
		if (this.state.propId) {
			$('#proposal_delete').modal('hide');
			functions.showLoader('proposal_detail');
			var proposalId = {
				proposalId: this.state.propId
			};
			this.props.actions.deleteProposal(proposalId);
		}
	}

	sendProposal() {
		var proposalId = {
			companyId: localStorage.companyId,
			proposalId: this.props.params.proposalId
		};
		$('#proposalSend').modal('hide');
		this.props.actions.sendProposal(proposalId);
	}

	handleSendProposal() {
		$('#proposalSend').modal('show');
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.proposalDetail.length!=0) {
			var proposalstate = JSON.parse(JSON.stringify(nextProps.proposalDetail.proposaldetail));
			let estimatesArray = proposalstate.proposedEstimates;
			this.setState({
				proposalDetails: proposalstate,
				estimatesData: estimatesArray
			});
			$('div#proposal_detail').unblock();

			if (this.state.breadcrumb && proposalstate.proposalNumber) {
				var data = {
					parent: <Link to='/proposal'>Proposals</Link>,
					childone: ('#' + proposalstate.proposalNumber) + ' (' + (proposalstate.customerId.companyName ? proposalstate.customerId.companyName : proposalstate.customerId.companyName) + ')',
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}
		}
	}

	render() {
		var proposalData = this.state.proposalDetails;
		let countItem = 0;
		let estimateTabData = this.state.estimatesData.length != 0 ?
			this.state.estimatesData.map(function (i, index) {
				countItem = countItem + 1;
				return (
					<tr key={index} data-id={index}>
						{/* <td><span className="handle"><i className="fa fa-bars"></i></span></td> */}
						<td style={{ textAlign: 'center' }}>{countItem}</td>
						<td>{i.estimateNumber ? i.estimateNumber : '-'}</td>
						<td>{i.estimateName ? i.estimateName : '-'}</td>
						<td>{i.total ? '$' : ''}{i.total ? i.total : '-'}</td>
						<td>{i.status ? i.status : '-'}</td>

					</tr>
				);
			}.bind(this)) : '';

		return (
			<div className="portlet light portlet-fit portlet-datatable bordered">
				<div className="portlet-title">
					<div className="caption">
						<i className="icon-users "></i>
						<span className="caption-subject bold uppercase" style={{ 'fontSize': '17px' }}>Proposal</span>
					</div>
					<div className="text-right">
						<Link to={'/export/' + this.props.params.proposalId + '/proposal'} target="_blank" className="btn btn-sm btn-circle blue" style={{ marginBottom: '10px' }}>
							<i className="icon-cursor"></i>Export </Link>&nbsp;&nbsp;
						<Link to="/proposal" className="btn btn-sm btn-circle red" style={{ marginBottom: '10px' }}>
                            Cancel </Link>&nbsp;&nbsp;
						<button className="btn btn-sm btn-circle red" style={{ marginBottom: '10px' }} onClick={this.handleDelete}>
                            Delete </button>&nbsp;&nbsp;
						<button className="btn btn-sm btn-circle blue" style={{ marginBottom: '10px' }} onClick={this.handleSendProposal}>
							<i className="fa fa-envelope-open" ></i>Send Proposal </button>&nbsp;&nbsp;
						<Link to={'/proposal/' + this.props.params.proposalId + '/edit'} className="btn btn-sm btn-circle green" style={{ marginBottom: '10px' }}>
                            Edit </Link>
					</div>
				</div>
				<div className="portlet light box-shadow-none" id="proposal_detail">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="proposal-add">
								<form role="form">
									<div className="form-body">
										<div className="row">
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static"> {proposalData && proposalData.createdAt ? moment(proposalData.createdAt).format('LLL') : '-'} </div>
													<label htmlFor="form_control_1">Date</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.proposalNumber ? proposalData.proposalNumber : '-'}</div>
													<label htmlFor="form_control_1">Proposal #</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static"> {proposalData && proposalData.customerId.companyName ? proposalData.customerId.companyName : '-'} </div>
													<label htmlFor="form_control_1">Proposal For</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.individualId.firstname ? proposalData.individualId.firstname + ' ' + proposalData.individualId.lastname : '-'}</div>
													<label htmlFor="form_control_1">Attn</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.salesRep.firstname ? proposalData.salesRep.firstname + ' ' + proposalData.salesRep.lastname : '-'}</div>
													<label htmlFor="form_control_1">Salesperson</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.projectName ? proposalData.projectName : '-'}</div>
													<label htmlFor="form_control_1">Project Name</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.projectLocation ? proposalData.projectLocation : '-'}</div>
													<label htmlFor="form_control_1">Project Location</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.summary ? proposalData.summary : '-'}</div>
													<label htmlFor="form_control_1">Summary</label>
												</div>
											</div>
											<div className="col-md-6">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="form-control form-control-static">{proposalData && proposalData.note ? proposalData.note : '-'}</div>
													<label htmlFor="form_control_1">Notes</label>
												</div>
											</div>

										</div>
									</div>
								</form>
								{this.state.estimatesData.length != 0 ?
									<div className="portlet light portlet-fit portlet-datatable bordered">
										<div className="portlet light bordered">
											<div className="portlet-title tabbable-line">
												<div className="caption">
													<i className="icon-share font-dark"></i>
													<span className="caption-subject font-dark bold uppercase">Estimates</span>
												</div>
											</div>

											<div className="portlet-body">
												<div className="tab-content">
													<div className="row">
														<div className="col-md-12">
															<div className="table-container table-responsive" style={{ overflow: 'auto' }}>
																<table className="table table-striped table-bordered" id="lineitem">
																	<thead >
																		<tr>
																			{/* <th className="items"></th> */}
																			<th className="items">#</th>
																			<th className="items">Estimate #</th>
																			<th className="items">Name</th>
																			<th className="rowtotal">Total</th>
																			<th className="items">Status</th>
																		</tr>
																	</thead>
																	<tbody id="sortable">
																		{estimateTabData}
																	</tbody>
																</table>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>:null}
							</div>
						</div>
					</div>
				</div>
				<div
					id="proposalSend"
					className="modal fade"
					tabIndex="-1"
					aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
								<h4 className="modal-title">Proposal</h4>
							</div>
							<div className="modal-body">
                                Are you sure you want to send proposal to customer ?
							</div>
							<div className="modal-footer">
								<button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
								<button
									type="button"
									className="btn green"
									onClick={this.sendProposal}>Yes</button>
							</div>
						</div>
					</div>
				</div>
				<DeleteModal deleteModalId="proposal_delete" deleteUserHandler={this.deleteProposalHandler} />
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		proposalDetail: state.proposal.proposalDetail
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(proposalActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProposalDetail);