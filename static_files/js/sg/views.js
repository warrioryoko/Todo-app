"use strict";

//Overriden Backbone methods
//--------------------------
//Override total_remove to remove all #id elements
Backbone.View.prototype.total_remove = function () {

    this.undelegateEvents();

    this.$el.removeData().unbind();

    $("#" + this.id).remove();
};

//Everytime you override destory you must call total_remove
Backbone.View.prototype.destroy = function () {

    this.total_remove();
};


//Views
//-----
//Grains view - Manages the loading of questions based on selected category and 
//answered/unanswered/all selectors
sg.grainsView = Backbone.View.extend({

    el: "#content",

    events: {
        'mouseup .category': 'select_category',
        'sortupdate .category-list': 'update_categories'
    },

    search: function (search_string) {

        search_string = search_string.toLocaleLowerCase();

        if (search_string === "") {
            this.clear_sorting();
            return;
        }

        var self = this;

        this.sorted = [];

        _.each(this.views, function (view) {

            if (view.search(search_string))

            self.sorted.push(view.cid);
        });

        this.sort_cards();
    },

    sort_cards: function () {

        var self = this;

        $(".card_question").each(function () {

            if (!_.contains(self.sorted, $(this).attr('id'))) $(this).hide();
            else $(this).show();
        });

    },

    clear_sorting: function () {

        $(".card_question").each(function () {
            $(this).show();
        });
    },

    load_type: function (type) {

        if (this.type === type) return;

        this.type = type;

        //load the previous category we had open, if any
        var category = this.get_current_category();

        if (!category) return;

        this.load_questions(category);
    },

    load_more: function () {

        var self = this;

        var searchval = $("#searchbar").val();

        var category_uri = this.get_current_category();

        this.questions[category_uri].fetchNext({
            remove: false
        }, null)

        .done(function (resp) {

            var to_delete = [];

            _.each(resp.objects, function (data) {

                var model = self.questions[category_uri].findWhere({
                    'id': data.id
                });

                if (model.get('possible_answers').length < 2) {

                    to_delete.push(model);

                } else {

                    var new_view = new self.view({
                        question: model,
                        id: model.get('id')
                    });

                    self.views.push(new_view);

                    self.render(new_view);
                }
            });

            self.questions[category_uri].remove(to_delete);

            if (searchval !== "") self.search(searchval);
        });
    },

    // this tells the server what order the tabs are in
    update_categories: function () {

        var selected_el = $(".category.selected");

        var uri = selected_el.attr("category-resource");

        var new_weight = parseInt($(".category").index(selected_el)) + 1;

        var inserted_model = sg.categories.findWhere({
            resource_uri: uri
        });

        //used in sorting below
        var inserted_id = inserted_model.cid;
        var old_weight = inserted_model.get("weight");

        inserted_model.save({
            "weight": new_weight
        }, {
            patch: true
        })

        .done(function () {

            sg.categories.update_sort(inserted_id, old_weight);
        });
    },

    unselect_category: function () {
        $(".category").removeClass("selected");
    },

    select_category: function (e) {

        this.unselect_category();
        $(e.currentTarget).addClass("selected");

        this.load_questions($(e.currentTarget).attr("category-resource"));
    },

    get_questions: function (category_uri) {

        if (this.questions[category_uri].length === 0) this.questions[category_uri].fetch({
            async: false
        });
        else return;

        var to_delete = [];

        //delete questions with only one possible answer until the webapp
        //supports more question types
        _.each(this.questions[category_uri].models, function (model) {

            if (model.get('possible_answers').length < 2) {
                to_delete.push(model);

                return;
            }
        });

        this.questions[category_uri].remove(to_delete);
    },

    get_current_category: function () {

        return $(this.el).find('.category.selected').attr('category-resource');
    },

    load_questions: function (category_uri) {

        var self = this;

        this.delete_question_views();

        this.get_questions(category_uri);

        _.each(this.questions[category_uri].models, function (question) {

            if (self.type === "unanswered") {

                if (question.get('answers').length !== 0) return;
            }
            else if (self.type === "answered") {

                if (question.get('answers').length === 0) return;
            }

            self.views.push(new sg.questionView({
                question: question,
                id: question.get('id')
            }));
        });

        this.render();
    },

    delete_question_views: function () {

        _.each(this.views, function (v) {

            v.destroy();
        });

        this.views.length = 0;
    },

    destroy: function () {

        this.delete_question_views();

        this.total_remove();
    },

    render_question: function (view) {

        $("#cards").append(view.render());

        view.setElement($("#" + view.cid));
    },

    render: function () {

        var self = this;

        $("#cards").empty();

        _.each(self.views, function (view) {

            self.render_question(view);
        });

        sg.masonify();

        if (this.views.length > 0) sg.init_load_more(this);
    },

    initialize: function (options) {

        if (!_.contains(['answered', 'unanswered', 'all'], options.type)) return;

        var self = this;

        this.view = sg.questionView;

        this.views = [];

        this.type = options.type;

        this.questions = {};

        _.each(sg.categories.models, function (category) {

            self.questions[category.get("resource_uri")] =
            new sg.QuestionCollection(null, {
                filters: {
                    'category': sg.get_id_from_uri(
                    category.attributes.category.resource_uri)
                }
            });
        });

        $("#content").html(sg.render.categories());

        $(".category-list").sortable();
        $(".category-list").disableSelection();

        this.select_category({
            currentTarget: $(".category.card").first()
        });

    }
});

