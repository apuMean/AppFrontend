import React from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as signinActions from '../../actions/signinActions';
import * as layout from '../../scripts/app';
import * as app from '../../scripts/login';
import moment from 'moment';
import '../../styles/login.css';
import { browserHistory } from 'react-router';

//login container component
class Login extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			email: '',
			password: ''
		};
		//binding current context to all functions
		//used in the container component
		this.onChange = this.onChange.bind(this);
		this.onSigninHandler = this.onSigninHandler.bind(this);
		this.signInAzure = this.signInAzure.bind(this);
		this.Auth = this.Auth.bind(this);
	}

	signInAzure() {
		var data = {
			firstname: 'tanuj',
			lastname: 'upreti'
		};
		this.props.actions.azureSignInUser(data);
	}

	Auth() {
		var userAgentApplication = new Msal.UserAgentApplication('ab8fa067-8dfd-4dff-b453-db0b3f023f89', null, function (errorDes, token, error, tokenType) {
			// this callback is called after loginRedirect OR acquireTokenRedirect (not used for loginPopup/aquireTokenPopup)
		});

		return new Promise((resolve, reject) => {
			userAgentApplication.loginPopup(['user.read']).then((token) => {
				if (token) {
					var logindata = {
						auth_user_name: userAgentApplication.getUser().displayableId,
						auth_user_id: userAgentApplication.getUser().userIdentifier,
						name: userAgentApplication.getUser().name,
						company: 'Hive'
					};
					this.props.actions.signinUser(logindata);
				}
				else {
					toastr.error('Some error occured please try again');
				}
				userAgentApplication.acquireTokenSilent(['user.read']).then((token) => {
					resolve(token);
				}, function (error) {
					reject(error);
				});
			}, function (error) {
				reject(error);
			});
		});
	}
	componentWillMount(){
		if(localStorage.getItem('token')!=null||''){
			browserHistory.push('/home');
		}
	}
	componentDidMount() {
		setTimeout(function () {
			layout.App.init();
		}, 400);
		app.Login.init();
		layout.FormValidationMd.init();

	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	//Handler for sign-in
	onSigninHandler(event) {
		event.preventDefault();
		var signin = {
			email: this.state.email,
			password: this.state.password
		};
	
		if (jQuery('#loginForm').valid()) {
			$('div#login').block({
				message: loader.GET_LOADER_IMAGE,
				// css: { width: '25%',background:'none', border: 'none' },
				css: { width: '10%'},
				overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
			});
			this.props.actions.signinUser(signin);
		}

	}

	render() {
		return (
			<div className="user-login-5" id="login">
				<div className="row bs-reset">
					<div className="col-md-6 login-container bs-reset">
						<Link to="/"><img className="login-logo login-6" src={require('../../img/login.png')} /></Link>
						<div className="login-content">
							<div className="login-head">
								<h1>Hive Login</h1>
								<p> Lorem ipsum dolor sit amet, coectetuer adipiscing elit sed diam nonummy et nibh euismod aliquam erat volutpat. Lorem ipsum dolor sit amet, coectetuer adipiscing. </p>
							</div>
							<form className="login-form" id="loginForm" onSubmit={this.onSigninHandler}>
								<div className="row">
									<div className="col-sm-6">
										<div className="form-group  form-md-line-input form-md-floating-label has-success">
											<input type="text" className="form-control" id="email" ref="email" name="email" defaultValue="" onChange={this.onChange} />
											<label htmlFor="email">Email<span className="required">*</span></label>
										</div>

									</div>
									<div className="col-sm-6">
										<div className="form-group form-md-line-input form-md-floating-label has-success">
											<input type="password" className="form-control" id="password" ref="password" name="password" defaultValue="" onChange={this.onChange} />
											<label htmlFor="password">Password<span className="required">*</span></label>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-4 col-xs-5">
										<div className="md-checkbox-inline">
											<div className="md-checkbox">
												<input type="checkbox" id="checkbox33" className="md-check" ref="rememberMeCheckBox" />
												<label htmlFor="checkbox33">
													<span></span>
													<span className="check"></span>
													<span className="box"></span> Remember me
												</label>
											</div>
										</div>

									</div>
									<div className="col-sm-8 col-xs-7 text-right">
										<button className="btn blue" type="submit" >Sign In</button>
									</div>
								</div>
							</form>
						</div>
						<div className="login-footer">
							<div className="row bs-reset">
								<div className="col-xs-5 bs-reset">
									<ul className="login-social">
										<li>
											<a href="javascript:void(0);">
												<i className="icon-social-facebook"></i>
											</a>
										</li>
										<li>
											<a href="javascript:void(0);">
												<i className="icon-social-twitter"></i>
											</a>
										</li>
										<li>
											<a href="javascript:void(0);">
												<i className="icon-social-dribbble"></i>
											</a>
										</li>
									</ul>
								</div>
								<div className="col-xs-7 bs-reset">
									<div className="login-copyright text-right">
										<p>{moment().year()} &copy; Hive</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 bs-reset">
						<div className="login-bg back-img"> </div>
					</div>
				</div>
			</div>
		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		signin: state.signin
	};
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(signinActions, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
