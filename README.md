###My JS "framework"

I work for a large financial institution, and recently discovered how to build websites using some existing infrastructure that I had access to. I had been teaching myself how to program for the past year and a half, and I had gotten pretty familiar with Javascript, HTML, CSS, Python, Bash, and Vim. When I discovered the ability to make websites at work, I immediately started try to build/implement a modern framework, to make life easier. 

I had used Meteor for a couple of projects previously, so I tried getting that up and running first. However I immediately ran into a couple of problems: 
1. I didn't have root or sudo access on the server
2. I didn't have admin privileges on my work issued Windows laptop
3. The frontend and backend server were VERY separate

So Meteor was out of the question because it would be a pain to install on my Winddows laptop (install failed due to no admin privileges), and because my backend couldn't communicate directly with my front end.

I had looked at Backbone.js a couple times before, but it just seemed like too much boilerplate. The examples seemed like a lot of code for stuff that I had thought was pretty simple to implement, so I never really played with it. Ember.js and Angular.js likewise felt a bit foreign to me.

So I decided to try and take the client side pieces of Meteor that I liked, and try to implement them on my own. At first, I looked into using Meteor as a stand alone client library, but that seemed like quite a bit of work. So then I just started adding the components I used regurlarly. I ended up with:

- jQuery.js
- Underscore.js
- Handlebars.js
- Twitter Bootstrap

along with a custom javascript library that tied everything together which I called me.js. 

After I made a few apps for work, I added a set of command line utilities, basic templates, and a default app structure and files. I also started customizing my Vim setup, to make things easier. 

As I continued working on ideas outside of work, I came to miss some of the features I had developed at work, so I decided to port them all to node.js so that I could use the same set of tools, and allow others to use/improve my work. Right now it's just setup to serve static files, but as I continue to dig into Node, I'll add additional features that allow it to be more dynamic. 

One of the features I like the most is a javascript function: 
```
	add_routes = function(e) {
	    $(e).find("[class*=route]").each(function() {
	        var classes = $(this).attr('class').split(' ');
	        var routes = _.filter(classes, function(c) { return (c.indexOf('route') != -1); });
	        var e = this;
	        _.each(routes, function(r) {
	            var opts = r.split('-');
	            var args = _.map(opts.slice(2), function(o) { return $(e).attr(o) || o; });
	            me.add_event(e, opts[1], function() { route.apply(undefined, args); }); 
	        });
	    });
	}
```
which pairs with these functions in main.js:
``` 
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
        return routes[command](rest, context);
};
extract = function extract(info, str) {
    var methods = {
        'command' : function(str) { return str.slice(0, ((str.indexOf("_") != -1) ? str.indexOf("_") : str.length)); },
        'rest' : function(str) { return str.slice(str.indexOf("_")+1); }
    };
    return methods[info](str);
};
```
The "add_routes" function is called everytime is a template is rendered (that function passes the element that the template is being rendered to). It then searches the HTML produced by that template, looking for any classes that start with route. It then processes the "route" classes, which compile to javascript. 

For example:
```    <button class="route-click-id" id="alert_Clicked">Click Me!</button> ```
Compiles to:
```    $('#alert_Clicked').click(function() { route['alert']('Clicked'); }); ```

This allows me to direct all events to the route function for processing, event handlers are automatically applied whenever a template is rendered, and I rarely have to actually write any event handlers. 

You can also pass additional arguments to the route function, like so:
```    <input type="email" id="submit_email" value="brad.larson@capitalone.com" class="route-change-id-value"> ```
which is equivalent to:
```    $('#submit_email').change(function() { route['submit']('email', $(this).prop("value")); }); ```

A couple other notes:
- I've included templates for basic bootstrap elements, which can be added by typing :Add template_name in Vim
- More to come!