// Question view - a single question type. Right now all question are represented
//in a tag-cloud like format, evetnually this will need to be subclassed to support
//many different types of questions
sg.questionView = Backbone.View.extend({

    events: {

        'click .next': 'next',
        'click .grain': 'grain_click'
    },

    search: function (string) {

        var found = _.find(this.model.get('possible_answers'), function (possible) {

            if (possible.text.toLocaleLowerCase().indexOf(string) === -1) return false;

            return true;
        });

        if (found === undefined) return false;

        return true;
    },

    update_answers: function () {

        var self = this;

        this.request = sg.api_call('PUT', 'answer', {

            data: this.generate_patch_data(),

            filters: {
                'question': self.model.id
            },

            async: true
        })

        .done(function () {

            self.set_server_answers();
        })

        .fail(function () {

            self.reset_grains();
        });
    },

    reset_grains: function () {

        var self = this;

        $(this.el).find(".grain").each(function () {

            var el = $(this);

            if (_.contains(self.model.get('server_answers'), parseInt(el.attr('answer-id')))) {
                if (!el.hasClass('grain-bold')) el.addClass('grain-bold');
            }
            else {

                if (el.hasClass('grain-bold')) el.removeClass('grain-bold');
            }
        });
    },

    grain_click: function (e) {

        var uri = $(e.currentTarget).attr('possible_answer');

        //TODO maybe change this to a true/false value in the dom?
        if ($(e.currentTarget).hasClass('grain-bold')) $(e.currentTarget).removeClass('grain-bold');
        else $(e.currentTarget).addClass('grain-bold');

        this.update_debounced();
    },

    get_clicked_ids: function () {

        var ids = [];

        $(this.el).find(".grain-bold").each(function () {

            ids.push(parseInt($(this).attr('answer-id')));
        });

        return ids;
    },

    generate_patch_data: function () {

        var self = this;

        var data = {
            'objects': []
        };

        _.each(this.model.get('answers'), function (id) {

            var answer = {

                'possible_answer': sg.prefix + 'possibleanswer/' + id + '/',

                'question': self.model.get('resource_uri')
            };

            data.objects.push(answer);
        });

        return data;
    },

    debounce_answers: function () {

        var ids = this.get_clicked_ids();

        this.model.set('answers', ids);

        //if our current answers match the ones on the server
        if (sg.is_unsorted_equal(this.model.get('answers'), this.model.get('server_answers'))) return;

        //4 is the 'completed' state
        if (this.request.readyState !== 4) {
            console.log('still waiting');
            return;
        }

        this.update_answers();
    },

    set_server_answers: function () {

        var orig_answers = _.clone(this.model.get('answers'));
        this.model.set('server_answers', orig_answers);
    },

    next: function () {},

    render: function () {

        return sg.render.card_question(this.cid, this.model);
    },

    initialize: function (options) {

        var self = this;

        this.model = options.question;

        this.request = {
            'readyState': 4
        };

        this.set_server_answers();

        this.update_debounced = _.debounce(this.debounce_answers, 2000);
    }
});

//Region view - used for homogenous views, ie plants, mulches, messages
sg.RegionView = Backbone.View.extend({

    el: "#cards",

    search: function (search_string) {

        search_string = search_string.toLocaleLowerCase();

        if (search_string === "") {
            this.clear_sorting();
            return;
        }

        var self = this;

        this.sorted = [];

        _.each(this.views, function (view) {

            if (view.search(search_string))

            self.sorted.push(view.cid);
        });

        this.sort_cards();
    },


    sort_cards: function () {

        var self = this;

        $(".card").each(function () {

            if (!_.contains(self.sorted, $(this).attr('id'))) $(this).hide();
            else $(this).show();
        });

    },


    clear_sorting: function () {

        $(".card").each(function () {
            $(this).show();
        });
    },


    destroy: function () {

        clearTimeout(this.timer);

        _.each(this.views, function (v) {

            v.destroy();
        });

        this.views.length = 0;

        this.total_remove();
    },

    add: function (model) {

        var new_view = new this.view(model);

        this.collection.add(model);

        this.views.push(new_view);

        if (this.collection.length === 1) this.render_all();
        else {
            this.render(new_view, $(".card").first());
            sg.masonify();
        }
    },

    load_more: function () {

        var self = this;

        var searchval = $("#searchbar").val();

        this.collection.fetchNext({
            remove: false
        }, null)

        .done(function (resp) {

            _.each(resp.objects, function (data) {

                var new_view = new self.view(self.collection.findWhere({
                    'id': data.id
                }));

                self.views.push(new_view);

                self.render(new_view);
            });

            if (searchval !== "") self.search(searchval);
        });
    },

    //el_before lets us insert content before a specified element
    render: function (view, el_before) {

        el_before = el_before || null;

        if (el_before) el_before.before(view.render(this.template));
        else this.$el.append(view.render(this.template));

        var new_el = $("#" + view.cid);

        var scroller = new_el.find(".scroller");

        view.setElement(new_el);

        if (scroller.length) {

            scroller.niceScroll();

            $(".scroller").getNiceScroll().resize();

            sg.scrollDown(scroller[0]);
        }

    },

    render_all: function () {

        var self = this;

        if (this.$el.length === 0 || this.$el.attr("cid") !== this.cid) {

            console.log("different tab");
            return false;
        }

        _.each(self.views, function (view) {

            self.render(view);
        });

        sg.masonify();

        if (this.views.length > 0) sg.init_load_more(this);
    },

    check_for_new: function () {

        this.dispatcher.trigger("check_for_new");

        this.timer = _.delay(_.bind(this.check_for_new, self), sg.CHECKTIME);

    },

    initialize: function (options) {

        var self = this;

        this.dispatcher = {};

        _.extend(this.dispatcher, Backbone.Events);


        this.check_for_new = _.bind(this.check_for_new, this);


        this.collection = new options.collection(null, {
            filters: options.filters
        });

        this.view = options.view;
        this.views = [];
        this.template = options.template;

        this.$el.attr('cid', this.cid);

        this.collection.fetch()

        .done(function (data) {

            _.each(self.collection.models, function (model) {

                var new_view = new self.view(model);

                self.views.push(new_view);

                new_view.listenTo(self.dispatcher, "check_for_new", new_view.check_for_new);

            });

            self.render_all();

            self.timer = _.delay(_.bind(self.check_for_new, self), sg.CHECKTIME);

        });
    }
});

