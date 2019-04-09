// import React,{Component} from 'react';

// export default class ProposalConfig extends Component {
//     render(){
//         return(<div>Proposal2</div>);
//     }
// }
import React from 'react';


class ProposalConfig extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {};
	}

	render() {

		let formats = this.props.formatList.map(function (format, index) {
			return <option key={index} value={format._id}>{format.formatNo}</option>;
		});

		let self = this;
		const items = this.props.itemColumns.map((val, i) => (
			<div key={i} className="input-group list-sort-item" style={{ marginBottom: '8px', width: '200px' }}>
				<span className="input-group-addon">
					<input type="checkbox" defaultChecked={val.isVisible} onChange={this.props.handleVisibleToggle.bind(self, i, 'HEADER')} />
				</span>
				<input type="text"
					className="form-control" ref={'columnInput' + val.seqNo}
					defaultValue={val.fieldName}
					key={val.fieldName}
					disabled={val.disabled}
					onKeyUp={this.props.handleEnterInputEvent.bind(self, i, 'HEADER')} />
				<span className="input-group-addon" style={{ cursor: 'pointer', display: val.disabled ? '' : 'none' }} onClick={this.props.handleUpdateEnable.bind(self, i, 'HEADER', val.seqNo)}>
					<i className="fa fa-pencil black"></i>
				</span>
				<span className="input-group-addon" id={'isEdit' + val.seqNo} style={{ cursor: 'pointer', display: val.disabled ? 'none' : '' }} onClick={this.props.handleEditableColumn.bind(self, i, 'HEADER', true, val.seqNo)}>
					<i className="fa fa-check" style={{ color: 'green' }}></i>
				</span>
				<span className="input-group-addon" id={'isEdit' + val.seqNo} style={{ cursor: 'pointer', display: val.disabled ? 'none' : '' }} onClick={this.props.handleEditableColumn.bind(self, i, 'HEADER', false, val.seqNo)}>
					<i className="fa fa-ban" style={{ color: 'red' }}></i>
				</span>
			</div>
		));
		const totals = this.props.totalColumns.map((val, i) => (
			<div key={i} className="input-group list-total-sort" style={{ marginBottom: '8px', width: '200px' }}>
				<span className="input-group-addon">
					<input type="checkbox" defaultChecked={val.isVisible} onChange={this.props.handleVisibleToggle.bind(self, i, 'TOTAL')} />
				</span>
				<input type="text"
					className="form-control" ref={'totalInput' + val.seqNo}
					defaultValue={val.fieldName}
					key={val.fieldName}
					disabled={val.disabled}
					onKeyUp={this.props.handleEnterInputEvent.bind(self, i, 'TOTAL')} />
				<span className="input-group-addon" style={{ cursor: 'pointer', display: val.disabled ? '' : 'none' }} onClick={this.props.handleUpdateEnable.bind(self, i, 'TOTAL')}>
					<i className="fa fa-pencil black"></i>
				</span>
				<span className="input-group-addon" id={'isEdit' + val.seqNo} style={{ cursor: 'pointer', display: val.disabled ? 'none' : '' }} onClick={this.props.handleEditableColumn.bind(self, i, 'TOTAL', true, val.seqNo)}>
					<i className="fa fa-check" style={{ color: 'green' }}></i>
				</span>
				<span className="input-group-addon" id={'isEdit' + val.seqNo} style={{ cursor: 'pointer', display: val.disabled ? 'none' : '' }} onClick={this.props.handleEditableColumn.bind(self, i, 'TOTAL', false, val.seqNo)}>
					<i className="fa fa-ban" style={{ color: 'red' }}></i>
				</span>
			</div>
		));

		return (
			<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12" ref="est_config" style={{ padding: '0 0 0 15px', margin: '0',}}>
				<div className="portlet light bordered">
					<div className="portlet-body form">
						<form className="form-horizontal" role="form">
							<div className="form-body" style={{ paddingBottom: 0 }}>
								<div className="form-group">
									<label className="col-md-3 control-label">Format</label>
									<div className="col-md-9">
										<select className="form-control" value={this.props.formatId ? this.props.formatId : ''} onChange={this.props.handleFormatChange}>
											{formats}
										</select>
									</div>
								</div>
								<div className="form-group">
									<label className="col-md-3 control-label"></label>
									<div className="col-md-9">
										{this.props.formatId ? <button className="btn green" type="button" onClick={this.props.handleUpdateFormat}>Save</button> : null}&nbsp;&nbsp;
										<button className="btn purple" type="button" onClick={this.props.handleSavePopUp}>Save as New</button>
									</div>
								</div>
								{/* <div className="form-group">
									<label className="col-md-3 control-label">Revision</label>
									<div className="col-md-9">
										<select className="form-control">

											<select className="form-control" onChange={this.props.changeRevision.bind(this)}>
											{this.props.revisions}
										</select>
									</div>
								</div>*/}
								<div className="form-group" style={{ marginBottom: '0' }}>
									<label className="col-md-3 control-label">Orientation</label>
									<div className="col-md-9">
										<div className="md-radio-list" style={{ marginLeft: '15px' }}>
											<div className="md-radio">
												<input
													type="radio"
													id="checkbox112_6"
													name="radio1" value="1"
													className="md-radiobtn"
													defaultChecked={true}
													// onChange={this.props.updateOrientation}
												/>
												<label htmlFor="checkbox112_6">
													<span></span>
													<span className="check"></span>
													<span className="box"></span>Portrait</label>
											</div>
											<div className="md-radio">
												<input type="radio"
													id="checkbox112_7"
													name="radio1" value="2"
													className="md-radiobtn"
													onChange={this.props.updateOrientation}
												/>
												<label htmlFor="checkbox112_7">
													<span className="inc"></span>
													<span className="check"></span>
													<span className="box"></span> Landscape </label>
											</div>
										</div>
									</div>
								</div>
							</div> 
						</form>
					</div>
					{/* Columns Collapsible */}
					<div className="portlet box blue ">
						<div className="portlet-title" style={{ cursor: 'pointer' }} data-toggle="collapse" data-target="#collapseOne">
							<div className="caption">
								<i className="fa fa-gift"></i>
                                Columns
							</div>
							<div className="tools">
								<a className="collapse accordion-toggle-styled collapsed" data-toggle="collapse" href="#collapseOne"> </a>
							</div>
						</div>
						<div className="portlet-body" id="collapseOne" className="collapse">
							<form role="form" style={{ marginLeft: '25px' }}>
								<div className="row">
									<div className="col-md-12 list-sort" id="list_item" ref="list_item">
										{items}
									</div>
								</div>
							</form>
						</div>
					</div>
					{/* Totals Collapsible */}
					<div className="portlet box blue ">
						<div className="portlet-title" style={{ cursor: 'pointer' }} data-toggle="collapse" data-target="#collapseThree">
							<div className="caption">
								<i className="fa fa-gift"></i> Totals
							</div>
							<div className="tools">
								<a className="collapse accordion-toggle" data-toggle="collapse" href="#collapseThree"> </a>
							</div>
						</div>
						<div className="portlet-body" id="collapseThree" className="collapse">
							<form role="form" style={{ marginLeft: '25px' }}>
								<div className="row">
									<div className="col-md-12 list-total" id="list_total" ref="list_total">
										{totals}
									</div>
								</div>
							</form>
						</div>
					</div>
					{/* Column Options Collapsible */}
					<div className="portlet box blue ">
						<div className="portlet-title" style={{ cursor: 'pointer' }} data-toggle="collapse" data-target="#collapseTwo">
							<div className="caption">
								<i className="fa fa-gift"></i> Options
							</div>
							<div className="tools">
								<a className="collapse accordion-toggle" data-toggle="collapse" href="#collapseTwo"> </a>
							</div>
						</div>
						<div className="portlet-body" id="collapseTwo" className="collapse">
							<form role="form" style={{ marginLeft: '25px' }}>
								<div className="row">
									{/* <div className="col-md-12">
										<div className="input-group" style={{ marginBottom: '8px', width: '200px' }}>
											<span className="input-group-addon">
												<input type="checkbox" defaultChecked={this.props.combineMfgModelPartDesc} key={this.props.combineMfgModelPartDesc} onChange={this.props.handleMergeColumn} />
											</span>
											<textarea className="form-control" rows="2" style={{ resize: 'none' }} disabled={true} defaultValue="Combine Mfg, Part, Model and Desc" />
										</div>
									</div> */}
									<div className="col-md-12">
										<div className="input-group" style={{ marginBottom: '8px', width: '200px' }}>
											<span className="input-group-addon">
												<input type="checkbox" defaultChecked={this.props.showDollarSign} key={this.props.showDollarSign} onChange={this.props.handleDollarShow} />
											</span>
											<textarea className="form-control" rows="2" style={{ resize: 'none' }} disabled={true} defaultValue="Show dollar signs in estimate rows" />
										</div>
									</div> 
									<div className="col-md-12">
										<div className="input-group" style={{ marginBottom: '8px', width: '200px' }}>
											<span className="input-group-addon">
												<input type="checkbox" defaultChecked={this.props.includeSign} key={this.props.includeSign} onChange={this.props.handleSignInclude} />
											</span>
											<textarea className="form-control" rows="1" style={{ resize: 'none' }} disabled={true} defaultValue="Include signature" />
										</div>
									</div>
									{/* <div className="col-md-12">
										<div className="input-group" style={{ marginBottom: '8px', width: '200px' }}>
											<span className="input-group-addon">
												<input type="checkbox" defaultChecked={this.props.showShipping} key={this.props.showShipping} onChange={this.props.handleShowShipping} />
											</span>
											<textarea className="form-control" rows="2" style={{ resize: 'none' }} disabled={true} defaultValue="Show shipping in line items" />
										</div>
									</div> */}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default ProposalConfig;