
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
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
                var role = user.get('role');
                if (role == 3) {
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
                var role = callingUser.get('role');
                if (role == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.equalTo('username', username);
                    queryUser.first({
                        success: function(user){
                            if (user != undefined) {
                                user.destroy({
                                    useMasterKey: true,
                                    success: function(object){
                                        res.success('User Deleted.');
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
                var role = callingUser.get('role');
                if (role == 3) {
                    var queryUser = new Parse.Query(Parse.User);
                    queryUser.equalTo('objectId', userId);
                    console.log('queryUser = ' + JSON.stringify(queryUser));
                    queryUser.first({
                        success: function(user){
                            if (user != undefined) {
                                user.set('username', username);
//                                 user.set('password', password);
                                user.set('role', role);
                                console.log('user = ' + JSON.stringify(user));
                                user.save({
                                    useMasterKey: true,
                                    success: function(object){
                                        console.log('User Updated.');
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
