(function () {
    'use strict';

    module.exports = {
        isEmail: isEmail,
        isZipCode: isZipCode,
        removeSpecialCharSpace: removeSpecialCharSpace,
        numberWithCommas: numberWithCommas
    }

    /* @function : isEmail
     * @param    : Email
     * @created  : piyush
     * @modified : piyush dwivedi
     * @purpose  : To validate email and return status
     * @return   : Status : true, false
     * @public
     */
    function isEmail(email) {
        return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(email);
    }


    /* @function : isZipCode
     * @param    : zipcode
     * @created  : piyush
     * @modified : piyush
     * @purpose  : To validate zipcode
     * @return   : true, false
     * @public
     */
    function isZipCode(zipcode) {
        return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode);
    }

    /* @function : removeSpecialCharSpace
     * @param    : specialcharspace
     * @created  : piyush
     * @modified : piyush
     * @purpose  : To remove special char from string
     * @return   : str
     * @public
     */
    function removeSpecialCharSpace(str) {
        return str.replace(/[^A-Z0-9]/ig, "");
    }

    /* @function : numberWithCommas
     * @param    : commaseperatedNumber
     * @created  : piyush
     * @modified : piyush
     * @purpose  : To add commas in number string
     * @return   : str
     * @public
     */
    function numberWithCommas(n) {
        var parts = n.toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }

})();