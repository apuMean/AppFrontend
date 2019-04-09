import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import * as layout from '../../scripts/app';
import jQuery from 'jquery';
import RoleAwareComponent from '../authorization/roleaware.component';
import * as appValid from '../../scripts/app';
import * as usersActions from '../../actions/usersActions';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { isValidImage } from '../shared/isValidImage';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import * as loader from '../../constants/actionTypes.js';
import * as authorize from '../authorization/roleTypes';

//Profile page controlled component
class Profile extends RoleAwareComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userData: '',
            userRoles: [],
            disabled: false,
            rolesValue: [],
            rolesOptions: [],
            dataRecieved: false,
            blocking: true
        };
        this.handleRolesChange = this.handleRolesChange.bind(this);
        this.handleUserUpdate = this.handleUserUpdate.bind(this);
        this.imageUpdateHandler = this.imageUpdateHandler.bind(this);
        this.removeProfileImage = this.removeProfileImage.bind(this);
    }

    componentWillMount() {
        
        let profileId = {
            companyUserId: this.props.params.profileId
        }
        this.setState({ dataRecieved: true });
        this.props.actions.getUserDetails(profileId);
        let companyId = {
            companyId: localStorage.companyId
        }
        this.props.actions.getRoles(companyId);
    }

    componentDidMount() {
        appValid.FormValidationMd.init();
        let fileData = ReactDOM.findDOMNode(this.refs.userFileUpload);
    }

    componentWillUnmount() {
        let fileData = ReactDOM.findDOMNode(this.refs.userFileUpload);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData) {
            let userState = nextProps.userData;
            this.setState({
                userData: userState,
                blocking: false
            });

            if (this.state.dataRecieved) {
                let currentRolesState = nextProps.userData.roles.map(function (role) {
                    this.state.rolesValue.push({ value: role.roleId, label: role.roleName });
                }.bind(this));
                this.setState({
                    dataRecieved: false
                });
            }

            if (nextProps.userRoles.length !== 0 && this.state.rolesOptions.length == 0) {
                let rolesState = nextProps.userRoles.map(function (role) {
                    this.state.rolesOptions.push({ value: role._id, label: role.roleName });
                }.bind(this));

                this.setState({
                    userRoles: nextProps.userRoles
                });
            }
            setTimeout(function () {
                layout
                    .FloatLabel
                    .init();
            }, 400);
        }
    }

    handleRolesChange(value) {
        
        this.setState({ rolesValue: value })
        let roleData = [];
        value.map(function (role) {
            let obj = {
                roleId: role.value,
                roleName: role.label
            }
            roleData.push(obj);
        })
        let roledata = {
            userId: this.props.params.profileId,
            roles: roleData
        }
        this.props.actions.updateUserRoles(roledata);
    }

    handleUserUpdate() {
        
        if (jQuery('#userUpdateForm').valid()) {
            let firstname = ReactDOM.findDOMNode(this.refs.firstname).value.trim();
            let lastname = ReactDOM.findDOMNode(this.refs.lastname).value.trim();
            let currentState = JSON.parse(JSON.stringify(this.state.userData));
            let userData = {
                userId: this.props.params.profileId,
                firstName: firstname,
                lastName: lastname,
                name: firstname + ' ' + lastname
            }
            this.props.actions.updateUserDetails(userData, currentState);
        }
    }

    imageUpdateHandler(event) {
        
        let userId;
        let fileData;
        let currentState = JSON.parse(JSON.stringify(this.state.userData));
        if (event.target.value) {
            userId = this.props.params.profileId;
            fileData = ReactDOM.findDOMNode(this.refs.userFileUpload).files[0];
            if (!isValidImage(fileData.name)) {
                userId = '';
            }
        }
        else {
            userId = '';
        }
        if (userId) {
            this.props.actions.updateUserPicture(fileData, userId, currentState);
        }
    }

    removeProfileImage() {
        
        let currentState = JSON.parse(JSON.stringify(this.state.userData));
        let userId = this.props.params.profileId;
        let data = {
            userId: userId,
            path: this.state.userData.userImage.replace(/ +/g, "")
        }
        this.props.actions.removeUserPicture(data, currentState);
    }

    render() {

        var userRoles = this.state.userRoles
            .map(function (user, index) {
                return <option value={user._id} key={index}>{user.roleName}</option>;
            }.bind(this));
        return (
            <BlockUi tag="div" blocking={this.state.blocking}loader={<img src='../../img/new_loader.gif'/>}>
                <div className="portlet light bordered" style={{ height: '500px' }}>
                    <div className="portlet-title tabbable-line">
                        <div className="caption">
                            <i className="icon-users font-dark"></i>
                            <span className="caption-subject font-dark bold uppercase">User - {this.state.userData.firstname ? this.state.userData.name : this.state.userData.email}</span>
                        </div>
                        <ul className="nav nav-tabs">
                            <li className="active">
                                <a href="#user-details" data-toggle="tab"> Details </a>
                            </li>
                            <li>
                                <a href="#user-settings" data-toggle="tab"> Settings </a>
                            </li>
                        </ul>
                    </div>
                    <div className="portlet-body">
                        <div className="tab-content">
                            <div className="tab-pane active" id="user-details">
                                <form action="#" className="horizontal-form">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <ul className="list-unstyled profile-nav">
                                                    <li>
                                                        <img src={this.state.userData.userImage ? this.state.userData.userImage : require('../../img/profile/avatar-default.png')} className="img-responsive pic-bordered" alt="Profile Pic" />
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static">{this.state.userData.firstname ? this.state.userData.firstname : '-'}</div>
                                                            <label htmlFor="firstname">First Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {this.state.userData.lastname ? this.state.userData.lastname : '-'} </div>
                                                            <label htmlFor="lastname">Last Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {this.state.userData.company ? this.state.userData.company : '-'} </div>
                                                            <label htmlFor="company">Company</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <div className="form-control form-control-static"> {this.state.userData.email ? this.state.userData.email : '-'} </div>
                                                            <label htmlFor="email">Email</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="tab-pane" id="user-settings">
                                <form role="form" id="userUpdateForm">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                        <div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ width: 200, height: 200}}>
                                                            <img src={this.state.userData.userImage ? this.state.userData.userImage : require('../../img/profile/avatar-default.png')} className="img-responsive" alt="Logo" />
                                                        </div>
                                                        <div>
                                                            <span className="btn red btn-sm btn-outline btn-file">
                                                                <span className="fileinput-new"> Select Picture </span>
                                                                <span className="fileinput-exists"> Change </span>
                                                                <input type="file"
                                                                    ref="userFileUpload"
                                                                    id="userFileUpload"
                                                                    name="userFileUpload"
                                                                    accept='image/*'
                                                                    onChange={this.imageUpdateHandler} />
                                                            </span>
                                                            {this.state.userData.userImage ? <a href="javascript:;"
                                                                className="btn red btn-sm"
                                                                onClick={this.removeProfileImage}> Remove </a> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <input ref="firstname" type="text" className="form-control" name="firstname" id="firstname" key={this.state.userData.firstname} defaultValue={this.state.userData.firstname} />
                                                            <label htmlFor="firstname">First Name<span className="required">*</span></label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <input ref="lastname" type="text" className="form-control" name="lastname" id="lastname" key={this.state.userData.lastname} defaultValue={this.state.userData.lastname} />
                                                            <label htmlFor="lastname">Last Name</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <input ref="weburl" disabled={true}
                                                                type="text"
                                                                className="form-control"
                                                                name="web" id="web"
                                                                key={this.state.userData.company}
                                                                defaultValue={this.state.userData.company ? this.state.userData.company : '-'} />
                                                            <label htmlFor="web">Company</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <input ref="location" disabled={true}
                                                                type="text"
                                                                className="form-control"
                                                                name="location"
                                                                id="location"
                                                                key={this.state.userData.email}
                                                                defaultValue={this.state.userData.email ? this.state.userData.email : '-'} />
                                                            <label htmlFor="location">Email</label>
                                                        </div>
                                                    </div>
                                                    {this.shouldBeVisible(authorize.userAuthorize) ? <div className="col-md-6">
                                                        <div className="form-group form-md-line-input form-md-floating-label">
                                                            <label htmlFor="roles">Roles</label>
                                                            <Select
                                                                multi
                                                                disabled={this.state.disabled}
                                                                value={this.state.rolesValue}
                                                                placeholder="Select roles"
                                                                options={this.state.rolesOptions}
                                                                onChange={this.handleRolesChange}
                                                            />
                                                        </div>
                                                    </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-actions noborder text-right">
                                        <button type="button" className="btn blue"
                                            onClick={this.handleUserUpdate}>Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockUi>
        );
    }
}

//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return {
        userData: state.users.userData,
        userRoles: state.users.userRoles
    };
}

//this tells what action should expose on props
//bindActionCreators is used to bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(usersActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);