import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            statsState: '',
            percentageState: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.statsData) {
            let data = nextProps.statsData;
            let stage = '';
            let value = '';
            let daysOpen = '';
            let probability = '';
            if (data.value) {
                if (data.value >= 1000000) {
                    value = 100;
                }
                else if (data.value < 1000000) {
                    value = ((data.value / 1000000) * 100).toFixed(2);
                }
            }
            if (data.daysOpen) {
                if (data.daysOpen >= 90) {
                    daysOpen = 100;
                }
                else if (data.daysOpen < 90) {
                    daysOpen = ((data.daysOpen / 90) * 100).toFixed(2);
                }
            }
            if (data.probability >= 0) {
                probability = data.probability;
            }
            if (data.stage >= 0) {
                stage = data.stage;
            }
            let currentState = {
                stage: stage,
                value: value,
                daysOpen: daysOpen ? daysOpen : 0,
                probability: probability
            }
            this.setState({
                statsState: nextProps.statsData,
                percentageState: currentState
            });
        }
    }
    render() {
        return (
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="dashboard-stat2 bordered">
                        <div className="display">
                            <div className="number">
                                <h3 className="font-red-haze">
                                    <span data-counter="counterup" data-value="1349">{this.state.statsState ? this.state.statsState.stage : '-'}</span>
                                    <small className="font-red-haze">%</small>
                                </h3>
                                <small>Stage</small>
                            </div>
                        </div>
                        <div className="progress-info">
                            <div className="progress">
                                <span style={{ width: this.state.percentageState ? this.state.percentageState.stage + '%' : '-' }} className="progress-bar progress-bar-success red-haze">
                                    <span className="sr-only">{this.state.percentageState ? this.state.percentageState.stage : '-'}% progress</span>
                                </span>
                            </div>
                            <div className="status">
                                <div className="status-title"> progress </div>
                                <div className="status-number"> {this.state.percentageState ? this.state.percentageState.stage : '-'}% </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="dashboard-stat2 bordered">
                        <div className="display">
                            <div className="number">
                                <h3 className="font-green-sharp">
                                    <span data-counter="counterup" data-value="7800">{this.state.statsState ? this.state.statsState.value : '-'}</span>
                                    <small className="font-green-sharp">$</small>
                                </h3>
                                <small>Value</small>
                            </div>
                        </div>
                        <div className="progress-info">
                            <div className="progress">
                                <span style={{ width: ' ' + this.state.percentageState ? this.state.percentageState.value + '%' : '-' + ' ' }} className="progress-bar progress-bar-success green-sharp">
                                    <span className="sr-only">{this.state.percentageState ? this.state.percentageState.value : '-'}% progress</span>
                                </span>
                            </div>
                            <div className="status">
                                <div className="status-title"> Value </div>
                                <div className="status-number"> {this.state.percentageState ? this.state.percentageState.value : '-'}% </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="dashboard-stat2 bordered">
                        <div className="display">
                            <div className="number">
                                <h3 className="font-blue-sharp">
                                    <span data-counter="counterup" data-value="567">{this.state.statsState ? this.state.statsState.probability : '-'}</span>
                                    <small className="font-blue-sharp">%</small>
                                </h3>
                                <small>Probability</small>
                            </div>
                            {/* <div className="icon">
                                <i className="icon-basket"></i>
                            </div> */}
                        </div>
                        <div className="progress-info">
                            <div className="progress">
                                <span style={{ width: this.state.percentageState ? this.state.percentageState.probability + '%' : '-' }} className="progress-bar progress-bar-success blue-sharp">
                                    <span className="sr-only">{this.state.percentageState ? this.state.percentageState.probability : '-'}% probability</span>
                                </span>
                            </div>
                            <div className="status">
                                <div className="status-title"> probability </div>
                                <div className="status-number"> {this.state.percentageState ? this.state.percentageState.probability : '-'}% </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="dashboard-stat2 bordered">
                        <div className="display">
                            <div className="number">
                                <h3 className="font-purple-soft">
                                    <span data-counter="counterup" data-value="276">{this.state.statsState ? this.state.statsState.daysOpen : '-'}</span>
                                </h3>
                                <small>Days Open</small>
                            </div>
                            {/* <div className="icon">
                                <i className="icon-user"></i>
                            </div> */}
                        </div>
                        <div className="progress-info">
                            <div className="progress">
                                <span style={{ width: this.state.percentageState ? this.state.percentageState.daysOpen + '%' : '-' }} className="progress-bar progress-bar-success purple-soft">
                                    <span className="sr-only">{this.state.percentageState ? this.state.percentageState.daysOpen : '-'}% change</span>
                                </span>
                            </div>
                            <div className="status">
                                <div className="status-title"> Days Open </div>
                                <div className="status-number"> {this.state.percentageState ? this.state.percentageState.daysOpen : '-'}% </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Stats;