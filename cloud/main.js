
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('GetUsers', function(req, res){
    var callingUserId = req.params.userId;

    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('objectId', callingUserId);
    queryUser.first({
        success: function(user){
            if (user != undefined) {
                var role = user.get('role');
                if (role == 2 || role == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.find({
                        useMasterKey: true,
                        success: function(users){
                            if (users != undefined) {
                                res.success(users);
                            }
                            else {
                                res.error('No users found.');
                            }
                        },
                        error: function(error){
                            res.error(error);
                        }

                    });
                }
                else {
                    res.error('User not authorized to do this.');
                }
            }
            else {
                res.error('User ' + callingUserId + ' does not exist.');
            }
        },
        error: function(error){
            res.error(error);
        }
    });
});

Parse.Cloud.define('CreateUser', function(req, res){
    var callingUserId = req.params.userId;
    var username = req.params.username;
    var password = req.params.password;
    var role = req.params.role;

    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('objectId', callingUserId);
    queryUser.first({
        success: function(user){
            if (user != undefined) {
                var callingRole = user.get('role');
                if (callingRole == 2 || callingRole == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.equalTo('username', username);
                    queryUser.first({
                        success: function(user){
                            if (user == undefined) {
                                user = new Parse.User();
                                user.set('username', username);
                                user.set('password', password);
                                user.set('role', role);
                                user.signUp().then(function(user){
                                    res.success(JSON.stringify(user));
                                });
                            }
                            else {
                                res.error('User Exists');
                            }
                        },
                        error: function(error){
                            res.error(error);
                        }

                    });
                }
                else {
                    res.error('User not authorized to do this.');
                }
            }
            else {
                res.error('User not authorized to do this.');
            }
        },
        error: function(error){
            res.error(error);
        }
    });
});

Parse.Cloud.define('DeleteUser', function(req, res){
    var callingUserId = req.params.userId;
    var username = req.params.username;

    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('objectId', callingUserId);
    queryUser.first({
        success: function(callingUser){
            if (callingUser != undefined) {
                var callingRole = callingUser.get('role');
                if (callingRole == 2 || callingRole == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.equalTo('username', username);
                    queryUser.first({
                        success: function(user){
                            if (user != undefined) {
                                user.destroy({
                                    useMasterKey: true,
                                    success: function(object){
                                        console.log('Deleting entries for user ' + JSON.stringify(user));
                                        deleteEntriesForUser(user, res);
                                    },
                                    error: function(object, error){
                                        res.error(error);
                                    }
                                });
                            }
                            else {
                                res.error('User Does Not Exist.');
                            }
                        },
                        error: function(error){
                            res.error(error);
                        }

                    });
                }
                else {
                    res.error('User not authorized to do this.');
                }
            }
            else {
                res.error('User not authorized to do this.');
            }
        },
        error: function(error){
            res.error(error);
        }
    });
});

function deleteEntriesForUser(user, res) {
    console.log('deleteEntriesForUser(' + user.id + ')');
    var Entry = Parse.Object.extend('Entry');
    var query = new Parse.Query(Entry);
    query.equalTo('user', user);
    console.log('query = ' + JSON.stringify(query));
    query.find({
        useMasterKey: true,
        success: function(objects){
            console.log('objects = ' + JSON.stringify(objects));
            var ids = [];
            for (object in objects){
                if (object.id != undefined) {
                    console.log('object = ' + JSON.stringify(object));
                    ids.push(object.id);
                }
            }
            console.log('ids = ' + JSON.stringify(ids));
            Parse.Object.destroyAll(ids, {
                success: function(){
                    console.log('Entries deleted.');
                    res.success('Deleted');
                },
                error: function(error){
                    res.error(error);
                },
            });
        },
        error: function(objects, error){
        }
    });
}

Parse.Cloud.define('UpdateUser', function(req, res){
    var callingUserId = req.params.callingUserId;
    var userId = req.params.userId;
    var username = req.params.username;
    var password = req.params.password;
    var role = req.params.role;

    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('objectId', callingUserId);
    queryUser.first({
        success: function(callingUser){
            if (callingUser != undefined) {
                var callingRole = callingUser.get('role');
                if (callingRole == 2 || callingRole == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.equalTo('objectId', userId);
                    queryUser.first({
                        success: function(user){
                            if (user != undefined) {
                                if (username != undefined) {
                                    user.set('username', username);
                                }
                                if (password != undefined) {
                                    user.set('password', password);
                                }
                                if (role != undefined) {
                                    user.set('role', role);
                                }
                                user.save(null, {
                                    useMasterKey: true,
                                    success: function(object){
                                        res.success('User Updated.');
                                    },
                                    error: function(object, error){
                                        res.error(error);
                                    }
                                });
                            }
                            else {
                                res.error('User Does Not Exist.');
                            }
                        },
                        error: function(error){
                            res.error(error);
                        }

                    });
                }
                else {
                    res.error('User not authorized to do this.');
                }
            }
            else {
                res.error('User not authorized to do this.');
            }
        },
        error: function(error){
            res.error(error);
        }
    });
});