//Console view - used by itself for views that are just a console, ie plants and
//mulches. Subclassed by views that incorporate the console, ie posts and messages
sg.consoleView = Backbone.View.extend({

    events: {
        'mouseenter .console-button': 'slide_out',
        'mouseleave .console-button': 'slide_in',
        'mouseenter .console-score': 'show_comparison',
        'mouseleave .console-score': 'hide_comparison',
        'click .plant-button': 'plant_click',
        'click .message-button': 'message_click',
        'click .mulch-button': 'mulch_click',
        'click .recycle-button': 'recycle_click',
        'click .camera-button': 'camera_click',
    },

    slide_time: 300,

    search: function (string) {

        return (this.user.get("username").toLocaleLowerCase().indexOf(string) !== -1);
    },

    slide_out: function (e) {

        var type = $(e.currentTarget).attr("data-action");
        var self = this;

        $(this.el).find(".console-button-" + type + " .slider-image").stop().animate({
            marginRight: 0
        }, this.slide_time, function () {

            $(self.el).find(".console-button-" + type + " .main-image").attr('src', sg.console_images[type + '_s5']);

        });
    },
    slide_in: function (e) {

        var type = $(e.currentTarget).attr("data-action");

        $(this.el).find(".console-button-" + type + " .main-image").attr('src', sg.console_images[type + '_s1']);

        $(this.el).find(".console-button-" + type + " .slider-image").stop().animate({
            marginRight: -50
        }, this.slide_time);
    },

    show_comparison: function (e) {

        var console = $(e.currentTarget).parents(".console").first();

        console.find(".comparison").css("visibility", "visible");

        // Mark this match as having been seen
/*if ( ! this.seen ) {
                var other_user_id = console.attr("data-id");
                var url = "/sg/" + sg.user.get('id') + "/action/mark_match_as_seen/" + other_user_id;
                sg.sendJSON('POST', url, null, true, null, null);
            }*/
    },
    hide_comparison: function (e) {

        var console = $(e.currentTarget).parents(".console").first();

        console.find(".comparison").css("visibility", "hidden");
    },


    plant_click: function (event) {

        var self = this;

        sg.api_call('POST', 'friendship', {
            data: {
                'profile_from': sg.user.get("resource_uri"),
                "profile_to": this.user.get("resource_uri")
            },
            success: function () {

                $('#notification-dialog').html("A Plant request has been sent to " + plant_name);
                $('#notification-dialog').dialog();

                //self.destroy();
            }
        });

    },

    message_click: function (event) {

        $("#message-dialog").find("#msg_body").val("");

        $("#message-dialog #msg_recipient").attr("value", this.user.get("id"));

        $("#message-dialog").dialog({

            title: "Message to " + this.user.get("username")
        });

        $("#message-dialog").dialog("open");
    },

    mulch_click: function (event) {

        var self = this;

        sg.api_call('POST', 'blocked', {
            data: {
                'profile_from': sg.user.get("resource_uri"),
                "profile_to": this.user.get("resource_uri")
            },
            success: function () {

                self.destroy();
            }
        });

    },

    recycle_click: function (event) {

        var self = this;

        this.model.destroy({
            success: function () {
                self.destroy();
            }
        });

    },

    camera_click: function (event) {
        Backbone.history.navigate("profile_pic", {
            trigger: true
        });
    },

    render: function (t) {

        return t(this.cid, {
            other_user: this.user
        });
    },

    initialize: function (data, id) {

        var self = this;

        this.model = data;

        this.id = data.id;

        this.user = new sg.ProfileModel();

        //we're dealing with a friendship, matched or blocked model
        if (this.model.has("profile_from")) {

            if (this.model.get("profile_from") === sg.user.get("resource_uri")) {

                this.user.set(this.model.get("profile_to"));
            } else {

                this.user.set(this.model.get("profile_from"));
            }
        }
        else {

            this.user.set(this.model.attributes);
        }

        var answers = [];

        var shared = new sg.SharedAnswerCollection();

        shared.fetch({
            async: false,
            data: {
                random: true,
                profile: this.user.get('id')
            }
        })

        .done(function () {

            _.each(shared.models, function (model) {

                _.each(model.get("shared_answers"), function (answer) {

                    answers.push(answer);
                });
            });

            self.user.set("shared_answers", answers);
        });

        //this is a hack because rich_other_user gives back null for some
        //values...we'll have to fix it eventually
        //if ( ! data.other_user.match)
        self.seen = false;
        //else
        //  self.seen = data.other_user.match.seen_by_user1;
    }
});

