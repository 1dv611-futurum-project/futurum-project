/**
 * Declares custom error classes.
 */

// Imports
import * as util from 'util';

// Authorization and authentication errors
export function AuthError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(AuthError, Error);

export function DelegationDisallowedError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(DelegationDisallowedError, AuthError);

export function UnauthorizedEmailError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(UnauthorizedEmailError, AuthError);

// IMAP errors
export function IMAPError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(IMAPError, Error);

export function NoIMAPCredentialsError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(NoIMAPCredentialsError, IMAPError);

// Gmail errors
export function GmailError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(GmailError, Error);

// Database errors
export function DBError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(DBError, Error);

export function DBCreationError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(DBCreationError, DBError);

export function AssigneeMismatchError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(AssigneeMismatchError, DBError);

export function CustomerMismatchError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(CustomerMismatchError, DBError);

export function DBConnectionError(message) {
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = message;
}

util.inherits(DBConnectionError, DBError);
