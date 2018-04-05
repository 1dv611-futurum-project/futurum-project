/**
 * Creates passport strategies.
 */

// Imports
import * as passport from 'passport';
import * as Google from 'passport-google-oauth20';

class PassportStrategies {

  private static accessTokenEnv = 'IMAP_ACCESS_TOKEN';
  private static refreshTokenEnv = 'IMAP_REFRESH_TOKEN';

  /**
   * Initiates the passport strategies.
   */
  public make() {
    /**
     * Delegate access to the support email thorugh google.
     */
    passport.use('gmail', new Google.Strategy({
      clientID: process.env.IMAP_CLIENT_ID,
      clientSecret: process.env.IMAP_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:8080/node/auth/google/callback'
    },
      (accessToken, refreshToken, profile, done) => {
        let authorized;

        if (!profile) {
          return done({message: 'You have to allow delegation to the account for the app to work.'});
        } else {
          authorized = profile.emails.find((email) => {
            return email.value === process.env.IMAP_USER;
          });
        }

        if (authorized) {
          process.env[PassportStrategies.accessTokenEnv] = accessToken;
          process.env[PassportStrategies.refreshTokenEnv] = refreshToken;
          return done(null, profile);

        } else {
          return done({message: 'You are not authorized to use this app with this email.'});
        }
      }
    ));
  }
}

// Exports
export default new PassportStrategies();