//Post view - has a Post body and comments below
sg.vinepostView = sg.consoleView.extend({

    events: {

        'click .edit-comment': 'edit_comment',
        'click .comment .edit_area .edit_button': 'save_or_cancel_comment',

        'click .vp .edit': 'edit_post',
        'click .vp .edit_area .edit_button': 'save_or_cancel_post',

        'click .vp .delete': 'delete_post',
        'click .delete-comment': 'delete_comment',

        'click .load_more': 'load_more',

        'submit .msg': 'post_comment'
    },

    load_more: function () {

        var self = this;

        this.comments.fetchNext({
            'remove': false
        }, null)

        .done(function (data) {

            var num_new = data.objects.length;

            if (num_new > 0) {

                $(self.el).find('.comment:first').before(
                sg.render.vinepost_comments({

                    'comments': _.first(self.comments.models, num_new),

                    'own_vp': self.model.get('own_vp')
                }));

                if (self.comments.meta.total_count === self.comments.length) $(self.el).find(".load_more").remove();
            }
            else {
                $(self.el).find(".load_more").remove();
            }

        });
    },

    search: function (string) {

        //this is a DRY violation but you try getting super in js to work
        var found = (
        this.user.get("username").toLocaleLowerCase().indexOf(string) !== -1

        ||

        this.model.get('body').toLocaleLowerCase().indexOf(string) !== -1);

        if (found) return found;


        _.each(this.model.get('comments').models, function (model) {

            if (model.get('body').toLocaleLowerCase().indexOf(string) !== -1) found = true;
        });

        return found;
    },

    edit_post: function (e) {

        var post = $(e.currentTarget).parents(".vp");

        this.old_body = post.find(".message").clone();

        post.find(".sgactions").toggle();

        post.find(".message").replaceWith(
        sg.templates.edit_area_textarea({}));

        post.find(".edit_area .edit_input").val(this.model.get('body'));

    },

    edit_comment: function (e) {

        var comment = $(e.currentTarget).parents(".comment");

        var comment_id = comment.attr("comment-id");

        this.orig_comments[comment_id] = comment.find(".text").clone();

        comment.find(".actions").toggle();

        comment.find(".text").replaceWith(
        sg.templates.edit_area_input({}));

        comment.find(".edit_area .edit_input").val(
        this.orig_comments[comment_id].html().trim());
    },


    save_or_cancel_post: function (e) {

        var self = this;

        var post = $(e.currentTarget).parents(".vp");

        if ($(e.currentTarget).attr('action') === "save") {

            var new_text = $(e.currentTarget).parents().first().siblings(".edit_input").val();

            this.model.set('body', new_text);

            this.model.update({
                success: function () {

                    post.find(".edit_area").replaceWith(self.old_body);

                    post.find(".message").html(new_text);
                }
            });

        } else {

            post.find(".edit_area").replaceWith(this.old_body);
        }

        post.find(".sgactions").toggle();
    },


    save_or_cancel_comment: function (e) {

        var self = this;

        var comment = $(e.currentTarget).parents(".comment");

        var comment_id = comment.attr("comment-id");

        if ($(e.currentTarget).attr('action') === "save") {

            var new_text = $(e.currentTarget).parents().first().siblings(".edit_input").val();

            var model = this.comments.get(comment_id);

            model.set('body', new_text);

            model.update({
                success: function () {

                    comment.find(".edit_area").replaceWith(
                    self.orig_comments[comment_id]);

                    comment.find(".text").html(new_text);

                }
            });

        } else {

            comment.find(".edit_area").replaceWith(
            this.orig_comments[comment_id]);
        }

        comment.find(".actions").toggle();
    },

    delete_post: function (e) {

        var self = this;

        this.model.destroy({
            wait: true,
            async: false,
            error: sg.generic_error,
            success: function () {
                self.destroy();
                sg.masonify();
                $(".scroller").getNiceScroll().resize();
            }
        });
    },

    delete_comment: function (e) {

        var self = this;

        var comment_id = $(e.currentTarget).parents(".comment").attr("comment-id");

        this.comments.get(comment_id).destroy({
            wait: true,
            async: false,
            error: sg.generic_error,
            success: function () {
                $(e.currentTarget).parents(".comment").remove();
                self.comments.meta.total_count--;
            }
        });
    },

    post_comment: function (event) {

        var self = this;

        var comment = $(event.currentTarget).val();

        if (comment === "") return false;

        var new_comment = this.comments.create({
            post: this.model.get('resource_uri'),
            profile: sg.user.get('resource_uri'),
            body: comment
        }, {
            error: sg.generic_error,

            success: function () {

                self.add_comment(new_comment);
            }
        });
    },

    add_comments: function (comments) {

        var self = this;

        _.each(comments, function (comment) {

            self.add_comment(comment);
        });
    },

    add_comment: function (comment) {

        this.comments.meta.total_count++;

        $(this.el).find(".comments").append(
        sg.render.vinepost_comment(this.model.get('own_vp'), comment));

        sg.scrollDown($(this.el).find(".scroller")[0]);

        $(this.el).find(".msg").val("");
    },

    check_for_new: function () {

        var self = this;

        var total = this.comments.meta.total_count || 0;

        var new_collection = new sg.CommentCollection(null, {
            filters: {
                post: self.model.id,
                offset: total,
                order_by: 'created_at',
                rand: Math.random()
            }
        });

        new_collection.fetch()

        .done(function () {

            self.comments.add(new_collection.models);

            self.add_comments(new_collection.models);
        });

    },

    destroy: function () {

        this.total_remove();
    },

    render: function (t) {

        var loaded_all_comments = false;

        if (this.comments.meta.total_count === undefined || this.comments.meta.total_count === this.comments.length) {
            loaded_all_comments = true;
        }

        return t(this.cid, this.model, loaded_all_comments);
    },

    initialize: function (data) {

        var self = this;

        this.model = data;
        this.id = data.id;

        this.orig_comments = {};

        this.model.set('own_vp', (sg.user.get('resource_uri') === this.model.attributes.profile.resource_uri));



        if (this.model.get("own_vp")) {

            this.user = sg.user;
        }
        else {

            this.user = new sg.ProfileModel({
                id: sg.get_id_from_uri(
                this.model.attributes.profile.resource_uri)
            });


            this.user.fetch({
                async: false,
                data: {
                    matching: true
                }
            });

            var answers = [];

            var shared = new sg.SharedAnswerCollection();

            shared.fetch({
                async: false,
                data: {

                    random: true,
                    profile: this.user.get('id')
                }
            })

            .done(function () {

                _.each(shared.models, function (model) {

                    _.each(model.get("shared_answers"), function (answer) {

                        answers.push(answer);
                    });
                });

                self.user.set("shared_answers", answers);
            });
        }

        this.model.set("user", this.user);

        this.comments = new sg.CommentCollection(null, {
            filters: {
                post: this.model.id,
                order_by: '-created_at'
            }
        });

        this.comments.comparator = function (comment) {
            return comment.get("id");
        };

        //don't bother to get the comments when there aren't any
        if (this.model.get('comments_number') > 0)

        this.comments.fetch({
            async: false
        });

        this.model.set('comments', this.comments);

        this.events = _.extend({}, sg.consoleView.prototype.events, this.events);

    }
});

