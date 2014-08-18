/* vim: set filetype=javascript sw=4 ts=4 sts=4 : */

cal = {};

$ = jQuery = require("jquery");
require("jquery-ui");

_ = require("underscore");

moment = require("moment");

Backbone = require("backbone");
Backbone.$ = $;

require("../lib/base64");
require("../lib/backbone-tastypie");
require("../bower_components/jquery.nicescroll/jquery.nicescroll.min");
require("../bower_components/jquery-easing/jquery.easing.min");

require("./models");
require("./views");

cal.templates = require("./templates");

Backbone.Tastypie.defaultLimit = 10;

cal.App = function () {

    "use strict";

    var Router = Backbone.Router.extend({

        initialize: function () {

            Backbone.history.start();
        },

        route_init: function () {
            cal.current_view.destroy();
            $("#content").empty();
        },

        routes: {
            "help": "help",
            "list": "list",
            "create": "create"
        },

        help: function () {
            alert("help");
        },
        list: function () {

            this.route_init();

            cal.current_view = new cal.listView();
        },
        create: function () {

            this.route_init();

            cal.current_view = new cal.createView();
        }
    });

    var init = function () {

        if (window.location.hash === '') window.location.hash = "#create";

        $(window).on('hashchange', function () {

            $("#navbar a").removeClass("active");



            if (window.location.hash === "#list") {
                $("#navbar a[href='#list']").addClass("active");

            }

            else {
                $("#navbar a[href='#create']").addClass("active");
            }

        });

        $("#navbar a").removeClass("active");

        if (window.location.hash === "#list") {
            $("#navbar a[href='#list']").addClass("active");
        }
        else {
            $("#navbar a[href='#create']").addClass("active");
        }

        cal.current_view = new Backbone.View;
        var router = new Router();
    };

    //Public methods
    return {
        init: init
    };

};
module.exports = cal;