const passport = require("passport");
const userController = require("../controllers/userController");

const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const githubLogin = new GitHubStrategy(
  {
    clientID: "fe1d40a550fc4599378c",
    clientSecret: "4b34f9e84b16b0e67e4de8fc66a7c2f7a4fe191b",
    callbackURL: "http://localhost:8000/auth/github/callback",
  },
  function (accessToken, refreshToken, profile, callback) {
    let user = userController.getUserByGitHubIDorCreate(profile);
    return callback(null, user);
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(githubLogin).use(localLogin);
