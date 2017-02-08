
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('CreateUser', function(req, res){
    var callingUserId = req.params.userId;
    var username = req.params.username;
    var password = req.params.password;
    var role = req.params.role;
    
    var queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo('username', username);
    queryUser.first().then(function(user){
        if (user == undefined) {
            user = new Parse.User;
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
    });
});