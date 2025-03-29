module.exports = function(schema) {
    var module = {};

    module.login = function(req, res, next){
        if(req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    };

    module.isLogin = function(req, res, next){
        if (req.session.user) {
            console.log("Already login");
            //req.flash('error',"You have already login.");
            res.redirect('/dashbord');            
        } else {
        	next();
        }
    };  

    return module;
}    