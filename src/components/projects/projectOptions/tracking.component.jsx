import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import ReactDOM from 'react-dom';
import DeleteModal from '../../common/deleteModal.component.js';
import * as loader from '../../../constants/actionTypes.js';
import * as estimateActions from '../../../actions/estimateActions';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class ProjectTracking extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            itemValue: '',
            itemOptions: [],
            startDate: '',
            endDate: '',
            itemList: [],
            deleteIndex: '',
            itemId: ''
        }
    }

    componentDidMount() {
        $('div#itemList').block({
            message: loader.GET_LOADER_IMAGE,
            css: {
                width: '25%'
            },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#itemList').unblock();
        }, 2000);

        var projectId = {
            projectId: this.props.params.projectId
        }
        this
            .props
            .actions
            .getItemsList(projectId);

        var data1 = {
            parent: 'Projects',
            childone: 'Production Tracking',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }
    // handleItemChange(value) {     this.setState({itemValue: value}); }
    // onItemInputChange(value) {     var data = {         itemName: value,
    // companyId: localStorage.companyId     }     this         .props .estActions
    // .getItemData(data) }

    handleItemSubmit() {
        var days = this.refs.duration.value;
        if (this.refs.name.value.trim() && this.refs.description.value.trim() && this.refs.startDate.value && this.refs.endDate.value) {
            if (days <= 0 || days == '') {
                toastr.error('Please select valid date');
                return false
            }
            var details = {
                companyId: localStorage.companyId,
                itemId: "",
                projectId: this.props.params.projectId,
                itemName: this
                    .refs
                    .name
                    .value
                    .trim(),
                description: this
                    .refs
                    .description
                    .value
                    .trim(),
                start: this.state.startDate,
                end: this.state.endDate,
                duration: parseInt(this.refs.duration.value),
                dailyAverage: 0
            }
            $('#lineitem_add').modal('hide');
            $('div#itemList').block({
                message: loader.GET_LOADER_IMAGE,
                css: {
                    width: '25%'
                },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this
                .props
                .actions
                .addProjectItem(details, JSON.parse(JSON.stringify(this.state.itemList)));
        } else {
            toastr.error("Please populate all fields.")
        }
    }

    handleStartDate(event, picker) {

        var displayDate = picker
            .startDate
            .format('MM-DD-YYYY');
        this.setState({ startDate: displayDate });
    }
    handleEndDate(event, picker) {
        var displayDate = picker
            .startDate
            .format('MM-DD-YYYY');
        this.setState({ endDate: displayDate });
    }

    handleDetail(id) { }

    openModal() {
        ReactDOM
            .findDOMNode(this.refs.startDate)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.endDate)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.name)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.description)
            .value = "";
        ReactDOM
            .findDOMNode(this.refs.duration)
            .value = "";
        $('#lineitem_add').modal('show');
    }

    handleDelete(id, index) {

        this.setState({ itemId: id, deleteIndex: index })
        $('#item_delete').modal('show');
    }

    deleteItemHandler() {
        // if (this.state.itemId) {
        //     $('#item_delete').modal('hide');
        //     $('div#itemList').block({
        //         message: loader.GET_LOADER_IMAGE,
        //         css: {
        //             width: '25%'
        //         }
        //     });
        //     var data = {
        //         itemId: this.state.itemId
        //     }
        // this.props.timerActions.deleteTimer(data,this.state.deleteIndex,this.state.ti
        // merData);
        // }
    }

    componentWillReceiveProps(nextProps) {
        // var item = []; if (nextProps.newitemList.length != 0) {     var newitemList =
        // nextProps         .newitemList         .map(function (list, index) {    var
        // obj = {                 id: list._id,                 label: list.itemName
        //    }             item.push(obj)         }.bind(this)); }
        // this.setState({itemOptions: item})
        if (nextProps.itemList) {
            var itemState = JSON.parse(JSON.stringify(nextProps.itemList));
            this.setState({ itemList: itemState });
            var item_list = $('#tracking_item').DataTable();
            item_list.destroy();
            setTimeout(function () {
                datatable
                    .ProjectMoreOptions
                    .init();
            }, 3000);
            setTimeout(function () {
                $('div#itemList').unblock();
            }, 3200);
        }
    }
    render() {
        var itemList = this
            .state
            .itemList
            .map(function (item, index) {

                return <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.description}</td>
                    <td>{item.start}</td>
                    <td>{item.end}</td>
                    <td>{item.duration + ' ' + "days"}</td>
                    <td>NA</td>
                    {/*<td>
                        <i
                            className="icon-close "
                            onClick={this
                            .handleDelete
                            .bind(this, item._id, index)}
                            id={item._id}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <i
                            className="icon-eye "
                            onClick={this
                    .handleDetail
                    .bind(this, item._id)}></i>
                    </td>*/}
                </tr>;
            }.bind(this));
        let totalDays = '';
        if (this.state.startDate && this.state.endDate) {
            var m1 = moment(this.state.startDate, "MM-DD-YYYY");
            var m2 = moment(this.state.endDate, "MM-DD-YYYY");
            totalDays = m2.diff(m1, "days");
        }
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>Production Tracking</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet-title tabbable-line">
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#tracking-items" data-toggle="tab">
                                Items
                            </a>
                        </li>
                        <li>
                            <a href="#tracking-summary" data-toggle="tab">
                                Summary
                            </a>
                        </li>
                        <div className="text-right" style={{ "marginBottom": "5px" }}>
                            <a className="btn btn-sm btn-circle green" onClick={this.openModal}>
                                <i className="icon-plus"></i>
                                New Project Task
                            </a>&nbsp;&nbsp;
                            <Link
                                to={"/project/" + this.props.params.projectId}
                                className="btn btn-sm btn-circle red">
                                Back
                            </Link>
                        </div>
                    </ul>
                </div>
                <div className="portlet-body" id="itemList">
                    <div className="tab-content">
                        <div className="tab-pane active" id="tracking-items">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="tracking_item">
                                                    <thead >
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Description</th>
                                                            <th>Start</th>
                                                            <th>End</th>
                                                            <th>Duration</th>
                                                            <th>Daily Avg</th>
                                                            {/*<th>Action</th>*/}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {itemList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane" id="tracking-summary">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="table-container table-responsive">
                                                            <table className="table table-striped table-bordered table-hover">
                                                                <thead >
                                                                    <tr>
                                                                        <th>Task</th>
                                                                        <th>Duration</th>
                                                                        <th>Daily Avg</th>
                                                                        <th>Weighted Val</th>
                                                                        <th>Required</th>
                                                                        <th>To Date</th>
                                                                        <th>% Complete</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Routing</td>
                                                                        <td>-</td>
                                                                        <td>-</td>
                                                                        <td>-</td>
                                                                        <td>1</td>
                                                                        <td>-</td>
                                                                        <td>80%</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 table-responsive">
                                                        <div className="table-container table-responsive">
                                                            <table className="table table-striped table-bordered table-hover">
                                                                <thead >
                                                                    <tr>
                                                                        <th>Mon</th>
                                                                        <th>Tue</th>
                                                                        <th>Wed</th>
                                                                        <th>Thu</th>
                                                                        <th>Fri</th>
                                                                        <th>Sat</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>140</td>
                                                                        <td>0</td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                        <td></td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div id="lineitem_add" className="modal fade" tabIndex="-1" aria-hidden="true">
                            <div className="modal-dialog ">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="caption">
                                            <span className="caption-subject bold uppercase">New Project Task</span>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        {/*<Select
                                            disabled={false}
                                            value={this.state.itemValue}
                                            placeholder="Select Item"
                                            name="item"
                                            id="item"
                                            options={this.state.itemOptions}
                                            onChange={this.handleItemChange}
                                            onInputChange={this.onItemInputChange}/>*/}

                                        <div className="portlet-body form">
                                            <div className="form-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">Task Name
                                                                <span className="required">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                ref="name"
                                                                name="name"
                                                                className="form-control"
                                                                placeholder="Task Name"
                                                                defaultValue="" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">Description
                                                                <span className="required">*</span>
                                                            </label>
                                                            <textarea
                                                                ref="description"
                                                                name="description"
                                                                placeholder="Description"
                                                                className="form-control"
                                                                rows="1"
                                                                defaultValue=""></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="startDateTime">Start<span className="required">*</span>
                                                            </label>
                                                            <DateRangePicker
                                                                showDropdowns={true}
                                                                minDate={moment()}
                                                                timePicker={false}
                                                                onHide={this.handleStartDate}
                                                                singleDatePicker>
                                                                <div className="input-group date form_datetime">
                                                                    <input
                                                                        type="text"
                                                                        className="selected-date-range-btn"
                                                                        size="16"
                                                                        ref="startDate"
                                                                        disabled={true}
                                                                        name="startDate"
                                                                        className="form-control"
                                                                        defaultValue={this.state.startDate}
                                                                        key={this.state.startDate} />
                                                                    <span className="input-group-btn">
                                                                        <button className="btn default date-set calendar-shadow-none" type="button">
                                                                            <i className="fa fa-calendar"></i>
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </DateRangePicker>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="endDateTime">End<span className="required">*</span>
                                                            </label>
                                                            <DateRangePicker
                                                                showDropdowns={true}
                                                                minDate={moment()}
                                                                timePicker={false}
                                                                onHide={this.handleEndDate}
                                                                singleDatePicker>
                                                                <div className="input-group date form_datetime">
                                                                    <input
                                                                        type="text"
                                                                        className="selected-date-range-btn"
                                                                        size="16"
                                                                        disabled={true}
                                                                        ref="endDate"
                                                                        name="endDate"
                                                                        className="form-control"
                                                                        defaultValue={this.state.endDate}
                                                                        key={this.state.endDate} />
                                                                    <span className="input-group-btn">
                                                                        <button className="btn default date-set calendar-shadow-none" type="button">
                                                                            <i className="fa fa-calendar"></i>
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </DateRangePicker>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">Duration(Days)
                                                                <span className="required">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                ref="duration"
                                                                name="duration"
                                                                defaultValue={totalDays >= 0
                                                                    ? totalDays
                                                                    : ''}
                                                                key={totalDays}
                                                                className="form-control"
                                                                disabled={true}
                                                                placeholder="Duration" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                        <button
                                            type="button"
                                            className="btn green"
                                            id="send-invite-button"
                                            onClick={this.handleItemSubmit}>Done</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <DeleteModal
                            deleteModalId="item_delete"
                            deleteUserHandler={this.deleteItemHandler} />
                    </div>
                </div>
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
    return {
        itemList: state.projectOption.itemList
        // newitemList: state.estimate.itemList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
        // estActions: bindActionCreators(estimateActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTracking);