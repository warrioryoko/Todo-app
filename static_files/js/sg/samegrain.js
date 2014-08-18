/* vim: set filetype=javascript sw=4 ts=4 sts=4 : */

//Samegrain.js imports all external modules and other samegrain modules, sets up
//backbone routes, and gives the browser an entry point with which to start the
//application.

//'sg' is the global variable which all samegrain code uses. For some reason setting sg.App as an object literal does not work, hence why we assign it below to sg after sg is created here.
sg = {};


//Modules
//-------
//All modules imported and variables defined here are global and attached to the
//window object.
$ = jQuery = require("jquery");
require("jquery-ui");

_ = require("underscore");

moment = require("moment");

imgareaselect = require("../lib/jquery.imgareaselect-0.9.10/scripts/jquery.imgareaselect.pack");

Backbone = require("backbone");
Backbone.$ = $;

require("../lib/character_counter");
require("../bower_components/wookmark-jquery/jquery.wookmark.min");
require("../lib/base64");
require("../lib/backbone-tastypie");
require("../lib/google_analytics");
require("../bower_components/jquery.nicescroll/jquery.nicescroll.min");
require("../bower_components/jquery-easing/jquery.easing.min"); /*require("../bower_components/jquery.validation/jquery.validate");*/

require("./settings");
require("./models");