//Message view - a simple list of messages
sg.messageView = sg.consoleView.extend({

    events: {
        'click .load_more': 'load_more',
        'click .delete': 'delete_message',
        'submit .msg': 'send_message'
    },

    load_more: function () {

        var self = this;

        this.collection.fetchNext({
            'remove': false
        }, null)

        .done(function (data) {

            var num_new = data.objects.length;

            if (num_new > 0) {

                $(self.el).find('.message:first').before(
                sg.render.messages(self.user, _.first(self.collection.models, num_new)));

                if (self.collection.meta.total_count === self.collection.length)

                $(self.el).find(".load_more").remove();
            }
            else {

                $(self.el).find(".load_more").remove();
            }

        });

    },

    search: function (string) {

        //this is a DRY but you try getting super in js to work
        var found = (this.user.get('username').toLocaleLowerCase().indexOf(string) !== -1);

        if (found) return found;

        _.each(this.collection.models, function (model) {

            if (model.get('body').toLocaleLowerCase().indexOf(string) !== -1) found = true;
        });

        return found;
    },

    check_for_new: function () {

        var self = this;

        var total = this.collection.meta.total_count;

        var new_collection = new sg.MessageCollection(null, {
            filters: {
                conversation_with: self.user.get('id'),
                offset: total,
                order_by: 'created_at',
                rand: Math.random()
            }
        });

        new_collection.fetch()

        .done(function () {

            self.collection.add(new_collection.models);

            self.add_messages(new_collection.models);
        })
    },

    send_message: function (e) {

        var self = this;

        var msg_body = $(e.currentTarget).val();

        if (msg_body === "") return false;

        var m = new sg.Message({
            'profile_from_id': sg.user.get('id'),
            'profile_to_id': this.user.get('id'),
            'body': msg_body
        });

        m.save(null, {
            success: function () {

                self.collection.add(m);

                self.add_message(m);
            }
        });

    },

    delete_message: function (e) {

        var self = this;

        var message_id = $(e.currentTarget).parents(".message").attr("message-id");

        this.collection.get(message_id).destroy({
            success: function () {

                if ($(self.el).find(".message").length === 0) self.destroy();

                $(e.currentTarget).parents(".message").remove();

                self.collection.meta.total_count--;

                $("#content").find(".scroller").getNiceScroll().resize();

            }
        });

    },

    add_messages: function (messages) {

        var self = this;

        _.each(messages, function (message) {

            self.add_message(message);
        });
    },

    add_message: function (message) {

        this.collection.meta.total_count++;

        $(this.el).find(".messages").append(
        sg.render.message(sg.user, message));

        sg.scrollDown($(this.el).find(".scroller")[0]);

        $(this.el).find(".msg").val("");
    },

    toggle_load_more: function () {

        $(e.currentTarget).find(".load_more").toggle();
    },

    destroy: function () {

        this.total_remove();
    },

    render: function (t) {

        return t(this.cid, this.user, this.collection);
    },

    initialize: function (user) {

        var self = this;

        this.user = user;

        this.id = user.id;

        var answers = [];

        var shared = new sg.SharedAnswerCollection();

        shared.fetch({
            async: false,
            data: {
                random: true,
                profile: this.user.get('id')
            }
        })

        .done(function () {

            _.each(shared.models, function (model) {

                _.each(model.get("shared_answers"), function (answer) {

                    answers.push(answer);
                });
            });

            self.user.set("shared_answers", answers);
        });

        this.collection = new sg.MessageCollection(null, {
            filters: {
                'conversation_with': user.get('id'),
                'order_by': '-created_at'
            }
        });

        this.collection.comparator = function (model) {
            return model.get("id");
        };

        this.collection.fetch({
            async: false
        });

        this.events = _.extend({}, sg.consoleView.prototype.events, this.events);
    }
});

