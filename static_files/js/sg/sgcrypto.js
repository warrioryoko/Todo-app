/* vim: set filetype=javascript sw=4 ts=4 sts=4 : */

//UNUSED LEGACY CODE, KEPT FOR POSSIBLE FUTURE USE
//------------------------------------------------
/* Password hashing and crypto functions */
/* Depends on CryptJS and jQuery */
/* By Braddock Gaskill, Nov 2012 */
/* Copyright (C) 2012 SameGrain Inc */

/* Using these hashing functions, a password is hashed
 * before it ever leaves the user's browser.  Thus the site
 * does not know the user's password without a brute force
 * attack. */
var sgcrypto = (function () {

    'use strict';

    var randomSalt = function () {
        var salt = CryptoJS.lib.WordArray.random(64 / 8);
        salt = salt.toString(CryptoJS.enc.Hex);
        return salt;
    };

    var hashWithSalt = function (password, salt) {
        if (salt === null) {
            salt = randomSalt();
        }
        var myhash = CryptoJS.SHA1(salt + password);
        myhash = salt + myhash.toString(CryptoJS.enc.Hex);
        return myhash;
    };

/* Generates a SHA-1 hash of the password string with a random 64-bit salt.
     * Returns a hex string, with the salt as the first 16 characters */
    var hash = function (password) {
        var salt = randomSalt();
        return hashWithSalt(password, salt);
    };

    var hashAndSubmitForm = function (form, salt) {
        jQuery(form).find("input[type=password]").each(function () {
            var password = jQuery(this).val();
            jQuery(this).val(hashWithSalt(password, salt));
        });
        form.submit();
    };

/* A submission handler which will hash any password field in the given form
     * with attribute type="password", and then call submit on the form */
    var hashSubmitHandler = function (form) {
        var userInput = jQuery(form).find("input[name=email]").first();
        if (userInput !== null) {
            var email = userInput.val();
            var url = '/sg/salt_email/' + email;
            sg.sendJSON('POST', url, 'null', true, function (data) {
                var salt;
                if (data === null) {
                    salt = randomSalt();
                } else {
                    salt = data.salt;
                }
                hashAndSubmitForm(form, salt);
            }, null);
            return false;
        } else {
            hashAndSubmitForm(form, randomSalt());
            return false;
        }
    };


    var SettingsHashSubmitHandler = function (form) {

        var passcount = 0;
        jQuery(form).find("input[type=password]").each(function () {
            if ($(this).val().length) passcount++;
        });

        if (passcount === 3) {

            $.ajax({

                url: '/sg/salt_userid/' + $(form).attr('userid'),
                async: false,
                dataType: "json"
            }).done(function (data) {

                if (data === null) {
                    alert("returned false");
                    return false;
                }

                var salt = data.salt;
                var randomsalt = randomSalt();

                $(form).find("#current_password").val(
                hashWithSalt($(form).find("#current_password").val(), salt));

                $(form).find("#new_password").val(
                hashWithSalt($(form).find("#new_password").val(), randomsalt));

                $(form).find("#confirm_new_password").val(
                hashWithSalt($(form).find("#confirm_new_password").val(), randomsalt));
            });

        }
        else {

            jQuery(form).find("input[type=password]").each(function () {
                $(this).val("");
            });
        }

        form.submit();
        return false;
    };


    var hashSubmitHandlerUsingThis = function () {
        return hashSubmitHandler(this);
    };

    var hashSubmitHandlerUsingEvent = function (eventObject) {
        //return hashSubmitHandler($(eventObject.target).parents().find('form').first().get(0));
        return hashSubmitHandler(jQuery('form')[0]);
    };

    var that = {
        'hash': hash,
        'hashWithSalt': hashWithSalt,
        'hashSubmitHandler': hashSubmitHandler,
        'SettingsHashSubmitHandler': SettingsHashSubmitHandler,
        'hashSubmitHandlerUsingThis': hashSubmitHandlerUsingThis,
        'hashSubmitHandlerUsingEvent': hashSubmitHandlerUsingEvent,
        'randomSalt': randomSalt
    };

    return that;
}());

module.exports = sgcrypto;