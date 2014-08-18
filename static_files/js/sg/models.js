"use strict";

//Backbone Models and Collections which correspond to different REST api endpoints, ie /post, /profile, etc.
//A Collection will give you back an array of Models that have an id - for example, the /post Collection might contain a model with an id of 2 so a url endpoint of /post/2
//The base model used throughout the app and subclassed by all other models. Connects to a /profile entity by default
sg.ProfileModel = Backbone.Model.extend({

    urlRoot: sg.prefix + 'profile/',

    update: function (options) {

        //in case we don't get any arguments
        options = options || {};

        options = _.defaults(options, {
            patch: true,
            async: false
        });

        this.save(this.changedAttributes(), options);
    },

    //add an /ID if one exists
    url: function () {

        if (!this.id) return this.urlRoot;

        return this.urlRoot + this.id + "/";
    }
});


//Post
//----
sg.Post = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'post/'
});

sg.PostCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'post/',
    model: sg.Post
});


//Comment
//-------
sg.Comment = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'comment/'
});

sg.CommentCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'comment/',
    model: sg.Comment
});


//Matches
//-------
sg.MatchCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'profile/',
    model: sg.ProfileModel
});


//Friendship
//----------
sg.Friend = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'friendship/'
});

sg.FriendCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'friendship/',
    model: sg.Friend
});


//Message and ChatGroup
//---------------------
sg.Message = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'message/'
});

sg.MessageCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'message/',
    model: sg.Message
});

sg.ChatGroupCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'chatgroup/',
    model: sg.ProfileModel
});


//Block
//-------
sg.Blocked = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'blocked/'
});

sg.BlockedCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'blocked/',
    model: sg.Blocked
});


//Category Configuration
//----------------------
sg.CategoryConfiguration = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'categoryconfiguration/'
});

sg.CategoryConfigurationCollection = Backbone.Tastypie.Collection.extend({
    comparator: 'weight',
    urlRoot: sg.prefix + 'categoryconfiguration/',
    model: sg.CategoryConfiguration,

    //essentially a 'where' method for nested objects
    resource_from_category_id: function (id) {

        for (var i = 0; i < this.models.length; i++) {

            var model = this.models[i];

            if (model.attributes.category.id === id) return model.get("resource_uri");
        }
    },

    //update the sorted order locally so we can have the category order be correct
    update_sort: function (cid, old_weight) {

        var new_weight = this.get(cid).get("weight");

        //item moved up, decrease the weights of those less than it
        if (old_weight < new_weight) {

            //these loops are efficient but backbone doesn't give us a way to know
            //a model's index...we could implement a sorting algorithm but for 15
            //items why bother. This will need to be improved if the number of
            //categories ever gets big
            _.each(this.models, function (model) {

                if (model.get("weight") > new_weight || model.get("weight") < old_weight || model.cid === cid)

                return;

                model.set("weight", model.get("weight") - 1);
            });
        }

        //item moved down, increase the weights of those less than it
        else if (new_weight < old_weight) {

            _.each(this.models, function (model) {

                if (model.get("weight") < new_weight || model.get("weight") > old_weight || model.cid === cid)

                return;

                model.set("weight", model.get("weight") + 1);
            });
        }

        this.sort();
    }
});


//Shared Answer
//-------------
sg.SharedAnswer = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'sharedquestion/'
});

sg.SharedAnswerCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'sharedquestion/',
    model: sg.SharedAnswer
});


//Possible Answer
//---------------
sg.PossibleAnswer = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'possibleanswer/'
});

sg.PossibleAnswerCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'possibleanswer/',
    model: sg.PossibleAnswer
});


//Answer
//------
sg.Answer = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'answer/'
});

sg.AnswerCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'answer/',
    model: sg.Answer
});


//Question
//--------
sg.Question = sg.ProfileModel.extend({
    urlRoot: sg.prefix + 'question/'
});

sg.QuestionCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: sg.prefix + 'question/',
    model: sg.Question,

    get_category: function (uri) {
        return this.where({
            'category': uri
        });
    },

    get_answered: function () {
        return this.where({
            'is_answered': true
        });
    },

    get_unanswered: function () {
        return this.where({
            'is_answered': false
        });
    },

    set_is_answered: function (model) {

        var is_answered = true;

        if (model.get('answers').length === 0) is_answered = false;

        model.set('is_answered', is_answered);
    },

    initialize: function () {

        this.on("change", this.set_is_answered, this);
    }
});