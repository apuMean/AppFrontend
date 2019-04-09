// Table row component
import React, { PropTypes } from 'react';
class ItemRow extends React.Component {
	render() {
		return (
			<tr onClick={this.props.handleDetail} className="gridpointer">
				<td>{this.props.item.manufacturer ? this.props.item.manufacturer : '-'}</td>
				<td>{this.props.item.modal ? this.props.item.modal : '-'}</td>
				<td>{this.props.item.partNumber ? this.props.item.partNumber : '-'}</td>
				<td>{this.props.item.itemName ? this.props.item.itemName : '-'}</td>
			</tr>
		);
	}
}
export default ItemRow;