//Shared answer view - Statically displays shared answers. Eventually clicking on
//an answer should take you to the grains page where you can see the question
sg.sharedAnswersView = Backbone.View.extend({

    el: "#cards",

    load_more: function () {},

    most_answers: function () {

        var biggest = 0;

        $(".card_comparison").each(function () {

            biggest = _.max([biggest, $(this).find(".common-grain").length]);
        });

        console.log(biggest);

        return biggest;
    },

    initialize: function (options) {

        if (!_.has(options, 'user_id')) return false;

        var self = this;

        this.user_id = options.user_id;

        this.shared = [];

        var el = $(this.el);

        _.each(sg.categories.models, function (category) {

            category = category.get("category");

            var uri = category.resource_uri;

            self.shared[uri] = new sg.SharedAnswerCollection(null, {
                filters: {

                    profile: self.user_id,

                    category: category.id

                }
            });

            self.shared[uri].fetch()

            .done(function () {

                if (self.shared[uri].length === 0) return;

                el.append(sg.render.card_comparison(self.shared[uri]));

                sg.masonify();
            });

        });

/*_.delay(function() {

                if ( self.most_answers() === 4 ) {

                    sg.init_load_more( self );
                 console.log('should be initing');   
                }        

            }, 2000)*/

    }

});

//Profile view - your or another user's profile page
sg.profileView = sg.consoleView.extend({

    el: "#content",

    events: {
        'click .edit_button': 'toggle_edit',
        'click .cancel_button': 'toggle_edit',
        'click #submit_button': 'update_profile'
    },

    load_posts: function () {

        this.cards = new sg.RegionView({
            collection: sg.PostCollection,
            template: sg.render.vinepost,
            view: sg.vinepostView,
            filters: sg.filters.profile_posts(this)
        });
    },

    load_answers: function () {

        new sg.sharedAnswersView({
            'user_id': this.user.get('id')
        });
    },

    load_type: function (type) {

        this.cards.destroy();
        $("#profile-cards").empty();

        if (type === "answers") this.load_answers();
        else this.load_posts();
    },

    show_edit: function (target, to_check) {

        $(target + " .info_box .info_text").css({
            "display": "none"
        });
        $(target + " .info_box .edit").css({
            "display": "block"
        });

        this.is_hidden[to_check] = false;
    },

    hide_edit: function (target, to_check) {

        $(target + " .info_box .edit").css({
            "display": "none"
        });
        $(target + " .info_box .info_text").css({
            "display": "block"
        });
        $(target + " .info_box .edit textarea").val("");

        this.is_hidden[to_check] = true;
    },

    toggle_edit: function (e) {

        var target = $(e.currentTarget).attr("data-target") || e;
        var to_check = target.slice(1);

        if (this.is_hidden[to_check]) {
            this.show_edit(target, to_check);
        }
        else {
            this.hide_edit(target, to_check);
        }
    },

    update_info: function () {

        $("#goals_text").html(sg.user.get("goals"));
        $("#about_me_text").html(sg.user.get("about_me"));
    },

    update_profile: function () {

        var self = this;

        var goals = $("#goals").val();
        var about_me = $("#about_me").val();

        //we need to have a to_set var so that we can update both vars in one
        //pass and changedAttributes won't just record the last one
        var to_set = {};

        if (goals) to_set['goals'] = goals;

        if (about_me) to_set['about_me'] = about_me;

        if (goals || about_me) {

            sg.user.set(to_set);

            if (!sg.user.changedAttributes()) return false;

            sg.user.update({
                success: function () {

                    self.hide_edit("#goal_div", 'goals');
                    self.hide_edit("#about_div", 'about_me');

                    self.update_info();
                }
            });
        }

    },

    render: function () {

        $(this.el).html(
        sg.render.profile_page(this.my_profile, this.user));

        //only display selector if other profile is a friend
        if ((!this.my_profile) && (this.user.get("is_friend"))) sg.create_selector(sg.selectors.profile);

        //this.columnize_cards();
    },

    initialize: function (options) {

        var self = this;

        this.events = _.extend({}, sg.consoleView.prototype.events, this.events);

        this.my_profile = options.my_profile;

        if (!this.my_profile) {

            this.user = new sg.ProfileModel({
                id: options.other_user
            });
            this.user.fetch({
                async: false,
                data: {
                    matching: true
                }
            });

            var answers = [];

            var shared = new sg.SharedAnswerCollection();

            shared.fetch({
                async: false,
                data: {
                    random: true,
                    profile: this.user.get('id')
                }
            })

            .done(function () {

                _.each(shared.models, function (model) {

                    _.each(model.get("shared_answers"), function (answer) {

                        answers.push(answer);
                    });
                });

                self.user.set("shared_answers", answers);
            });
        }

        this.render();

        if (this.my_profile) {

            $("#goals").charCounter(140, {
                format: "%1/140"
            });
            $("#about_me").charCounter(140, {
                format: "%1/140"
            });

            this.is_hidden = {
                about_me: true,
                goals: true
            };
        }

        this.cards = new Backbone.View();
    }
});

