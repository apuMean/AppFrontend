import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';
import * as loader from '../../constants/actionTypes.js';
import * as createContactAction from '../../actions/createContactAction';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import InputMask from 'react-input-mask';
import Select from 'react-select';
import jQuery from 'jquery';
import SingleInput from '../shared/SingleInput';
import SingleSelect from '../shared/SingleSelect';
import * as layout from '../../scripts/app';
import DeleteModal from '../common/deleteModal.component.js';
import NotificationSystem from 'react-notification-system';
import Modal from '../common/popup.component';
import "../../styles/bootstrap-fileinput.css";
import * as validate from '../common/validator';
import * as appValid from '../../scripts/app';
import * as functions from '../common/functions';
import { isValidImage } from '../shared/isValidImage';
import SignaturePad from 'react-signature-pad-wrapper';
import autoBind from 'react-autobind';
import * as message from '../../constants/messageConstants';

const phoneIndex = '';
const mailIndex = '';
const addressIndex = '';
const phoneCheck = false;
const mailCheck = false;
const addressCheck = false;

class ContactsEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        autoBind(this);
        this.state = {
            companyStateValue: '',
            companyValue: '',
            companyOptions: [],
            disabled: false,
            phoneDetails: [],
            mailDetails: [],
            addressdetails: [],
            addType: "Add",
            deleteType: "Add",
            keywordsdetails: [],
            contactData: '',
            keyword: [],
            keywords: [],
            statusId: '',
            typeId: '',
            sourceId: '',
            Date: '',
            DateDisplay: '',
            isPrimary: true,
            groupname: '',
            activeTabName: 'tab1',
            locale: {
                'format': 'MM-DD-YYYY'
            },
            editType: '',
            phoneType: 'Work',
            mailType: 'Work',
            addressType: 'Work',
            updatePhoneIndex: -1,
            updateMailIndex: -1,
            updateAddressIndex: -1,
            age: '',
            deleteIndex: '',
            recordType: '',
            currentRecordState: '',
            _notificationSystem: null,
            undoFlag: false,
            addOtherFlag: '',
            breadcrumb: true,
            imagePath: '',
            imageChange: false,
            salesImageChange: false,
            isSalesRep: false,
            query: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        let contactPhone = [];
        let contactMail = [];
        let contactAddress = [];
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
        if (nextProps.createcontact && !this.state.imageChange) {
            let contactState = JSON.parse(JSON.stringify(nextProps.createcontact));
            let birthday = JSON.parse(JSON.stringify(nextProps.createcontact.birthday));
            let age = nextProps.createcontact.age ? JSON.parse(JSON.stringify(nextProps.createcontact.age)) : '';
            let keywords = JSON.parse(JSON.stringify(nextProps.dropdownsList.contactDropdowns.keyword));
            let keyword = JSON.parse(JSON.stringify(nextProps.createcontact.contactkeywordInfo));

            let companyObj = {
                id: contactState.companyContactId,
                label: contactState.companyName
            };
            if (this.state.addOtherFlag === 'Status') {
                let lastIndex = nextProps.dropdownsList.contactDropdowns.status.length - 1;
                let statusId = nextProps.dropdownsList.contactDropdowns.status[lastIndex]._id;
                this.setState({ statusId: statusId })
            }
            else if (this.state.addOtherFlag === 'Type') {
                let lastIndex = nextProps.dropdownsList.contactDropdowns.type.length - 1;
                let typeId = nextProps.dropdownsList.contactDropdowns.type[lastIndex]._id;
                this.setState({ typeId: typeId })
            }
            else if (this.state.addOtherFlag === 'Source') {
                let lastIndex = nextProps.dropdownsList.contactDropdowns.source.length - 1;
                let sourceId = nextProps.dropdownsList.contactDropdowns.source[lastIndex]._id;
                this.setState({ sourceId: sourceId })
            }
            else {
                let statusId = contactState.statusInfo.length != 0 ? contactState.statusInfo[0]._id : '';
                let typeId = contactState.typeInfo.length != 0 ? contactState.typeInfo[0]._id : '';
                let sourceId = contactState.sourcesInfo.length != 0 ? contactState.sourcesInfo[0]._id : '';
                this.setState({
                    statusId: statusId,
                    typeId: typeId,
                    sourceId: sourceId
                })
            }
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

            let keywordsState = keywords.map(function (obj) {
                return {
                    value: obj._id,
                    label: obj.keywordName
                };
            });

            let keywordState = keyword.map(function (obj) {
                this
                    .state
                    .keywords
                    .push(obj._id);
                return {
                    value: obj.keywordId,
                    label: obj.keywordName
                };
            }.bind(this));

            if (this.state.breadcrumb && contactState.firstname) {
                let data = {
                    parent: <Link to='/contact'>Contacts</Link>,
                    childone: contactState.firstname + ' ' + contactState.lastname,
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
                Date: birthday,
                age: age,
                keywordsdetails: keywordsState,
                keyword: keywordState,
                companyValue: companyObj,
                imagePath: contactState.profileImage ? contactState.profileImage : '',
                salesImagePath: contactState.salesRepSign ? contactState.salesRepSign : '',
                isSalesRep: contactState.isSalesRep
            })
            setTimeout(function () {
                layout.FormValidationMd.init();
            }, 3000);

            const el = ReactDOM.findDOMNode(this.refs.edit_contact);
            $(el).unblock();
        }
        if (nextProps.imagePath && this.state.imageChange) {
            this.setState({ imagePath: nextProps.imagePath })
        } else if (!nextProps.imagePath && this.state.imageChange) {
            this.setState({ imagePath: '' })
        } else if (nextProps.salesImagePath && this.state.salesImageChange) {
            this.setState({ salesImagePath: nextProps.salesImagePath, salesImageChange: false })
        }
        let company = [];
        if (nextProps.companyList.length != 0) {
            let companyList = nextProps
                .companyList
                .map(function (list, index) {
                    let obj = {
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
    componentWillMount() {

        let data = {
            companyId: localStorage.companyId,
            referredBy: this.props.params.contactId
        }
        this.props.actions.getContactDropdowns(data);
        let contact = {
            contactId: this.props.params.contactId
        }
        this.props.actions.getContact(contact);
        const locale = locale;
        this.handleCompanySearchDebounced = _.debounce(function () {
            if (this.state.query) {
                this.props.actions.getCompanyList(this.state.query);
            }
        }, 350);
    }

    componentDidMount() {
        appValid.FormValidationMd.init()
        this.state._notificationSystem = this.refs.notificationSystem;
        setTimeout(function () {
            layout
                .FloatLabel
                .init();
        }, 400);
        functions.showLoader('edit_contact');
        let fileData = ReactDOM.findDOMNode(this.refs.contactFileUpload);
    }

    addUpdatePhone(isAdd, contact, index) {
        if (isAdd) {
            phoneIndex = '';
            phoneCheck = false;
            ReactDOM.findDOMNode(this.refs.phone).value = "";
            ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = false;
            $('#phoneUpdate').modal('show');
        } else {
            phoneIndex = index;
            phoneCheck = contact.isPrimary;
            ReactDOM.findDOMNode(this.refs.phonetype).value = contact.phonetype;
            ReactDOM.findDOMNode(this.refs.phone_CheckVal).checked = contact.isPrimary;
            this.refs.phone.setState({ value: contact.phone });
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

    deleteDepartment(index) {
        let currentState = this.props.dropdownsList.contactDropdowns.Department;
        let data = currentState[index];
        if (data._id) {
            this.props.actions.deleteDepartment(data._id, index)
        }
    }

    deleteIndustry(index) {
        let currentState = this.props.dropdownsList.contactDropdowns.Department;
        let data = currentState[index];
        if (data._id) {
            this.props.actions.deleteIndustry(data._id, index)
        }
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
                    let updatedData = phoneDetails;
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
            let found = this.state.mailDetails.some(function (el) {
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
                    let updatedData = mailDetails;
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

    clearBirthday(e) {
        e.preventDefault();
        if (this.state.contactData.birthday) {
            let currentState = this.state.contactData;
            currentState.birthday = '';
            this.setState({
                contactData: currentState,
                age: ''
            });
        }
    }

    addPhone() {
        toastr.remove();
        let phoneVal = ReactDOM.findDOMNode(this.refs.phone).value;
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

                    let found = phoneArr.some(function (el) {
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

                let found = phoneArr.some(function (el) {
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
            let phoneState = this.state.phoneDetails;
            phoneState.splice(index, 0, currentStateData);
            this.setState({
                phoneDetails: phoneState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
        else if (this.state.recordType === "mail") {
            let mailState = this.state.mailDetails;
            mailState.splice(index, 0, currentStateData);
            this.setState({
                mailDetails: mailState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
        else if (this.state.recordType === "address") {
            let addressState = this.state.addressdetails;
            addressState.splice(index, 0, currentStateData);
            this.setState({
                addressdetails: addressState,
                undoFlag: false
            })
            toastr.success(message.RECOVERED_SUCCESS)
        }
    }

    removePhone(index) {
        let phoneData = this.state.phoneDetails[index];
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

            if (mailIndex !== "") {
                let mailDetails = JSON.parse(JSON.stringify(self.state.mailDetails));
                let mailArr = [];
                mailDetails.map(function (x, index) {
                    if (index != mailIndex) {
                        mailArr.push(x)
                    }
                });

                let found = mailArr.some(function (el) {
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
        let mailData = this.state.mailDetails[index];
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

    addAddress(e) {
        if (jQuery('#validateAdd').valid()) {
            e.preventDefault();
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
        let addressData = this.state.addressdetails[index];
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
        if (type === 'Status') {
            let statusId = this.state.statusId;
            this.setState({ statusId: statusId })
        }
        else if (type === 'Type') {
            let typeId = this.state.typeId;
            this.setState({ typeId: typeId })
        }
        else if (type === 'Source') {
            let sourceId = this.state.sourceId;
            this.setState({ sourceId: sourceId })
        }
        if (e.target.value == "other") {
            ReactDOM.findDOMNode(this.refs.add_value).value = "";
            e.target.selectedIndex = "0";
            this.setState({ addType: type });
            $('#select-addType').modal('show');
        }
        else if (e.target.value == "delete") {
            e.target.selectedIndex = "0";
            this.setState({ deleteType: type });
            $('#delete-addType').modal('show');
        }
    }

    selectOtherKeyword(type, e) {
        e.preventDefault();

        if (type) {
            this.setState({ addType: type });
            $('#select-addType').modal('show');
        }
    }

    handleKeywordChange(value) {

        this.state.keywords = [];
        this.setState({ keyword: value });
        let stage = value.map(function (res, index) {
            this
                .state
                .keywords
                .push(res.value);
        }.bind(this));
    }

    handleAddOtherPopup(e) {
        toastr.remove();
        e.preventDefault();
        let name = ReactDOM
            .findDOMNode(this.refs.add_value)
            .value;
        let type = this.state.addType;
        if (name.trim()) {
            this.setState({ addOtherFlag: type })
            switch (type) {
                case "Type":
                    this
                        .props
                        .actions
                        .addOtherType(name);
                    break;
                case "Status":
                    this
                        .props
                        .actions
                        .addOtherStatus(name.trim());
                    break;
                case "Source":
                    this
                        .props
                        .actions
                        .addOtherSource(name);
                    break;
                case "Department":
                    this
                        .props
                        .actions
                        .addOtherDepartment(name);
                    break;
                case "Industry":
                    this
                        .props
                        .actions
                        .addOtherIndustry(name);
                    break;
                case "Keyword":
                    this
                        .props
                        .actions
                        .addOtherKeyword(name);
                    break;
                default:
                    break;
            }
            $('#select-addType').modal('hide');
        } else {
            toastr.error("Field can't be null.");
        }

    }

    handleEvent(event, picker, currentValue) {
        let start = picker
            .startDate
            .format();
        let displayDate = picker
            .startDate
            .format('MM-DD-YYYY');

        let age = moment(displayDate, "MM-DD-YYYY");
        let res = moment().diff(age, 'years');
        let contact = this.state.contactData;
        contact["birthday"] = displayDate;
        this.setState({
            Date: start,
            DateDisplay: displayDate,
            age: res,
            contactData: contact
        });
    }

    setTab(tabName) {
        if (tabName) {
            this.setState({ activeTabName: tabName });
        }
    }

    handleDelete(type, index) {
        toastr.remove();
        if (this.state.undoFlag) {
            toastr.error('Please complete the undo operation first!');
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

    updateContact() {
        toastr.remove();
        if (this.state.activeTabName === 'tab1') {

            let updatedContactData = {
                contactId: this.props.params.contactId,
                userId: localStorage.userId,
                companyId: localStorage.companyId,
                phone: this.state.phoneDetails,
                address: this.state.addressdetails,
                internet: this.state.mailDetails,
                companyName: this.state.companyValue ? this.state.companyValue.label : '',
                contactCompanyId: this.state.companyValue ? this.state.companyValue.id : '',
                isSalesRep: ReactDOM
                    .findDOMNode(this.refs.isSalesRep)
                    .checked,
                webAddress: ReactDOM
                    .findDOMNode(this.refs.webAddress.refs.webAddress)
                    .value,
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
                modifiedBy: localStorage.userName
            }

            if (!ReactDOM
                .findDOMNode(this.refs.isSalesRep)
                .checked) {
                updatedContactData.salesRepSign = "";
            }

            if (jQuery('#update_form').valid()) {
                if (this.state.phoneDetails.length == 0) {
                    toastr.error("Please fill the phone details.");
                }
                else {
                    functions.showLoader('edit_contact');
                    this
                        .props
                        .actions
                        .updateContact(updatedContactData, '', 2, this.props.params.contactId);
                }
            }
        }

        else if (this.state.activeTabName === 'tab2') {
            let contactMoreInfo = {
                contactId: this.props.params.contactId,
                departmentId: ReactDOM.findDOMNode(this.refs.departmentVal).value != "0" ? ReactDOM.findDOMNode(this.refs.departmentVal).value : "",
                industryId: ReactDOM
                    .findDOMNode(this.refs.industryVal).value != "0" ? ReactDOM
                        .findDOMNode(this.refs.industryVal).value : "",
                referredBy: ReactDOM
                    .findDOMNode(this.refs.referredBy)
                    .value != "0" ? ReactDOM
                        .findDOMNode(this.refs.referredBy)
                        .value : "",
                birthday: ReactDOM
                    .findDOMNode(this.refs.birthday)
                    .value,
                spouse: ReactDOM
                    .findDOMNode(this.refs.spouse)
                    .value,
                children: ReactDOM
                    .findDOMNode(this.refs.children)
                    .value,
                branch: ReactDOM
                    .findDOMNode(this.refs.branch)
                    .value,
                notes: ReactDOM
                    .findDOMNode(this.refs.notes)
                    .value,
                keyword: this.state.keywords,
                age: this.state.age ? parseInt(this.state.age) : 0,
                modifiedBy: localStorage.userName
            }
            if (this.props.params.contactId) {
                functions.showLoader('edit_contact');
                this
                    .props
                    .actions
                    .createContactMoreInfo(contactMoreInfo, 2);

            } else {
                toastr.error("Please create a contact first");
            }
        }
    }

    imageUpdateHandler(type, event) {
        let contactId;
        let fileData;
        if (type == 'CONTACT') {
            this.state.imageChange = true;
            if (event.target.value) {
                contactId = this.props.params.contactId;
                fileData = ReactDOM.findDOMNode(this.refs.contactFileUpload).files[0];
                if (!isValidImage(fileData.name)) {
                    contactId = '';
                }
            }
            else {
                contactId = '';
            }
            if (contactId) {
                this.props.actions.updateContactPicture(fileData, contactId);
            }
        }
        else if (type == 'SALESREP') {
            this.state.salesImageChange = true;
            if (event.target.value) {
                contactId = this.props.params.contactId;
                fileData = ReactDOM.findDOMNode(this.refs.salesFileUpload).files[0];
                if (!isValidImage(fileData.name)) {
                    contactId = '';
                }
            }
            else {
                contactId = '';
            }
            if (contactId) {
                this.props.actions.updateSalesSignature(fileData, contactId);
            }
        }
    }

    imageRemoveHandler() {
        this.state.imageChange = true;
        if (this.state.imagePath) {
            let data = {
                contactId: this.props.params.contactId
            }
            this.props.actions.removeCompanyPicture(data);
        }
    }

    handleSignature() {
        let signature = this.refs.signatureboard;
        let res = signature.isEmpty();
        let res2 = signature.toDataURL();
        let signBlob = {
            contactId: this.props.params.contactId,
            image: res2
        }

        if (!res) {
            this.state.salesImageChange = true;
            this.props.actions.updateSignature(signBlob);
            const el = ReactDOM.findDOMNode(this.refs.add_signature);
            $(el).modal('hide');
        }
        signature.clear();
    }

    clearSignature() {
        let signature = this.refs.signatureboard;
        signature.clear();
    }

    salesRepHandler(e) {
        let salesValue = e.target.checked;
        this.setState({ isSalesRep: salesValue });
    }

    render() {
        let contactData = this.state.contactData;
        if (contactData) {
            var departmentId = contactData.departmentInfo.length ? contactData.departmentInfo[0]._id : '';
            var industryId = contactData.industryInfo.length ? contactData.industryInfo[0]._id : ''
            var referredByContact = contactData.referredByInfo.length ? contactData.referredByInfo[0]._id : '';
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
            var contacttype = this
                .props
                .dropdownsList
                .contactDropdowns
                .type
                .map(function (type, index) {
                    return <option value={type._id} key={index}>{type.typeName}</option>;
                }.bind(this));

            var contactstatus = this
                .props
                .dropdownsList
                .contactDropdowns
                .status
                .map(function (status, index) {
                    return <option value={status._id} key={index}>{status.statusName}</option>;
                }.bind(this));

            var contactsource = this
                .props
                .dropdownsList
                .contactDropdowns
                .source
                .map(function (source, index) {
                    return <option value={source._id} key={index}>{source.sourceName}</option>;
                }.bind(this));

            var contactdepartment = this
                .props
                .dropdownsList
                .contactDropdowns
                .Department
                .map(function (Department, index) {
                    return <option value={Department._id} key={index}>{Department.departmentName}</option>;
                }.bind(this));

            var contactDepartmentTable = this
                .props
                .dropdownsList
                .contactDropdowns
                .Department
                .map(function (Department, index) {
                    return <tr key={index}>
                        <td>{Department.departmentName}</td>
                        <td><span className="btn btn-icon-only red" onClick={this.deleteDepartment.bind(this, index)}><i className="fa fa-times"></i></span></td>
                    </tr>;
                }.bind(this));

            var contactindustry = this
                .props
                .dropdownsList
                .contactDropdowns
                .industry
                .map(function (industry, index) {
                    return <option value={industry._id} key={index}>{industry.industryName}</option>;
                }.bind(this));

            var contactIndustryTable = this
                .props
                .dropdownsList
                .contactDropdowns
                .industry
                .map(function (industry, index) {
                    return <tr key={index}>
                        <td>{industry.industryName}</td>
                        <td><span className="btn btn-icon-only red" onClick={this.deleteIndustry.bind(this, index)}><i className="fa fa-times"></i></span></td>
                    </tr>;
                }.bind(this));

            var referredby = this
                .props
                .dropdownsList
                .contactDropdowns
                .contact
                .map(function (contact, index) {
                    return <option value={contact._id} key={index}>{contact.firstname + ' ' + contact.lastname}</option>;
                }.bind(this));
        }

        return (
            <div>
                <div className="portlet-title tabbable-line ">
                    <NotificationSystem ref="notificationSystem" />
                    <ul className="nav nav-tabs ">
                        <li className="active">
                            <a href="#contact-add" data-toggle="tab" onClick={this.setTab.bind(this, 'tab1')}>
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="#contact-moreinfo" data-toggle="tab" onClick={this.setTab.bind(this, 'tab2')}>
                                More Info
                            </a>
                        </li>
                        <div className="form-actions noborder text-right">
                            <Link to={"/contact/" + this.props.params.contactId} className="btn red">
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
                                <form role="form" id="update_form">
                                    <div className="form-body">
                                        <div className="row">
                                            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-6">
                                                <div className="form-group form-md-line-input form-md-floating-label">
                                                    <div className="fileinput fileinput-exists" data-provides="fileinput">
                                                        <div className="fileinput-preview thumbnail" data-trigger="fileinput" style={{ height: 142, width: 142 }}>
                                                            <img src={this.state.imagePath ? this.state.imagePath : require('../../img/profile/avatar-default.png')} />
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
                                                                    onChange={this.imageUpdateHandler.bind(this, 'CONTACT')} />
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
                                            <div className="col-lg-10 col-md-10 col-sm-9 col-xs-10">
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                        <div id="companyField" className="form-group">
                                                            <label htmlFor="Company">Company<span className="required">*</span></label>
                                                            <Select
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
                                                            className="form-control edited"
                                                            title="First Name"
                                                            name="firstname"
                                                            htmlFor="firstname"
                                                            defaultValue={contactData ? this.state.contactData.firstname : ''}
                                                            key={contactData ? this.state.contactData.firstname : ''}
                                                            ref={'firstname'}
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
                                                            htmlFor="lastname"
                                                            defaultValue={contactData ? this.state.contactData.lastname : ''}
                                                            key={contactData ? this.state.contactData.lastname : ''}
                                                            ref={'lastname'}
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
                                                            htmlFor="usrNickname"
                                                            defaultValue={contactData ? this.state.contactData.nickName : ''}
                                                            key={contactData ? this.state.contactData.nickName : ''}
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
                                                            htmlFor="usr_Title"
                                                            defaultValue={contactData ? this.state.contactData.title : ''}
                                                            key={contactData ? this.state.contactData.title : ''}
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
                                                            id='statusVal'
                                                            htmlFor='statusVal'
                                                            placeholder='Select'
                                                            ref={'status'}
                                                            defaultValue={this.props.dropdownsList.contactDropdowns.status.length != 0 ? this.state.statusId : ''}
                                                            key={this.props.dropdownsList.contactDropdowns.status.length != 0 ? this.state.statusId : ''}
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
                                                            htmlFor="webAddress"
                                                            defaultValue={this.state.contactData.webAddress ? this.state.contactData.webAddress : ''}
                                                            key={this.state.contactData.webAddress}
                                                            ref={'webAddress'}
                                                            required={false}
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" style={{ marginTop: '33px' }}>
                                                        <label className="rememberme mt-checkbox mt-checkbox-outline">
                                                            <input type="checkbox" name="remember" ref="isSalesRep"
                                                                key={contactData.isSalesRep}
                                                                defaultChecked={contactData.isSalesRep ? contactData.isSalesRep : false}
                                                                onChange={this.salesRepHandler.bind(this)} />
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
                                                        <select
                                                            className="form-control edited"
                                                            onChange={this
                                                                .selectOtherType
                                                                .bind(this, "Department")}
                                                            ref="departmentVal"
                                                            defaultValue={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .Department.length ? departmentId : ''}
                                                            key={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .Department.length ? departmentId : ''}
                                                            id="departmentVal">
                                                            <option value="0">Select</option>
                                                            {contactdepartment}
                                                            <option style={{ backgroundColor: "#F0F0F0", color: "#3D9DE0" }} value="other">Add Other</option>
                                                            <option style={{ backgroundColor: "#F0F0F0", color: "#E95C5C" }} value="delete">Delete</option>
                                                        </select>
                                                        <label htmlFor="departmentVal">Department</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData ? contactData.createdBy : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Created By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData ? moment(contactData.createdAt).format("LLL") : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">On</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select
                                                            className="form-control edited"
                                                            onChange={this
                                                                .selectOtherType
                                                                .bind(this, "Industry")}
                                                            ref="industryVal"
                                                            defaultValue={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .industry.length ? industryId : ''}
                                                            key={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .industry.length ? industryId : ''}
                                                            id="industryVal">
                                                            <option value="0">Select</option>
                                                            {contactindustry}
                                                            <option style={{ backgroundColor: "#F0F0F0", color: "#3D9DE0" }} value="other">Add Other</option>
                                                            <option style={{ backgroundColor: "#F0F0F0", color: "#E95C5C" }} value="delete">Delete</option>
                                                        </select>
                                                        <label htmlFor="industryVal">Industry</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.modifiedBy ? contactData.modifiedBy : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">Modified By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 col-sm-3 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {contactData.modifiedBy ? moment(contactData.updatedAt).format("LLL") : '-'}
                                                        </div>
                                                        <label htmlFor="form_control_1">On</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <select className="form-control edited"
                                                            ref="referredBy" id="referredBy"
                                                            defaultValue={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .contact.length ? referredByContact : ''}
                                                            key={this
                                                                .props
                                                                .dropdownsList
                                                                .contactDropdowns
                                                                .contact.length ? referredByContact : ''}>
                                                            <option value="0">Select</option>
                                                            {referredby}
                                                        </select>
                                                        <label htmlFor="referredBy">Reffered By</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="branch"
                                                            ref="branch"
                                                            defaultValue={contactData ? contactData.branch : ''}
                                                            key={contactData.branch} />
                                                        <label htmlFor="branch">Branch</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="row">
                                                        <div className="col-md-8 col-sm-10 col-xs-10">
                                                            <div className="form-group form-md-floating-label">
                                                                <label htmlFor="birthday">Birthday</label>
                                                                <DateRangePicker
                                                                    onApply={this.handleEvent}
                                                                    showDropdowns={true}
                                                                    singleDatePicker

                                                                    locale={this.state.locale}
                                                                    maxDate={moment()}
                                                                    startDate={contactData.birthday ? this.state.contactData.birthday : moment()}
                                                                >
                                                                    <div className="input-group date form_datetime">
                                                                        <input
                                                                            type="text"
                                                                            className="selected-date-range-btn"
                                                                            size="16"
                                                                            readOnly={true}
                                                                            className="form-control"
                                                                            value={this.state.contactData ? this.state.contactData.birthday : ''}
                                                                            id="birthday"
                                                                            ref="birthday"
                                                                            style={{ cursor: 'default' }} />
                                                                        <span className="input-group-btn">
                                                                            <button className="btn default date-set" type="button">
                                                                                <i className="fa fa-calendar"></i>
                                                                            </button>
                                                                        </span>
                                                                    </div>
                                                                </DateRangePicker>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2 col-sm-2 col-xs-2" style={{ marginTop: 25 }}>
                                                            <span className="input-group-btn" >
                                                                <button className="btn btn-icon-only red" onClick={this.clearBirthday}>
                                                                    <i className="fa fa-times"></i>
                                                                </button>
                                                            </span>
                                                        </div>     </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <div className="form-control form-control-static">
                                                            {this.state.age ? this.state.age + ' years' : '-'}
                                                        </div>
                                                        <label htmlFor="age">Age</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <TextareaAutosize style={{ resize: 'none' }} className="form-control" rows={1} ref="notes" defaultValue={contactData ? contactData.notes : ''} key={contactData.notes}></TextareaAutosize>
                                                        <label htmlFor="notes">Notes</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label">
                                                        <TextareaAutosize
                                                            style={{ resize: 'none' }}
                                                            type="email"
                                                            className="form-control"
                                                            rows={1}
                                                            id="spouse"
                                                            ref="spouse"
                                                            defaultValue={contactData ? contactData.spouse : ''}
                                                            key={contactData.spouse} />
                                                        <label htmlFor="spouse">Spouse</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label childrenInput">
                                                        <TextareaAutosize
                                                            style={{ resize: 'none' }}
                                                            type="text"
                                                            className="form-control"
                                                            id="children"
                                                            rows={1}
                                                            ref="children"
                                                            defaultValue={contactData ? contactData.children : ''}
                                                            key={contactData.children} />
                                                        <label htmlFor="children">Children</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-sm-6 col-xs-12">
                                                    <div className="form-group form-md-line-input form-md-floating-label childrenInput">
                                                        <div className="row">
                                                            <div className="col-md-10 col-sm-10 col-xs-10">
                                                                <Select
                                                                    multi
                                                                    disabled={this.state.disabled}
                                                                    value={this.state.keyword}
                                                                    placeholder="Select Keyword"
                                                                    options={this.state.keywordsdetails}
                                                                    onChange={this.handleKeywordChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-2 col-sm-2 col-xs-2" style={{ marginLeft: -13, marginTop: 10 }}>
                                                                <a value="other" onClick={this.selectOtherKeyword.bind(this, "Keyword")}><i className="fa fa-plus-circle fa-2x" aria-hidden="true"></i></a>
                                                            </div></div>
                                                    </div>
                                                </div>
                                                {this.state.isSalesRep ?
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        {contactData && contactData.salesRepSign && contactData.isSalesRep ? <div style={{ width: '100%' }}>
                                                            <label style={{ top: '0', fontSize: '13px', color: '#999' }} htmlFor="signature">Signature</label>
                                                            <div style={{ width: '300px', padding: '10px', border: '1px solid #D3D3D3', margin: '0' }}>
                                                                <img style={{ width: "350px", height: "50px" }}
                                                                    src={this.state.salesImagePath ? this.state.salesImagePath : ''}
                                                                    className="img-responsive center-block"
                                                                    alt="Signature" />
                                                            </div>
                                                        </div> : null}
                                                        <div className="form-group form-md-line-input form-md-floating-label childrenInput">
                                                            <a href="#add_signature" data-toggle="modal" data-backdrop="static" data-keyboard="false">
                                                                <button type="button" className="btn blue btn-outline">Draw Signature</button>
                                                            </a>&nbsp;&nbsp;&nbsp;
                                                            <input type="file" id="files" ref="salesFileUpload" className="hidden" onChange={this.imageUpdateHandler.bind(this, 'SALESREP')} />
                                                            <label htmlFor="files" className="btn red btn-outline">Upload Signature</label>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="select-addType" className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
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
                            </div>
                            <div id="delete-addType" className="modal fade bs-modal-sm" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog modal-sm">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="actions">
                                                <h5 className="modal-title">Delete {this.state.deleteType}</h5>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div className="table-container table-responsive">
                                                <table className="table table-striped table-bordered table-hover">
                                                    <thead >
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.deleteType == "Industry" ? contactIndustryTable : contactDepartmentTable}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" data-dismiss="modal" className="btn dark btn-outline">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="add_signature" ref="add_signature" className="modal fade" tabIndex="-1" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="caption">
                                                <span className="caption-subject bold uppercase">Please write your signature below</span>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            {contactData ? <SignaturePad
                                                className="wrapperPad"
                                                width={570} height={200}
                                                ref="signatureboard" /> : null}
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn dark btn-outline" onClick={this.clearSignature}>Clear</button>
                                            <button
                                                type="button"
                                                className="btn green"
                                                onClick={this.handleSignature}>Save</button>
                                            <button
                                                type="button"
                                                className="btn dark btn-outline" data-dismiss="modal" onClick={this.clearSignature}>Close</button>
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
                                                        maxLength="5"
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
        imagePath: state.createcontact.imagePath,
        salesImagePath: state.createcontact.salesImagePath
    };
}
// this tells what action should expose on props bindActionCreators is used to
// bind all actions at once
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(createContactAction, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ContactsEdit);