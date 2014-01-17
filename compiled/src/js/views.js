Templates['testing'] = function() {
    Templates.init('testing', '#app_content');
};
me.add_helpers({
    'testing' : function() { return 'This is a test of my framework'; }
});