// SameGrain App Object
//---------------------
//sg.App is the main function of the webapp, it gets required data and sets up events.
sg.App = function (user_id, email, api_key) {

    "use strict";

    //Download the user's profile object...as some point this data should be
    //bootstrapped into the django 'home' template.
    $.ajax('api/v1/profile/' + user_id + "/", {
        async: false,
        dataType: 'json',
        success: function (data) {

            sg.user = new sg.ProfileModel();
            sg.user.set(data);

            //This prevents issues with the console not finding 'shared_answers'
            sg.user.set("shared_answers", []);

            //Hardwire these for now
            sg.user.set("email", email);
            sg.user.set("api_key", api_key);
        }
    });

    //Now that we have an api_key we can tell jquery to send it as a header
    //automatically.
    $.ajaxSetup({
        headers: {

            "Authorization": "ApiKey " + email + ":" + api_key
        }
    });

    //Get the category configuration. This gives us the categories as well as
    //ordering metadata.
    sg.categories = new sg.CategoryConfigurationCollection(null, {
        filters: sg.filters.no_limit
    });

    sg.categories.fetch({
        async: false
    }, null);


    //Setup a dummy sg.current_view
    sg.current_view = new Backbone.View();


    //Modules that depend on sg.user
    //------------------------------
    require("./sgutil");
    require("./views");

    //These get their own namespaces for ease of use
    sg.templates = require("./templates");
    sg.render = require("./render_templates");


    //Router
    //------
    var Router = Backbone.Router.extend({

        initialize: function () {

            Backbone.history.start();
        },

        //Route_init destroys sg.current_view, clears the searchbar, selectors and
        //#content and then adds the given selectors and #card div
        route_init: function (options) {

            options = _.defaults(options, {
                selector: null,
                create_cards: false
            });

            var self = this;

            sg.current_view.destroy();

            $("#searchbar").val("");

            $("#selector").empty();

            $("#content").empty();

            if (options.create_cards)

            $("#content").append("<div id='cards'></div>");

            sg.create_selector(options.selector);

/*if (banner_page) {
            
                $("#content").append(
                    sg.render.banner(this.get_banner(banner_page))
                );

                $(".banner .close").click( function(e) {

                    sg.mark_banner_as_seen(
                        $(this).parents(".banner").attr("data-banner")
                    );
                    
                    $(this).parents(".banner").remove();
                });
            }*/
        },

        //routes
        //------
        //Match routes and sub routes to functions
        routes: {

            'posts(/:filter)': 'load_vine',
            'matches': 'load_matches',
            'plants(/:requests)': 'load_plants',
            'messages': 'load_conversations',
            'grains/:type(/:category)': 'load_grains',
            'mulchpile': 'load_mulchpile',
            'settings': 'load_settings',
            'tutorial': 'load_tutorial',
            'profile_pic': 'load_profile_pic',
            'myprofile': 'load_my_profile',
            'profile/:user_or_filter': 'load_profile',
            'help': 'load_help'
        },

        load_matches: function () {

            this.route_init({
                create_cards: true
            });
            sg.current_view = new sg.RegionView({
                collection: sg.MatchCollection,
                template: sg.render.match,
                view: sg.consoleView,
                filters: sg.filters.matching
            });
        },
        load_mulchpile: function () {

            this.route_init({
                create_cards: true
            });
            sg.current_view = new sg.RegionView({
                collection: sg.BlockedCollection,
                template: sg.render.mulch,
                view: sg.consoleView,
                filters: sg.filters.matching
            });
        },
        load_plants: function (requests) {

            this.route_init({
                selector: sg.selectors.plants,
                create_cards: true
            });

            sg.current_view = new sg.RegionView({
                collection: sg.FriendCollection,
                template: sg.render.plant,
                view: sg.consoleView,
                filters: sg.filters.plants(requests)
            });
        },
        load_conversations: function () {

            this.route_init({
                create_cards: true
            });
            sg.current_view = new sg.RegionView({
                collection: sg.ChatGroupCollection,
                template: sg.render.conversation,
                view: sg.messageView,
                filters: sg.filters.matching
            });
            sg.scroller_init();
        },
        load_vine: function (filter) {

            this.route_init({
                selector: sg.selectors.posts,
                create_cards: true
            });

            $("#content").prepend(sg.render.vinepost_form());

            $("#vine_submit").click(function (e) {
                e.preventDefault();
                sg.create_new_vinepost($("#vine_message").val());
            });

            sg.current_view = new sg.RegionView({
                collection: sg.PostCollection,
                template: sg.render.vinepost,
                view: sg.vinepostView,
                filters: sg.filters.posts(filter)
            });

            sg.scroller_init();
        },
        load_tutorial: function () {

            this.route_init({});
            sg.current_view = new sg.tutorialView();
        },
        load_settings: function () {

            this.route_init({});
            sg.current_view = new sg.settingsView();
        },
        load_help: function () {

            /*$("#content").html( sg.render.help() );*/
        },
        load_grains: function (type) {

            if (!_.contains(['answered', 'unanswered', 'all'], type)) return;

            if (sg.current_view instanceof sg.grainsView) {

                sg.current_view.load_type(type);

            } else {

                this.route_init({
                    selector: sg.selectors.grains
                });

                sg.current_view = new sg.grainsView({
                    'type': type
                });
            }
        },
        load_my_profile: function () {

            this.route_init({});
            sg.current_view = new sg.profileView({
                'my_profile': true
            });
        },
        load_profile: function (user_or_filter) {

            if (sg.isdigit(user_or_filter)) var is_user = true;
            else var is_user = false;

            if (is_user) {

                this.route_init({});

                sg.current_view = new sg.profileView({

                    'my_profile': false,

                    'other_user': user_or_filter
                });
            }
            else {

                this.navigate("#profile/" + sg.current_view.other_user.get('id'), {
                    replace: true,
                    trigger: false
                });

                sg.current_view.load_type(user_or_filter);
            }

        },
        load_profile_pic: function () {

            this.route_init({});
            sg.current_view = new sg.profilePicView();
        }
    });


    //Init is sg.App's public method which gets called from a script tag in the
    //home template to start the app
    var init = function () {

        //Setup the jquery message dialog handler
        $('#message-dialog').submit(sg.message_form_handler);

        //Setup the more or less mechanism - click 'more' to expand and 'less' to
        //collapse
        $('#content').on('click', '.more-button', sg.more_or_less);
        $('#content').on('click', '.less-button', sg.more_or_less);

        //Create the sg.navbutton_hashes object from each navbar link DOM el
        sg.navbutton_hashes = {}
        $(".navbutton").each(function () {

            var el = $(this);
            var href = el.attr("href");

            //Didn't find a slash
            if (href.indexOf("/") === -1)

            sg.navbutton_hashes[href] = el;
            else sg.navbutton_hashes[
            _.chain(href.split('/')).compact().first().value()] = el;
        });

        //Run through this once on page load so the proper link gets selected
        if (sg.select_navbar()) {

            var title = $(".navbutton.selected").find(".name").html().trim();

            $("#searchbar").attr("placeholder", "Search " + title + "...");
        }

        //When we go to a new page make sure the correct navbutton is highlighted
        $(window).on('hashchange', function () {

            if (sg.select_navbar()) {

                var title = $(".navbutton.selected").find(".name").html().trim();

                $("#searchbar").attr("placeholder", "Search " + title + "...");
            }
        });

        //On each keyup on the searchbar run the current_view's search function
        $("#searchbar").keyup(function (e) {

            sg.current_view.search($(e.currentTarget).val());
        });

        //No content exists on /home so redirect to /home#posts
        if (window.location.hash === '') window.location.hash = "#posts";

        var router = new Router();
        sg.router = router;
    };

    //Public methods
    return {
        init: init
    };

}; // sgapp
module.exports = sg;