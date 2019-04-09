import * as types from '../constants/actionTypes';
import * as api from '../../tools/apiConfig';
import jQuery from 'jquery';
import axios from 'axios';
import {
	browserHistory
} from 'react-router';

// get API's
export function getDropIndustries(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_INDUSTRY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_INDUSTRIES,
						industriesList: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getOpportunitySource(data) {
	return function (dispatch, getState) {
		axios.post(api.GET_OPPORTUNITY_SOURCE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_OPPORTUNITY_SOURCE,
						sourcesList: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function getEstimateStages(data) {
	//  
	return function (dispatch, getState) {
		axios.post(api.GET_ESTIMATE_STAGES, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				//  
				if (response.data.code == 200) {
					return dispatch({
						type: types.GET_ESTIMATE_STAGES,
						estimateStages: response.data.data
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

// add/update API's
export function addDropIndustries(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_INDUSTRY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_INDUSTRY_LIST, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_INDUSTRIES,
									industriesList: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateDropIndustries(data) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_INDUSTRY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_INDUSTRY_LIST, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_INDUSTRIES,
									industriesList: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addOpportunitySource(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_OPPORTUNITY_SOURCE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_OPPORTUNITY_SOURCE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {
							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_OPPORTUNITY_SOURCE,
									sourcesList: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateOpportunitySource(data) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_OPPORTUNITY_SOURCE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_OPPORTUNITY_SOURCE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {
							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_OPPORTUNITY_SOURCE,
									sourcesList: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addOrderType(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_ORDER_TYPE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_OTHER_ORDER_TYPE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {
							if (response.data.code == 200) {
								return dispatch({ type: types.GET_OTHER_ORDER_TYPE, orderTypesData: response.data.data });
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateOrderType(data) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_ORDER_TYPE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_OTHER_ORDER_TYPE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {
							if (response.data.code == 200) {
								return dispatch({ type: types.GET_OTHER_ORDER_TYPE, orderTypesData: response.data.data });
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addEstimateStage(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_APP_STAGE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_ESTIMATE_STAGES, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_ESTIMATE_STAGES,
									estimateStages: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateEstimateStage(data) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_APP_STAGE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_ESTIMATE_STAGES, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({
									type: types.GET_ESTIMATE_STAGES,
									estimateStages: response.data.data
								});
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function addLaborRate(data) {

	return function (dispatch, getState) {
		axios.post(api.ADD_LABOR_RATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_LABOR_RATE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({ type: types.GET_LABOR_RATE_FOR_ADMIN, laborRates: response.data.data });
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function updateLaborRate(data) {

	return function (dispatch, getState) {
		axios.post(api.UPDATE_LABOR_RATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					axios.post(api.GET_LABOR_RATE, data, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': localStorage.token
						}
					})
						.then(function (response) {

							if (response.data.code == 200) {
								return dispatch({ type: types.GET_LABOR_RATE_FOR_ADMIN, laborRates: response.data.data });
							} else if (response.data.code == 403) {
								localStorage.clear();
								browserHistory.push('/signin');
								toastr.error(response.data.message);
							}
						})
						.catch(function (error) {
							console.log(error);
						});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

// delete API's
export function deleteDropIndustries(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_INDUSTRY_LIST, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.DELETE_INDUSTRIES,
						deleteId: data.industryId
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteOpportunitySource(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_OPPORTUNITY_SOURCE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.DELETE_OPPORTUNITY_SOURCE,
						deleteId: data.sourceId
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteOrderType(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_ORDER_TYPE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.DELETE_ORDER_TYPE,
						deleteId: data.typeId
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteAppStage(data) {

	return function (dispatch, getState) {
		axios.post(api.DELETE_APP_STAGE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {

				if (response.data.code == 200) {
					return dispatch({
						type: types.DELETE_APP_STAGE,
						deleteId: data.stageId
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}

export function deleteLaborRate(data) {
	return function (dispatch, getState) {
		axios.post(api.DELETE_LABOR_RATE, data, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.token
			}
		})
			.then(function (response) {
				if (response.data.code == 200) {
					return dispatch({
						type: types.DELETE_LABOR_RATE,
						deleteId: data.laborId
					});
				} else if (response.data.code == 403) {
					localStorage.clear();
					browserHistory.push('/signin');
					toastr.error(response.data.message);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	};
}