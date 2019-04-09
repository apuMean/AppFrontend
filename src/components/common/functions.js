import * as loader from '../../constants/actionTypes.js';

/* Show BlockUi Loader */
export function showLoader(showLoaderForId) {
	$('div#' + showLoaderForId).block({
		message: loader.GET_LOADER_IMAGE,
		css: {
			width: '10%'
			// width: '25%'
		},
		overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
	});
}

/*Checks for if taxrate and default markup is valid or not*/
export function checkValidMarkAndTax(markup, taxrate) {
	toastr.remove();
	let data = {
		defaultMarkUp: markup >= 0 ? markup : 0,
		taxRate: taxrate >= 0 ? taxrate : 0
	};
	if (data.defaultMarkUp >= 0 && data.taxRate <= 100 && data.taxRate >= 0) {
		return true;
	}
	else {
		return false;
	}
}

export function shouldBeVisible(authorize) {
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