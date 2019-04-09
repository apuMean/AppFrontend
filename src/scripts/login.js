let bg1 = require("../img/login/bg1.jpg");
let bg2 = require("../img/login/bg2.jpg");
let bg3 = require("../img/login/bg3.jpg");
export const Login = function () {
    var handleLogin = function () {

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {

            handleLogin();
            // $('.forget-form').hide();
            // init background slide images
            $('.login-bg').backstretch([
                bg1,
                bg2,
                bg3
            ], {
                    fade: 1000,
                    duration: 2000
                }
            );
        }

    };

}();

