import React from 'react';
import _ from 'lodash';

class RoleAwareComponent extends React.Component {
	constructor(props) {
		super(props);
		this.authorize = [];
	}

	shouldBeVisible(authorize) {
		const user = JSON.parse(localStorage.getItem('user'));
		let userRole = [];
		if (user && user.roles.length !== 0) {
			user.roles.map(function (role, index) {
				userRole.push(role.roleName);
			});
		}
		if (user) {
			return _.intersection(authorize, userRole).length > 0;
		}

		return false;
	}
}

export default RoleAwareComponent;