import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="jumbotron">
                                <h2>
                                    Home
                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;