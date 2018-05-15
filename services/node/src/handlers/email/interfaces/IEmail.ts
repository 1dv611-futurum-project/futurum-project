/**
 * Email interface for communicating with the MailSender module.
 */

// Exports.
export default interface IEmail {
	from?: string;
	to?: string;
	subject: string;
	body: string;
}
