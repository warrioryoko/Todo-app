this["templates"] = this["templates"] || {};
this["templates"]["banner"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div class="banner" data-banner="' + ((__t = (d.id)) == null ? '' : __t) + '">\n\n    <div class="button close">\n        <span class="ui-icon ui-icon-circle-close"></span>\n    </div>\n\n    <div class="text">\n        ' + __e(d.text) + '\n    </div>\n\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card">\n    <div class="inner">\n        ' + ((__t = (d.content)) == null ? '' : __t) + '\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_comparison"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="card card_comparison">\n    <div class="inner">\n\n        <div class="header">\n\n            <div class="category_image">\n                <img src="https://s3.amazonaws.com/static.samegrain.com/img/categories/' + ((__t = (d.category.get('name').toLowerCase())) == null ? '' : __t) + '.png">\n            </div>\n\n            <div class="name">\n                ' + ((__t = (d.category.get('name'))) == null ? '' : __t) + '\n            </div>\n\n        </div>\n\n        <div class="comparison">\n            <div class="comparison-text">\n\n                ';
    _.each(d.comparison.models, function (model) {;
        __p += '\n                    \n                    ';
        _.each(model.get('shared_answers'), function (answer) {;
            __p += '\n                    \n                        <span class="common-grain">\n                            <b>\n                            ';
            if (!d.first) {;
                __p += '\n                                -\n                            ';
            }
            d.first = false;;
            __p += '\n                            </b>\n                            \n                            ' + ((__t = (answer.text)) == null ? '' : __t) + '\n                        </span>\n\n                    ';
        });;
        __p += '\n                \n                ';
    });;
    __p += '\n\n            </div>\n        </div>\n\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_conversation"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card card_conversation"">\n    <div class="inner">\n\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n\n        <div class="conversation">\n            \n            '; /*This outer div makes the scrolling work*/
    ;
    __p += '\n            <div>\n                <div class="ui comments messages scroller">\n\n                    ';
    if (!d.loaded_all_messages) {;
        __p += '\n                        <div class="load_more" style="background-color: rgb(159, 195, 37); color: white;">Load more messages</div>\n                    ';
    };
    __p += '\n\n                    ';
    _.each(d.messages, function (m) {;
        __p += '\n                           ' + ((__t = (m)) == null ? '' : __t) + '\n                    ';
    });;
    __p += '    \n                    \n                </div>\n            </div>\n            \n            <div class="add_to_thread">\n\n                <img class="leaf-border" src="' + ((__t = (d.user_image)) == null ? '' : __t) + '">\n\n                <textarea class="msg" maxlength="1000" placeholder="Post a message..." rows="2" onKeyPress="return sg.checkSubmit(this, event)"></textarea>\n\n            </div>\n\n        </div>\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_match"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card card_match">\n    <div class="inner">\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_mulch"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card">\n    <div class="inner">\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_plant"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card card_plant">\n    <div class="inner">\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card card_question ' + ((__t = (d.qtype)) == null ? '' : __t) + ' ' + ((__t = (d.answered)) == null ? '' : __t) + '" data-disappear="' + ((__t = (d.disappear)) == null ? '' : __t) + '">\n        <div class="inner">\n            <div class="tile">\n                <div class="grains-tile">\n                    <div class="prompt">\n                        ';
    if (d.prompt) {;
        __p += '\n                            ' + ((__t = (d.prompt)) == null ? '' : __t) + '\n                        ';
    } else {;
        __p += '\n                            Select phrases which describe or relate to you.\n                        ';
    };
    __p += ' \n                    </div>\n                    <div class="question">\n                        ' + ((__t = (d.card)) == null ? '' : __t) + '\n                    </div>\n                    <center>\n                        ';
    if (d.skipButton) {;
        __p += '\n                            <div class="submit skip">\n                                Skip\n                            </div>\n                        ';
    };
    __p += '\n                    </center>\n                </div>\n            </div>\n        </div>\n    </div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["card_vinepost"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div id="' + ((__t = (d.id)) == null ? '' : __t) + '" class="card card_vine"">\n    <div class="inner">\n\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n\n        <div class="vinepost">\n\n            <div class="vp">\n\n                <span class="timestamp" id="vp-timestamp">\n                    ' + __e(d.how_long_ago) + '\n                </span>\n\n                <div class="message">\n                    ' + __e(d.body) + '\n                </div>\n\n                ';
    if (d.own_vp) {;
        __p += '\n \n                    <div class="sgactions">\n\n                        <a class="edit">Edit</a>\n                        <a class="delete">Delete</a>\n                    \n                    </div>\n                \n                ';
    };
    __p += '\n\n            </div>\n\n            '; /*This outer div makes the scrolling work*/
    ;
    __p += '\n            <div>\n                <div class="ui comments scroller">\n                    \n                    ';
    if (!d.loaded_all_comments) {;
        __p += '\n                        <div class="load_more" style="background-color: rgb(159, 195, 37); color: white;">Load more comments</div>\n                    ';
    };
    __p += '\n\n                    ';
    _.each(d.comments, function (c) {;
        __p += '\n                           ' + ((__t = (c)) == null ? '' : __t) + '\n                    ';
    });;
    __p += '\n\n                </div>\n            </div>\n\n            <div class="add_to_thread">\n\n                <img class="leaf-border" src="' + ((__t = (d.user_image)) == null ? '' : __t) + '">\n\n                <textarea class="msg" maxlength="1000" placeholder="Post a comment..." rows="2" onKeyPress="return sg.checkSubmit(this, event)"></textarea>\n\n            </div>\n           \n        </div>\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["categories"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="categories">\n\n    <div class="category-column">\n        <div class="category_cards"></div>\n        <div class="category-list">\n            ';
    _.each(d.models, function (category) {

        //get the 'category' object from the categoryconfiguration object
        category = category.get("category");

        //get the categoryconfiguration resource for its regular 'category'
        //object id
        var resource_uri = sg.categories.resource_from_category_id(category.id);

        ;
        __p += '\n\n                <div class="category card progress" category-resource="' + ((__t = (resource_uri)) == null ? '' : __t) + '">\n                    <div class="inner">\n                        <div class="selectable">\n                            <div class="image">\n                                <img src="https://s3.amazonaws.com/static.samegrain.com/img/categories/' + ((__t = (category.name.toLowerCase())) == null ? '' : __t) + '.png">\n                            </div>\n                            <div class="category-name">\n                                <b>' + ((__t = (category.name)) == null ? '' : __t) + '</b>\n                            </div>\n                        </div>\n                        <div class="updown">\n                            <img src="https://s3.amazonaws.com/static.samegrain.com/img/categories/sortable.png">\n                        </div>\n                    </div>\n                </div>\n            ';
    });;
    __p += '\n        </div>\n    </div>\n\n</div>\n\n<div id="cards" class="question-cards"></div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["console"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }

/*
Renders the user console view, with picture above, match score, name, and
buttons underneath.

Score is the match score to the other user.

Disable is a list of buttons which should be disabled.

Context variables:
is_me, user, disable: [], auto_accept_plant: false, size: 'large',
camera: false
*/
    ;
    __p += '\n\n<div class="console ' + ((__t = (d.size)) == null ? '' : __t) + '"\ndata-username="' + __e(d.user.username) + '"\ndata-id="' + ((__t = (d.user.id)) == null ? '' : __t) + '">\n\n<div class="console-crop ' + ((__t = (d.size)) == null ? '' : __t) + '">\n    <img src="' + ((__t = (d.user.image)) == null ? '' : __t) + '"/>\n\n    <div class="comparison">\n        <div class="comparison-text">\n            ';
    if (d.user.shared_answers.length > 0) {;
        __p += '\n                <span class="common-grain">\n                    ' + ((__t = (d.user.shared_answers[0].text)) == null ? '' : __t) + '\n                </span>\n                ';
        _.each(_.rest(d.user.shared_answers, 1), function (answer) {;
            __p += '\n                    <span class="common-grain">\n                        <b>-</b> ' + ((__t = (answer.text)) == null ? '' : __t) + '\n                    </span>\n                ';
        });;
        __p += '\n            ';
    };
    __p += '\n        </div>\n    </div>\n\n<div class="console-buttons ' + ((__t = (d.size)) == null ? '' : __t) + '">\n\n';
    if (!d.is_me) {
        _.each(d.items, function (e) {
            capitalized = e.charAt(0).toUpperCase() + e.slice(1, e.length);;
            __p += '\n\n    <div style="cursor: pointer" class="' + ((__t = (e)) == null ? '' : __t) + '-button" data-other-username="' + __e(d.user.username) + '" data-other-user-id="' + ((__t = (d.user.id)) == null ? '' : __t) + '" data-auto-accept="' + ((__t = (d.auto_accept_plant)) == null ? '' : __t) + '">\n\n        <div class="console-button ' + ((__t = (d.size)) == null ? '' : __t) + ' console-button-' + ((__t = (e)) == null ? '' : __t) + ' enabled" data-action="' + ((__t = (e)) == null ? '' : __t) + '" title="' + __e(capitalized) + ' ' + __e(d.user.username) + '">\n\n            <div class="slider-parent"><!--\n                --><img class = "slider-image" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-' + ((__t = (e)) == null ? '' : __t) + '_s6.png"/><!--\n            --></div><!--\n            --><img class="main-image" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-' + ((__t = (e)) == null ? '' : __t) + '_s1.png"/>\n\n        </div>\n\n        <div class="' + ((__t = (e)) == null ? '' : __t) + '-images" style="display: none">\n            <img class="s1" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-' + ((__t = (e)) == null ? '' : __t) + '_s1.png"/>\n            <img class="s5" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-' + ((__t = (e)) == null ? '' : __t) + '_s5.png"/>\n            <img class="s6" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-' + ((__t = (e)) == null ? '' : __t) + '_s6.png"/>\n        </div>\n\n    </div>\n';
        });
    };
    __p += '\n\n';
    if ((d.is_me) && (d.camera)) {;
        __p += '\n\n    <div class = "console-button ' + ((__t = (d.size)) == null ? '' : __t) + ' console-button-camera enabled camera-button" style="visibility: visible; cursor: pointer; overflow: visible;">\n        <div class = "slider-parent"></div>\n        <img class = "main-image" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-camera_s1.png"/>\n    </div>\n\n    <div class="camera-images" style="display: none">\n            <img class="s1" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-camera_s1.png"/>\n            <img class="s5" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-camera_s5.png"/>\n            <img class="s6" alt="" src="https://s3.amazonaws.com/static.samegrain.com/img/newconsole/icon-camera_s6.png"/>\n    </div>\n\n';
    };
    __p += '\n\n<div style="clear: left;"></div>\n\n    </div> <!-- End of console-buttons -->\n</div> <!-- End of console-crop -->\n<div class="console-score ' + ((__t = (d.size)) == null ? '' : __t) + '">\n\n    <div class="ui green progress" style="display: block;">\n        <div class="bar" style="width: ' + ((__t = (d.score)) == null ? '' : __t) + '%;"></div>\n    </div>\n\n    ';
    if (!d.is_me) {;
        __p += '\n            <a class="username profile_link" href="#profile/' + ((__t = (d.user.id)) == null ? '' : __t) + '">\n    ';
    }
    else {;
        __p += '\n            <a class="username profile_link" href="#myprofile">\n    ';
    };
    __p += '\n\n        <div>' + __e(d.user.username) + '</div>\n\n    </a>\n\n</div>\n<div style="clear: left;"></div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["edit_area_input"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div class="ui buttons edit_area">\n\n    <input class="edit_input"/>\n\n    <div class="cancelsave">\n        <div class="tiny ui button edit_button" action="cancel">Cancel</div>\n        <div class="or"></div>\n        <div class="tiny ui positive button edit_button" action="save">Save</div>\n    </div>\n\n</div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["edit_area_textarea"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div class="ui buttons edit_area">\n\n    <textarea class="edit_input"></textarea>\n\n    <div class="cancelsave">\n        <div class="tiny ui button edit_button" action="cancel">Cancel</div>\n        <div class="or"></div>\n        <div class="tiny ui positive button edit_button" action="save">Save</div>\n    </div>\n\n</div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["grain_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <center>\n        <div class="grains">\n\n\t\t';
    _.each(d.possible_answers, function (possible_answer) {

        if (_.contains(d.answers, possible_answer.id)) d.addclass = "grain-bold";
        else d.addclass = "";;
        __p += '\n                \n           <span class="' + __e(d.addclass) + ' grain" answer-id="' + ((__t = (possible_answer.id)) == null ? '' : __t) + '"\n                 possible_answer="' + __e(possible_answer.resource_uri) + '">\n               <img src="https://s3.amazonaws.com/static.samegrain.com/img/haker2/icon-sm_leaf.png" width="8"/>\n               ' + __e(possible_answer.text) + '\n           </span>\n        ';
    });;
    __p += '\n        </div>\n    </center>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["image_scroll_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div class=\'left-arrow\'>\n        <img src=\'https://s3.amazonaws.com/static.samegrain.com/img/misc/arrow_left_alpha.png\'>\n    </div>\n    <div class=\'viewport\'>\n    <div class=\'choices\'>\n        ';
    _.each(d.grains, function (grain) {

        d.text = grain[0];
        d.image = grain[1];

        if (_.contains(selected, d.text)) d.checked = 'selected';
        else d.checked = '';;
        __p += '\n            <div class=\'choice ' + ((__t = (d.checked)) == null ? '' : __t) + '\' data-option="' + ((__t = (base64.encode(d.text).trim())) == null ? '' : __t) + '">\n                <div class=\'image\'>\n                    <img src=\'https://s3.amazonaws.com/static.samegrain.com/img/questions/' + ((__t = (d.image)) == null ? '' : __t) + '\'/>\n                </div>\n                <div class=\'text\'>\n                    ' + ((__t = (d.text)) == null ? '' : __t) + '\n                </div>\n            </div>\n        ';
    });;
    __p += '\n    </div>\n    </div>\n    <div class=\'right-arrow\'>\n        <img src=\'https://s3.amazonaws.com/static.samegrain.com/img/misc/arrow_right_alpha.png\'>\n    </div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["image_selection_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div class=\'choices\'>\n        ';
    _.each(d.grains, function (grain) {

        d.text = grain[0];
        d.image = grain[1];

        if (_.contains(d.selected, d.text)) d.checked = 'selected';
        else d.checked = '';;
        __p += '\n            <div class=\'choice ' + ((__t = (d.checked)) == null ? '' : __t) + '\' data-option="' + ((__t = (base64.encode(d.text).trim())) == null ? '' : __t) + '">\n                <div class=\'image\'>\n                    <img src=\'https://s3.amazonaws.com/static.samegrain.com/img/questions/' + ((__t = (d.image)) == null ? '' : __t) + '\'/>\n                </div>\n                <div class=\'text\'>\n                    ' + ((__t = (d.text)) == null ? '' : __t) + '\n                </div>\n            </div>\n        ';
    });;
    __p += '\n    </div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["load_more"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="load_more_content" class="left attached ui black huge launch button">\n\n    <i class="left icon"></i>\n\n    <span class="text" style="display: none;">\n        Load more\n    </span>\n\n</div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["message_div"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="comment message" message-id="' + ((__t = (d.id)) == null ? '' : __t) + '">\n    \n    <a class="avatar">\n        <img src="' + ((__t = (d.user['thumbnail'])) == null ? '' : __t) + '">\n    </a>\n    \n    <div class="content">\n\n        <a class="author">\n            ' + __e(d.user['username']) + '\n        </a>\n        \n        <div class="metadata">\n            <span class="date">' + ((__t = (d.how_long_ago)) == null ? '' : __t) + '</span>\n        </div>\n    \n        <div class="text">\n            ' + __e(d.body) + '\n        </div>\n    \n        ';
    if (d.own) {;
        __p += '\n\n            <div class="actions">\n                <a class="delete">Delete</a>                \n            </div>\n\n        ';
    };
    __p += '\n    \n    </div>\n\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["multiple_selection_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div class=\'choices\'>\n        ';
    _.each(d.grains, function (grain) {

        if (_.contains(grain, d.selected)) d.checked = ' checked';
        else d.checked = '';;
        __p += '\n            <input type="checkbox" name="' + ((__t = (d.group)) == null ? '' : __t) + '" value="' + ((__t = (base64.encode(grain).trim())) == null ? '' : __t) + '" ' + ((__t = (d.checked)) == null ? '' : __t) + '>\n            ' + ((__t = (grain)) == null ? '' : __t) + '\n            <br/>\n        ';
    });;
    __p += '\n    </div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["my_profile"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="card card_profile">\n\n    <div class="inner">\n\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n\n        <div>\n\n            <div id="goal_div" class="info">\n\n                <div class="title">SameGrain Goals</div>\n\n                <div class="info_box">\n\n                    <div class="info_text">\n                        <div id="goals_text">' + __e(d.goals) + '</div>\n                        <img class="edit_button" data-target="#goal_div" src="https://s3.amazonaws.com/static.samegrain.com/img/misc/edit.png"/>\n                    </div>\n\n                    <div class=\'edit\'>\n                        <textarea id="goals" placeholder="Enter your SameGrain goals" name="goals" maxlength="140"></textarea>\n\n                        <input value="Cancel" class="button_base cancel_button no-select" data-target="#goal_div"></input>\n                    </div>\n\n                </div>\n\n            </div>\n\n            <div id="about_div" class="info">\n\n                <div class="title">About Me</div>\n\n                <div class="info_box">\n\n                    <div class="info_text">\n                        <div id="about_me_text">' + __e(d.about_me) + '</div>\n                        <img class="edit_button" data-target="#about_div" src="https://s3.amazonaws.com/static.samegrain.com/img/misc/edit.png"/>\n                    </div>\n\n                    <div class=\'edit\'>\n                        <textarea id="about_me" placeholder="This space allows you to write a little more about yourself." name="about_me" maxlength="140"></textarea>\n\n                        <input value="Cancel" class="button_base cancel_button no-select" data-target="#about_div"></input>\n                    </div>\n\n                </div>\n\n            </div>\n\n            ';
/*<div id="bday_div" class="info">

                <div class="title">Birthday</div>

                <div class="info_box">

                    <div class="info_text">
                        ${(profile_form.birthdate(style="display:none"))}

            			<div id="when"><p>When were you born?</p></div>

						<div id="selectors">
						    <select id="month">
						        %for month in profile_form.dates[0]:
						            <option value="${loop.index+1}">${month}</option>
						        %endfor
						    </select>

						    <select id="day">
						        %for day in profile_form.dates[1]:
						            <option value="${day}">${day}</option>
						        %endfor
						        </select>

						    <select id="year">
						        %for year in profile_form.dates[2]:
						            <option value="${year}">${year}</option>
						        %endfor
						    </select>
						</div>

                        <input id="date_cancel" value="Cancel" class="button_base cancel_button no-select" onclick="reset_date()"></input>
                    </div>
                </div>
            </div>*/
    ;
    __p += '\n\n            <input id="submit_button" class="button_base save_button no-select" type="submit" value="Submit" name="submit_button"></input>\n\n        </div>\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["other_profile"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div class="card card_profile card_other_profile">\n\n    <div class="inner">\n\n        ' + ((__t = (d.console)) == null ? '' : __t) + '\n\n        <div id="goal_div" class="info">\n\n            <div class="title">SameGrain Goals</div>\n\n            <div class="info_box">\n\n                <div class="info_text">\n                    <div>' + __e(d.goals) + '</div>\n\n                </div>\n            </div>\n        </div>\n\n        <div id="about_div" class="info">\n\n            <div class="title">About Me</div>\n\n            <div class="info_box">\n\n                <div class="info_text">\n                    <div>' + __e(d.about_me) + '</div>\n                </div>\n\n            </div>\n        </div>\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["profile_page"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="profile">\n\n<div id="bluebar">\n\n    <div id="bar_content">\n        <div id="blue_text">' + ((__t = (d.bluebar_title)) == null ? '' : __t) + '</div>\n        '; /*<div class="arrow"></div>*/
    ;
    __p += '\n    </div>\n\n    ';
/*<div id="profile_dropdown">
        <div><a href="">Grains</a></div>
        <div><a href="">Posts</a></div>
    </div>*/
    ;
    __p += '\n\n</div>\n\n    <div class="profile-card">\n        ' + ((__t = (d.profile_card)) == null ? '' : __t) + '\n    </div>\n\n</div>\n\n<div id="cards" class="profile-cards"></div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["profile_pic"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }

/* Progress bar

<script type="text/javascript">

    $('#fileupload input').bind('change', function() {
        if ( this.files[0].size/1024/1024 > 1.0) {
            alert('too large');
            document.getElementById("fileupload").reset();
        }
    });

    $('#fileupload').uploadProgress({

        // function called each time bar is updated
        uploading: function(upload) {$('#percents').html(upload.percents+'%');},

        // selector or element that will be updated
        progressBar: "#progressbar",

        // progress reports url
        progressUrl: "/progress",

        // how often will bar be updated
        interval: 1500
    });

    </script>

    .bar {
        width: 300px;
    }
  
    #progress {
        background: #eee;
        border: 1px solid #222;
        margin-top: 20px;
    }

    #progressbar {
        width: 0px;
        height: 24px;
        background: #333;
    }

<div id="uploading">
  <div id="progress" class="bar">
    <div id="progressbar"> </div>
    <div id="percents"></div>
  </div>
</div>

*/
    ;
    __p += '\n\n<div class="profile_pic"> \n    <div id="container">\n\n        <h4 style="margin-left: 2%">Upload your profile picture here</h4>\n        <br/>\n\n        <form id="upload" action="/upload_profile_picture" method="post" enctype="multipart/form-data">\n\n            <input id="image" type="file" name="image"></input>\n            <input id="submit_button" type="submit" value="Upload" name="submit_button"></input>\n\n        </form>\n\n        <div class="croptool">\n            <h4>Crop your picture</h4>\n\n            <div class="image">\n            </div>\n\n            <div class="save-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" aria-disabled="false">\n                <span class="ui-button-text">\n                    Save\n                </span>\n            </div>\n\n        </div>\n    </div>\n</div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["radio_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div class=\'radiobuttons\'>\n        ';
    _.each(d.grains, function (grain) {

        if (_.contains(grain, d.selected)) d.checked = ' checked';
        else d.checked = '';;
        __p += '\n            <input type="radio" name="' + ((__t = (d.group)) == null ? '' : __t) + '" value="' + ((__t = (base64.encode(grain).trim())) == null ? '' : __t) + '" ' + ((__t = (d.checked)) == null ? '' : __t) + '>\n            ' + ((__t = (grain)) == null ? '' : __t) + '\n            <br/>\n        ';
    });;
    __p += '\n    </div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["settings"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<style type="text/css">\n\n#container {\n\n    margin: 15px;\n    min-width: 700px;\n    max-width: 700px;\n    width: 700px;\n    height: 525px;\n    border-radius: 10px;\n    border: 5px solid #d4d5cd;\n    background-color: white;\n}\n\n.left {\n    float: left;\n}\n.right {\n    float: right;\n}\n\n#left-tab {\n\n    background-color: #deeff6;\n    margin: 1.5%;\n    width: 48%;\n    height: 95%;\n    border-radius: 3%;\n    float: left;\n}\n\n#right-tab {\n\n    width: 49%;\n    height: 95%;\n    margin-top: 4%;\n    float: right;\n}\n\n\n#settingsform {\n\n    margin-top: 5%;\n    margin-left: 5%;\n}\n\n#new-password {\n    margin-top: 3%;\n}\n\n.text-input {\n    width: 90%;\n}\n\n.second-form {\n    margin-top: 2%;\n}\n\n.small {\n\n    margin-top: 2%;\n    margin-bottom: 2%;\n}\n\n.large-text {\n\n    font-size: large;\n    margin-bottom: 3%;\n}\n\n.medium-text {\n    font-size: medium;\n}\n.small-text {\n    font-size: 95%;\n}\n.blue-text {\n    color: #2c5362;\n}\n.red-text {\n    color: #fb432b;\n}\n.white-text {\n    color: white;\n}\n.orange-text {\n    color: #e36d09;\n}\n.orange-background {\n    background-color: #e36d09;\n}\n.italic {\n    font-style: italic;\n}\na {\n    text-decoration: none;\n}\na:visited {\n    text-decoration: none;\n}\n\n\n#username-text {\n\n    width: 62%;\n    height: 15px;\n    float: right;\n    margin-right: 8%;\n}\n\n#email-text {\n\n    width: 74%;\n    height: 15px;\n    overflow: auto;\n    float: right;\n    margin-right: 8%;\n}\n\n\n#horiz {\n\n    height: 100px;\n    margin-top: 10%;\n}\n\n#delete {\n\n    margin-left: -3%;\n    border: none;\n    background: none;\n    cursor: pointer;\n    font-size: 110%;\n}\n\n#update {\n\n    width: 17%;\n    height: 20%;\n    margin-right: 8%;\n    color: white;\n    text-align: center;\n    border-radius: 5px;\n    float: right;\n    cursor: pointer;\n    border: 0;\n}\n\n#notification-toggles {\n\n    margin-left: 8%;\n    margin-right: 10%;\n    height: 100%;\n}\n\n.notification-description {\n\n    margin-top: 5%;\n    margin-bottom: 7%;\n    line-height: 125%;\n}\n\n.toggle-description {\n\n    margin-top: 3%;\n    margin-right: 10%;\n    height: 8%;\n}\n\n.toggle-checkbox {\n\n    display: none;\n}\n\n.toggle {\n\n    width: 18%;\n    color: white;\n    border-radius: 8px;\n    height: 50%;\n    cursor: pointer;\n    overflow: hidden;\n    float: right;\n}\n\n.toggle-slider {\n\n    width: 200%;\n}\n\n.toggle-text-yes {\n\n    margin-top: 3%;\n    margin-left: 4%;\n    margin-right: 2%;\n    float: left;\n}\n\n.toggle-text-no {\n\n    margin-top: 3%;\n    margin-right: 5%;\n    float: left;\n}\n\n.toggle-circle {\n\n    margin-right: 5%;\n    margin-left: 3%;\n    margin-top: 4%;\n    width: 10px;\n    height: 10px;\n    border: 1px solid white;\n    border-radius: 50%;\n    background-color: white;\n    float: left;\n}\n\n</style>\n</head>\n<body>\n\n<div id="container">\n\n<div id="left-tab">\n\n    <form id="settingsform">\n\n        <label>\n            <p class="large-text blue-text">Username: \n                <span class="medium-text" id="username-text">' + __e(d.username) + '</span>\n            </p>\n            <p class="small small-text red-text italic">Select an anonymous name to protect your identity.</p>\n\n        </label>\n\n        <input id="username" class="text-input" type="text" value="" placeholder="Change User Name" name="username"></input>\n\n\n        <label>\n            <p class="large-text blue-text">Email:\n                <span class="medium-text" id="email-text">' + __e(d.email) + '</span>\n            </p>\n            <p class="small small-text red-text italic">Email addresses are never shown or shared by SameGrain.</p>\n\n        </label>\n\n        <input id="email" class="text-input" type="text" value="" placeholder="Change email address" name="email"></input>\n        <input id="confirm_email" class="text-input second-form" type="text" value="" placeholder="Confirm email address" name="confirm_email"></input>\n\n        <p class="large-text blue-text">Change Password</p>  \n\n        <label>\n            <div><!--Current Password--></div>\n        </label>\n        <input id="current_password" class="text-input" type="password" value="" placeholder="Current Password" name="current_password"></input>\n\n        <label>\n            <div id="new-password"><!--New Password--></div>\n        </label>\n\n        <input id="new_password" class="text-input" type="password" value="" placeholder="New Password" name="new_password"></input>\n        <input id="confirm_new_password" class="text-input second-form" type="password" value="" placeholder="Confirm New Password" name="confirm_new_password"></input>\n\n        <div id="horiz">\n\n        <input id="update" class="orange-background white-text small-text" type="submit" value="Update" name="submit_button"></input>\n\n    </form>\n\n    <form id="delete-form">\n        <input id="delete" class="orange-text" type="submit" value="Delete My Account" name="submit_button"></input>\n    </form>\n\n        </div>\n</div>\n\n\n\n<div id="right-tab">\n\n<div id="notification-toggles">\n\n    <div class="large-text blue-text">Notifications</div>\n\n    <div class="medium-text notification-description">\n        Selecting "Yes" will send you a notification email when one of the following occurs:\n    </div>\n\n    <div class="toggle-description">\n        New Matches\n        <div class="toggle orange-background no-select-children" toggle-description="match_notifications" ischecked="' + __e(d.match_notifications) + '">\n            <div class="toggle-slider">\n                <div class="toggle-text-yes">YES</div>\n                <div class="toggle-circle"></div>\n                <div class="toggle-text-no">NO</div>\n            </div>\n\n        </div>\n    </div>\n\n    <div class="toggle-description">\n        New Private Messages\n        <div class="toggle orange-background no-select-children" toggle-description="message_notifications" ischecked="' + __e(d.message_notifications) + '">\n            <div class="toggle-slider">\n                <div class="toggle-text-yes">YES</div>\n                <div class="toggle-circle"></div>\n                <div class="toggle-text-no">NO</div>\n            </div>\n\n        </div>\n    </div>\n\n    <div class="toggle-description">\n        New Plant Requests\n        <div class="toggle orange-background no-select-children" toggle-description="plant_request_notifications" ischecked="' + __e(d.plant_request_notifications) + '">\n            <div class="toggle-slider">\n                <div class="toggle-text-yes">YES</div>\n                <div class="toggle-circle"></div>\n                <div class="toggle-text-no">NO</div>\n            </div>\n\n        </div>\n    </div>\n    \n    <div class="toggle-description">\n        Plant Request Accepted\n        <div class="toggle orange-background no-select-children" toggle-description="accepted_plant_request_notifications" ischecked="' + __e(d.accepted_plant_request_notifications) + '">\n            <div class="toggle-slider">\n                <div class="toggle-text-yes">YES</div>\n                <div class="toggle-circle"></div>\n                <div class="toggle-text-no">NO</div>\n            </div>\n\n        </div>\n    </div>\n    \n    <div class="toggle-description">\n        Share Location\n        <div class="toggle orange-background no-select-children" toggle-description="share_location" ischecked="' + __e(d.share_location) + '">\n            <div class="toggle-slider">\n                <div class="toggle-text-yes">YES</div>\n                <div class="toggle-circle"></div>\n                <div class="toggle-text-no">NO</div>\n            </div>\n\n        </div>\n    </div>\n\n\n';
/*
    <div class="toggle-description">
        Accepted Plant Requests
        <div class="toggle orange-background no-select-children" toggle-description="plants" ischecked="{{d.notifications['plants']}}">
            <div class="toggle-slider">
                <div class="toggle-text-yes">YES</div>
                <div class="toggle-circle"></div>
                <div class="toggle-text-no">NO</div>
            </div>

        </div>
    </div>

    <div class="toggle-description">
        New comments on your posts 
        <div class="toggle orange-background no-select-children" toggle-description="comments_after_post" ischecked="{{d.notifications['comments_after_post']}}">
            <div class="toggle-slider">
                <div class="toggle-text-yes">YES</div>
                <div class="toggle-circle"></div>
                <div class="toggle-text-no">NO</div>
            </div>

        </div>
    </div>

    <div class="toggle-description">
        New comments on a post you have commented on 
        <div class="toggle orange-background no-select-children" toggle-description="comments_after_comment" ischecked="${notifications['comments_after_comment']}">
            <div class="toggle-slider">
                <div class="toggle-text-yes">YES</div>
                <div class="toggle-circle"></div>
                <div class="toggle-text-no">NO</div>
            </div>

        </div>
    </div>


    <p class="large-text blue-text">Facebook</p>
        Share information on Timeline
    </div>

    <p class="large-text blue-text">Location</p>
        Display Location
   </div>

    </div>
*/
    ;
    __p += '\n</div>\n\n</div>\n\n</div>\n\n<div id="confirm-dialog" style="display: none" title="Confirm">\nAre you sure you want to delete your account?\n</div>\n\n</body>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["text_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<p>\n    ';
    if (d.current) {;
        __p += '\n        <input class="textinput" value="' + ((__t = (d.current)) == null ? '' : __t) + '"/>\n    ';
    } else {;
        __p += '\n        <input class="textinput"/>\n    ';
    };
    __p += '\n</p>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["topbar_selector"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }

    _.each(d, function (link) {;
        __p += '\n\n  <a href="' + __e(link.url) + '" class="ui green button">' + __e(link.text) + '</a>\n\n';
    });;
    __p += '\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["tutorial"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="tutorial">\n    <div class="cards">\n        <div class="column"></div>\n    </div>\n\n    <div class="tutorial-column">\n        <div class="tutorial-panel">\n\n            <div id="tutorial-image">\n                <div id="slide_sprite" class="s1"></div>\n\n                <div id="next-div"></div>\n                ';
    _.each(_.range(1, d.totalSteps + 1), function (i) {;
        __p += '\n                    <div class="circle-div" id="circle-' + ((__t = (i)) == null ? '' : __t) + '" data-step="' + ((__t = (i)) == null ? '' : __t) + '"></div>\n                ';
    });;
    __p += '\n            </div>\n        </div>\n\n        <div class="tutorial-aux">\n            <div id="aux_sprite"></div>\n        </div>\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["vertical_slider_question"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '    <div class=\'sliderdiv\'>\n        <div class=\'slider\' style=\'height: ' + ((__t = (d.height)) == null ? '' : __t) + 'px\' data-position=\'' + ((__t = (d.position)) == null ? '' : __t) + '\'>\n        </div>\n    </div>\n    <div class=\'choices\' style=\'margin-top: ' + ((__t = (d.step / 3)) == null ? '' : __t) + 'px\'>\n        ';
    _.each(d.grains, function (grain) {;
        __p += '\n            <div class=\'choice\' style=\'height: ' + ((__t = (d.step)) == null ? '' : __t) + 'px\'>\n                ' + ((__t = (grain)) == null ? '' : __t) + '\n            </div>\n        ';
    });;
    __p += '\n    </div>\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["vinepost_comment"] = function (d) {
    var __t, __p = '',
        __e = _.escape,
        __j = Array.prototype.join;

    function print() {
        __p += __j.call(arguments, '')
    }
    __p += '<div class="comment" comment-id="' + ((__t = (d.id)) == null ? '' : __t) + '">\n\n    <a class="avatar">\n        <img src="' + ((__t = (d.user['thumbnail'])) == null ? '' : __t) + '">\n    </a>\n\n    <div class="content">\n\n        <a class="author">\n            ' + __e(d.user['username']) + '\n        </a>\n\n        <div class="metadata">\n            <span class="date">' + ((__t = (d.how_long_ago)) == null ? '' : __t) + '</span>\n        </div>\n\n        <div class="text">\n            ' + __e(d.body) + '\n        </div>\n\n        <div class="actions">\n\n            ';
    if (d.own_comment) {;
        __p += '\n\n                <a class="edit-comment">Edit</a>\n                <a class="delete-comment">Delete</a>\n\n            ';
    } else if (d.own_vp) {;
        __p += '\n            \n                <a class="delete-comment">Delete</a>\n            \n            ';
    };
    __p += '\n\n        </div>\n\n    </div>\n</div>\n\n';
    return __p
};;

this["templates"] = this["templates"] || {};
this["templates"]["vinepost_form"] = function (d) {
    var __t, __p = '',
        __e = _.escape;
    __p += '<div id="post_to_vine" class="ui piled segment">\n\n    <div class="ui red ribbon label">Create a new post</div>\n\n    <textarea id="vine_message" rows="2" placeholder="Share thoughts with your plants" cols="30"></textarea>\n\n    <div id="vine_submit" class="ui mini purple button">Submit</div>\n\n</div>\n';
    return __p
};

module.exports = this['templates'];