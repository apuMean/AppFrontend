import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as dashboardActions from '../../actions/dashboardActions';

class Home extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			role: localStorage.getItem('roleName')
		};
	}

	componentWillMount() {
		var data = {
			parent: 'Home',
			childone: '',
			childtwo: ''
		};
		this.props.breadCrumbs(data);
		// this.props.actions.updateBreadcrumb(data);

	}
	render() {
		var Home = this.state.role != 'Technician' ? <div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="jumbotron">
						<h2>
                            Home
						</h2>
					</div>
				</div>
			</div>
		</div> : <div className="container">
			<div className="jumbotron jumbotronDiv">
			
				
					<Link to="/worklog/add" className="btn btn-sm btn-circle green">
						<i className="icon-plus plus_icon"></i>Add Work Log Entry</Link>
			

			</div>
		</div>;
		return (
			<div>
				{Home}
			</div>
		);
	}
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {};
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dashboardActions, dispatch),
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);