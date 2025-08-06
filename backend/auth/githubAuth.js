const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        profile.token = accessToken;
        return done(null, profile);
      }
    )
  );

  // Step 1: Redirect to GitHub for authentication
  app.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));

  // Step 2: GitHub callback
  app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
      // Redirect to frontend with GitHub access token
      res.redirect(`http://localhost:5173/dashboard?token=${req.user.token}`);
    }
  );
};