//Tutorial view - loads the tutorial questions and images and is responsable for
//navigation between the tutorial pages
sg.tutorialView = Backbone.View.extend({

    el: '#content',

    events: {
        'click .tutorial-panel #next-div': 'load_next',
        'click .tutorial-panel .circle-div': 'load_step'
    },

    questions: {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12],
        5: [13, 14, 15],
        6: [16, 17, 18]
    },

    load_next: function () {
        this.load_step(this.step + 1);
    },

    load_step: function (e) {

        if (_.isNumber(e)) this.step = e;
        else this.step = parseInt($(e.currentTarget).attr("data-step"));

        if (this.step > 6) {
            this.exit_tutorial();
            return;
        }

        $("#aux_sprite").removeClass();
        if (_.contains([3, 4, 5], this.step)) $("#aux_sprite").addClass("sprite aux" + this.step);

        $("#slide_sprite").removeClass();
        $("#slide_sprite").addClass("sprite s" + this.step);

        this.render_questions();
    },

    destroy: function () {

        this.delete_question_views();
        this.total_remove();
    },

    exit_tutorial: function (e) {

        var e = e || null;

        this.delete_question_views();

        $('.navbar-overlay').toggle();
        $('#overlay-background').toggle();

        $('a').off('click');

        //normal exit
        if (!e) Backbone.history.navigate("grains/unanswered", {
            trigger: true
        });
        //clicked on a link
        else Backbone.history.navigate($(e.currentTarget).attr('href'), {
            trigger: true
        });
    },

    clear_column: function () {
        $(".column").empty();
    },

    delete_question_views: function () {

        _.each(this.views, function (q) {
            q.destroy();
        });
    },

    render_questions: function () {

        var self = this;

        this.clear_column();

        var range = _.range((this.step * 3) - 3, this.step * 3);

        var spliced_views = [];

        _.each(range, function (num) {

            spliced_views.push(self.views[num]);
        });

        _.each(spliced_views, function (view) {

            $(".column").append(view.render());

            view.setElement($("#" + view.cid));
        });
    },

    render: function () {

        var self = this;

        var overlay = $('.navbar-overlay');

        if (!overlay.attr('src')) overlay.attr('src', overlay.attr('data-url'));
        else overlay.toggle();

        $('#overlay-background').toggle();

        $("#content").html(sg.render.tutorial());

        this.load_step(this.step);

        $('a').on('click', function (e) {

            e.preventDefault();

            self.exit_tutorial(e);
        });
    },

    initialize: function () {

        var self = this;

        this.step = 1;
        this.views = [];

        this.questions = new sg.QuestionCollection();

        this.questions.fetch().done(function () {

            _.each(self.questions.models, function (question) {

                self.views.push(new sg.questionView({
                    question: question,
                    id: question.get('id')
                }));
            });

            self.render();
        });
    }
});

//Profile pic view - lets you upload a new profile pic. Cleans out the cache of
//the old profile image
sg.profilePicView = Backbone.View.extend({

    el: "#content",

    events: {

        //$(node).find('.save-button').click(save).button();
        //'submit #upload': 'upload',
        'click .save-button': 'save'
    },

    profile_pic_cleanup: function () {
        //Delete old image area selection - it makes a MESS
        /* Delete the top level divs which have no class but do have a style attribute */
        $('#content > div:not([class])').filter('div[style]').remove();
        $('.imgareaselect-outer, .imgareaselect-selection').remove();
        $('.imgareaselect-border1, .imgareaselect-border2, .imgareaselect-border3, .imgareaselect-border4').remove();
        $('.imgareaselect-handle').remove();
    },

    update: function (e) {

        //e.preventDefault()
        var self = this;

        // Cache breaker
        var url = sg.user.get('image') + "?" + new Date().getTime();

        sg.update_topbar_image(url);

        $(self.el).find('.image').html('<img src="' + url + '"/>');

        this.profile_pic_cleanup();

        /* wait for the image to load to determine its size */
        $(self.el).find('.image img').load(function () {
            var width = $(self.el).find('.image img').width();
            var height = $(self.el).find('.image img').height();
            var targetAspect = 278.0 / 128.0;
            var aspect = width / height;

            if (aspect > targetAspect) { // too wide
                width = targetAspect * height;
            } else { // too tall
                height = width / targetAspect;
            }

            self.x1 = 0.025 * width;
            self.y1 = 0.025 * height;
            self.x2 = 0.975 * width;
            self.y2 = 0.975 * height;

            $(self.el).find('.image img').imgAreaSelect({
                aspectRatio: '278:128',
                handles: true,
                x1: self.x1,
                y1: self.y1,
                x2: self.x2,
                y2: self.y2,
                onSelectEnd: function (img, selection) {
                    self.x1 = selection.x1;
                    self.y1 = selection.y1;
                    self.x2 = selection.x2;
                    self.y2 = selection.y2;
                }
            });
        });
    },

    upload: function () {

        var self = this;

        var formData = new FormData($(self.el).find('form')[0]);

        console.log($('input[type=file]').val() /*$("#image")*/ );

/*sg.api_call('PATCH', 'profile', {data:
            {
                'profile_from': sg.user.get("resource_uri"),
                "profile_to": this.user.resource_uri
            }, success: function() {
        
                self.destroy();
            } } );



            $.ajax({
                type: 'POST',
                url: '/sg/' + sg.user.get('id') + '/action/upload_profile_picture',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    sg.update_user();
                    self.update();
                },
                error: function (jqXHR, textStatus, errorMessage) {
                }
            });*/

        return false;
    },

    save: function () {

        var img = $(this.el).find('.image img');

        var width = img.width();
        var height = img.height();

        /* size without scaling */
        var naturalWidth = img[0].naturalWidth;
        var naturalHeight = img[0].naturalHeight;

        var scaleX = naturalWidth / width;
        var scaleY = naturalHeight / height;

        var nx1 = Math.floor(this.x1 * scaleX);
        var ny1 = Math.floor(this.y1 * scaleY);
        var nx2 = Math.floor(this.x2 * scaleX);
        var ny2 = Math.floor(this.y2 * scaleX);

        var nwidth = nx2 - nx1;
        var nheight = ny2 - ny1;

        var self = this;

        sg.sendJSON('POST', '/sg/' + sg.user.get('id') + '/action/crop_profile_picture', {
            'xoffset': nx1,
            'yoffset': ny1,
            'width': nwidth,
            'height': nheight
        }, false, function () {
            sg.update_user();
            self.update();
        }, null);
    },

    render: function () {

        $(this.el).html(sg.render.profile_pic());
    },

    initialize: function () {

        var self = this;

        this.x1, this.y1, this.x2, this.y2 = 0;

        this.render();

        $("#upload").append("<input id='csrf'></input>");

        $("#csrf").attr({
            'type': 'hidden',
            'name': 'csrfmiddlewaretoken',
            'value': sg.getCookie('csrftoken')
        });

        this.update();
    }
});

