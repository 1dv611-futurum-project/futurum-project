/**
 * Creates passport strategies.
 */

// Imports
import * as passport from 'passport';
import * as Google from 'passport-google-oauth20';
import { DelegationDisallowedError, UnauthorizedEmailError } from './errors';

class PassportStrategies {

	private accessTokenEnv = 'IMAP_ACCESS_TOKEN';
	private refreshTokenEnv = 'IMAP_REFRESH_TOKEN';

	private delegationDisallowedMessage = 'You have to allow delegation to the account for the app to work.';
	private unauthorizedEmailMessage = 'You are not authorized to use this app with this email.';

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
			callbackURL: process.env.IMAP_REDIRECT_URL
		},
			(accessToken, refreshToken, profile, done) => {
				let authorized;

				if (!profile) {
					return done(new DelegationDisallowedError(this.delegationDisallowedMessage));
				} else {
					authorized = profile.emails.find((email) => {
						return email.value === process.env.IMAP_USER;
					});
				}

				if (authorized) {
					process.env[this.accessTokenEnv] = process.env[this.accessTokenEnv] || accessToken;
					process.env[this.refreshTokenEnv] = process.env[this.refreshTokenEnv] || refreshToken;

					return done(null, profile);

				} else {
					return done(new UnauthorizedEmailError(this.unauthorizedEmailMessage));
				}
			}
		));
	}
}

// Exports
export default new PassportStrategies();
