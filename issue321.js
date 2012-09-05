Groups = new Meteor.Collection("groups");
Something = new Meteor.Collection("something");

if (Meteor.is_client) {
    Template.hello.greeting = function() {
	return "Click to execute callback and watch server console";
    };

    Template.hello.events = {
	'click input' : function() {
	    console.log("executing remote call");
	    Meteor.call("methodShouldWait", function(err, data) {
		console.log("client callback");
		if (err) {
		    console.log(err);
		}
		console.log("data");
		console.log(data);
	    });
	}
    };
}

if (Meteor.is_server) {
    Meteor.startup(function() {
	if (Groups.find().count() == 0) {
	    for ( var i = 0; i < 4; i++) {
		Groups.insert({groupval:i});
	    }
	}
	if (Something.find().count() == 0) {
	    for ( var i = 0; i < 1000; i++) {
		Something.insert({
		    group : i % 4,
		    stuff : i,
		    stringstuff : i.toString()
		});
	    }
	}
    });

    Meteor.methods({
	'methodShouldWait' : function() {
	    var somethingcounts = {};
	    console.log("starting");
	    // contrived example just do a count or something
	    Groups.find().forEach(function(thing) {
		console.log("loop top: " + JSON.stringify(somethingcounts));
		somethingcounts[thing.groupval] = {
		    count : Something.find({
			group : thing.groupval
		    }).count()
		};
		console.log("loop bottom: " + JSON.stringify(somethingcounts));
	    });
	    console.log("returning");
	    console.log(somethingcounts)
	    return somethingcounts;
	}
    });

}