module.exports = function () {

    "use strict";

    var self = {};


    var topbar_selector = function (data) {

        return sg.templates.topbar_selector(data);
    };
    self.topbar_selector = topbar_selector;


    var card = function (cid, data, type) {

        var d = {};
        d.id = cid;
        d.content = type(data);
        return sg.templates.card(d);
    };
    self.card = card;


    var banner = function (banner) {

        if (!banner) return "";

        var d = {
            'id': banner.id,
            'text': banner.text
        };

        return sg.templates.banner(d);
    };
    self.banner = banner;


    var help = function () {

        var html;

        $.ajax('/sg/help', {
            async: false,
            dataType: 'html',
            success: function (data) {

                html = data;
            }
        });

        return html;
    };
    self.help = help;


    var settings = function () {

        var d = sg.user.attributes;

        return sg.templates.settings(d);

    };
    self.settings = settings;


    var tutorial = function () {

        return sg.templates.tutorial({
            totalSteps: sg.TOTAL_STEPS
        });
    };
    self.tutorial = tutorial;


    var console = function (user, options) {

        var d = _.defaults(options, {
            disable: [],
            camera: false,
            size: 'large',
            auto_accept_plant: false
        });

        d.is_me = (sg.user.get('id') === user.get("id"));

        if (d.is_me) d.score = 0;
        else {

            d.score = Math.round(user.get("matching").total_matching);

            //prevent it from showing nothing as it does for your own profile
            if (d.score === 0) d.score = 1;
        }

        //Already a plant
        if (user.get('is_friend')) d.disable.push('plant');

        //if (d.is_me)
        d.comparison = [];
        //else
        //  d.comparison = d.user['comparison'];
        d.items = _.difference(['message', 'plant', 'mulch', 'recycle', 'camera'], d.disable);

        d.user = user.attributes;

        return sg.templates.console(d);
    };
    self.console = console;


    var vinepost_comment = function (own_vp, comment) {

        var d = {};

        d.id = comment.get("id");

        d.how_long_ago = sg.how_long_ago(comment.get('updated_at'));

        d.user = comment.get('profile');

        d.own_comment = (sg.user.get('username') === d.user.username);

        d.own_vp = own_vp;

        d.body = comment.get('body');

        return sg.templates.vinepost_comment(d);
    };
    self.vinepost_comment = vinepost_comment;


    var vinepost_comments = function (data) {

        var comments = [];

        _.each(data.comments, function (c) {

            comments.push(self.vinepost_comment(data.own_vp, c));
        });

        return comments;
    };
    self.vinepost_comments = vinepost_comments;


    var vinepost = function (cid, data, loaded_all_comments) {

        var d = {};

        d.loaded_all_comments = loaded_all_comments;

        d.id = cid;

        d.console = self.console(data.get('user'), {
            disable: ['recycle', 'camera']
        });

        d.own_vp = data.get('own_vp');

        d.user_image = sg.user.get('image');

        d.how_long_ago = sg.how_long_ago(data.get('updated_at'));

        d.comments = self.vinepost_comments({
            comments: data.attributes.comments.models,
            own_vp: d.own_vp
        });

        d.body = data.get('body');

        return sg.templates.card_vinepost(d);
    };
    self.vinepost = vinepost;


    var vinepost_form = function () {

        return sg.templates.vinepost_form();
    };
    self.vinepost_form = vinepost_form;


    var match = function (cid, data) {

        var d = {};

        d.id = cid;

        d.console = self.console(data.other_user, {
            disable: ['recycle', 'camera']
        });

        return sg.templates.card_match(d);
    };
    self.match = match;


    var plant = function (cid, data) {

        var d = {};
        d.id = cid;
        d.console = self.console(data.other_user, {
            disable: ['recycle', 'camera']
        });

        return sg.templates.card_plant(d);
    };
    self.plant = plant;


    var mulch = function (cid, data) {

        var d = {};
        d.id = cid;

        d.console = self.console(data.other_user, {
            disable: ['message', 'mulch', 'camera', 'plant'],
            redir: "mulchpile",
            auto_accept_plant: true
        });

        return sg.templates.card_mulch(d);
    };
    self.mulch = mulch;


    var message = function (user, message) {

        var d = {};

        d.user = user.attributes;

        d.id = message.get('id');

        d.body = message.get('body');

        d.how_long_ago = sg.how_long_ago(message.get('created_at'));

        d.own = (sg.user.get('id') === user.get('id'));

        return sg.templates.message_div(d);
    };
    self.message = message;


    var messages = function (other_user, messages) {

        var rendered = [];

        _.each(messages, function (m) {

            if (m.get("profile_from_id") === sg.user.get('id')) other_user = sg.user;

            rendered.push(self.message(other_user, m));
        });

        return rendered;
    };
    self.messages = messages;


    var conversation = function (cid, other_user, messages) {

        var d = {};

        d.loaded_all_messages = false;

        if (messages.meta.total_count === undefined || messages.meta.total_count === messages.length) {
            d.loaded_all_messages = true;
        }

        messages = messages.models;

        d.id = cid;

        d.console = self.console(other_user, {
            disable: ['message', 'recycle', 'camera'],
            redir: "mulchpile",
            auto_accept_plant: true
        });

        d.messages = self.messages(other_user, messages);

        d.user_image = sg.user.get('image');

/*
        d.load_more = load_more;
        
        d.num_fewer_posts = 10;
        
        d.num_unread = 0;
        
        _.each(d.messages, function(m) {

            if ( ( ! m['seen'] ) && ( m['sender_id'] !== sg.user.get('id') ) )
                d.num_unread++;
        });
        */

        return sg.templates.card_conversation(d);
    };
    self.conversation = conversation;


    var categories = function (data) {

        return sg.templates.categories(sg.categories);
    };
    self.categories = categories;


    var card_question = function (cid, question) {

        var d = {};

        d.qtype = 'QTYPE_GRAIN';
        d.answered = true; //check this value later
        d.skipButton = false;
        d.disappear = false;

        d.prompt = question.get("prompt");
        d.id = cid;

        d.possible_answers = question.get('possible_answers');
        d.answers = question.get('answers');

        d.card = sg.templates.grain_question(d);

        return sg.templates.card_question(d);
    };
    self.card_question = card_question;


    var profile_page = function (my_profile, other_user, comparison) {

        var d = {};

        if (my_profile) {

            d.bluebar_title = "My Profile";

            d.user_id = sg.user.get('id');
            d.goals = sg.user.get('goals');
            d.about_me = sg.user.get('about_me');

            d.console = self.console(sg.user, {
                disable: ['message', 'plant', 'mulch', 'recycle', 'map'],
                camera: true
            });

            d.profile_card = sg.templates.my_profile(d);
        }
        else {

            d.bluebar_title = other_user.get('username') + "'s Profile";
            d.goals = other_user.get('goals');
            d.about_me = other_user.get('about_me');

/*if ( other_user['mulched'] )
                d.console = self.console(other_user,
                {disable: ['camera', 'mulch', 'plant']} );
            else*/
            d.console = self.console(other_user, {
                disable: ['camera', 'recycle']
            });

            d.profile_card = sg.templates.other_profile(d);
        }

        //d.profile_grains = self.profile_grains(comparison);
        return sg.templates.profile_page(d);

    };
    self.profile_page = profile_page;


    var comparison_cards = function (comparison) {

        var cards = '';

        _.each(comparison, function (c) {
            cards += self.card_comparison(c);
        });

        return cards;
    };
    self.comparison_cards = comparison_cards;


    var card_comparison = function (comparison) {

        var d = {
            'comparison': comparison,
            first: true,
            category: sg.categories.findWhere({
                'id': comparison.filters.category
            })
        };

        return sg.templates.card_comparison(d);
    };
    self.card_comparison = card_comparison;


    var profile_pic = function () {

        var d = {
            'user_id': sg.user.get('id')
        };

        return sg.templates.profile_pic(d);
    };
    self.profile_pic = profile_pic;


    return self;

}();