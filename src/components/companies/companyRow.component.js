// Table row component
import React, { PropTypes } from 'react';
import * as validate from '../common/validator';
class CompanyRow extends React.Component {
	render() {
		let phone = '-';
		if (this.props.company.companyName) {
			var address = this.props.company.addressInfo.map(function (addressData, index) {
				return addressData.mapAddress1 + ' ' + addressData.mapAddress2 + ' ' + addressData.city + ' ' + addressData.state + ' ' + addressData.zip;
			});
			var phoneN = this.props.company.phoneInfo.map(function (phonedata, index) {
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
				<td>{this.props.company.companyName ? this.props.company.companyName : '-'}</td>
				<td>{this.props.company.phoneInfo && this.props.company.phoneInfo.length ? phoneN : '-'}</td>
				<td>{this.props.company.internetInfo && this.props.company.internetInfo.length ? this.props.company.internetInfo[0].internetvalue : '-'}</td>
				<td>{this.props.company.addressInfo && this.props.company.addressInfo.length ? address : '-'}</td>
			</tr>
		);
	}
}
export default CompanyRow;