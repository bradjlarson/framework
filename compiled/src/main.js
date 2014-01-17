me.add_helpers({
  'full_name' : function () { return db.visitor().full_name; },
});

Templates = {
  init : function(t, e, c) { var c = c || {}; var template = me.make_template('#' + t); me.render(e, template(c)); },
  add_template: function(t, e, c) { Templates[t] = function(c2) { var ctx = c2 || c; Templates.init(t, e, ctx); }; }
};

Alerts = function(a) {
  var alerts = {
    'example' : function() { 
        var text = "This is an example alert.";
        me.make_alert('info', text);
    },
  };
  alerts[a]();
};

db = {
    set: function(key, val) { db[key] = val; },
    get: function(key) { return db[key]; },
    current_date: function() { var d = new Date(); return d.toJSON().slice(0,d.toJSON().indexOf('T')); },
    current_time: function() { var d = new Date(); return d.toJSON(); },
    current_state: {},
    set_state: function(view, context) { 
        db['current_state'] = {view: view, context: context};
        Templates[view](context);
     }, 
    get_state: function() { return db['current_state']; },
    save_state: function() { me.setLocal('current_state', {view: view, context: context}, db['settings']); },
    load_state: function() {  
        var state = me.getLocal('current_state', db['settings']); 
        db.set_state.apply(undefined, _.values(state)); },
    refresh_state: function() {  db.set_state.apply(null, _.values(db.current_state)); },
    search: function(item, cond) { return _.where(db.get(item), cond); },
};

route = function route(i, context) {
        var routes = {
            'go' : function(rest) { db.set_state(rest, db.get(context)); },
            'show' : function(rest) { Templates.modals_collection(); $('#' + rest).modal('show'); },
            'alert' : function(rest) { Alerts(rest); },
        };
        if (!me.existy(context)) { context = {}; }
        var i = _.isFunction(i) ? i() : i;
        var command = extract('command', i);
        var rest = extract('rest', i);
        return routes[command](rest);
};

extract = function extract(info, str) {
    var methods = {
        'command' : function(str) { return str.slice(0, ((str.indexOf("_") != -1) ? str.indexOf("_") : str.length)); },
        'rest' : function(str) { return str.slice(str.indexOf("_")+1); }
    };
    return methods[info](str);
};
/*
load_data = function() {
    $.ajax({
        'url': 'xsell_base.json',
        'async': false, //you can do sync or async
        'success': function(data) { load_done(data); }
    });
};                

load_done = function(data) {
    db.set('rl_db', $.parseJSON(data));    
};
*/
$(document).ready(function() {
//    load_data();
    db.set_state('testing');
});
