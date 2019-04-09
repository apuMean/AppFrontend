import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as createContactAction from '../../actions/createContactAction';
import moment from 'moment';
import InputMask from 'react-input-mask';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import Select from 'react-select';
import jQuery from 'jquery';
import * as layout from '../../scripts/app';
import DeleteModal from '../common/deleteModal.component.js';
import NotificationSystem from 'react-notification-system';
import '../../styles/bootstrap-fileinput.css';
import Modal from '../common/popup.component';
import AddContactModal from '../common/newContactModal.component';
import * as validate from '../common/validator';
import * as appValid from '../../scripts/app';
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

class CompanyEdit extends React.Component {
	constructor(props, context) {
		super(props, context);
		autoBind(this);
		this.state = {
			companyValue: '',
			companyOptions: [],
			phoneDetails: [],
			mailDetails: [],
			addressdetails: [],
			addType: 'Add',
			deleteType: 'Add',
			contactData: '',
			isPrimary: true,
			activeTabName: 'tab1',
			phoneType: 'Work',
			mailType: 'Work',
			addressType: 'Work',
			deleteIndex: '',
			recordType: '',
			currentRecordState: '',
			_notificationSystem: null,
			undoFlag: false,
			associatedContacts: [],
			parentCompanyValue: '',
			parentCompanyOptions: [],
			phoneIndex: '',
			newContactData: '',
			associateStatusId: '',
			breadcrumb: true,
			imagePath: '',
			imageChange: false,
			query: ''
		};
	}

	componentWillMount() {
		let data = {
			companyId: localStorage.companyId
		};
		this.props.actions.getContactDropdowns(data);
		let contact = {
			contactId: this.props.params.companyId
		};
		let associateData = {
			companyId: localStorage.companyId,
			companyContactId: this.props.params.companyId,
			userType: 2
		};
		this.props.actions.getContact(contact);
		this.props.actions.getAssociatedContacts(associateData);
		this.handleParentSearchDebounced = _.debounce(function () {
			if (this.state.query) {
				this.props.actions.getParentCompanyList(this.state.query);
			}
		}, 350);
	}

