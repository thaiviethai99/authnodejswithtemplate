/**
 * Module dependencies.
 */
var express = require("express"),
  routes = require("./routes"),
  user = require("./routes/user"),
  http = require("http"),
  path = require("path");
//var methodOverride = require('method-override');
var session = require("express-session");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var router = express.Router();


var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejslogin"
});

connection.connect();

global.db = connection;

// all environments
app.set("port", process.env.PORT || 8080);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "assets/plugins")));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 }
  })
);
function dbQuery(sql){
  return new Promise(function(resolve, reject) {
      db.query(sql, function(err, result){  
        if (err) {
          return reject(err);
        }
        resolve(result);
       });
  });
}
router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  //global.dataUser = await dbQuery(sql);    
  next()
})
// development only
// middleware
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    //var err = new Error('You must be logged in to view this page.');
    //err.status = 401;
    return res.send('You must be logged in to view this page');
  }
}
router.get("/", routes.index); //call for main index page
router.get("/test",requiresLogin,function(req, res, next){
  res.send('login thanh cong');
});
router.get("/signup", user.signup); //call for signup page
router.post("/signup", user.signup); //call for signup post
router.get("/login", routes.index); //call for login page
router.post("/login", user.login); //call for login post
router.get("/home/dashboard", user.dashboard); //call for dashboard page after login
router.get("/home/logout", user.logout); //call for logout
router.get("/home/profile", user.profile); //to render users profile
//Middleware
app.use('/', router)
app.listen(3000,()=>console.log("server run"));
