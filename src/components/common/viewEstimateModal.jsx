import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/bootstrap-fileinput.css';
import moment from 'moment';
// import * as functions from '../common/functions';

class ViewEstimate extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {
		let estimateDetailData=this.props.estimateData?this.props.estimateData.estimateDetails:null;
		// if(estimateDetailData){
		// 	$('div#view_estimate').unblock();
		// }
		return (
			<div id={this.props.estimateViewId} ref={this.props.estimateViewId} className="modal fade" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog modal-lg" id='view_estimate'>
					{estimateDetailData?<div className="modal-content" style={{border:'solid 1px #36c6d3'}}>
						<div className="modal-header">
						<button type="button" className="close_btn" data-dismiss="modal">
							<i className="fa fa-times"></i>
						</button>
							<div className="caption">
								<span className="caption-subject bold uppercase">{estimateDetailData ? '#'+estimateDetailData.estimateNumber : '-'}{estimateDetailData?<span>({estimateDetailData.estimateName ? estimateDetailData.estimateName : null})</span>:null}</span>
							</div>
						</div>
						<form role="form">
							<div className="form-body">
								<div className="row">
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static"> {estimateDetailData.estimateName ? estimateDetailData.estimateName : '-'} </div>
											<label htmlFor="name">Estimate Name</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static"> {estimateDetailData.customerId ? estimateDetailData.customerId.companyName : '-'} </div>
											<label htmlFor="customer">Customer</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{estimateDetailData.individualId ? estimateDetailData.individualId.firstname + ' ' + estimateDetailData.individualId.lastname : '-'}</div>
											<label htmlFor="individual">Customer Contact</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{estimateDetailData.proposalId ? estimateDetailData.proposalId.proposalNumber : '-'}</div>
											<label htmlFor="proposal">Proposal #</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{estimateDetailData.projectId ? estimateDetailData.projectId.title : '-'}</div>
											<label htmlFor="project">Project</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static"> {estimateDetailData.createdAt ? moment(estimateDetailData.createdAt).format('LLL') : '-'} </div>
											<label htmlFor="date">Date</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static"> {estimateDetailData.estimateNumber ? estimateDetailData.estimateNumber : '-'} </div>
											<label htmlFor="estimateNo">Estimate #</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{estimateDetailData.salesRep ? estimateDetailData.salesRep.firstname + ' ' + estimateDetailData.salesRep.lastname : '-'}</div>
											<label htmlFor="salesrep">Sales Rep</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{estimateDetailData.stage ? estimateDetailData.stage.stageName : '-'}</div>
											<label htmlFor="stage">Stage</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static white_space">{estimateDetailData.note ? estimateDetailData.note : '-'}</div>
											<label htmlFor="opportunity">Estimate Notes</label>
										</div>
									</div>
									<div className="col-md-4 col-sm-6 col-xs-12">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div style={{lineHeight: '12px' }}className="form-control form-control-static white_space" dangerouslySetInnerHTML={{ __html: estimateDetailData.proposedServices ? estimateDetailData.proposedServices : '' }}></div>
											<label htmlFor="opportunity">Proposed Services (visible on quote)</label>

										</div>
									</div>
								</div>
							</div>
						</form>
						{/* <div className="modal-footer">
							<button
								type="button"
								className="btn dark btn-outline"
								onClick={this.props.handlePopUpClose.bind(this, 'item')}>Close</button>
					
						</div> */}
					</div>:null}
					{/* functions.showLoader('view_estimate') */}
				</div>
			</div>
		);
	}
}

export default ViewEstimate;