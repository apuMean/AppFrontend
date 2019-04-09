import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeleteModal from '../../common/deleteModal.component.js';
import * as loader from '../../../constants/actionTypes.js';
import * as datatable from '../../../scripts/table-datatables-buttons.js';
import * as projectOptionAction from '../../../actions/projectOptionActions.js';
import "../../../styles/bootstrap-fileinput.css";
import autoBind from 'react-autobind';

class ProjectDailies extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            dailiesData: '',
            dailyReportId: '',
            deleteIndex: '',
            dailySendData: '',
            dailiesList: []
        };
    }
    componentWillMount() {

        var dailyData = {
            companyId: localStorage.companyId,
            projectId: this.props.params.projectId
        }
        this.props.actions.getDailiesList(dailyData);

        var data1 = {
            parent: 'Projects',
            childone: 'Dailies',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
    }

    componentDidMount() {
        $('div#dailiesList').block({
            message: loader.GET_LOADER_IMAGE,
            css: { width: '25%' },
            overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
        });

        setTimeout(function () {
            datatable
                .ProjectMoreOptions
                .init();
            $('div#dailiesList').unblock();
        }, 2000);
    }

    handleDelete(index, dailyReportId) {

        var dailyReportId = dailyReportId;
        this.setState({ dailyReportId: dailyReportId, deleteIndex: index })
        $('#daily_delete').modal('show');
    }

    deleteDailyHandler() {

        if (this.state.dailyReportId) {
            var dailyReportId = {
                dailyReportId: this.state.dailyReportId
            }
            $('#daily_delete').modal('hide');
            $('div#dailiesList').block({
                message: loader.GET_LOADER_IMAGE,
                css: { width: '25%' },
                overlayCSS: { backgroundColor: '#ffffff', opacity: 0.7 }
            });
            this.props.actions.deleteDaily(dailyReportId, this.state.deleteIndex, this.state.dailiesList);
        }
    }

    handleSendDaily(index, id) {

        let dailiesState = this.state.dailiesList;
        let dailyState = dailiesState[index];
        let data = {
            dailyReportId: dailyState._id,
            projectId: this.props.params.projectId,
            attentionName: dailyState.attention.firstname + ' ' + dailyState.attention.lastname,
            customerName: dailyState.customerId.companyName,
            LoggedInUser: localStorage.userName
        }
        this.setState({ dailySendData: data })
        $('#dailySend').modal('show');
    }


    sendDaily(data) {

        if (this.state.dailySendData) {
            $('#dailySend').modal('hide');
            this.props.actions.sendDailyReport(this.state.dailySendData);
        }
    }

    handleViewPdf(index, dailyPath) {

        var url = dailyPath
        var win = window.open(url, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.dailiesList) {
            var dailiesState = JSON.parse(JSON.stringify(nextProps.dailiesList));
            this.setState({
                dailiesList: dailiesState
            });
            var project_dailies = $('#project_dailies').DataTable();
            project_dailies.destroy();
            setTimeout(function () {
                datatable.ProjectMoreOptions.init();
            }, 3000);
            setTimeout(function () {
                $('div#dailiesList').unblock();
            }, 3200);
        }
    }
    render() {
        var dailiesList = this
            .state
            .dailiesList
            .map(function (daily, index) {

                return <tr key={index}>
                    <td>{daily.date}</td>
                    <td>{daily.preparedBy}</td>
                    <td>
                        <i className="icon-doc" onClick={this.handleViewPdf.bind(this, index, daily.dailyReportFilePath)}></i>&nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="icon-envelope" onClick={this.handleSendDaily.bind(this, index, daily._id)}></i>&nbsp;&nbsp;&nbsp;&nbsp;
                        <i className="icon-close" onClick={this.handleDelete.bind(this, index, daily._id)}></i>
                    </td>
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-users "></i>
                        <span
                            className="caption-subject bold uppercase"
                            style={{
                                "fontSize": "15px"
                            }}>Dailies</span>
                    </div>

                </div>
                <hr></hr>
                <div className="text-right" style={{ "marginBottom": "5px" }}>
                    <Link to={"/newDaily/" + this.props.params.projectId} className="btn btn-sm btn-circle green"><i className="icon-plus"></i>New Daily</Link>&nbsp;&nbsp;
                    <Link
                        to={"/project/" + this.props.params.projectId}
                        className="btn btn-sm btn-circle red">
                        Back
                    </Link>
                </div>
                <div className="portlet-body" id="dailiesList">
                    <div className="tab-content">
                        <div className="tab-pane active">
                            <form role="form">
                                <div className="form-body">
                                    <div className="portlet light portlet-fit portlet-datatable bordered">
                                        <div className="portlet-body">
                                            <div className="table-container table-responsive">
                                                <table
                                                    className="table table-striped table-bordered table-hover"
                                                    id="project_dailies">
                                                    <thead >
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Prepared By</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dailiesList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div id="dailySend" className="modal fade" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h4 className="modal-title">Daily</h4>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to send daily report to the customer ?
                        </div>
                            <div className="modal-footer">
                                <button type="button" data-dismiss="modal" className="btn dark btn-outline">No</button>
                                <button
                                    type="button"
                                    className="btn green"
                                    onClick={this.sendDaily}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
                <DeleteModal deleteModalId="daily_delete" deleteUserHandler={this.deleteDailyHandler} />
            </div>
        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return { dailiesList: state.projectOption.dailiesList };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(projectOptionAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDailies);