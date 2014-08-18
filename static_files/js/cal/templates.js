this["templates"] = this["templates"] || {};
this["templates"]["creation_form"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<form class = "theform">\n<div class = "ui input">\n<input placeholder = "Add a title" type = "text" id = "title"></input>\n</div>\n<div class = "ui input">\n<input placeholder = "Add a description" type = "text" id = "description"></input>\n</div>\n<input type = "submit" class = "circular small ui blue button" value="Create a new to do"></input>\n\n</form>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["list_item"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '\n\n<div class = "ui segment todo_item" data-id="' + ((__t = (d.id)) == null ? '' : __t) + '">\n\n\t<div class = "ui top attached label title">Title:' + __e(d.title) + '</div>\n\t<div class = "description">Description:' + __e(d.description) + '</div>\n\t\n\t<div class = "delete small ui button">Delete</div>\n</div>\n\n\n';
    return __p
};

module.exports = this['templates'];


module.exports = this['templates'];