	componentDidMount() {
		appValid.FormValidationMd.init();
		this.state._notificationSystem = this.refs.notificationSystem;
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);
		functions.showLoader('edit_contact');
		let fileData = ReactDOM.findDOMNode(this.refs.contactFileUpload);
	}

	componentWillReceiveProps(nextProps) {
		let contactPhone = [];
		let contactMail = [];
		let contactAddress = [];
		let parentCompany = [];
		setTimeout(function () {
			layout
				.FloatLabel
				.init();
		}, 400);

		if (nextProps.createcontact && !this.state.imageChange) {
			let contactState = JSON.parse(JSON.stringify(nextProps.createcontact));

			if (nextProps.createcontact.phoneInfo.length != 0) {
				let phoneState = contactState.phoneInfo
					.map(function (phone, index) {
						contactPhone.push(phone);
					}.bind(this));
			}

			if (nextProps.createcontact.internetInfo.length != 0) {
				let mailState = contactState.internetInfo
					.map(function (mail, index) {
						contactMail.push(mail);
					}.bind(this));
			}

			if (contactState.addressInfo.length != 0) {
				let addressState = contactState.addressInfo
					.map(function (address, index) {
						contactAddress.push(address);
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
			}

			if (this.state.newContactData) {
				let associateData = {
					companyId: localStorage.companyId,
					companyContactId: this.props.params.companyId,
					userType: 2
				};
				this.props.actions.getAssociatedContacts(associateData);
			}

			let parentCompanyValue = {
				id: contactState.parentContactId ? contactState.parentContactId : '',
				label: contactState.parentContactName ? contactState.parentContactName : ''
			};

			if (this.state.breadcrumb && contactState.companyName) {
				let data = {
					parent: <Link to='/company'>Companies</Link>,
					childone: contactState.companyName,
					childtwo: ''
				};
				this.props.breadCrumb(data);
				this.state.breadcrumb = false;
			}

			this.setState({
				contactData: contactState,
				phoneDetails: contactPhone,
				mailDetails: contactMail,
				addressdetails: contactAddress,
				associatedContacts: nextProps.contactsList,
				parentCompanyOptions: parentCompany,
				parentCompanyValue: contactState.parentContactId ? parentCompanyValue : '',
				associateStatusId: contactState.assosiateStatusIdInfo ? contactState.assosiateStatusIdInfo[0]._id : '',
				newContactData: '',
				imagePath: contactState.profileImage ? contactState.profileImage : ''
			});
			setTimeout(function () {
				layout.FormValidationMd.init();
			}, 3000);

			const el = ReactDOM.findDOMNode(this.refs.edit_contact);
			$(el).unblock();
		}

		if (nextProps.imagePath && this.state.imageChange) {
			this.setState({ imagePath: nextProps.imagePath });
		} else if (!nextProps.imagePath && this.state.imageChange) {
			this.setState({ imagePath: '' });
		}
		let company = [];
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
		this.setState({
			companyOptions: company
		});
	}

	addAssocitedContact() {
		$('#associtedCont').modal('show');
	}

	addUpdatePhone(isAdd, contact, index) {
		if (isAdd) {
			phoneIndex = '';
			phoneCheck = false;
			ReactDOM.findDOMNode(this.refs.phone).value = '';
			ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = false;
			$('#phoneUpdate').modal('show');
		} else {
			phoneIndex = index;
			phoneCheck = contact.isPrimary;
			ReactDOM.findDOMNode(this.refs.phonetype).value = contact.phonetype;
			ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = contact.isPrimary;
			this.refs.phone.setState({ value: contact.phone });
			setTimeout(function () {
				layout
					.FloatLabel
					.init();
			}, 400);
			$('#phoneUpdate').modal('show');
		}

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

	addUpdateAddress(isAdd, address, index) {

		if (isAdd) {
			addressIndex = '';
			addressCheck = false;
			ReactDOM.findDOMNode(this.refs.address1).value = '';
			ReactDOM.findDOMNode(this.refs.address2).value = '';
			ReactDOM.findDOMNode(this.refs.addCity).value = '';
			ReactDOM.findDOMNode(this.refs.addState).value = '';
			ReactDOM.findDOMNode(this.refs.addZip).value = '';
			ReactDOM.findDOMNode(this.refs.country).value = '1';
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

	handleContactDetails(index) {
		let currentData = this.state.associatedContacts[index];
		window.open('/contact/' + currentData._id, '_blank');
	}

	handleContactAdd() {
		toastr.remove();
		if (jQuery('#add_other_contact').valid()) {
			let phoneVal = ReactDOM.findDOMNode(this.refs.contactAssociated.refs.new_phone).value;
			let phoneLen = phoneVal ? validate.removeSpecialCharSpace(phoneVal) : '';

			if (phoneLen.length >= 11) {

				let phone = [];
				let mail = [];
				let phoneData = {
					phonetype: 'Work',
					phone: ReactDOM.findDOMNode(this.refs.contactAssociated.refs.new_phone).value.trim(),
					isPrimary: true
				};
				phone.push(phoneData);
				let emailData = {
					internetType: 'Work',
					internetvalue: ReactDOM.findDOMNode(this.refs.contactAssociated.refs.new_email).value.trim(),
					isPrimary: true
				};
				mail.push(emailData);
				let contactData = {
					userId: localStorage.userId,
					companyId: localStorage.companyId,
					phone: phone,
					internet: mail,
					address: [],
					isSalesRep: false,
					webAddress: '',
					companyName: ReactDOM
						.findDOMNode(this.refs.contactAssociated.refs.new_company)
						.value,
					title: '',
					companyContactId: this.props.params.companyId,
					firstname: ReactDOM.findDOMNode(this.refs.contactAssociated.refs.first_name).value.trim(),
					lastname: ReactDOM.findDOMNode(this.refs.contactAssociated.refs.last_name).value.trim(),
					userType: 2,
					nickName: '',
					statusId: this.state.associateStatusId,
					createdBy: localStorage.userName
				};

				this.setState({ newContactData: 'N' });

				let associateData = {
					companyId: localStorage.companyId,
					companyContactId: this.props.params.companyId,
					userType: 2
				};
				this.props.actions.addOtherContactAssociate(contactData, 2);
				this.props.actions.getAssociatedContacts(associateData);
				$('#associtedCont').modal('hide');
			} else {
				toastr.error(message.VALID_PHONE);
			}

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

	addMail(e) {
		toastr.remove();
		e.preventDefault();
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
					toastr.error(message.UNIQUE_EMAIL);
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

	addAddress(e) {
		if (jQuery('#validateAdd').valid()) {
			toastr.remove();
			e.preventDefault();

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
		if (e.target.value == 'other') {
			ReactDOM.findDOMNode(this.refs.add_value).value = '';
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
					this
						.props
						.actions
						.addOtherType(name);
					break;
				case 'Status':
					this
						.props
						.actions
						.addOtherStatus(name.trim());
					break;
				case 'Source':
					this
						.props
						.actions
						.addOtherSource(name);
					break;
				case 'Department':
					this
						.props
						.actions
						.addOtherDepartment(name);
					break;
				case 'Industry':
					this
						.props
						.actions
						.addOtherIndustry(name);
					break;
				case 'Keyword':
					this
						.props
						.actions
						.addOtherKeyword(name);
					break;
				default:
					break;
				}
				$('#select-addType').modal('hide');
			}
		}

	}

	handleParentCompanyChange(value) {
		// this.setState({ parentCompanyValue: value });
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
				companyId: localStorage.companyId,
				companyContactId: this.props.params.companyId
			};
			this.setState({ query: data });
			this.handleParentSearchDebounced();
		}
		else {
			this.setState({ parentCompanyOptions: [] });
		}
	}

	setTab(tabName) {
		if (tabName) {
			this.setState({ activeTabName: tabName });
		}
	}

	handleDelete(type, index) {
		toastr.remove();
		this.state._notificationSystem = this.refs.notificationSystem;
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

	imageUpdateHandler(event) {
		this.state.imageChange = true;
		let companyId;
		let fileData;
		if (event.target.value) {
			companyId = this.props.params.companyId;
			fileData = ReactDOM.findDOMNode(this.refs.contactFileUpload).files[0];
			if (!isValidImage(fileData.name)) {
				companyId = '';
			}
		}
		else {
			companyId = '';
		}
		if (companyId) {
			this.props.actions.updateCompanyPicture(fileData, companyId);
		}
	}

	imageRemoveHandler() {
		this.state.imageChange = true;
		if (this.state.imagePath) {
			let data = {
				contactId: this.props.params.companyId
			};
			this.props.actions.removeCompanyPicture(data);
		}
	}

	updateContact() {

		if (this.state.activeTabName === 'tab1') {
			let updatedContactData = {
				contactId: this.props.params.companyId,
				parentContactId: this.state.parentCompanyValue ? this.state.parentCompanyValue.id : '',
				userId: localStorage.userId,
				companyId: localStorage.companyId,
				phone: this.state.phoneDetails,
				address: this.state.addressdetails,
				internet: this.state.mailDetails,
				companyName: ReactDOM.findDOMNode(this.refs.company.refs.compName).value.trim(),
				contactCompanyId: this.state.contactData._id,
				webAddress: ReactDOM.findDOMNode(this.refs.webaddress.refs.webAddress).value.trim(),
				userType: 1,
				statusId: ReactDOM.findDOMNode(this.refs.status.refs.statusVal).value,
				modifiedBy: localStorage.userName
			};

			if (jQuery('#update_form').valid()) {
				functions.showLoader('edit_contact');
				this
					.props
					.actions
					.updateContact(updatedContactData, '', 1, this.props.params.companyId);
			}
		}
	}

	render() {
		let contactData = this.state.contactData;
		if (contactData) {
			var primary = <i className="fa fa-star"></i>;
			var phoneData = this.state.phoneDetails.map(function (contact, index) {
				let phoneCount = validate.removeSpecialCharSpace(contact.phone);
				let phone = (phoneCount.length <= 11 && phoneCount.includes('x')) ? contact.phone.substring(0, contact.phone.indexOf('x')) : (contact.phone).replace(/_/g, '');
				return <tr key={index}>
					<td style={{ width: 15 }}>{contact.isPrimary ? primary : ''}</td>
					<td>{contact.phonetype}</td>
					<td>{phone}</td>
					<td className="text-right">
						<span className="btn btn-icon-only blue info" onClick={this.addUpdatePhone.bind(this, false, contact, index)}>
							<i className="fa fa-pencil"></i>
						</span>
						<span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, 'phone', index)}>
							<i className="fa fa-trash-o"></i>
						</span>
					</td>
				</tr>;
			}.bind(this));
			var mailData = this.state.mailDetails
				.map(function (mail, index) {
					return <tr key={index}>
						<td style={{ width: 15 }} >{mail.isPrimary ? primary : ''}</td>
						<td>{mail.internetType}</td>
						<td>{mail.internetvalue}</td>
						<td className="text-right"><span className="btn btn-icon-only blue info" onClick={this.addUpdateMail.bind(this, false, mail, index)}><i className="fa fa-pencil"></i></span><span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, 'mail', index)}><i className="fa fa-trash-o" ></i></span></td>
					</tr>;
				}.bind(this));
			var addressData = this
				.state
				.addressdetails
				.map(function (address, index) {
					let country = '';
					if (address.countryId == 1) {
						country = 'US';
					}
					else if (address.countryId == 2) {
						country = 'India';
					}
					return <tr key={index}>
						<td style={{ width: 15 }} >{address.isPrimary ? primary : ''}</td>
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


			var contactstatus = this
				.props
				.dropdownsList
				.contactDropdowns
				.status
				.map(function (status, index) {
					return <option value={status._id} key={index}>{status.statusName}</option>;
				}.bind(this));

			var compVal = { label: contactData.companyName };
		}

		let contactsAssociated = this.state.associatedContacts
			.map(function (contact, index) {
				let phone = contact.phoneInfo.map(function (phonedata, index) {
					if (phonedata.isPrimary) {
						return phonedata.phone;
					}
				});
				let internet = contact.internetInfo.map(function (internetData, index) {
					if (internetData.isPrimary) {
						return internetData.internetvalue;
					}
				});
				return <tr key={index}>
					<td><a onClick={this.handleContactDetails.bind(this, index)}>{contact.firstname + ' ' + contact.lastname}</a></td>
					<td>{contact.title ? contact.title : '-'}</td>
					<td>{contact.phoneInfo.length ? phone : '-'}</td>
					<td>{contact.internetInfo.length ? internet : '-'}</td>
				</tr>;
			}.bind(this));


		return (
			<div>
				<div className="portlet-title tabbable-line ">
					<NotificationSystem ref="notificationSystem" />
					<ul className="nav nav-tabs ">
						<li className="active">
							<a href="#contact-add" data-toggle="tab" onClick={this.setTab.bind(this, 'tab1')}>
                                Company
							</a>
						</li>
						<li>
							<a href="#contact-moreinfo" data-toggle="tab" onClick={this.setTab.bind(this, 'tab2')}>
                                More Info
							</a>
						</li>
						<div className="form-actions noborder text-right">
							<Link to={'/company/' + this.props.params.companyId} className="btn red">
                                Cancel
							</Link>&nbsp;&nbsp;
							<button type="button" className="btn blue" onClick={this.updateContact}>Save</button>
						</div>
					</ul>
				</div>
				<div className="portlet light bordered" id="edit_contact" ref="edit_contact">
					<div className="portlet-body">

						<div className="tab-content">
							<div className="tab-pane active" id="contact-add">
								<div className="portlet-title">
									<div className="caption">
										<span className="caption-subject bold uppercase">General Details</span>
									</div>
								</div>
								<form role="form" id="update_form">
									<div className="form-body">
										<div className="row">
											<div className="col-lg-2 col-md-2 col-sm-4 col-xs-4">
												<div className="form-group form-md-line-input form-md-floating-label">
													<div className="fileinput fileinput-exists" data-provides="fileinput">
														<div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: 142, width: 142 }}>
															<img src={this.state.imagePath ? this.state.imagePath : require('../../img/itemlogo.png')} className="img-responsive" alt="Logo" style={{ width: 200, height: 150 }} />
														</div>
														<div>
															<span className="btn red btn-outline btn-file" style={{ fontSize: '8px' }}>
																<span className="fileinput-new">
                                                                    Select Logo
																</span>
																<span className="fileinput-exists">
                                                                    Change
																</span>
																<input
																	type="file"
																	name=""
																	ref="contactFileUpload"
																	id="contactFileUpload"
																	accept='image/*'
																	onChange={this.imageUpdateHandler} />
															</span>
															{this.state.imagePath ? <a
																href="javascript:;"
																className="btn red"
																onClick={this.imageRemoveHandler} style={{ fontSize: '8px' }}>
                                                                Remove
															</a> : null}
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
															name="compName"
															ref="compName"
															htmlFor="compName"
															defaultValue={contactData ? this.state.contactData.companyName : ''}
															key={contactData ? this.state.contactData.companyName : ''}
															required={true}
															ref={'company'}
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
																options={this.state.parentCompanyOptions}
																onChange={this.handleParentCompanyChange.bind(this)}
																onInputChange={this.onParentCompanyInputChange.bind(this)}
															/>
														</div>
													</div>
													<div className="col-lg-2 col-md-2 col-sm-6 col-xs-12">
														<SingleSelect
															parentDivClass={'form-group form-md-line-input form-md-floating-label'}
															defaultValue={this.props.dropdownsList.contactDropdowns.status.length != 0 ? contactData.contactStatusId : ''}
															key={this.props.dropdownsList.contactDropdowns.status.length != 0 ? contactData.contactStatusId : ''}
															className='form-control edited'
															handleOnChange={this.selectOtherType.bind(this, 'Status')}
															title='Status'
															name='contactStatus'
															options={contactstatus}
															ref='status'
															id='statusVal'
															htmlFor='statusVal'
															placeholder='Select'
															required={true}
															defaultSelect={true}
															other={true}
														/>
													</div>
													<div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
														<SingleInput
															inputType="text"
															parentDivId="webField"
															parentDivClass="form-group form-md-line-input form-md-floating-label"
															className="form-control"
															title="Web Address"
															name="webAddress"
															ref="webAddress"
															htmlFor="webAddress"
															defaultValue={contactData ? this.state.contactData.webAddress : ''}
															key={contactData ? this.state.contactData.webAddress : ''}
															required={false}
															ref={'webaddress'}
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
											<div className="col-lg-12 col-md-12">
												<div className="portlet grey-cascade box">
													<div className="portlet-title">
														<div className="caption">
															<i className="fa fa-address-book"></i>Contacts
														</div>
														<div className="actions">
															<a className="btn btn-default btn-sm" href="javascript:;" onClick={this.addAssocitedContact}><i className="fa fa-plus"></i> Add</a>
														</div>
													</div>
													<div className="portlet-body" style={{ padding: 0 }}>
														<div className="table-responsive">
															<table className="table table-hover table-bordered table-striped" style={{ marginBottom: 0 }}>
																<thead>
																	<tr>
																		<th>Name</th>
																		<th>Title</th>
																		<th>Phone</th>
																		<th>Email</th>
																	</tr>
																</thead>
																<tbody>
																	{contactsAssociated}
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
							<div className="tab-pane" id="contact-moreinfo">
								<div className="portlet-title tabbable-line">
									<div className="caption">
										<span className="caption-subject font-dark bold uppercase">Other Details</span>
									</div>
								</div>
								<div className="portlet-body">
									<div className="tab-content">
										<div className="tab-pane active" id="user-details">
											<div className="row">
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData ? contactData.createdBy : '-'}
														</div>
														<label htmlFor="form_control_1">Created By</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData ? moment(contactData.createdAt).format('LLL') : '-'}
														</div>
														<label htmlFor="form_control_1">On</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.modifiedBy ? contactData.modifiedBy : '-'}
														</div>
														<label htmlFor="form_control_1">Modified By</label>
													</div>
												</div>
												<div className="col-md-6 col-sm-6 col-xs-12">
													<div className="form-group form-md-line-input form-md-floating-label">
														<div className="form-control form-control-static">
															{contactData.modifiedBy ? moment(contactData.updatedAt).format('LLL') : '-'}
														</div>
														<label htmlFor="form_control_1">On</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

							</div>
							<div id="select-addType" className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
								<form role="form" id="addOtherStatusType">
									<div className="modal-dialog modal-sm" style={{ marginTop: '230px' }}>
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
														maxLength="150"
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
														maxLength="150"
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
														maxLength="5"
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
							<AddContactModal ref='contactAssociated' addContactModalId="associtedCont" companyValue={contactData ? compVal : ''} contactAddhandler={this.handleContactAdd} />
						</div>
					</div>
				</div>
			</div>

		);
	}
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {
	return {
		createcontact: state.createcontact.contactData,
		dropdownsList: state.createcontact,
		companyList: state.createcontact.companyList,
		contactsList: state.createcontact.associatedContacts,
		parentCompanyList: state.createcontact.parentCompanyList,
		newAssociated: state.createcontact.individualAssociated,
		imagePath: state.createcontact.imagePath
	};
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

	return {
		actions: bindActionCreators(createContactAction, dispatch)
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(CompanyEdit);