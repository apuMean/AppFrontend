import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
//pricing presentational component
class Pricing extends React.Component {
	componentWillMount(){
		if(localStorage.getItem('token')!=null||''){
			browserHistory.push('/home');
		}
	}
	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="jumbotron">
								<h2>
                                    Pricing</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Pricing;