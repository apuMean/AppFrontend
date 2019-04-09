import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import '../../styles/error.css';
//landing page presentaional component
class ErrorPage extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-12 page-404">
                    <div className="number font-green">404</div>
                    <div className="details">
                        <h2>Oops! You're lost.</h2>
                        <p>
                            We can not find the page you're looking for.
                <br />
                            <Link to="/home"> Return home</Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage;