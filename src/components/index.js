import React from 'react';
import { Link, IndexLink } from 'react-router';
import '../styles/indexpage.css';
import '../styles/daterangepicker.css';
import '../../node_modules/react-select/dist/react-select.css';
import '../styles/custom.css';
import '../styles/plugins/datatables/datatables.min.css';
import '../styles/plugins/bootstrap/datatables.bootstrap.css';
import '../styles/bootstrap-multiselect.css';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class Index extends React.Component {
	render() {
		return (
			<div>
				<header className="bs-docs-nav navbar navbar-static-top" id="top">
					<div className="container">
						<div className="navbar-header">
							<button aria-controls="bs-navbar" aria-expanded="false" className="collapsed navbar-toggle" data-target="#bs-navbar" data-toggle="collapse" type="button">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<a href="#" className="navbar-brand"><img className="login-logo login-6" src={require('../img/login.png')} /></a>
						</div>
						<nav className="collapse navbar-collapse" id="bs-navbar">
							<ul className="nav navbar-nav"></ul>
							<ul className="nav navbar-nav navbar-right">
								<li className="active"> <Link to="/">Home</Link></li>
								<li>
									<Link to="/pricing" >Pricing</Link>
								</li>
								<li>
									<Link to="/contacts">Contact</Link>
								</li>
								<li>
									<Link to="/signin">Sign In</Link>
								</li>
							</ul>
						</nav>
					</div>
				</header>
				{this.props.children}
			</div>
		);
	}
}

export default Index;
