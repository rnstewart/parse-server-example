
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('CheckSignupCode', function(req, res){
    var code = req.params.code;
    var role = req.params.role;

    var SignupCodes = Parse.Object.extend('SignupCodes');
    var query = new Parse.Query(SignupCodes);
    query.equalTo('role', role);
    query.equalTo('code', code);
    query.first({
        success: function(object){
            if (object != undefined) {
                res.success('OK');
            }
            else {
                res.error('Invalid Code.');
            }
        },
        error: function(error){
            res.error(error);
        }
    });
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
    var Entry = Parse.Object.extend('Entry');
    var query = new Parse.Query(Entry);
    query.equalTo('user', user);
    query.find({
        useMasterKey: true,
        success: function(objects){
            Parse.Object.destroyAll(objects, {
                success: function(){
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
