import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as groupActions from '../../actions/groups.Actions';
import * as select2 from '../../scripts/components-multi-select';
import * as datatable from '../../scripts/table-datatables-buttons';
import DeleteModal from '../common/deleteModal.component.js';
import '../../styles/bootstrap-select.css';
import '../../styles/multi-select.css';
import '../../styles/select2.min.css';
import '../../styles/select2-bootstrap.min.css';
import '../../scripts/jquery.multi-select';
import autoBind from 'react-autobind';

let groupId;
let linktype;
class Groups extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            groupdata: '',
            groupId: '',
            deleteIndex: ''
        };
    }
    componentDidMount() {
        $('div#groupsDiv').block({
            message: loader.GET_LOADER_IMAGE,
            css: { width: '25%' },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });
        setTimeout(function () {
            datatable.GroupsTable.init();
            $('div#groupsDiv').unblock();
        }, 3000);

        let that = this;

        $("#groupname_list").on('click', '.times', function () {
            var index = $(this).attr('data');
            that.deleteGroupHandler(index);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            var groups = JSON.parse(JSON.stringify(nextProps.groupData));
            this.setState({
                groupdata: groups
            });
            setTimeout(function () {
                select2.ComponentsDropdowns.init();
            }, 100);

            var groupname_list = $('#groupname_list').DataTable();
            groupname_list.destroy();
            setTimeout(function () {
                datatable.GroupsTable.init();
            }, 3000);
            setTimeout(function () {
                $('div#groupsDiv').unblock();
            }, 3200);
        }
        $('div#multiple_contacts_dialog').unblock();
    }
    componentWillMount() {
        var data = {
            parent: 'Groups',
            childone: '',
            childtwo: ''
        };

        this.props.breadCrumb(data);

        var data1 = {
            companyId: localStorage.companyId
        }
        this.props.actions.getGroups(data1);
    }

    groupHandler(e) {
        var name = ReactDOM
            .findDOMNode(this.refs.group_name)
            .value;
        if (this.props.params.contactId) {
            this.props.actions.createGroup(name, this.state.groupdata);
            $('div#groupsDiv').block({
                message: loader.GET_LOADER_IMAGE,
                css: { width: '25%' },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
        }
        else {
            toastr.error("Some Error occured");
        }
    }
    deleteGroupHandler(index) {
        var res = this.state.groupdata[index];
        var groupId = res._id;
        this.setState({ groupId: groupId, deleteIndex: index })
        $('#group_delete').modal('show');
    }
    deleteGroup() {
        if (this.state.groupId) {
            $('#group_delete').modal('hide');
            $('div#groupsDiv').block({
                message: loader.GET_LOADER_IMAGE,
                css: { width: '25%' },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this.props.actions.deleteGroup(this.state.groupId, this.state.deleteIndex, this.state.groupdata);
        }
    }
    onGroupChange(group) {
        if (group) {
            groupId = group;
        }
    }
    multipleHandler(type) {
        if (groupId) {
            if (type == "ADD") {
                linktype = type;
                $('#multiple-contacts').modal({ backdrop: 'static', keyboard: false });
                $('div#multiple_contacts_dialog').block({
                    message: loader.GET_LOADER_IMAGE,
                    css: { width: '25%' },
                    overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 },
                    centerX: false,
                    centerY: false
                });
                this.props.actions.getAddContactList(groupId);
            }
            else if (type == "REMOVE") {
                linktype = type;
                $('#multiple-contacts').modal({ backdrop: 'static', keyboard: false });
                $('div#multiple_contacts_dialog').block({
                    message: loader.GET_LOADER_IMAGE,
                    css: { width: '25%' },
                    overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 },
                    centerX: false,
                    centerY: false
                });
                this.props.actions.getRemoveContactList(groupId);
            }
        }
        else {
            toastr.error("Please select a group first");
        }
    }
    multipleContactSubmit() {
        var multiplecontact = $('#my_multi_select1').val();
        if (multiplecontact.length != 0) {
            if (linktype == "ADD") {
                var multiplecontact = $('#my_multi_select1').val();
                this.props.actions.addMultipleContacts(groupId, multiplecontact);
                $('#multiple-contacts').modal('hide');
                jQuery("#my_multi_select1").multiSelect('deselect_all');
            }
            else if (linktype == "REMOVE") {
                var multiplecontact = $('#my_multi_select1').val();
                this.props.actions.removeMultipleContacts(groupId, multiplecontact);
                $('#multiple-contacts').modal('hide');
                jQuery("#my_multi_select1").multiSelect('deselect_all');
            }

        }
        else {
            toastr.error("Please select contacts first");
            $('#multiple-contacts').modal('hide');
        }
    }
    render() {
        var groupStateData = this.state.groupdata;
        if (groupStateData) {
            var groupstate = this
                .state
                .groupdata
                .map(function (group, index) {
                    return <tr key={index}>
                        <td>
                            <div className="radiotext">
                                <label htmlFor='regular'>{group.groupName}</label>
                            </div>
                        </td>
                        <td>
                            <div className="radio">
                                <label><input type="radio" id='group' name="group" onChange={this.onGroupChange.bind(this, group._id)} value={group.groupName} /></label>
                            </div>
                        </td>
                        <td>{group.group_count}</td>
                        <td>
                            <span className="btn btn-icon-only red times" data={index} id={group._id}><i className="fa fa-times"></i></span>
                        </td>
                    </tr>
                }.bind(this));
            var multipleadd = this
                .props
                .multipleAddData
                .map(function (contact, index) {
                    return <option key={index} value={contact._id}>{contact.firstname + ' ' + contact.lastname}</option>
                }.bind(this));
        }
        return (
            <div>
                <div className="btn-group btn-group-circle">
                    <a href="#create-group" data-toggle="modal" className="btn blue" data-backdrop="static" data-keyboard="false">
                        Add Group</a>
                    <a onClick={this.multipleHandler.bind(this, "ADD")} className="btn green">
                        Add Multiple</a>
                    <a onClick={this.multipleHandler.bind(this, "REMOVE")} data-toggle="modal" className="btn red">
                        Remove Multiple</a>
                </div>
                <hr />
                <div className="portlet-body" id="groupsDiv" stylke={{}}>
                    <div className="table-container table-responsive">
                        <table className="table table-striped table-bordered table-hover" id="groupname_list">
                            <thead>
                                <tr>
                                    <th>Group Name</th>
                                    <th>Selected</th>
                                    <th>Users</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupstate}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="multiple-contacts" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog" id="multiple_contacts_dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Contacts</h4>
                            </div>
                            <div className="modal-body">
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="icon-users "></i>
                                            <span className="caption-subject bold uppercase">Users</span>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="row">
                                            <select multiple="multiple" className="multi-select" id="my_multi_select1" name="my_multi_select1[]" ref="my_multi_select1" onChange={this.onGroupChange.bind(this)}>
                                                {multipleadd}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    className="btn green"
                                    id="send-invite-button" onClick={this.multipleContactSubmit}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    id="create-group"
                    className="modal fade bs-modal-sm"
                    tabIndex="-1"
                    aria-hidden="true">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="actions">
                                    <a className="btn btn-sm btn-circle green">
                                        Group Name
                                                </a>
                                </div>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="group_name"
                                    ref="group_name"
                                    defaultValue="" />
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn green"
                                    id="send-invite-button" onClick={this.groupHandler}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal deleteModalId="group_delete" deleteUserHandler={this.deleteGroup} />
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        groupData: state.groups.groupData,
        multipleAddData: state.groups.multipleAddContacts
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(groupActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Groups);