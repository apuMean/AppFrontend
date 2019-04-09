import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as createContactAction from '../../actions/createContactAction';
import Select from 'react-select';
import * as layout from '../../scripts/app';
import InputMask from 'react-input-mask';
import * as appValid from '../../scripts/app';
import DeleteModal from '../common/deleteModal.component.js';
import NotificationSystem from 'react-notification-system';
import '../../styles/bootstrap-fileinput.css';
import Modal from '../common/popup.component';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import * as validate from '../common/validator';
import * as functions from '../common/functions';
import { isValidImage } from '../shared/isValidImage';
import autoBind from 'react-autobind';
import * as message from '../../constants/messageConstants';

const phoneIndex = '';
const mailIndex = '';
const addressIndex = '';
const phoneCheck = false;
const mailCheck = false;
const addressCheck = false;
class CompanyAdd extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			companyStateValue: '',
			parentCompanyValue: '',
			parentCompanyOptions: [],
			phoneDetails: [],
			mailDetails: [],
			addressdetails: [],
			addType: 'Add',
			Date: '',
			isPrimary: true,
			deleteIndex: '',
			recordType: '',
			currentRecordState: '',
			_notificationSystem: null,
			undoFlag: false,
			phoneIndex: '',
			isImage: false,
			phone: '',
			query: '',
			parentCompanyNoResult: 'Search for Companies',
		};
	}
	componentWillReceiveProps(nextProps) {
		let company = [];
		let parentCompany = [];
		if (nextProps.companyList.length != 0) {
			let companyList = nextProps
				.companyList
				.map(function (list, index) {
					let obj = {
						id: list._id,
						label: list.companyName
					};
					company.push(obj);
				}.bind(this));
		}

		if (nextProps.parentCompanyList.length != 0) {
			let parentcompanyList = nextProps
				.parentCompanyList
				.map(function (parentlist, index) {
					let obj = {
						id: parentlist._id,
						label: parentlist.companyName
					};
					parentCompany.push(obj);
				}.bind(this));
		}else if(nextProps.parentCompanyList.length==0){
			this.setState({
				parentCompanyNoResult: 'No results found'
			});
		}

		this.setState({
			parentCompanyOptions: parentCompany
		});
	}
	componentDidMount() {
		this.state._notificationSystem = this.refs.notificationSystem;
		appValid
			.FormValidationMd
			.init();
	}
	componentWillMount() {
		let data1 = {
			parent: 'Companies',
			childone: 'Add',
			childtwo: ''
		};
		this.props.breadCrumb(data1);
		let data = {
			companyId: localStorage.companyId
		};
		this.props.actions.getContactDropdowns(data);

		this.handleParentSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getParentCompanyList(this.state.query);
			}
		}, 350);
	}
	handleParentCompanyChange(value) {
		if(value==''){
			this.setState({ parentCompanyValue: value,
				parentCompanyNoResult:'Search for Sales Rep' });
		}else{
			this.setState({ parentCompanyValue: value });

		}
	}
	onParentCompanyInputChange(value) {
		if (value.trim()) {
			let data = {
				companyId: localStorage.companyId
			};
			this.setState({ query: data });
			this.handleParentSearchDebounced();
		}
		else{
			this.setState({parentCompanyOptions:[]});
		}
	}
	checkAndAdd(data, type) {
		toastr.remove();
		if (type == 'phone') {
			let found = this.state.phoneDetails.some(function (el) {
				return el.phone === data.phone;
			});
			if (!found) {
				let phoneDetails = this.state.phoneDetails;
				if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
					phoneDetails.map(function (item, i) {
						if (phoneIndex === i) {
							item.isPrimary = true;
						} else {
							item.isPrimary = false;
						}
						return phoneDetails;
					});
				}

				if (phoneIndex === '') {
					phoneDetails
						.push(data);
					let updatedData = phoneDetails;
					this.setState({ phoneDetails: updatedData });

				} else {
					let currentState = phoneDetails;
					currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
					currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
					this.setState({ phoneDetails: currentState });
				}
				$('#phoneUpdate').modal('hide');
			}
			else {
				toastr.error(message.UNIQUE_PHONE);
			}
		}
		else if (type == 'mail') {
			let found = this.state.mailDetails.some(function (el) {
				return el.internetvalue === data.internetvalue;
			});
			if (!found) {

				let mailDetails = this.state.mailDetails;
				if (ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked) {
					mailDetails.map(function (item, i) {
						if (mailIndex === i) {
							item.isPrimary = true;
						} else {
							item.isPrimary = false;
						}
						return mailDetails;
					});
				}

				if (mailIndex === '') {
					mailDetails
						.push(data);
					let updatedData = mailDetails;
					this.setState({ mailDetails: updatedData });

				} else {
					let currentState = mailDetails;
					currentState[mailIndex].internetType = ReactDOM.findDOMNode(this.refs.mailtype).value;
					currentState[mailIndex].internetvalue = ReactDOM.findDOMNode(this.refs.mail).value;
					this.setState({ mailDetails: currentState });
				}
				$('#emailUpdate').modal('hide');
			}
			else {
				toastr.error(message.UNIQUE_EMAIL);
			}
		}
	}
	addUpdatePhone(isAdd, contact, index) {
		if (isAdd) {
			phoneIndex = '';
			phoneCheck = false;
			// this.refs.phone.setState({ value: "" })
			ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = false;
			this.setState({ phone: '' });
			$('#phoneUpdate').modal('show');
		} else {
			phoneIndex = index;
			phoneCheck = contact.isPrimary;
			ReactDOM.findDOMNode(this.refs.phonetype).value = contact.phonetype;
			// ReactDOM.findDOMNode(this.refs.phone).value = contact.phone;
			ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = contact.isPrimary;
			this.setState({ phone: contact.phone });
			setTimeout(function () {
				layout
					.FloatLabel
					.init();
			}, 400);
			$('#phoneUpdate').modal('show');
		}
	}
	addPhone() {
		toastr.remove();
		let phoneVal = ReactDOM.findDOMNode(this.refs.phone).value;
		let phone = phoneVal ? validate.removeSpecialCharSpace(this.refs.phone.value) : '';
		let self = this;

		if (phone.length >= 11 && phone.includes('x')) {
			let currentPhone = phone.substring(0, phone.indexOf('x'));
			if (currentPhone.length < 10) {
				toastr.error(message.VALID_PHONE);
			} else {
				let data = {
					phonetype: this.refs.phonetype
						.value
						.trim(),
					phone: this.refs.phone.value.trim(),
					isPrimary: self.state.phoneDetails.length === 0 ? true : this.refs.phone_CheckVal.checked
				};

				if (phoneIndex !== '') {
					let phoneDetails = JSON.parse(JSON.stringify(self.state.phoneDetails));
					let phoneArr = [];
					phoneDetails.map(function (x, index) {
						if (index != phoneIndex) {
							phoneArr.push(x);
						}
					});

					let found = phoneArr.some(function (el) {
						return el.phone === phoneVal;
					});

					if (!found) {
						if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
							self.state.phoneDetails.map(function (item, i) {
								if (phoneIndex === i) {
									item.isPrimary = true;
								} else {
									item.isPrimary = false;
								}
								return self.state.phoneDetails;
							});
						}

						let currentState = self.state.phoneDetails;
						currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
						currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
						self.setState({ phoneDetails: currentState });

						$('#phoneUpdate').modal('hide');

					} else {
						toastr.error(message.UNIQUE_PHONE);
					}

				} else {
					if (phone.length >= 11) {
						this.checkAndAdd(data, 'phone');
					}
					else {
						toastr.error(message.VALID_PHONE);
					}
				}
			}
		}
		else if (phone.length >= 11) {
			let data = {
				phonetype: this.refs.phonetype
					.value
					.trim(),
				phone: this.refs.phone.value.trim(),
				isPrimary: self.state.phoneDetails.length === 0 ? true : this.refs.phone_CheckVal.checked
			};

			if (phoneIndex !== '') {
				let phoneDetails = JSON.parse(JSON.stringify(self.state.phoneDetails));
				let phoneArr = [];
				phoneDetails.map(function (x, index) {
					if (index != phoneIndex) {
						phoneArr.push(x);
					}
				});

				let found = phoneArr.some(function (el) {
					return el.phone === phoneVal;
				});

				if (!found) {

					if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
						self.state.phoneDetails.map(function (item, i) {
							if (phoneIndex === i) {
								item.isPrimary = true;
							} else {
								item.isPrimary = false;
							}
							return self.state.phoneDetails;
						});
					}

					let currentState = self.state.phoneDetails;
					currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
					currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
					self.setState({ phoneDetails: currentState });

					$('#phoneUpdate').modal('hide');

				} else {
					toastr.error(message.UNIQUE_PHONE);
				}

			} else {

				if (phone.length >= 11) {
					this.checkAndAdd(data, 'phone');
				}
				else {
					toastr.error(message.VALID_PHONE);
				}
			}
		}
		else {
			toastr.error(message.VALID_PHONE);
		}
	}
	undoData(currentStateData, index) {
		if (this.state.recordType === 'phone') {
			let phoneState = this.state.phoneDetails;
			phoneState.splice(index, 0, currentStateData);
			this.setState({
				phoneDetails: phoneState,
				undoFlag: false
			});
			toastr.success(message.RECOVERED_SUCCESS);
		}
		else if (this.state.recordType === 'mail') {
			let mailState = this.state.mailDetails;
			mailState.splice(index, 0, currentStateData);
			this.setState({
				mailDetails: mailState,
				undoFlag: false
			});
			toastr.success(message.RECOVERED_SUCCESS);
		}
		else if (this.state.recordType === 'address') {
			let addressState = this.state.addressdetails;
			addressState.splice(index, 0, currentStateData);
			this.setState({
				addressdetails: addressState,
				undoFlag: false
			});
			toastr.success(message.RECOVERED_SUCCESS);
		}
	}
	removePhone(index) {
		let phoneData = this.state.phoneDetails[index];
		this.setState({ currentRecordState: phoneData });
		this.state.phoneDetails.splice(index, 1);
		this.setState({
			phoneDetails: this.state.phoneDetails,
			undoFlag: true
		});
		$('#contact_record_remove').modal('hide');
		this.state._notificationSystem.addNotification({
			title: 'Undo changes?',
			message: 'This record can\'t be recovered later!',
			level: 'info',
			position: 'tc',
			autoDismiss: 0,
			action: {
				label: 'Undo',
				callback: function () {
					this.undoData(this.state.currentRecordState, index);
				}.bind(this)
			},
			onRemove: function (notifications) {
				if (phoneData.isPrimary == true && this.state.phoneDetails.length !== 0 && this.state.undoFlag == true) {
					this.state.phoneDetails[0].isPrimary = true;
				}
				this.setState({ undoFlag: false });
			}.bind(this)
		});
	}
	addUpdateMail(isAdd, mail, index) {

		if (isAdd) {
			mailIndex = '';
			mailCheck = false;
			ReactDOM.findDOMNode(this.refs.mail).value = '';
			ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked = false;
		} else {
			mailIndex = index;
			mailCheck = mail.isPrimary;
			ReactDOM.findDOMNode(this.refs.phonetype).value = mail.internetType;
			ReactDOM.findDOMNode(this.refs.mail).value = mail.internetvalue;
			ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked = mail.isPrimary;
			setTimeout(function () {
				layout
					.FloatLabel
					.init();
			}, 400);
		}

		$('#emailUpdate').modal('show');
	}
	addMail() {
		toastr.remove();
		let mailVal = ReactDOM.findDOMNode(this.refs.mail).value;
		let self = this;
		if (validate.isEmail(ReactDOM.findDOMNode(this.refs.mail).value.trim())) {
			let data = {
				internetType: ReactDOM
					.findDOMNode(this.refs.mailtype)
					.value
					.trim(),
				internetvalue: ReactDOM
					.findDOMNode(this.refs.mail)
					.value
					.trim(),
				isPrimary: self.state.mailDetails.length === 0 ? true : this.refs.mail_CheckVal.checked
			};

			if (mailIndex !== '') {
				let mailDetails = JSON.parse(JSON.stringify(self.state.mailDetails));
				let mailArr = [];
				mailDetails.map(function (x, index) {
					if (index != mailIndex) {
						mailArr.push(x);
					}
				});

				let found = mailArr.some(function (el) {
					return el.internetvalue === mailVal;
				});

				if (!found) {

					if (ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked) {
						self.state.mailDetails.map(function (item, i) {
							if (mailIndex === i) {
								item.isPrimary = true;
							} else {
								item.isPrimary = false;
							}
							return self.state.mailDetails;
						});
					}

					let currentState = self.state.mailDetails;
					currentState[mailIndex].internetType = ReactDOM.findDOMNode(this.refs.mailtype).value;
					currentState[mailIndex].internetvalue = ReactDOM.findDOMNode(this.refs.mail).value;
					this.setState({ mailDetails: currentState });

					$('#emailUpdate').modal('hide');

				} else {
					toastr.error(message.UNIQUE_PHONE);
				}

			} else {

				if (validate.isEmail(ReactDOM.findDOMNode(this.refs.mail).value.trim())) {
					this.checkAndAdd(data, 'mail');
				} else {
					toastr.error(message.VALID_EMAIL);
				}
			}
		} else {
			toastr.error(message.VALID_EMAIL);
		}
	}
	removeMail(index) {
		let mailData = this.state.mailDetails[index];
		this.setState({ currentRecordState: mailData });
		this.state.mailDetails.splice(index, 1);
		this.setState({
			mailDetails: this.state.mailDetails,
			undoFlag: true
		});
		$('#contact_record_remove').modal('hide');

		this.state._notificationSystem.addNotification({
			title: 'Undo changes?',
			message: 'This record can\'t be recovered later!',
			level: 'info',
			position: 'tc',
			autoDismiss: 0,
			action: {
				label: 'Undo',
				callback: function () {
					this.undoData(this.state.currentRecordState, index);
				}.bind(this)
			},
			onRemove: function (notifications) {
				if (mailData.isPrimary == true && this.state.mailDetails.length !== 0 && this.state.undoFlag == true) {
					this.state.mailDetails[0].isPrimary = true;
				}
				this.setState({ undoFlag: false });
			}.bind(this)
		});
	}
	addUpdateAddress(isAdd, address, index) {

		if (isAdd) {
			addressIndex = '';
			addressCheck = false;
			ReactDOM.findDOMNode(this.refs.address_CheckVal).checked = false;
		} else {
			addressIndex = index;
			addressCheck = address.isPrimary;
			ReactDOM.findDOMNode(this.refs.addresstype).value = address.addressType;
			ReactDOM.findDOMNode(this.refs.address1).value = address.mapAddress1;
			ReactDOM.findDOMNode(this.refs.address2).value = address.mapAddress2;
			ReactDOM.findDOMNode(this.refs.addCity).value = address.city;
			ReactDOM.findDOMNode(this.refs.addState).value = address.state;
			ReactDOM.findDOMNode(this.refs.addZip).value = address.zip;
			ReactDOM.findDOMNode(this.refs.country).value = address.countryId == 2 ? '2' : '1';
			ReactDOM.findDOMNode(this.refs.address_CheckVal).checked = address.isPrimary;
			setTimeout(function () {
				layout
					.FloatLabel
					.init();
			}, 400);
		}

		$('#addressUpdate').modal('show');
	}
	addAddress() {
		if (jQuery('#validateAdd').valid()) {
			toastr.remove();

			let data = {
				addressType: ReactDOM
					.findDOMNode(this.refs.addresstype)
					.value
					.trim(),
				mapAddress1: ReactDOM
					.findDOMNode(this.refs.address1)
					.value
					.trim(),
				mapAddress2: ReactDOM
					.findDOMNode(this.refs.address2)
					.value
					.trim(),
				city: ReactDOM
					.findDOMNode(this.refs.addCity)
					.value
					.trim(),
				state: ReactDOM
					.findDOMNode(this.refs.addState)
					.value
					.trim(),
				zip: ReactDOM
					.findDOMNode(this.refs.addZip)
					.value
					.trim(),
				countryId: ReactDOM
					.findDOMNode(this.refs.country)
					.value
					.trim(),
				isPrimary: this.state.addressdetails.length == 0 ? true : this.refs.address_CheckVal.checked
			};

			let addressDetails = this.state.addressdetails;
			if (ReactDOM.findDOMNode(this.refs.address_CheckVal).checked) {
				addressDetails.map(function (item, i) {
					if (addressIndex === i) {
						item.isPrimary = true;
					} else {
						item.isPrimary = false;
					}
					return addressDetails;
				});
			}

			if (addressIndex === '') {
				addressDetails
					.push(data);
				let updatedData = addressDetails;
				this.setState({ addressdetails: updatedData });

			} else {

				let currentState = addressDetails;
				currentState[addressIndex].addressType = ReactDOM.findDOMNode(this.refs.addresstype).value;
				currentState[addressIndex].mapAddress1 = ReactDOM.findDOMNode(this.refs.address1).value;
				currentState[addressIndex].mapAddress2 = ReactDOM.findDOMNode(this.refs.address2).value;
				currentState[addressIndex].city = ReactDOM.findDOMNode(this.refs.addCity).value;
				currentState[addressIndex].state = ReactDOM.findDOMNode(this.refs.addState).value;
				currentState[addressIndex].zip = ReactDOM.findDOMNode(this.refs.addZip).value;
				currentState[addressIndex].countryId = ReactDOM.findDOMNode(this.refs.country).value;
				this.setState({ addressdetails: currentState });
			}

			ReactDOM
				.findDOMNode(this.refs.address1)
				.value = '';
			ReactDOM
				.findDOMNode(this.refs.address2)
				.value = '';
			ReactDOM
				.findDOMNode(this.refs.addCity)
				.value = '';
			ReactDOM
				.findDOMNode(this.refs.addState)
				.value = '';
			ReactDOM
				.findDOMNode(this.refs.addZip)
				.value = '';

			$('#addressUpdate').modal('hide');

		}
	}
	removeAddress(index) {
		let addressData = this.state.addressdetails[index];
		this.setState({ currentRecordState: addressData });
		this.state.addressdetails.splice(index, 1);
		this.setState({
			addressdetails: this.state.addressdetails,
			undoFlag: true
		});
		$('#contact_record_remove').modal('hide');
		this.state._notificationSystem.addNotification({
			title: 'Undo changes?',
			message: 'This record can\'t be recovered later!',
			level: 'info',
			position: 'tc',
			autoDismiss: 0,
			action: {
				label: 'Undo',
				callback: function () {
					this.undoData(this.state.currentRecordState, index);
				}.bind(this)
			},
			onRemove: function (notifications) {
				if (addressData.isPrimary == true && this.state.addressdetails.length !== 0 && this.state.undoFlag == true) {
					this.state.addressdetails[0].isPrimary = true;
				}
				this.setState({ undoFlag: false });
			}.bind(this)
		});
	}
	selectOtherType(type, e) {
		ReactDOM
			.findDOMNode(this.refs.add_value)
			.value = '';
		if (e.target.value == 'other') {
			e.target.selectedIndex = '0';
			this.setState({ addType: type });
			$('#select-addType').modal('show');
		}
	}
	handleAddOtherPopup(e) {
		if (jQuery('#addOtherStatusType').valid()) {
			toastr.remove();
			e.preventDefault();
			let name = ReactDOM
				.findDOMNode(this.refs.add_value)
				.value;
			let type = this.state.addType;
			if (name.trim()) {
				switch (type) {
				case 'Type':
					this.props.actions.addOtherType(name);
					break;
				case 'Status':
					this.props.actions.addOtherStatus(name.trim());
					break;
				case 'Source':
					this.props.actions.addOtherSource(name);
					break;
				case 'Department':
					this.props.actions.addOtherDepartment(name);
					break;
				case 'Industry':
					this.props.actions.addOtherIndustry(name);
					break;
				default:
					break;
				}
				$('#select-addType').modal('hide');
			}
		}

	}
	onCompanyChange(event) {
		this.setState({ companyStateValue: event.target.value.trim() });
	}
	handleDelete(type, index) {
		toastr.remove();
		if (this.state.undoFlag) {
			toastr.error(message.COMPLETE_UNDO_OPERATION);
		}
		else if (!this.state.undoFlag) {
			this.setState({ deleteIndex: index, recordType: type });
			$('#contact_record_remove').modal('show');
		}
	}
	removeRecordHandler() {
		if (this.state.recordType === 'phone') {
			this.removePhone(this.state.deleteIndex);
		}
		else if (this.state.recordType === 'mail') {
			this.removeMail(this.state.deleteIndex);
		}
		else if (this.state.recordType === 'address') {
			this.removeAddress(this.state.deleteIndex);
		}
	}
	primaryCheck(type, e) {

		let checked = e.target.checked;

		if (type == 'phone') {

			phoneCheck = checked;

		} else if (type == 'email') {

			checked;

		} else if (type == 'address') {

			checked;
		}

	}
	imageUpdateHandler(event) {

		let file = document.querySelector('input[type=file]').files[0];
		if (!isValidImage(file.name)) {
			console.log('');
		} else {
			let reader = new FileReader();
			reader.addEventListener('load', function () {
				let image = document.getElementById('uplodedImage');
				image.src = reader.result;
			}, false);

			if (file) {
				reader.readAsDataURL(file);
			}
			this.setState({ isImage: true });
		}
	}
	imageRemoveHandler() {
		let image = document.getElementById('uplodedImage');
		image.src = require('../../img/itemlogo.png');
		this.setState({ isImage: false });
		ReactDOM.findDOMNode(this.refs.contactFileUpload).value = '';
	}
	_onChange(e) {
		let stateChange = {};
		stateChange[e.target.name] = e.target.value;
		this.setState(stateChange);
	}
	saveContact() {
		let contactDetails = {
			userId: localStorage.userId,
			companyId: localStorage.companyId,
			parentContactId: this.state.parentCompanyValue ? this.state.parentCompanyValue.id : '',
			phone: this.state.phoneDetails,
			address: this.state.addressdetails,
			internet: this.state.mailDetails,
			companyName: this.state.companyStateValue,
			webAddress: ReactDOM
				.findDOMNode(this.refs.webaddress.refs.webAddress)
				.value,
			userType: 1,
			statusId: ReactDOM
				.findDOMNode(this.refs.status.refs.statusVal)
				.value,
			createdBy: localStorage.userName,
			modifiedBy: localStorage.userName
		};

		let picData = ReactDOM.findDOMNode(this.refs.contactFileUpload).files[0];
		if (jQuery('#createContact').valid()) {
			functions.showLoader('create_contact');
			this.props.actions.createContact(contactDetails, picData, 1);
		}
	}

	render() {
		let contacttype = this
			.props
			.createcontact
			.contactDropdowns
			.type
			.map(function (type, index) {
				return <option value={type._id} key={index} >{type.typeName}</option>;
			}.bind(this));

		let contactstatus = this.props.createcontact.contactDropdowns.status
			.map(function (status, index) {
				return <option value={status._id} key={index} >{status.statusName}</option>;
			}.bind(this));

		let contactsource = this
			.props
			.createcontact
			.contactDropdowns
			.source
			.map(function (source, index) {
				return <option value={source._id} key={index} >{source.sourceName}</option>;
			}.bind(this));

		let contactdepartment = this
			.props
			.createcontact
			.contactDropdowns
			.Department
			.map(function (Department, index) {
				return <option value={Department._id} key={index} >{Department.departmentName}</option>;
			}.bind(this));

		let contactindustry = this
			.props
			.createcontact
			.contactDropdowns
			.industry
			.map(function (industry, index) {
				return <option value={industry._id} key={index} >{industry.industryName}</option>;
			}.bind(this));

		let referredby = this
			.props
			.createcontact
			.contactDropdowns
			.contact
			.map(function (contact, index) {
				return <option value={contact._id} key={index} >{contact.name}</option>;
			}.bind(this));

		let primary = <i className="fa fa-star"></i>;

		let phoneData = this
			.state
			.phoneDetails
			.map(function (contact, index) {
				let phoneCount = validate.removeSpecialCharSpace(contact.phone);
				let phone = (phoneCount.length <= 11 && phoneCount.includes('x')) ? contact.phone.substring(0, contact.phone.indexOf('x')) : (contact.phone).replace(/_/g, '');
				return <tr key={index}>
					<td style={{ width: 15 }}>{contact.isPrimary ? primary : ''}</td>
					<td>{contact.phonetype}</td>
					<td>{(phone).replace(/_/g, '')}</td>
					<td className="text-right"><span className="btn btn-icon-only blue info" onClick={this.addUpdatePhone.bind(this, false, contact, index)}><i className="fa fa-pencil"></i></span><span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, 'phone', index)}><i className="fa fa-trash-o"></i></span></td>
				</tr>;
			}.bind(this));
		let mailData = this
			.state
			.mailDetails
			.map(function (mail, index) {
				return <tr key={index}>
					<td style={{ width: 15 }}>{mail.isPrimary ? primary : ''}</td>
					<td>{mail.internetType}</td>
					<td>{mail.internetvalue}</td>
					<td className="text-right"><span className="btn btn-icon-only blue info" onClick={this.addUpdateMail.bind(this, false, mail, index)}><i className="fa fa-pencil"></i></span><span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, 'mail', index)}><i className="fa fa-trash-o" ></i></span></td>
				</tr>;
			}.bind(this));
		let addressData = this
			.state
			.addressdetails
			.map(function (address, index) {
				let country = '';
				if (address.countryId == 2) {
					country = 'India';
				}
				else if (address.countryId == 1) {
					country = 'US';
				}
				return <tr key={index}>
					<td style={{ width: 15 }}>{address.isPrimary ? primary : ''}</td>
					<td>{address.addressType}</td>
					<td>{address.mapAddress1}</td>
					<td>{address.mapAddress2}</td>
					<td>{address.city}</td>
					<td>{address.state}</td>
					<td>{address.zip}</td>
					<td>{country}</td>
					<td className="text-right"><span className="btn btn-icon-only blue info" onClick={this.addUpdateAddress.bind(this, false, address, index)}><i className="fa fa-pencil"></i></span><span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, 'address', index)}><i className="fa fa-trash-o" ></i></span></td>
				</tr>;
			}.bind(this));
		return (
			<div>
				<div className="portlet-title tabbable-line">
					<NotificationSystem ref="notificationSystem" />
					<ul className="nav nav-tabs">
						<li className="active">
							<a href="#contact-add" data-toggle="tab">
                                Company
							</a>
						</li>
						<div className="form-actions noborder text-right">
							<Link to="/company" className="btn red">
                                Cancel
							</Link>&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.saveContact}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="create_contact">
					<div className="portlet-body">
						<div className="tab-content">
							<div className="tab-pane active" id="contact-add">
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject bold uppercase">General Details</span>
									</div>
								</div>
								<form role="form" id="createContact">
									<div className="form-body">
										<div className="row">
											<div className="col-lg-2 col-md-2 col-sm-4 col-xs-4">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="fileinput fileinput-exists" data-provides="fileinput">
														<div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: 142, width: 142 }}>
															<img
																src={require('../../img/itemlogo.png')}
																className="img-responsive"
																ref="uplodedImage"
																id="uplodedImage"
																alt="Logo" />
														</div>
														<div>
															<span className="btn red btn-sm btn-outline btn-file" style={{ fontSize: '8px' }}>
																<span className="fileinput-new"> Select </span>
																<span className="fileinput-exists"> Change </span>
																<input type="file"
																	name="contactFileUpload"
																	ref="contactFileUpload"
																	id="contactFileUpload"
																	accept='image/*'
																	onChange={this.imageUpdateHandler} />
															</span>
															{this.state.isImage ? <a href="javascript:;"
																className="btn btn-sm red"
																style={{ fontSize: '8px' }} onClick={this.imageRemoveHandler}> Remove </a> : null}
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-10 col-md-10 col-sm-8 col-xs-12">
												<div className="row">
													<div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
														<SingleInput
															inputType="text"
															parentDivId="companyField"
															parentDivClass="form-group form-md-line-input form-md-floating-label"
															className="form-control"
															title="Company"
															name="comp_Name"
															ref="compName"
															htmlFor="comp_Name"
															defaultValue=""
															required={true}
															ref={'company'}
															handleOnChange={this.onCompanyChange}
														/>
													</div>
													<div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
														<div id="parent" className="form-group form-md-floating-label cstm-select">
															<label htmlFor="parent">Parent Company</label>
															<Select
																placeholder="Type to search"
																value={this.state.parentCompanyValue}
																name="parent"
																id="parent"
																ref="parent"
																noResultsText={this.state.parentCompanyNoResult}
																options={this.state.parentCompanyOptions}
																onChange={this.handleParentCompanyChange.bind(this)}
																onInputChange={this.onParentCompanyInputChange.bind(this)}
															/>
														</div>
													</div>
													<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12">
														<SingleSelect
															parentDivClass={'form-group form-md-line-input form-md-floating-label'}
															className='form-control edited'
															handleOnChange={this.selectOtherType.bind(this, 'Status')}
															title='Status'
															name='contactStatus'
															options={contactstatus}
															ref='statusVal'
															id='statusVal'
															htmlFor='statusVal'
															placeholder='Select'
															ref={'status'}
															required={true}
															defaultSelect={true}
															other={true}
														/>
													</div>
													<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
														<SingleInput
															inputType="text"
															parentDivClass="form-group form-md-line-input form-md-floating-label"
															className="form-control"
															title="Web Address"
															name="webAddress"
															ref="webAddress"
															htmlFor="webAddress"
															defaultValue=""
															ref={'webaddress'}
															required={false}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-lg-6 col-md-12">
												<div className="portlet blue-hoki box">
													<div className="portlet-title">
														<div className="caption">
															<i className="fa fa-phone"></i>Phone
														</div>
														<div className="actions">
															<a className="btn btn-default btn-sm" href="javascript:;" onClick={this.addUpdatePhone.bind(this, true, '', '')}><i className="fa fa-plus" ></i> Add</a>
														</div>
													</div>
													<div className="portlet-body" style={{ padding: 0 }}>
														<div className="table-responsive">
															<table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
																<thead>
																	<tr>
																		<th></th>
																		<th>Type</th>
																		<th>Number</th>
																		<th></th>
																	</tr>
																</thead>
																<tbody>
																	{phoneData}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-6 col-md-12">
												<div className="portlet green-meadow box">
													<div className="portlet-title">
														<div className="caption">
															<i className="fa fa-envelope"></i>Email
														</div>
														<div className="actions">
															<a className="btn btn-default btn-sm" href="javascript:;" onClick={this.addUpdateMail.bind(this, true, '', '')}><i className="fa fa-plus"></i> Add</a>
														</div>
													</div>
													<div className="portlet-body" style={{ padding: 0 }}>
														<div className="table-responsive">
															<table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
																<thead>
																	<tr>
																		<th></th>
																		<th>Type</th>
																		<th>Address</th>
																		<th></th>
																	</tr>
																</thead>
																<tbody>
																	{mailData}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-12 col-md-12">
												<div className="portlet red-sunglo box">
													<div className="portlet-title">
														<div className="caption">
															<i className="fa fa-building"></i>Address
														</div>
														<div className="actions">
															<a className="btn btn-default btn-sm" href="javascript:;" onClick={this.addUpdateAddress.bind(this, true, '', '')}><i className="fa fa-plus"></i> Add</a>
														</div>
													</div>
													<div className="portlet-body" style={{ padding: 0 }}>
														<div className="table-responsive">
															<table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
																<thead>
																	<tr>
																		<th></th>
																		<th>Type</th>
																		<th>Addr. 1</th>
																		<th>Addr. 2</th>
																		<th>City</th>
																		<th>State</th>
																		<th>Zip</th>
																		<th>Country</th>
																		<th></th>
																	</tr>
																</thead>
																<tbody>
																	{addressData}
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div id="select-addType" className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
					
					<form role="form" id="addOtherStatusType">
						<div className="modal-dialog modal-sm">
							<div className="modal-content">
								<div className="modal-header">
									<div className="actions">
										<h5 className="modal-title">Add {this.state.addType}</h5>
									</div>
								</div>
								<div className="modal-body">
									<input
										type="text"
										className="form-control"
										id="add_value"
										name="add_value"
										ref="add_value"
										defaultValue="" />
								</div>
								<div className="modal-footer">
									<button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
									<button
										type="button"
										className="btn green"
										id="send-invite-button"
										onClick={this.handleAddOtherPopup}>Done</button>
								</div>
							</div>
						</div>
					</form>
				</div>
				<DeleteModal deleteModalId="contact_record_remove" deleteUserHandler={this.removeRecordHandler} />
				<Modal modalId="phoneUpdate" header="Phone Update" addDone={this.addPhone}>
					<div className="row">
						<div className="col-md-2">
							<div className="form-group form-md-line-input form-md-floating-label">
								<label className="rememberme mt-checkbox mt-checkbox-outline">
									<input type="checkbox" ref="phone_CheckVal" onChange={this.primaryCheck.bind(this, 'phone')} defaultChecked="" />
									<span></span>
                                    Primary
								</label>
							</div>
						</div>
						<div className="col-md-5">
							<div className="form-group form-md-line-input form-md-floating-label">
								<select className="form-control edited" id="phonetype" ref="phonetype">
									<option value="Work">Work</option>
									<option value="Mobile">Mobile</option>
									<option value="Fax">Fax</option>
									<option value="Home">Home</option>
									<option value="Other">Other</option>
								</select>
							</div>
						</div>
						<div className="col-md-5">
							<div className="form-group form-md-line-input form-md-floating-label">
								<InputMask
									className="form-control"
									id="phone"
									ref="phone"
									value={this.state.phone}
									onChange={this._onChange}
									name="phone" mask="(999) 999-9999  x99999" />
								<label htmlFor="form_control_1">Phone<span className="required">*</span></label>
							</div>
						</div>
					</div>
				</Modal>
				<Modal modalId="emailUpdate" header="Email Detail" addDone={this.addMail}>
					<div className="row">
						<div className="col-md-2">
							<div className="form-group form-md-line-input form-md-floating-label">
								<label className="rememberme mt-checkbox mt-checkbox-outline">
									<input type="checkbox" ref="mail_CheckVal" onChange={this.primaryCheck.bind(this, 'mail')} defaultChecked="" />
									<span></span>
                                    Primary
								</label>
							</div>
						</div>
						<div className="col-md-5">
							<div className="form-group form-md-line-input form-md-floating-label">
								<select className="form-control edited" id="mailtype" ref="mailtype">
									<option value="Work">Work</option>
								</select>
							</div>
						</div>
						<div className="col-md-5">
							<div className="form-group form-md-line-input form-md-floating-label">
								<input
									type="text"
									className="form-control"
									id="mail"
									ref="mail"
									name="mail" />
								<label htmlFor="mail">Email<span className="required">*</span></label>
							</div>
						</div>
					</div>
				</Modal>
				<Modal modalId="addressUpdate" header="Address Detail" addDone={this.addAddress}>
					<form role="form" id="validateAdd">
						<div className="form-body">
							<div className="row">
								<div className="col-md-2">
									<div className="form-group form-md-line-input form-md-floating-label">
										<label className="rememberme mt-checkbox mt-checkbox-outline" style={{ marginBottom: '2px' }}>
											<input type="checkbox" ref="address_CheckVal" onChange={this.primaryCheck.bind(this, 'address')} defaultChecked="" />
											<span></span>
                                            Primary
										</label>
									</div>
								</div>
								<div className="col-md-5">
									<div className="form-group form-md-line-input form-md-floating-label">
										<select className="form-control edited" id="addresstype" ref="addresstype">
											<option value="Work">Work</option>
										</select>
									</div>
								</div>
								<div className="col-md-5">
									<div className="form-group form-md-line-input form-md-floating-label">
										<select className="form-control edited" id="country" ref="country">
											<option value="1">US</option>
											<option value="2">India</option>
										</select>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label contactAddrss">
										<input
											type="text"
											className="form-control"
											id="address1"
											maxLength="150"
											ref="address1"
											name="address1" />
										<label htmlFor="address1">Address 1<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group form-md-line-input form-md-floating-label contactAddrss">
										<input
											type="text"
											className="form-control"
											id="address2"
											maxLength="150"
											ref="address2"
											name="address2" />
										<label htmlFor="address2">Address 2</label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label contactAddrss">
										<input
											type="text"
											className="form-control"
											id="addCity"
											ref="addCity"
											name="addCity" />
										<label htmlFor="addCity">City<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label contactAddrss">
										<input
											type="text"
											className="form-control"
											id="addState"
											ref="addState"
											name="addState" />
										<label htmlFor="addState">State<span className="required">*</span></label>
									</div>
								</div>
								<div className="col-md-4">
									<div className="form-group form-md-line-input form-md-floating-label contactAddrss">
										<input
											type="text"
											className="form-control"
											id="addZip"
											ref="addZip"
											name="addZip" />
										<label htmlFor="addZip">Zip<span className="required">*</span></label>
									</div>
								</div>
							</div>
						</div>
					</form>
				</Modal>
			</div>

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		createcontact: state.createcontact,
		companyList: state.createcontact.companyList,
		parentCompanyList: state.createcontact.parentCompanyList
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(createContactAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyAdd);