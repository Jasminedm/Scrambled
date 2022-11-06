module.exports = function(app, passport, db) {
  const ObjectId = require("mongodb").ObjectID;
  
   
// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    

    app.get('/profile',isLoggedIn, function(req, res) {
      db.collection('WinsAndLosses').find({user: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
          res.render('profile.ejs', {
            results: result,
            user : req.user

          })
      })
    })
    // need user to stay associated with logged user
    app.get('/playPage', isLoggedIn, function(req, res) {
      let words = ' substance, consumed, provide, nutritional, support, organism, Food, contains, essential, agricultural, technologies, increased, conventional, international, example, Sustainable, Development'.split(', ')
      let randomW = words[Math.floor(Math.random() * words.length)]
      let remainder = randomW
      let scrambled= ''
      while(remainder.length > 0){
        //get random index representing letter from remainder
        let index= Math.floor(Math.random() * remainder.length)
        //Pushing the index from the remainder into the scrambled string
        scrambled = scrambled + remainder[index]
        //not to get same letter twice| remove pushed letter 
        //from remainder string and reconnect rest of letters
        remainder = remainder.slice(0, index) + remainder.slice(index+1)
        

      }
      res.render('playPage.ejs', {
        scrambled: scrambled,
        user : req.user,
        cWord: randomW
      
      })    
    })
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    

// message board routes ===============================================================

    app.post('/submit', (req, res) => {
      db.collection('WinsAndLosses').save({user: req.user.local.email, iWord: req.body.userInput, cWord: req.body.correctWord, sWord: req.body.scrambledWord, heart: false}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put("/messages", (req, res) => {
      console.log(ObjectId(req.body.id))
      db.collection("WinsAndLosses").findOneAndUpdate(
        { _id: ObjectId(req.body.id)},
        {
          $set: {
            heart: !req.body.heart,
          },
        },
        {
          sort: { _id: -1 },
          upsert: true,
        },
        (err, result) => {
          if (err) return res.send(err);
          //Sending the response
          res.send(result);
        }
      );
    });

    // app.put('/messages', (req, res) => {
    //   console.log(req.body)
    //   db.collection('WinsAndLosses')
    //   .findOneAndUpdate({user: req.user.local.email, ThumbUp: req.body.thumbUp}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    // app.put('/thumbdown', (req, res) => {
    //   db.collection('messages')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbDown:req.body.thumbDown + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/messages', (req, res) => {
      db.collection('WinsAndLosses').findOneAndDelete({user: req.user.local.email, ThumbUp: req.body.thumbUp}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
