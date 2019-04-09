import React from 'react';
import ReactDOM from 'react-dom';
import * as datatable from '../../scripts/table-datatables-buttons';
import '../../styles/plugins/datatables/datatables.min.css';
import '../../styles/custom.css';
import '../../styles/plugins/bootstrap/datatables.bootstrap.css';
import '../../scripts/datatable.js';
import '../../scripts/table-datatables-buttons.js';

export default class DetailsTab extends React.Component {
	
	render() {
		
		return (<div className="tab-pane active" id={this.props.tabId}>
			<form role="form">
				<div className="form-body">
					<div className="row">
						<div className="col-md-3">
							<ul className="list-unstyled profile-nav">
								<li>
									<img src={this.props.companyImage ? this.props.companyImage : require('../../img/profile/avatar-default.png')} className="img-responsive pic-bordered" alt="Logo" />
								</li>
							</ul>
						</div>
						<div className="col-md-9">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<div className="form-control form-control-static"> {this.props.companyName}</div>
										<label htmlFor="companyName">Company</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<div className="form-control form-control-static"> {this.props.phone ? this.props.phone : '-'} </div>
										<label htmlFor="phone">Phone</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<div className="form-control form-control-static"> {this.props.weburl ? this.props.weburl : '-'} </div>
										<label htmlFor="web">Web</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<div className="form-control form-control-static"> {this.props.location ? this.props.location : '-'} </div>
										<label htmlFor="location">Location</label>
									</div>
								</div>
								<div className="col-md-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<div className="form-control form-control-static">
											{this.props.about ? this.props.about : '-'}
										</div>
										<label htmlFor="about">About</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>);
	}
}