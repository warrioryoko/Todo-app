cal.prefix = "/api/v1/"

cal.Model = Backbone.Model.extend({

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


cal.ToDoModel = cal.Model.extend({
    urlRoot: cal.prefix + 'todo/'
});

cal.ToDoCollection = Backbone.Tastypie.Collection.extend({
    urlRoot: cal.prefix + 'todo/',
    model: cal.ToDoModel
});