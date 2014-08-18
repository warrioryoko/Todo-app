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

cal.listView = Backbone.View.extend({

    el: "#content",

    events: {
        'click #load_more': 'load_more',
        'click .delete': 'delete_todo'
    },

    delete_todo: function (event) {

        var self = this;

        var modelId = $(event.currentTarget).parents(".todo_item").attr("data-id");
        var model = this.collection.findWhere({
            id: parseInt(modelId)
        });

        console.log(model);

        model.destroy()

        .done(function () {

            $(event.currentTarget).parents(".todo_item").remove();
        });

    },

    load_more: function () {

        var self = this;

        this.collection.fetchNext({
            'remove': false
        }, null)

        .done(function (returned_data) {

            self.collection.add(returned_data.objects);

            self.render(self.collection.models.length - returned_data.objects.length);

            var load = self.$el.find("#load_more").detach();
            load.appendTo("#content");
        });
    },


    render: function (index) {

        var self = this;

        index = index || 0;

        _.each(_.rest(this.collection.models, index), function (model) {

            self.$el.append(cal.templates['list_item']({

                'title': model.get("title"),
                'description': model.get("description"),
                'id': model.id

            }));
        });
    },

    initialize: function () {
        this.collection = new cal.ToDoCollection();
        this.collection.fetch({
            async: false
        }, null);
        console.log(this.collection);

        this.render();

        this.$el.append("<div id='load_more'>Load more</div>");
    }


});

cal.createView = Backbone.View.extend({

    el: "#content",

    events: {
        'submit .theform': 'submit'
    },

    render: function () {

        this.$el.html(cal.templates['creation_form']);
    },

    submit: function () {

        var model = new cal.ToDoModel({
            "title": this.$el.find("#title").val(),
            "description": this.$el.find("#description").val()
        });
        model.save(null)

        .done(function () {

            alert("created successfully!");

            this.render();
        });
    },

    initialize: function () {

        this.render();
    }
});