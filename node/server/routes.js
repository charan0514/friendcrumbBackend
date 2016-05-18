var userSchema = require('./models/user-model'); 
var eventSchema = require('./models/event-model');
var contactSchema = require('./models/contact-model');
var appUrlSchema = require('./models/app-url-model'); 

var idgen = require('idgen');

module.exports = function(app){
	
	//for allowing cross-origin requests
	app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Powered-By,Content-Type");
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
     });

	app.get('/',function(req, res){
		res.send("Use '/api/events', '/api/users' or '/api/'contacts to get the respective results");
	});

    app.get('/api/users/:user_id', function(req, res){
        getUserById(req, res);
    });

	app.post('/api/users', function(req, res){
        var userObj = req.body;
        userSchema.addUser(userObj, function(err, user){
            if(err)
                res.send(err);
            //res.json(user);
            getAllUsers(res);
        });
	});

    /*Event related apis*/

    app.get('/api/events/:user_id', function(req, res){
        getAllEvents(req, res);
    });

    app.get('/api/events/:user_id/:event_id', function(req, res){
        getSpecificEvent(req, res);
    });

    app.post('/api/events/', function(req, res){
        var  eventObj = req.body;
        eventObj.event_id = idgen(16); //generate eventId 
       
        //update invitees event list with this event
        eventSchema.addEventToAttendeeList(eventObj, function(err, event){
            if(err)
                res.send(err);
            res.json(event);
        });

        // eventSchema.createEvent(eventObj, function(err, user){
        //     if(err)
        //         res.send(err);
        //     res.json(user);
        //     //getAllEvents(req,res);
        // }); 
    });

     app.put('/api/events/', function(req, res){
        var  eventObj = req.body;

        //update invitees event list with this event
        eventSchema.updateAttendeeEventList(eventObj, function(err, event){
            if(err)
                res.send(err);
            res.json(event);
        });
        
        // eventSchema.updateEvent(eventObj, function(err, event){
        //     if(err)
        //         res.send(err);
        //     res.json(event);
        // });
     });

     //when attendees decline an event 
     app.delete('/api/events/deleteEvent', function(req, res){
        eventSchema.deleteEvent(req.body, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     //when attendees accept an event
     app.put('/api/events/updateEventStatus', function(req, res){
        eventSchema.updateAttendeeStatus(req.body, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     //app url related api's
     app.post('/api/appUrls', function(req, res){
        appUrlSchema.addAppUrl(req.body, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.get('/api/appUrls/:app_id', function(req, res){
        appUrlSchema.getAppUrl(req.params.app_id, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.get('/api/appUrls', function(req, res){
        appUrlSchema.getAllAppUrls(req.params.app_id, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.delete('/api/appUrls', function(req, res){
        appUrlSchema.deleteAppUrl(req.body.app_id, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     //contact related api's
     app.get('/api/contacts/:user_id', function(req, res){
        contactSchema.getContacts(req.params.user_id, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.post('/api/contacts', function(req, res){
        //everytime posting new contacts delete existing contacts
        contactSchema.deleteContacts(req.body.user_id, function(err, resp){
            if(err)
                res.send(err);
            //then post new contacts
            else{
                contactSchema.addContacts(req.body, function(err, resp){
                    if(err)
                        res.send(err);
                    res.json(resp);
                });
            }
        });
     });

     app.delete('/api/contacts', function(req, res){
        contactSchema.deleteContacts(req.body.user_id, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     /**** for local testing only ***/
     app.delete('/api/users/deleteAll/', function(req, res){
        userSchema.removeAllUsers(function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.delete('/api/events/deleteAll/', function(req, res){
        eventSchema.clearAllEvents(function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.delete('/api/events/deleteAllEvents/', function(req, res){
        eventSchema.deleteAllEvents(req.body.user_id, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });
    
     app.get('/api/users',function(req, res){
            getAllUsers(res);
     });
     

    //  app.put('/api/users/:user_id',function(req, res){
    //     userSchema.updateUser(req.params._id, req.body, function(err, user){
    //         if(err)
    //             res.send(err);
    //         //res.send(user);
    //         getUserById(req, res);
    //     });
    // });

    // app.delete('/api/users/:user_id', function(req, res){
    //     userSchema.removeUser(req.params.user_id, function(err, user){
    //         if(err)
    //             res.send(err);
    //         res.json(user);
    //     });
    // });

};

function getUserById(req, res){
    userSchema.getUserById(req.params.user_id, function(err, user){
        if(err)
            res.send(err);
        res.json(user);
    });
};

function getAllUsers(res){

    //moved to users.js
	/*userSchema.find(function(err, response){
		if(err)
			res.send(err);

		res.json(response);

	});*/

    userSchema.getUsers(function(err, users){
        if(err)
            res.send(err);
        res.json(users);
    });

};

function getSpecificEvent(req, res){
     eventSchema.getEventById(req.params.user_id, req.params.event_id, function(err, user){
            if(err)
                res.send(err);
            res.json(user);
        });
};

function getAllEvents(req, res){
    eventSchema.getAllEvents(req.params.user_id, function(err, users){
        if(err)
            res.send(err);
        res.json(users);
    });
};