//Settings view - responsible for boolean and form settings
sg.settingsView = Backbone.View.extend({

    el: "#content",

    events: {
        'click #delete': 'confirm_deletion',
        'click .toggle': 'toggle',
        'submit #settingsform': 'submit'
    },

    submit: function (e) {

        e.preventDefault();

        var username = $("#username").val().trim();

        var current = $("#current_password").val().trim();
        var password = $("#new_password").val().trim();
        var confirm = $("#confirm_new_password").val().trim();

        if (username !== "") {

            sg.user.save({
                "username": username
            }, {
                patch: true
            })

            //TODO eventually this should really be replaced with a live data
            //binding
            //replace all instances of username on page with updated one
            .done(function () {

                $("#username-text, #menu-username").html(
                sg.user.get("username"));
            }).fail(function () {

                alert("bad username");
            });
        }


        if ((password !== "" && confirm !== "" && current !== "") && (password === confirm)) {

            sg.api_call('PATCH', 'userpassword', {
                id: sg.user.get('id'),
                data: {
                    'password': $("#new_password").val()
                }
            })

            .done(function () {

                alert("password changed");
            });
        }
    },

    destroy: function () {

        this.undelegateEvents();

        this.$el.removeData().unbind();
    },

    toggle: function (event) {

        var self = this;

        var target = $(event.currentTarget);

        var field = target.attr("toggle-description");

        //change from yes to no
        if (target.attr("ischecked") === "true") {

            sg.user.set(field, false);

            if (!sg.user.changedAttributes()) return false;

            sg.user.update({
                success: function () {

                    target.find(".toggle-slider").stop().animate({
                        "margin-left": "-60%"
                    }, 500);
                    target.attr("ischecked", "false");

                },
                error: function () {

                    //the call didn't work so set the value back to what it was
                    sg.user.set(field, true);
                }
            });

        }

        //change from no to yes
        else {

            sg.user.set(field, true);

            if (!sg.user.changedAttributes()) return false;

            sg.user.update({
                success: function () {

                    target.find(".toggle-slider").stop().animate({
                        "margin-left": "0"
                    }, 500);
                    target.attr("ischecked", "true");
                },
                error: function () {

                    //the call didn't work so set the value back to what it was
                    sg.user.set(field, false);
                }
            });

        }
    },

    confirm_deletion: function (e) {

        e.preventDefault();

        $("#confirm-dialog").dialog({
            resizable: false,
            height: 140,
            modal: true,
            buttons: {
                "Cancel": function () {
                    $(this).dialog("close");
                },
                "Delete": function () {
                    //we do this manually becuase jquery.validate appears
                    //to register ALL submit() calls from jquery
                    //document.getElementById("delete-form").submit();
                    //destroy user
                    $(this).dialog("close");
                }
            }
        });
    },

    render: function () {
        $(this.el).html(sg.render.settings());
    },

    initialize: function () {

        this.render();

        //set the color of the username text to the default one
        $('#username-text').css('color', $('body').css('color'));
        $('#email-text').css('color', $('body').css('color'));

        //go through and change all 'false' checkboxes
        $(".toggle").each(function () {

            if ($(this).attr("ischecked") === "false") {

                $(this).find(".toggle-slider").stop().animate({
                    "margin-left": "-60%"
                }, 500);
            }
        });

/*$("#theform").validate({

                submitHandler: sg.crypto.SettingsHashSubmitHandler,

                rules: {
                    username: {
                        minlength: 3,
                        maxlength: 25
                    },
                    email: {
                        email: true
                    },
                    confirm_email: {
                        email: true,
                        equalTo: "#email"
                    },
                    current_password: {
                        minlength: 6
                    },
                    new_password: {
                        minlength: 6,
                    },
                    confirm_new_password: {
                        minlength: 6,
                        equalTo: "#new_password"
                    }
                }
            });*/
    }

});