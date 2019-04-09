import React, { PropTypes } from 'react';
import { Link } from 'react-router';
//Parent container for all components and their nested components
class App extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default App;