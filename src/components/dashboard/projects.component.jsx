import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as dashboardActions from '../../actions/dashboardActions';
import autoBind from 'react-autobind';

const STAGE = [
    {
        value: '1',
        label: 'Open'
    }, {
        value: '2',
        label: 'In-Progress'
    }, {
        value: '3',
        label: 'Closed'
    }
];

class Projects extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            ranges: {
                'Today': [
                    moment(), moment()
                ],
                'Yesterday': [
                    moment().subtract(1, 'days'),
                    moment().subtract(1, 'days')
                ],
                'Two Days Ago': [
                    moment().subtract(2, 'days'),
                    moment().subtract(2, 'days')
                ],
                'Three Days Ago': [
                    moment().subtract(3, 'days'),
                    moment().subtract(3, 'days')
                ],
                'This Week': [
                    moment().startOf('week'),
                    moment().endOf('week')
                ],
                'This Week To Date': [
                    moment().startOf('week'),
                    moment()
                ],
                'Last Week': [
                    moment()
                        .subtract(1, 'week')
                        .startOf('week'),
                    moment()
                        .subtract(1, 'week')
                        .endOf('week')
                ],
                'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month')
                ],
                'This Month To Date': [
                    moment().startOf('month'),
                    moment()
                ],
                'Last Month': [
                    moment()
                        .subtract(1, 'month')
                        .startOf('month'),
                    moment()
                        .subtract(1, 'month')
                        .endOf('month')
                ]
            },
            disabled: false,
            crazy: false,
            stageValue: [],
            categoryValue: [],
            stageOptions: STAGE,
            categoryOptions: [],
            startDate: '',
            endDate: '',
            per_page: 0,
            page: 0,
            showDropdowns: true,
            projectsList: [],
            categorys: [],
            stages: []
        };
    }

    componentWillMount() {
        var data = {
            companyId: localStorage.companyId
        }
        var data1 = {
            parent: 'Dashboard',
            childone: 'Projects',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
        this.props.actions.getProjectCategory(data);
        this.props.actions.getDashProjectList(data);
    }

    componentWillReceiveProps(nextProps) {
        let categoryData = [];
        if (nextProps.categoryDrop.length != 0) {
            var categories = nextProps
                .categoryDrop
                .map(function (category, index) {
                    var obj = {
                        value: category._id,
                        label: category.categoryName
                    }
                    categoryData.push(obj)
                }.bind(this));
        }

        this.setState({
            categoryOptions: categoryData,
            projectsList: nextProps.getProjectList
        })

        $('div#dashboard_projects_container').block({
            message: loader.GET_LOADER_IMAGE,
            css: { width: '25%' },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        var groupname_list = $('#dash_project').DataTable();
        groupname_list.destroy();

        setTimeout(function () {
            datatable.DashboardProjectsTable.init();
            $('div#dashboard_projects_container').unblock();
        }, 3000);
    }


    componentDidMount() { }

    handleEvent(event, picker) {
        this.setState({ stageValue: [] });
        this.setState({ categoryValue: [] });
        var start = picker
            .startDate
            .format('MM-DD-YYYY');
        var end = picker
            .endDate
            .format('MM-DD-YYYY');
        var data = {
            "filterType": "date",
            "companyId": localStorage.companyId,
            "startDate": start,
            "endDate": end
        }
        this
            .props
            .actions
            .getDashProjectFilteredList(data)
        this.setState({ startDate: start, endDate: end });
    }

    handleStageChange(value) {
        this.setState({
            categoryValue: [],
            startDate: '__-__-__',
            endDate: '__-__-__'
        });
        if (value.length == 0) {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashProjectList(data);
            this.setState({ stageValue: value });
        }
        else {
            this.state.stages = [];
            this.setState({ stageValue: value });
            var stageState = value.map(function (res, index) {
                this
                    .state
                    .stages
                    .push(res.value);
            }.bind(this));
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "stage",
                "stageId": this.state.stages
            }
            this
                .props
                .actions
                .getDashProjectFilteredList(data)
        }
    }

    handleCategoryChange(value) {
        this.setState({
            stageValue: [],
            startDate: '__-__-__',
            endDate: '__-__-__'
        });
        if (value.length == 0) {
            var data = {
                "companyId": localStorage.companyId
            }
            this
                .props
                .actions
                .getDashProjectList(data);
            this.setState({ categoryValue: value });
        }
        else {
            this.state.categorys = [];
            this.setState({ categoryValue: value });
            var categoryState = value.map(function (res, index) {
                this
                    .state
                    .categorys
                    .push(res.value);
            }.bind(this));
            var data = {
                "companyId": localStorage.companyId,
                "filterType": "category",
                "categoryId": this.state.categorys
            }
            this
                .props
                .actions
                .getDashProjectFilteredList(data)
        }
    }

    render() {
        let stage = '';
        var start = this.state.startDate;
        var end = this.state.endDate;
        var label = start + ' - ' + end;
        if (start === end) {
            label = start;
        }

        var dashboardProjectsList = this.state.projectsList;
        if (dashboardProjectsList) {
            var projectList = dashboardProjectsList.map(function (project, index) {
                if (project.stageId === 1) {
                    stage = 'Open'
                }
                else if (project.stageId === 2) {
                    stage = 'In-Progress'
                }
                else if (project.stageId === 3) {
                    stage = 'Closed'
                }
                return <tr key={index}>
                    <td>{project.projectNumber ? project.projectNumber : '-'}</td>
                    <td>{project.companyId ? project.companyId.company : '-'}</td>
                    <td>{project.title ? project.title : '-'}</td>
                    <td>{stage ? stage : '-'}</td>
                    <td>{project.categoryId ? project.categoryId.categoryName : '-'}</td>
                    <td>{project.startDate ? moment(project.startDate).format("MM-DD-YYYY") : '-'}</td>
                    <td>{project.endDate ? moment(project.endDate).format("MM-DD-YYYY") : '-'}</td>
                </tr>;
            }.bind(this));
        }
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "17px"
                            }}>Projects</span>
                    </div>
                </div>
                <hr></hr>
                <div className="portlet light bordered" id="dashboard_projects_container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group form-md-floating-label">
                                <label htmlFor="status">Date Range</label>
                                <DateRangePicker
                                    ranges={this.state.ranges}
                                    showDropdowns={this.state.showDropdowns}
                                    onApply={this.handleEvent}>
                                    <div className="input-group date form_datetime">
                                        <input
                                            type="text"
                                            className="selected-date-range-btn"
                                            size="16"
                                            className="form-control"
                                            defaultValue={label
                                                ? label
                                                : "__-__-__"}
                                            key={label} />
                                        <span className="input-group-btn">
                                            <button className="btn default date-set" type="button">
                                                <i className="fa fa-calendar"></i>
                                            </button>
                                        </span>
                                    </div>
                                </DateRangePicker>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <Select
                                multi
                                disabled={this.state.disabled}
                                value={this.state.stageValue}
                                placeholder="Select stage"
                                options={this.state.stageOptions}
                                onChange={this.handleStageChange}
                                style={{
                                    "marginTop": "25px"
                                }} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Select
                                multi
                                disabled={this.state.disabled}
                                value={this.state.categoryValue}
                                placeholder="Select category"
                                options={this.state.categoryOptions}
                                onChange={this.handleCategoryChange} />
                        </div>
                    </div>
                    <div className="row"></div>
                    <div className="row">
                        <div
                            className="portlet light portlet-fit portlet-datatable bordered"
                            style={{
                                "marginTop": "15px"
                            }}>
                            <div className="portlet-body">
                                <div className="table-container table-responsive">
                                    <table className="table table-striped table-bordered table-hover" id="dash_project">
                                        <thead>
                                            <tr>
                                                <th>Project #</th>
                                                <th>Company</th>
                                                <th>Title</th>
                                                <th>Stage</th>
                                                <th>Category</th>
                                                <th>Date Start</th>
                                                <th>Date End</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projectList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <popup></popup>
                <div id="link-salesrep" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Select SalesRep</h4>
                            </div>
                            <div className="modal-body">
                                <div className="portlet light portlet-fit portlet-datatable bordered">
                                    <div className="portlet-title">
                                        <div className="caption">
                                            <i className="icon-users "></i>
                                            <span className="caption-subject bold uppercase">Sales Reps</span>
                                        </div>
                                    </div>
                                    <div className="portlet-body">
                                        <div className="table-container table-responsive">
                                            <table className="table table-striped table-bordered table-hover" id="sample_3">
                                                <thead>
                                                    <tr>
                                                        <th>SalesRep Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>John Miller</td>
                                                        <td>
                                                            <div className="md-checkbox-inline">
                                                                <div className="md-checkbox">
                                                                    <input type="checkbox" id="linkcheck2" className="md-check" />
                                                                    <label htmlFor="linkcheck2">
                                                                        <span></span>
                                                                        <span className="check"></span>
                                                                        <span className="box"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                <button
                                    type="button"
                                    data-dismiss="modal"
                                    className="btn green"
                                    id="send-invite-button">Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        getProjectList: state.dashboards.projectsList,
        categoryDrop: state.dashboards.projectDropdowns.categoryInfo
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(dashboardActions, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);