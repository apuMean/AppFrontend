import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loader from '../../constants/actionTypes.js';
import * as datatable from '../../scripts/table-datatables-buttons';
import * as createContactAction from '../../actions/createContactAction';
import Select from 'react-select';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import * as layout from '../../scripts/app';
import InputMask from 'react-input-mask';
import * as appValid from '../../scripts/app';
import DeleteModal from '../common/deleteModal.component.js';
import NotificationSystem from 'react-notification-system';
import Modal from '../common/popup.component';
import "../../styles/bootstrap-fileinput.css";
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

class ContactsAdd extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            companyStateValue: '',
            disabled: false,
            noResult: 'No contact found',
            companyValue: '',
            companyOptions: [],
            phoneDetails: [],
            mailDetails: [],
            addressdetails: [],
            addType: "Add",
            Date: '',
            isPrimary: true,
            imageState: false,
            deleteIndex: '',
            recordType: '',
            currentRecordState: '',
            _notificationSystem: null,
            undoFlag: false,
            isImage: false,
            phone: '',
            query: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        var company = [];
        if (nextProps.companyList.length != 0) {
            var companyList = nextProps
                .companyList
                .map(function (list, index) {
                    var obj = {
                        id: list._id,
                        label: list.companyName
                    }
                    company.push(obj)
                }.bind(this));
        }

        this.setState({
            companyOptions: company
        });
    }

    componentDidMount() {
        this.state._notificationSystem = this.refs.notificationSystem;
        appValid
            .FormValidationMd
            .init();
    }
    componentWillMount() {
        var data1 = {
            parent: 'Contacts',
            childone: 'Add',
            childtwo: ''
        };
        this.props.breadCrumb(data1);
        let data = {
            companyId: localStorage.companyId
        }
        this.props.actions.getContactDropdowns(data);
        this.handleCompanySearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.actions.getCompanyList(this.state.query);
            }
        }, 350);
    }

    addUpdatePhone(isAdd, contact, index) {
        if (isAdd) {
            phoneIndex = '';
            phoneCheck = false;
            // ReactDOM.findDOMNode(this.refs.phone).value = "";
            ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = false;
            this.setState({ phone: "" })
            $('#phoneUpdate').modal('show');
        } else {
            phoneIndex = index;
            phoneCheck = contact.isPrimary;
            ReactDOM.findDOMNode(this.refs.phonetype).value = contact.phonetype;
            // ReactDOM.findDOMNode(this.refs.phone).value = contact.phone;
            ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = contact.isPrimary;
            this.setState({ phone: contact.phone })
            setTimeout(function () {
                layout.FloatLabel.init();
            }, 300);
            $('#phoneUpdate').modal('show');
        }
    }

    addUpdateMail(isAdd, mail, index) {
        if (isAdd) {
            mailIndex = '';
            mailCheck = false;
            ReactDOM.findDOMNode(this.refs.mail).value = "";
            ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked = false;
        } else {
            mailIndex = index;
            mailCheck = mail.isPrimary;
            ReactDOM.findDOMNode(this.refs.phonetype).value = mail.internetType;
            ReactDOM.findDOMNode(this.refs.mail).value = mail.internetvalue;
            ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked = mail.isPrimary;
            setTimeout(function () {
                layout.FloatLabel.init();
            }, 300);
        }
        $('#emailUpdate').modal('show');
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
            ReactDOM.findDOMNode(this.refs.country).value = address.countryId == 2 ? "2" : '1';
            ReactDOM.findDOMNode(this.refs.address_CheckVal).checked = address.isPrimary;
            setTimeout(function () {
                layout.FloatLabel.init();
            }, 300);
        }
        $('#addressUpdate').modal('show');
    }

    handleCompanyChange(value) {
        if (value) {
            this.setState({
                companyValue: value,
                companyStateValue: value.label,
                companyOptions: []
            });
        }
        else {
            this.setState({
                companyValue: '',
                companyStateValue: '',
                companyOptions: []
            });
        }
    }

    onCompanyInputChange(value) {
        this.setState({ noResult: 'No record found' })
        if (value.trim()) {
            let data = {
                companyName: value,
                companyId: localStorage.companyId
            }
            this.setState({ query: data });
            this.handleCompanySearchDebounced();
        }
        else {
            this.setState({ companyOptions: [] })
        }
    }

    checkAndAdd(data, type) {
        toastr.remove();
        if (type == 'phone') {
            var found = this.state.phoneDetails.some(function (el) {
                return el.phone === data.phone;
            });
            if (!found) {

                let phoneDetails = this.state.phoneDetails;
                if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
                    phoneDetails.map(function (item, i) {
                        if (phoneIndex === i) {
                            item.isPrimary = true
                        } else {
                            item.isPrimary = false
                        }
                        return phoneDetails
                    });
                }

                if (phoneIndex === '') {
                    phoneDetails
                        .push(data);
                    var updatedData = phoneDetails;
                    this.setState({ phoneDetails: updatedData });

                } else {
                    let currentState = phoneDetails;
                    currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
                    currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
                    this.setState({ phoneDetails: currentState })
                }
                $('#phoneUpdate').modal('hide');
            }
            else {
                toastr.error(message.UNIQUE_PHONE);
            }
        }
        else if (type == 'mail') {
            var found = this.state.mailDetails.some(function (el) {
                return el.internetvalue === data.internetvalue;
            });
            if (!found) {

                let mailDetails = this.state.mailDetails;
                if (ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked) {
                    mailDetails.map(function (item, i) {
                        if (mailIndex === i) {
                            item.isPrimary = true
                        } else {
                            item.isPrimary = false
                        }
                        return mailDetails
                    });
                }

                if (mailIndex === '') {
                    mailDetails
                        .push(data);
                    var updatedData = mailDetails;
                    this.setState({ mailDetails: updatedData });

                } else {
                    let currentState = mailDetails;
                    currentState[mailIndex].internetType = ReactDOM.findDOMNode(this.refs.mailtype).value;
                    currentState[mailIndex].internetvalue = ReactDOM.findDOMNode(this.refs.mail).value;
                    this.setState({ mailDetails: currentState })
                }
                $('#emailUpdate').modal('hide');
            }
            else {
                toastr.error(message.UNIQUE_EMAIL);
            }
        }
    }

    addPhone() {
        toastr.remove();
        var phoneVal = ReactDOM.findDOMNode(this.refs.phone).value;
        let phone = phoneVal ? validate.removeSpecialCharSpace(this.refs.phone.value) : '';
        let self = this;
        if (phone.length >= 11 && phone.includes("x")) {
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

                if (phoneIndex !== "") {
                    let phoneDetails = JSON.parse(JSON.stringify(self.state.phoneDetails));
                    let phoneArr = [];
                    phoneDetails.map(function (x, index) {
                        if (index != phoneIndex) {
                            phoneArr.push(x)
                        }
                    });

                    var found = phoneArr.some(function (el) {
                        return el.phone === phoneVal;
                    });

                    if (!found) {

                        if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
                            self.state.phoneDetails.map(function (item, i) {
                                if (phoneIndex === i) {
                                    item.isPrimary = true
                                } else {
                                    item.isPrimary = false
                                }
                                return self.state.phoneDetails
                            });
                        }

                        let currentState = self.state.phoneDetails;
                        currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
                        currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
                        self.setState({ phoneDetails: currentState })

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

            if (phoneIndex !== "") {
                let phoneDetails = JSON.parse(JSON.stringify(self.state.phoneDetails));
                let phoneArr = [];
                phoneDetails.map(function (x, index) {
                    if (index != phoneIndex) {
                        phoneArr.push(x)
                    }
                });

                var found = phoneArr.some(function (el) {
                    return el.phone === phoneVal;
                });

                if (!found) {

                    if (ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked) {
                        self.state.phoneDetails.map(function (item, i) {
                            if (phoneIndex === i) {
                                item.isPrimary = true
                            } else {
                                item.isPrimary = false
                            }
                            return self.state.phoneDetails
                        });
                    }

                    let currentState = self.state.phoneDetails;
                    currentState[phoneIndex].phonetype = ReactDOM.findDOMNode(this.refs.phonetype).value;
                    currentState[phoneIndex].phone = ReactDOM.findDOMNode(this.refs.phone).value;
                    self.setState({ phoneDetails: currentState })

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
        if (this.state.recordType === "phone") {
            var phoneState = this.state.phoneDetails;
            phoneState.splice(index, 0, currentStateData);
            this.setState({
                phoneDetails: phoneState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
        else if (this.state.recordType === "mail") {
            var mailState = this.state.mailDetails;
            mailState.splice(index, 0, currentStateData);
            this.setState({
                mailDetails: mailState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
        else if (this.state.recordType === "address") {
            var addressState = this.state.addressdetails;
            addressState.splice(index, 0, currentStateData);
            this.setState({
                addressdetails: addressState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
    }

    removePhone(index) {
        var phoneData = this.state.phoneDetails[index];
        this.setState({ currentRecordState: phoneData })
        this.state.phoneDetails.splice(index, 1);
        this.setState({
            phoneDetails: this.state.phoneDetails,
            undoFlag: true
        });
        $('#contact_record_remove').modal('hide');
        this.state._notificationSystem.addNotification({
            title: 'Undo changes?',
            message: "This record can't be recovered later!",
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
                    this.state.phoneDetails[0].isPrimary = true
                }
                this.setState({ undoFlag: false })
            }.bind(this)
        });
    }
    addMail() {
        toastr.remove();
        var mailVal = ReactDOM.findDOMNode(this.refs.mail).value;
        let self = this;
        if (validate.isEmail(ReactDOM.findDOMNode(this.refs.mail).value.trim())) {
            var data = {
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

            if (mailIndex !== "") {
                let mailDetails = JSON.parse(JSON.stringify(self.state.mailDetails));
                let mailArr = [];
                mailDetails.map(function (x, index) {
                    if (index != mailIndex) {
                        mailArr.push(x)
                    }
                });

                var found = mailArr.some(function (el) {
                    return el.internetvalue === mailVal;
                });

                if (!found) {

                    if (ReactDOM.findDOMNode(this.refs.mail_CheckVal).checked) {
                        self.state.mailDetails.map(function (item, i) {
                            if (mailIndex === i) {
                                item.isPrimary = true
                            } else {
                                item.isPrimary = false
                            }
                            return self.state.mailDetails
                        });
                    }

                    let currentState = self.state.mailDetails;
                    currentState[mailIndex].internetType = ReactDOM.findDOMNode(this.refs.mailtype).value;
                    currentState[mailIndex].internetvalue = ReactDOM.findDOMNode(this.refs.mail).value;
                    this.setState({ mailDetails: currentState })

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
        var mailData = this.state.mailDetails[index];
        this.setState({ currentRecordState: mailData })
        this.state.mailDetails.splice(index, 1);
        this.setState({
            mailDetails: this.state.mailDetails,
            undoFlag: true
        });
        $('#contact_record_remove').modal('hide');

        this.state._notificationSystem.addNotification({
            title: 'Undo changes?',
            message: "This record can't be recovered later!",
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
                    this.state.mailDetails[0].isPrimary = true
                }
                this.setState({ undoFlag: false })
            }.bind(this)
        });
    }
    addAddress() {
        if (jQuery('#validateAdd').valid()) {
            toastr.remove();

            var data = {
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
                        item.isPrimary = true
                    } else {
                        item.isPrimary = false
                    }
                    return addressDetails
                });
            }

            if (addressIndex === '') {
                addressDetails
                    .push(data);
                var updatedData = addressDetails;
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
                this.setState({ addressdetails: currentState })
            }

            ReactDOM
                .findDOMNode(this.refs.address1)
                .value = "";
            ReactDOM
                .findDOMNode(this.refs.address2)
                .value = "";
            ReactDOM
                .findDOMNode(this.refs.addCity)
                .value = "";
            ReactDOM
                .findDOMNode(this.refs.addState)
                .value = "";
            ReactDOM
                .findDOMNode(this.refs.addZip)
                .value = "";

            $('#addressUpdate').modal('hide');
        }
    }
    removeAddress(index) {
        var addressData = this.state.addressdetails[index];
        this.setState({ currentRecordState: addressData })
        this.state.addressdetails.splice(index, 1);
        this.setState({
            addressdetails: this.state.addressdetails,
            undoFlag: true
        });
        $('#contact_record_remove').modal('hide');
        this.state._notificationSystem.addNotification({
            title: 'Undo changes?',
            message: "This record can't be recovered later!",
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
                    this.state.addressdetails[0].isPrimary = true
                }
                this.setState({ undoFlag: false })
            }.bind(this)
        });
    }
    selectOtherType(type, e) {
        ReactDOM
            .findDOMNode(this.refs.add_value)
            .value = "";
        if (e.target.value == "other") {
            e.target.selectedIndex = "0";
            this.setState({ addType: type });
            $('#select-addType').modal('show');
        }
    }

    handleAddOtherPopup(e) {
        toastr.remove();
        e.preventDefault();
        var name = ReactDOM
            .findDOMNode(this.refs.add_value)
            .value;
        var type = this.state.addType;
        if (name.trim()) {
            switch (type) {
                case "Type":
                    this.props.actions.addOtherType(name);
                    break;
                case "Status":
                    this.props.actions.addOtherStatus(name.trim());
                    break;
                case "Source":
                    this.props.actions.addOtherSource(name);
                    break;
                case "Department":
                    this.props.actions.addOtherDepartment(name);
                    break;
                case "Industry":
                    this.props.actions.addOtherIndustry(name);
                    break;
                default:
                    break;
            }
            $('#select-addType').modal('hide');
        } else {
            toastr.error(message.REQUIRED_FIELD);
        }
    }

    handleDelete(type, index) {
        toastr.remove();
        if (this.state.undoFlag) {
            toastr.error(message.COMPLETE_UNDO_OPERATION);
        }
        else if (!this.state.undoFlag) {
            this.setState({ deleteIndex: index, recordType: type })
            $('#contact_record_remove').modal('show');
        }
    }

    removeRecordHandler() {
        if (this.state.recordType === "phone") {
            this.removePhone(this.state.deleteIndex);
        }
        else if (this.state.recordType === "mail") {
            this.removeMail(this.state.deleteIndex);
        }
        else if (this.state.recordType === "address") {
            this.removeAddress(this.state.deleteIndex);
        }
    }

    onSelectFocus(e) {
        this.setState({ noResult: 'Type to search' })
    }

    saveContact() {

        var contactDetails = {
            userId: localStorage.userId,
            companyId: localStorage.companyId,
            phone: this.state.phoneDetails,
            address: this.state.addressdetails,
            internet: this.state.mailDetails,
            companyName: this.state.companyStateValue,
            companyContactId: this.state.companyValue.id ? this.state.companyValue.id : "",
            isSalesRep: ReactDOM.findDOMNode(this.refs.isSalesRep).checked,
            webAddress: ReactDOM.findDOMNode(this.refs.webAddress.refs.webAddress).value,
            userType: 2,
            firstname: ReactDOM
                .findDOMNode(this.refs.firstname.refs.firstname)
                .value,
            lastname: ReactDOM
                .findDOMNode(this.refs.lastname.refs.lastname)
                .value,
            title: ReactDOM
                .findDOMNode(this.refs.usr_Title.refs.usr_Title)
                .value.trim(),
            nickName: ReactDOM
                .findDOMNode(this.refs.usrNickname.refs.usrNickname)
                .value,
            statusId: ReactDOM
                .findDOMNode(this.refs.status.refs.statusVal)
                .value,
            createdBy: localStorage.userName
        }
        var picData = ReactDOM.findDOMNode(this.refs.contactFileUpload).files[0];
        if (jQuery('#createContact').valid()) {
            if (this.state.phoneDetails.length == 0) {
                toastr.error(message.REQUIRED_PHONE);
            }
            else {
                functions.showLoader('create_contact');
                this.props.actions.createContact(contactDetails, picData, 2);
            }
        }

    }

    primaryCheck(type, e) {

        let checked = e.target.checked;

        if (type == "phone") {

            phoneCheck = checked;

        } else if (type == "email") {

            mailCheck: checked;

        } else if (type == "address") {

            addressCheck: checked;
        }

    }

    imageUpdateHandler(event) {

        var file = document.querySelector('input[type=file]').files[0];
        if (!isValidImage(file.name)) {
            console.log('');
        } else {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                let image = document.getElementById('uplodedImage');
                image.src = reader.result;
            }, false);

            if (file) {
                reader.readAsDataURL(file);
            }
            this.setState({ isImage: true })
        }
    }

    imageRemoveHandler() {
        let image = document.getElementById('uplodedImage');
        image.src = require('../../img/profile/avatar-default.png');
        this.setState({ isImage: false });
        ReactDOM.findDOMNode(this.refs.contactFileUpload).value = '';
    }

    _onChange(e) {
        var stateChange = {}
        stateChange[e.target.name] = e.target.value
        this.setState(stateChange)
    }

    render() {

        var contacttype = this
            .props
            .createcontact
            .contactDropdowns
            .type
            .map(function (type, index) {
                return <option value={type._id} key={index} >{type.typeName}</option>;
            }.bind(this));

        var contactstatus = this
            .props
            .createcontact
            .contactDropdowns
            .status
            .map(function (status, index) {
                return <option value={status._id} key={index} >{status.statusName}</option>;
            }.bind(this));

        var contactsource = this
            .props
            .createcontact
            .contactDropdowns
            .source
            .map(function (source, index) {
                return <option value={source._id} key={index} >{source.sourceName}</option>;
            }.bind(this));

        var contactdepartment = this
            .props
            .createcontact
            .contactDropdowns
            .Department
            .map(function (Department, index) {
                return <option value={Department._id} key={index} >{Department.departmentName}</option>;
            }.bind(this));

        var contactindustry = this
            .props
            .createcontact
            .contactDropdowns
            .industry
            .map(function (industry, index) {
                return <option value={industry._id} key={index} >{industry.industryName}</option>;
            }.bind(this));

        var referredby = this
            .props
            .createcontact
            .contactDropdowns
            .contact
            .map(function (contact, index) {
                return <option value={contact._id} key={index} >{contact.name}</option>;
            }.bind(this));

        var primary = <i className="fa fa-star"></i>;

        var phoneData = this
            .state
            .phoneDetails
            .map(function (contact, index) {
                let phoneCount = validate.removeSpecialCharSpace(contact.phone);
                let phone = (phoneCount.length <= 11 && phoneCount.includes("x")) ? contact.phone.substring(0, contact.phone.indexOf("x")) : (contact.phone).replace(/_/g, "");
                return <tr key={index}>
                    <td style={{ width: 15 }}>{contact.isPrimary ? primary : ''}</td>
                    <td>{contact.phonetype}</td>
                    <td>{phone}</td>
                    <td className="text-right">
                        <span className="btn btn-icon-only blue info" onClick={this.addUpdatePhone.bind(this, false, contact, index)}><i className="fa fa-pencil"></i></span>
                        <span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, "phone", index)}><i className="fa fa-trash-o"></i></span>
                    </td>
                </tr>;
            }.bind(this));
        var mailData = this
            .state
            .mailDetails
            .map(function (mail, index) {
                return <tr key={index}>
                    <td style={{ width: 15 }}>{mail.isPrimary ? primary : ''}</td>
                    <td>{mail.internetType}</td>
                    <td>{mail.internetvalue}</td>
                    <td className="text-right">
                        <span className="btn btn-icon-only blue info" onClick={this.addUpdateMail.bind(this, false, mail, index)}><i className="fa fa-pencil"></i></span>
                        <span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, "mail", index)}><i className="fa fa-trash-o" ></i></span>
                    </td>
                </tr>;
            }.bind(this));
        var addressData = this
            .state
            .addressdetails
            .map(function (address, index) {
                let country = ''
                if (address.countryId == 2) {
                    country = "India"
                }
                else if (address.countryId == 1) {
                    country = "US"
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
                    <td className="text-right">
                        <span className="btn btn-icon-only blue info" onClick={this.addUpdateAddress.bind(this, false, address, index)}><i className="fa fa-pencil"></i></span>
                        <span className="btn btn-icon-only red" onClick={this.handleDelete.bind(this, "address", index)}><i className="fa fa-trash-o" ></i></span>
                    </td>
                </tr>;
            }.bind(this));
        return (
            <div>
                <div className="portlet-title tabbable-line">
                    <NotificationSystem ref="notificationSystem" />
                    <ul className="nav nav-tabs">
                        <li className="active">
                            <a href="#contact-add" data-toggle="tab">
                                Contact
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to="/contact" className="btn red">
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
                                <form role="form" id="createContact">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                        <div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: 142, width: 142 }}>
                                                            <img
                                                                src={require('../../img/profile/avatar-default.png')}
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
                                                                    accept="image/*"
                                                                    onChange={this.imageUpdateHandler} />
                                                            </span>
                                                            {this.state.isImage ? <a href="javascript:;" className="btn btn-sm red"
                                                                style={{ fontSize: '8px' }} onClick={this.imageRemoveHandler}> Remove </a> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-10 col-md-10 col-sm-9 col-xs-10">
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <div id="companyField" className="form-group">
                                                            <label htmlFor="Company">Company<span className="required">*</span></label>
                                                            <Select
                                                                noResultsText={this.state.noResult}
                                                                onFocus={this.onSelectFocus}
                                                                disabled={this.state.disabled}
                                                                value={this.state.companyValue}
                                                                name="Company"
                                                                id="Company"
                                                                ref="Company"
                                                                options={this.state.companyOptions}
                                                                onChange={this.handleCompanyChange.bind(this)}
                                                                onInputChange={this.onCompanyInputChange.bind(this)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="First Name"
                                                            name="firstname"
                                                            ref="firstname"
                                                            htmlFor="firstname"
                                                            defaultValue=""
                                                            ref={'firstname'}
                                                            maxLength="100"
                                                            required={true}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Last Name"
                                                            name="lastname"
                                                            ref="lastname"
                                                            htmlFor="lastname"
                                                            defaultValue=""
                                                            ref={'lastname'}
                                                            maxLength="100"
                                                            required={true}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Nickname"
                                                            name="usrNickname"
                                                            ref="usrNickname"
                                                            htmlFor="usrNickname"
                                                            defaultValue=""
                                                            ref={'usrNickname'}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Title"
                                                            name="usr_Title"
                                                            ref="usr_Title"
                                                            htmlFor="usr_Title"
                                                            defaultValue=""
                                                            ref={'usr_Title'}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <SingleSelect
                                                            parentDivClass={'form-group form-md-line-input form-md-floating-label'}
                                                            className='form-control edited'
                                                            handleOnChange={this.selectOtherType.bind(this, "Status")}
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
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">

                                                        <SingleInput
                                                            inputType="text"
                                                            parentDivClass="form-group form-md-line-input form-md-floating-label"
                                                            className="form-control"
                                                            title="Web Address"
                                                            name="webAddress"
                                                            ref="webAddress"
                                                            htmlFor="webAddress"
                                                            defaultValue=""
                                                            ref={'webAddress'}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" style={{ marginTop: '33px' }}>
                                                        <label className="rememberme mt-checkbox mt-checkbox-outline">
                                                            <input type="checkbox" name="remember" ref="isSalesRep" />
                                                            Sales Rep
                                                        <span></span>
                                                        </label>
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
                                                            <a className="btn btn-default btn-sm"
                                                                href="javascript:;" onClick={this.addUpdatePhone.bind(this, true, '', '')}><i className="fa fa-plus" ></i> Add</a>
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
                                                            <a className="btn btn-default btn-sm"
                                                                href="javascript:;" onClick={this.addUpdateAddress.bind(this, true, '', '')}><i className="fa fa-plus"></i> Add</a>
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
                <div
                    id="select-addType"
                    className="modal fade bs-modal-sm"
                    tabIndex="-1"
                    aria-hidden="true">
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
                </div>
                <DeleteModal deleteModalId="contact_record_remove" deleteUserHandler={this.removeRecordHandler} />
                <Modal modalId="phoneUpdate" header="Phone Update" addDone={this.addPhone}>
                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group form-md-line-input form-md-floating-label">
                                <label className="rememberme mt-checkbox mt-checkbox-outline">
                                    <input type="checkbox" ref="phone_CheckVal" onChange={this.primaryCheck.bind(this, "phone")} defaultChecked="" />
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
                                    <input type="checkbox" ref="mail_CheckVal" onChange={this.primaryCheck.bind(this, "mail")} defaultChecked="" />
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
                                            <input type="checkbox" ref="address_CheckVal" onChange={this.primaryCheck.bind(this, "address")} defaultChecked="" />
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
                                            name="addCity"
                                             />
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
                                            name="addState"
                                             />
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
            </div>

        );
    }
}
//this tells what state should expose on props
function mapStateToProps(state, ownProps) {

    return {
        createcontact: state.createcontact,
        companyList: state.createcontact.companyList
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(createContactAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactsAdd);