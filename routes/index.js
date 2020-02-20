var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var dbuser = require("../model/thongtin")




router.get('/xem',function(req,res,next){
  dbuser.findOne({"username":"admin"}).then(rel=>{bcrypt.compare("admin",rel.password,function(err,dl){
    if (err) { console.log("Lỗi xác thực") }
    if (!dl) {
          console.log("mk sai");
        }
        else{
          console.log("đúng mk");
        }
  })});
  res.render('xem');
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login')
.get((req, res) => {res.render('login', { title: 'Login' })});

router.post('/login', passport.authenticate('local', { successRedirect: '/loginsucc',
                                                    failureRedirect: '/login' }));


passport.use(new LocalStrategy(
  function(username, password, done) {
    dbuser.findOne({ username: username }, function (err, user) {
      if(user == null){
        console.log('a');
        return done(err);
      }
      else{bcrypt.compare(password,user.password,function(err,rel){
        if (err) { return done(err); }
        if (!rel) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        return done(null, user);
        
      })}
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(a, done) {
  dbuser.findOne({"username":a},function(err,dl){
    if(dl) return done(null,dl);
    else return done(null,false);
  })
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  var user = req.body.user,pass = req.body.pass;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pass,salt);
  console.log(user);
  console.log(hash);
  var ob = {
    "username":user,
    "password":hash
  }

  dbuser.collection.insertOne(ob).then(dt=>res.redirect('/ressuccess')).catch(err => console.err('Lỗi rồi'));
});

router.get('/ressuccess',function(req,res,next){
  res.render('ressuccess',{title:'Đăng ký thành công'});
})

router.get('/loginsucc',function(req,res,next){
  if(req.isAuthenticated()){
    res.render('loginsucc');
  }else{
    res.redirect('/');
  }
})

router.get('/logout',(req,res,next)=>{req.logout();res.redirect('/')});



module.exports = router;
