import React from 'react';
export const LaborRatesDrop = ({ laborRates,handleEdit, handleDelete}) => (
	<div className="row">
		<table className="table table-striped table-bordered table-hover">
			<thead >
				<tr>
					<th>Type</th>
					<th>Name</th>
					<th>Rate</th>
					<th>Our Cost</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{laborRates.map(function (val, index) {
					return <tr key={index}>
						<td>{val.laborType}</td>
						<td>{val.displayName}</td>
						<td>{val.rate}</td>
						<td>{val.ourCost?val.ourCost:'-'}</td>
						<td>
							<span className="btn btn-icon-only blue info"  onClick={(e) => handleEdit(e, index)}>
								<i className="fa fa-pencil"></i>
							</span>
							<span className="btn btn-icon-only red" onClick={(e) => handleDelete(e, index, val._id)}>
								<i className="fa fa-trash-o"></i>
							</span>
						</td>
					</tr>;
				})}
			</tbody>
		</table>
	</div>
);