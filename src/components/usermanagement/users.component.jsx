import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import * as usersActions from '../../actions/usersActions';
import '../../styles/users.css';

//User page presentational component
class Users extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };

        this.handleUserDetails = this.handleUserDetails.bind(this);
    }

    componentWillMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        let companyId = {
            userId: user.companyEmployeeId,
            companyId: localStorage.companyId
        }
        this.props.actions.getUsers(companyId);
    }

    handleUserDetails(id) {

        let profileId = id;
        browserHistory.push('/user/' + profileId);
    }

    render() {
        let userList = this.props.usersData.map(function (user, index) {
            return <div className="form-group" key={index}>
                <input type="hidden" value={user.name} />
                <button type="button"
                    onClick={this.handleUserDetails.bind(this, user._id)}
                    className="btn btn-block green uppercase">{user.name ? user.name : user.email}
                </button>
            </div>;
        }.bind(this));

        return (
            <div className="user">
                <div className="logo" >
                    <Link to="/company">
                        <img src={require('../../img/login.png')} alt="" />
                    </Link>
                </div>

                <div className="content">
                    <h3 className="form-title font-green">Select User</h3>
                    <div className="user-vertical-scroll">
                        {userList}
                    </div>
                </div>
                <div className="copyright"> 2017 &copy; Hive </div>
            </div>
        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return { usersData: state.users.usersList };
}
//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(usersActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Users);