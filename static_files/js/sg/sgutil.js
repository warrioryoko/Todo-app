/* General Utility Routines for SameGrain */

/* vim: set filetype=javascript sw=4 ts=4 sts=4 : */

"use strict";

//Highlight a navbutton
sg.select_navbar = function () {

    $(".navbutton").removeClass("selected");

    var val;

    //Didn't find a slash
    if (window.location.hash.indexOf("/") === -1)

    val = window.location.hash;
    else val = _.chain(window.location.hash.split('/')).compact().first().value();

    if (_.has(sg.navbutton_hashes, val)) {

        sg.navbutton_hashes[val].addClass("selected");
        return true;
    }

    return false;
};

//Call the wookmark masonify plugin so that vertical space is reduced between cards
sg.masonify = function () {

    $('#cards .card').wookmark({
        align: 'left',
        autoResize: true,
        container: $("#cards"),
        offset: 15
    });
};

//Create a topbar selector - ie 'all' or 'mine' on the Home page
sg.create_selector = function (selector) {

    selector = selector || null;

    if (selector) {

        $("#selector").html(sg.render.topbar_selector(selector));

        $("#selector a[href='" + window.location.hash + "']").addClass("active");

        $("#selector a").click(function (e) {

            e.preventDefault();

            $("#selector a").removeClass("active");

            $(e.currentTarget).addClass("active");

            sg.router.navigate($(e.currentTarget).attr('href'), {

                trigger: true,

                replace: true
            });
        });
    }
};

//Initialize the load more button
sg.init_load_more = function (view) {

    var el = $(view.el);

    if (el.find('#load_more_content').length === 0) {

        el.append(sg.templates.load_more());

        $("#load_more_content").hover(function () {

            console.log("hello");
        }, function () {

            console.log("goodbye");
        });

        $('#load_more_content').click(function () {

            view.load_more();
        });
    }
};

//Simple utility to detect if unsorted arrays are equal or not. Probably
//very inefficient
sg.is_unsorted_equal = function (array1, array2) {

    if (array1.length !== array2.length) return false;

    var diff1 = _.difference(array1, array2);

    var diff2 = _.difference(array2, array1);

    return ((diff1.length === 0) && (diff2.length === 0));
};

//Get an id from a uri - ie '10' from '/api/v1/profile/10'
sg.get_id_from_uri = function (uri) {

    var val = _.chain(uri.split('/')).compact().last().value();

    if (sg.isdigit(val)) return parseInt(val);

    return false;
};

//Get a cookie by name, taken from the django docs and used for sending the csrf
//token when uploading a new profile pic
sg.getCookie = function (cookie_name) {

    var cookieValue = null;

    if (document.cookie && document.cookie != '') {

        var cookies = document.cookie.split(';');

        for (var i = 0; i < cookies.length; i++) {

            var cookie = jQuery.trim(cookies[i]);

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, cookie_name.length + 1) == (cookie_name + '=')) {
                cookieValue = decodeURIComponent(
                cookie.substring(cookie_name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

//A generic error that alerts the error text
sg.generic_error = function (data) {
    alert("call failed with message: " + data.responseText);
};

//A utility function that tells you whether a string is comprised only of digits
sg.isdigit = function (arg) {

    if (typeof(arg) !== "string") return false;

    for (var i in arg) {

        if (!arg.charAt(i).match(/[0-9]/))

        return false;
    }

    return true;
};

//Append filters ( ie http keyword arguments ) to a uri. ie &api_key=12345
sg.append_filters = function (url, filters) {

    //url doesn't have a query string, add one
    if (url.indexOf("/?") === -1) url += "?";

    _.each(filters, function (value, key) {

        url += "&" + key + "=" + value;
    });

    return url;
};

//An api call routine for those time when a Backbone model is not appropriate
//'Method' is the HTTP verb, ie GET or POST
//'Resource' is the tastypie resource uri, ie 'profile' or 'post' or 'message'
//'Options' is an object that contains different options that change the call
sg.api_call = function (method, resource, options) {

    var options = _.defaults(options, {
        id: null,
        data: null,
        filters: {},
        error: sg.generic_error,
        success: null,
        async: false
    });

    var url = sg.prefix + resource;

    if (url.slice(-1) !== '/') url += '/';

    if (options.id) url += options.id + "/";

    url = sg.append_filters(url, options.filters);

    var opts = {
        contentType: 'application/json',
        async: options.async,
        type: method,
        data: JSON.stringify(options.data),
        dataType: 'json',
        error: options.error,
        success: options.success,
        url: url
    };

    return $.ajax(opts);
};


// Used to submit a form when the user presses return
//USAGE:  onKeyPress="return checkSubmit(this, event)"
sg.checkSubmit = function (obj, event) {
    if (event && event.keyCode === 13) {
        $(obj).submit();
        return false;
    }
    return true;
};

//Not really sure what this is used for...
sg.checkSearch = function (obj, e) {

    window.console.log($(e.currentTarget).val());
};

//Scroll to the bottom of an element. Used to scroll to the bottom of a
//conversation or comments
sg.scrollDown = function (el) {
    $(el).scrollTop($(el)[0].scrollHeight);
};

//Initialize the fancy scroller that appears on conversations and comments
sg.scroller_init = function () {

    $(".scroller").niceScroll();

    $(".scroller").each(function () {

        sg.scrollDown(this);
    });
};

//DEPRECATED
sg.mark_banner_as_seen = function (bid) {

    sg.sendJSON('POST', "/sg/" + sg.user['id'] + "/action/mark_banner_as_seen/" + bid, null, true, null, null);
};

//Cache buster for the topbar profile image
sg.update_topbar_image = function (url) {

    if (url) $("#profile_img").attr('src', url);
    else $("#profile_img").attr('src', sg.user['image']);
};

//Submits a message from the jquery message dialog
sg.message_form_handler = function (event) {

    var msg_body = $(event.currentTarget).find(".msg_body").val();
    var msg_recipient = $(event.currentTarget).find("#msg_recipient").val();
    //var msg_invitation = $(event.currentTarget).find("#msg_invitation").val();
    if (msg_body === "") {
        return false;
    }

    sg.api_call('POST', 'message', {
        data: {
            'profile_from_id': sg.user.get("id"),
            "profile_to_id": msg_recipient,
            'body': msg_body
        },
        success: function () {

            $("#message-dialog").dialog("close");
        }
    });

    return true;
};

// Toggle between more div and less div
sg.more_or_less = function (event) {
    var more_or_less_el = $(event.currentTarget).parent(".more-or-less");
    more_or_less_el.children(".more-content").toggle();
    more_or_less_el.children(".more-button").toggle();
    more_or_less_el.children(".less-button").toggle();
    more_or_less_el.children(".ellipses").toggle();
    return false;
};

//Create a new vinepost
sg.create_new_vinepost = function (text) {

    if (!text) return;

    var thepost = new sg.Post();

    thepost.set({
        body: text,
        profile: sg.user.get("resource_uri")
    });

    thepost.update({
        wait: true,
        async: false,
        error: sg.generic_error
    });

    if (thepost.has('id')) {
        sg.current_view.add(thepost);
        $("#vine_message").val("");
    }

};

//Tells you how long ago the time was. Accepts any datetime object or string that
//moment.js can parse. Returns one day, one week, two years, etc
sg.how_long_ago = function (time) {
    return moment.utc(time).fromNow();
};