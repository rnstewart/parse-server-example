
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('CreateUser', function(req, res){
    Parse.Cloud.useMasterKey();
    var callingUserId = req.params.userId;
    var username = req.params.username;
    var password = req.params.password;
    var role = req.params.role;
    
    console.log('callingUserId = ' + callingUserId);
    console.log('username = ' + username);
    console.log('password = ' + password);
    console.log('role = ' + role);
    
    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('username', username);
    console.log('queryUser = ' + JSON.stringify(queryUser));
    queryUser.first({
        success: function(user){
            console.log('user = ' + JSON.stringify(user));
            if (user == undefined) {
                user = new Parse.User();
                user.set('username', username);
                user.set('password', password);
                user.set('role', role);
                user.signUp().then(function(user){
                    res.success('User Created');
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
});