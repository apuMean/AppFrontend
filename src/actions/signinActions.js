import * as types from '../constants/actionTypes';
import * as auth from '../../tools/auth0.cred';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Cookies from 'universal-cookie'; 
const cookies = new Cookies();

export function signinUser(signin) {
	var signindata = {
		email: signin.email,
		password: signin.password,
		grant_type: 'password'
	};

	return function (dispatch, getState) {
		axios.post(api.USER_AUTH, JSON.stringify(signindata), {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					var token = response.data.data.access_token;
					axios.get(api.GET_AZURE_USER_DETAILS, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': response.data.data.access_token
						}
					})
						.then(function (response) {
                            
							if (response.status == 200) {
								var logindata = {
									auth_user_name: response.data.userPrincipalName,
									auth_user_id: response.data.objectId,
									company: 'Hive',
									userType: response.data.userType,
									name: response.data.displayName
								};
								axios.post(api.SIGN_IN, JSON.stringify(logindata), {
									headers: {
										'Content-Type': 'application/json'
									}
								})
									.then(function (response) {
                                        
										if (response.data.code == 200) {
											var now = new Date();
											var time = now.getTime();
											var expireTime = time + 1000*36000;
											now.setTime(expireTime);
											document.cookie = 'token='+response.data.token;
											localStorage.setItem('companyName',response.data.data.company);
											localStorage.setItem('roleName',response.data.data.roles[0].roleName);
											localStorage.setItem('token', response.data.token);
											localStorage.setItem('user', JSON.stringify(response.data.data));
											localStorage.setItem('employeeId',response.data.data.companyEmployeeId);
											localStorage.setItem('userId', response.data.data.userId);
											localStorage.setItem('userName', response.data.data.name ? response.data.data.name : response.data.data.email);
											localStorage.setItem('companyId', response.data.data.companyId);
											response.data.data.firstname||response.data.data.lastname?localStorage.setItem('completeName', response.data.data.firstname+' '+response.data.data.lastname):localStorage.setItem('completeName', response.data.data.name);


											$('div#login').unblock();
											browserHistory.push('/home');
										}
										else if (response.data.code == 403) {
											localStorage.clear();
											$('div#login').unblock();
										}
										else {
											$('div#login').unblock();
											toastr.remove();
											toastr.error(response.data.message);
										}
									})
									.catch(function (error) {
										$('div#login').unblock();
										toastr.remove();
										toastr.error(response.data.message);
									});
							}
							else {
								$('div#login').unblock();
							}
						});
				}
				else {
					$('div#login').unblock();
					toastr.remove();
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				$('div#login').unblock();
			});
	};
}
