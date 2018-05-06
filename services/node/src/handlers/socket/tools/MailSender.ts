/**
 * Handles the email events.
 */

// Imports.
import EmailHandler from '../../email/EmailHandler';

/**
 * Handles the email messages.
 */
class MailSender {

  public sendStatusUpdate(payload: any, doSend: boolean) {
    const mailBody = 'Status för ärende med ärendeID: ' + payload[0].ticketId + ' har ändrats.';
    const mailSubject = 'Kundärende har fått uppdaterad status';
    const mail = {to: payload[0].from.email,
      subject: mailSubject, body: mailBody};

    if (doSend) {
      EmailHandler.Outgoing.send(mail);
    } else {
      return;
    }
  }

  public sendMessageUpdate(payload: any) {
    const mailSubject = payload[0].title;
    const mail = {to: payload[0].from.email[0],
      subject: mailSubject, body: payload[0].body.pop().body};
    EmailHandler.Outgoing.answer(mail, payload[0].mailID);
  }
}

export default new MailSender();
