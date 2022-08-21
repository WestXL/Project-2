const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const path = require("path");
const auth = require("http-auth");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const Contact = require("../models/contact");
const router = express.Router();

const expSession = require("express-session")({
  secret: "mysecret", //decode or encode session
  resave: false,
  saveUninitialized: true,
  cookie: {
      // httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000,
  },
});

passport.serializeUser(User.serializeUser()); //session encoding
passport.deserializeUser(User.deserializeUser()); //session decoding
passport.use(
    new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            return done(null, user);
        });
    })
);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.use(expSession);

router.use(passport.initialize());
router.use(passport.session());

const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get("/logout",(req,res)=>{
  req.logout(function (err) {
      if (err) {
          return next(err);
      }
  }),
  res.redirect("/");
});

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('index', {
    title: 'Registration form'
  });
});

// router.get('/signin', basic.check((req, res) => {
//   Registration.find()
//     .then(() => {
//       res.render('dashboard', {
//         title: 'Dashboard',
//       });
//     })
//     .catch(() => {
//       res.send('Sorry! Incorrect Username and Password combinations.');
//     });
// }));

router.get('/dashboard', (req, res) => {
  //res.send('It works!');
  res.render('dashboard', {
    title: 'Dashboard'
  });
});

router.get('/register', (req, res) => {
  //res.send('It works!');
  res.render('register', {
    title: 'Registration form'
  });
});

router.get('/profile', (req, res) => {
  //res.send('It works!');
  res.render('profile', {
    title: 'Profile'
  });
});

router.get('/design1', (req, res) => {
  //res.send('It works!');
  res.render('design1', {
    title: 'Design1'
  });
});

router.get('/design2', (req, res) => {
  //res.send('It works!');
  res.render('design2', {
    title: 'Design2'
  });
});

router.get('/design3', (req, res) => {
  //res.send('It works!');
  res.render('design3', {
    title: 'Design3'
  });
});

router.get('/design4', (req, res) => {
  //res.send('It works!');
  res.render('design4', {
    title: 'Design4'
  });
});

router.get('/contact', basic.check((req, res) => {
  User.find()
    .then((users) => {
      res.render('registrants', {
        title: 'Listing registrations',
        users
      });
    })
    .catch(() => {
      res.send('Sorry! Something went wrong.');
    });
}));

router.get("/signin", function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
          res.render("signerror", { user: user, error: err });
      }
      if (!user) {
          res.render("signerror", { user: user, error: err });
      }
      res.render("dashboard", { user });
  });
});

router.post("/signin", function (req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
      if (err) {
          res.render("signerror", { user: user, error: err });
      }
      if (!user) {
          res.render("signerror", { user: user, error: err });
      }
      res.render("dashboard", { user });
  });
});

router.post(
  "/register",
  [
      check("username")
          .isLength({
              min: 1,
          })
          .withMessage("Please enter a username"),
      check("password")
          .isLength({
              min: 1,
          })
          .withMessage("Please enter an password"),
  ],
  async (req, res) => {
      User.register(
          new User({
              username: req.body.username,
              password: req.body.password,
              firstname: "",
              lastname: "",
              email: "",
          }),
          req.body.password,
          function (err, user) {
              if (err) {
                  console.log(err);
                  res.render("error", { user: user, error: err });
              } else {
                  passport.authenticate("local")(req, res, function () {
                      res.render("thankyou");
                  });
              }
          }
      );
  }
);

// router.post('/register',
//   [
//     check('name')
//     .isLength({
//       min: 1
//     })
//     .withMessage('Please enter a name'),
//     check('email')
//     .isLength({
//       min: 1
//     })
//     .withMessage('Please enter an email'),
//     check('user')
//     .isLength({
//       min: 1
//     })
//     .withMessage('Please enter a username'),
//     check('pwd')
//     .isLength({
//       min: 1
//     })
//     .withMessage('Please enter a password')
//   ],
//   async (req, res) => {
//     //console.log(req.body);
//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       const registration = new Registration(req.body);
//       const salt = await bcrypt.genSalt(10);
//       registration.pwd = await bcrypt.hash(registration.pwd, salt);
//       registration.save()
//         .then(() => {
//           res.render('thankyou')
//         })
//         .catch((err) => {
//           console.log(err);
//           res.send('Sorry! Something went wrong.');
//         });
//     } else {
//       res.render('register', {
//         title: 'Registration form',
//         errors: errors.array(),
//         data: req.body,
//       });
//     }
//   });

module.exports = router;