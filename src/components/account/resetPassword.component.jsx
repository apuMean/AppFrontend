import React from 'react';
import { Link } from 'react-router';
import jQuery from 'jquery';
import $ from 'jquery';
import { blockUI, unblockUI } from 'block-ui';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as crumbActions from '../../actions/accountAction';
// import * as appLayout from '../../scripts/account_layout';
import * as layout from '../../scripts/app';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
//ResetPassword container component
class ResetPassword extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			email: '',
			password: '',
			firstname: '',
			lastname: '',
			company: '',
			confirmpassword: ''
		};

		//binding current context to all functions
		//used in the container component
		this.triggerLabel = this.triggerLabel.bind(this);
		this.setPasswordHandler = this.setPasswordHandler.bind(this);
		this.activityHandler = this.activityHandler.bind(this);
	}

	componentWillMount() {
		this.isAcceptedCheck();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.isAccepted) {
			this.setState({
				firstname: nextProps.isAccepted.firstname,
				lastname: nextProps.isAccepted.lastname,
				email: nextProps.isAccepted.email
			});
		}
		if (nextProps.setPassword) {
			if (localStorage.roleName == 'Manager') {
				var activityData = {
					userId: nextProps.setPassword.userId,
					companyId: nextProps.setPassword.companyId,
					fullname: nextProps.setPassword.firstname + ' ' + nextProps.setPassword.lastname,
					activity: '' + 'accepted ' + nextProps.setPassword.companyName + ' invite' + '',
					activity_type: 'notify'
				};
				var loginData = {
					userId: nextProps.setPassword.userId,
					companyId: nextProps.setPassword.companyId,
					activity: '' + nextProps.setPassword.firstname + ' logged in' + '',
					activity_type: 'enable'
				};
				this.activityHandler(activityData);
				this.activityHandler(loginData);
			}
			// jQuery.unblockUI();
			browserHistory.push('/home');

		}
	}

	isAcceptedCheck() {

		if (localStorage.token) {
			toastr.error('You are already logged in with another account! Please log out and try again');
			browserHistory.push('/home');
		}
		else {
			var userData = {
				userId: this.props.params.userId,
				companyId: this.props.params.companyId
			};
			this.props.actions.checkIsAccepted(userData);
		}
	}
	componentDidMount() {
		// layout.App.init();
		layout.FormValidationMd.init();
		this.triggerLabel();
	}

	triggerLabel() {
		jQuery('#email').on('input', function () {
			var email = ReactDOM.findDOMNode(this.refs.email);
			email.className += ' edited';
		}.bind(this));
		jQuery('#password').on('input', function () {
			var password = ReactDOM.findDOMNode(this.refs.password);
			password.className += ' edited';
		}.bind(this));
		jQuery('#firstname').on('input', function () {
			var firstname = ReactDOM.findDOMNode(this.refs.firstname);
			firstname.className += ' edited';
		}.bind(this));
		jQuery('#lastname').on('input', function () {
			var lastname = ReactDOM.findDOMNode(this.refs.lastname);
			lastname.className += ' edited';
		}.bind(this));
		jQuery('#company').on('input', function () {
			var company = ReactDOM.findDOMNode(this.refs.company);
			company.className += ' edited';

		}.bind(this));
		jQuery('#confirmpassword').on('input', function () {
			var confirmpassword = ReactDOM.findDOMNode(this.refs.confirmpassword);
			confirmpassword.className += ' edited';
		}.bind(this));

	}

	//set password handler 
	setPasswordHandler(event) {
		event.preventDefault();
		var passwordData = {
			companyId: this.props.params.companyId,
			userId: this.props.params.userId,
			password: ReactDOM.findDOMNode(this.refs.password).value.trim()
		};
		if (jQuery('#setPasswordForm').valid()) {
			// jQuery.blockUI();

			this.props.actions.setPassword(passwordData);
		}
	}

	activityHandler(activityData) {
		this.props.actions.addActivity(activityData);
	}
	render() {
		return (
			<div className="row">
				<div className="user-login-5">
					<div className="row bs-reset">
						<div className="col-md-6 bs-reset mt-login-5-bsfix">
							<div className="login-bg back-img">
								<Link to="/"><img className="login-logo" src={require('../../img/login/logo.png')} /></Link>
							</div>
						</div>
						<div className="col-md-6 login-container bs-reset mt-login-5-bsfix">
							<div className="login-content signupFormId">
								<h1>Set Password</h1>
								<div className="row">
									<div className="col-md-6">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{this.state.firstname} {this.state.lastname}</div>
											<label htmlFor="phone">Name</label>
										</div>
									</div>
									<div className="col-md-6">
										<div className="form-group form-md-line-input form-md-floating-label">
											<div className="form-control form-control-static">{this.state.email}</div>
											<label htmlFor="location">Email</label>
										</div>
									</div>
								</div>
								<form className="login-form" id="setPasswordForm">
									<div className="row">
										<div className="col-xs-6">
											<div className="form-group  form-md-line-input form-md-floating-label has-success">
												<input type="password" className="form-control" id="password"
													ref="password" name="password" />
												<label htmlFor="password">Password<span className="required">*</span></label>
											</div>
										</div>
										<div className="col-xs-6">
											<div className="form-group  form-md-line-input form-md-floating-label has-success">
												<input type="password" className="form-control" id="confirmpassword"
													ref="confirmpassword" name="confirmpassword" />
												<label htmlFor="confirmpassword">Confirm password<span className="required">*</span></label>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-sm-6 text-right">

										</div>
										<div className="col-sm-6 text-right">
											<button className="btn green" id="setpassword" type="submit" onClick={this.setPasswordHandler}>Submit</button>
										</div>
									</div>
								</form>

							</div>
							<div className="login-footer signupFormFooter">
								<div className="row bs-reset">
									<div className="col-xs-5 bs-reset">
										<ul className="login-social">
											<li>
												<a href="javascript:;">
													<i className="icon-social-facebook"></i>
												</a>
											</li>
											<li>
												<a href="javascript:;">
													<i className="icon-social-twitter"></i>
												</a>
											</li>
											<li>
												<a href="javascript:;">
													<i className="icon-social-dribbble"></i>
												</a>
											</li>
										</ul>
									</div>
									<div className="col-xs-7 bs-reset">
										<div className="login-copyright text-right">
											<p>2017 &copy; Flex</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state, ownProps) {

	return {
		breadcrumb: state.accountReducer,
		userById: state.accountReducer.userById,
		isAccepted: state.accountReducer.isAccepted,
		setPassword: state.accountReducer.setPassword
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(crumbActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
