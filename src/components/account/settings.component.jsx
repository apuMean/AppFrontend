import React from 'react';
import ReactDOM from 'react-dom';
import * as api from '../../../tools/apiConfig';
import InputElement from 'react-input-mask';
import * as datatable from '../../scripts/table-datatables-buttons';
import '../../styles/plugins/datatables/datatables.min.css';
import '../../styles/custom.css';
import '../../styles/plugins/bootstrap/datatables.bootstrap.css';
import '../../scripts/datatable.js';
import '../../scripts/table-datatables-buttons.js';
let samplePic=require('../../img/profile/avatar-default.png');

export default class SettingsTab extends React.Component {

	render() {
		return (<div className="tab-pane" id={this.props.tabId}>
			<form role="form" id="accountUpdateForm">
				<div className="form-body">
					<div className="row">
						<div className="col-md-3">
							<div className="form-group form-md-line-input form-md-floating-label">
								<div className="fileinput fileinput-exists" data-provides="fileinput">
									<div className="list-unstyled profile-nav fileinput-preview thumbnail" data-trigger="fileinput" >
										<img src={this.props.companyImage ? this.props.companyImage : samplePic} className="img-responsive pic-bordered"/>
									</div>
									<div>
										<span className="btn red btn-sm btn-outline btn-file">
											<span className="fileinput-new"> Select Picture </span>
											<span className="fileinput-exists"> Change </span>
											<input type="file"
												ref="userFileUpload"
												id="userFileUpload"
												name="userFileUpload"
												accept='image/*'
												onChange={this.props.imageUpdateHandler} />
										</span>
										{this.props.companyImage ? <a href="javascript:;"
											className="btn red btn-sm"
											onClick={this.props.removeProfileImage}> Remove </a> : null}
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-9">
							<div className="row">
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input minLength="1"ref="companyName" type="text" className="form-control" name="accountname" id="companyName" maxLength='100' key={this.props.companyName} disabled={true} defaultValue={this.props.companyName} required />
										<label htmlFor="companyName">Company</label>
										{/* <span className="required">*</span> */}
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<InputElement ref="phone" type="text" className="form-control" mask="(999) 999-9999" maskChar="" name="phone" id="phone" key={this.props.phone} defaultValue={this.props.phone} />
										<label htmlFor="phone">Phone</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input ref="weburl" type="text" className="form-control" name="web" id="web" key={this.props.weburl} maxLength='120' defaultValue={this.props.weburl} />
										<label htmlFor="web">Web</label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label">
										<input ref="location" type="text" className="form-control" name="location" id="location" maxLength='100' key={this.props.location} defaultValue={this.props.location} />
										<label htmlFor="location">Location</label>
									</div>
								</div>
								<div className="col-md-12">
									<div className="form-group form-md-line-input form-md-floating-label">
										<textarea style={{ resize: 'none' }} maxLength="250" ref="about" type="text" className="form-control" name="about" key={this.props.about} defaultValue={this.props.about} rows="3"></textarea>
										<label htmlFor="about">About</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="form-actions noborder text-right">
					<button type="button" className="btn blue" onClick={this.props.updateAccountHandler}>Save</button>
				</div>
			</form>
		</div>);
	}
}
