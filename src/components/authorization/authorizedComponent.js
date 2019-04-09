import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

class AuthorizedComponent extends React.Component {

	componentWillMount() {
		const { routes } = this.props; // array of routes

		// check if user data available
		const user = JSON.parse(localStorage.getItem('user'));

		if (!user) {
			// redirect to login if not
			localStorage.clear();
			browserHistory.push('/signin');
		} 
		// else if(browserHistory.getCurrentLocation()=='/'){
		//     browserHistory.push('/home');
		// }


		// get all roles available for this route
		const routeRoles = _.chain(routes)
			.filter(item => item.authorize) // access to custom attribute
			.map(item => item.authorize)
			.flattenDeep()
			.value();

		let userRole = [];
		if (user.roles.length !== 0) {
			user.roles.map(function (role, index) {
				userRole.push(role.roleName);
			});
		}

		// compare routes with user data
		if (_.intersection(routeRoles, userRole).length === 0) {
			localStorage.clear();
			browserHistory.push('/signin');
			toastr.error('Your not authorized.Please log in with authorised user credentials!');
		}
	}
}

export default AuthorizedComponent;