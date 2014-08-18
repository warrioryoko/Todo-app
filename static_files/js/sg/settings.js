"use strict";

//Settings.js is where we define data constants for use in the application, in additon to filter functions that it's better to have in one place than spread throughout the code base
//The default number of objects we get back from tastypie
Backbone.Tastypie.defaultLimit = 10;

//The number of milliseconds we wait before checking to see if there are new messages/comments etc
sg.CHECKTIME = 10000;

//The number of total steps in the tutorial
sg.TOTAL_STEPS = 6;

//Api url prefix, handy for concantonating on to urls
sg.prefix = "/api/v1/";

//State switch selectors
sg.selectors = {
    plants: [{
        url: '#plants/requests',
        text: 'Plant Requests'
    },
    {
        url: '#plants',
        text: 'Plants'
    }],
    posts: [{
        url: '#posts/mine',
        text: 'My Posts'
    },
    {
        url: '#posts',
        text: 'All Posts'
    }],
    grains: [{
        url: '#grains/answered',
        text: 'Answered'
    },
    {
        url: '#grains/unanswered',
        text: 'Unanswered'
    },
    {
        url: '#grains/all',
        text: 'Both'
    }],
    profile: [{
        url: '#profile/answers',
        text: 'Answers'
    },
    {
        url: '#profile/posts',
        text: 'Posts'
    }]
};

//Console image urls
var prefix = "https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-";
sg.console_images = {
    "mulch_s1": prefix + "mulch_s1.png",
    "mulch_s5": prefix + "mulch_s5.png",
    "mulch_s6": prefix + "mulch_s6.png",
    "message_s1": prefix + "message_s1.png",
    "message_s5": prefix + "message_s5.png",
    "message_s6": prefix + "message_s6.png",
    "plant_s1": prefix + "plant_s1.png",
    "plant_s5": prefix + "plant_s5.png",
    "plant_s6": prefix + "plant_s6.png",
    "recycle_s1": prefix + "recycle_s1.png",
    "recycle_s5": prefix + "recycle_s5.png",
    "recycle_s6": prefix + "recycle_s6.png"
};

//Tastypie filters collected in one place. TODO There are still more in views.js that need to be brought in here
sg.filters = {

    'matching': {
        matching: true
    },

    'no_limit': {
        limit: 0
    },

    'base_posts': {
        order_by: '-created_at'
    },

    'posts': function (filter_string) {

        if (filter_string === "mine") return _.extend({
            profile: sg.user.get('id')
        }, this.base_posts);
        else return this.base_posts;
    },

    'plants': function (requests) {

        return _.extend({
            'is_active': (requests !== "requests")
        }, this.matching);
    },

    'profile_posts': function (context) {

        return _.extend({
            profile: context.other_user.get('id')
        }, this.base_posts);
    }
};