// Table row component
import React, { PropTypes } from 'react';
import * as validate from '../common/validator';
class ContactRow extends React.Component {
	render() {
		let phone = '';
		if (this.props.contact.companyName) {
			var phoneN = this.props.contact.phoneInfo.map(function (phonedata, index) {
				if (phonedata.isPrimary) {
					let phoneCount = validate.removeSpecialCharSpace(phonedata.phone);
					if (phoneCount.length <= 11 && phoneCount.includes('x')) {
						phone = phonedata.phone.substring(0, phonedata.phone.indexOf('x'));
					} else {
						phone = phonedata.phone;
						var str = phone;
						var newStr = str.replace(/_/g, '');
						phone = newStr;
					}
					return phone;
				}
			});
		}
		return (
			<tr onClick={this.props.handleDetail} className="gridpointer">
				<td>{this.props.contact.firstname ? this.props.contact.firstname + ' ' + this.props.contact.lastname : '-'}</td>
				<td>{this.props.contact.title ? this.props.contact.title : '-'}</td>
				<td>{phoneN ? phoneN : '-'}</td>
				<td>{this.props.contact.internetInfo && this.props.contact.internetInfo.length != 0 ? this.props.contact.internetInfo[0].internetvalue : '-'}</td>
				<td>{this.props.contact.companyName ? this.props.contact.companyName : '-'}</td>
			</tr>
		);
	}
}
export default ContactRow;