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
    // todo: change to: assigne.email stored in db
    const mail = {from: 'dev@futurumdigital.se', to: payload[0].from.email,
      subject: mailSubject, body: mailBody};

    if (doSend) {
      EmailHandler.Outgoing.send(mail);
    } else {
      return;
    }
  }

  public sendMessageUpdate(payload: any) {
    const mailSubject = 'RE: ' + payload[0].title;
    const mail = {from: 'dev@futurumdigital.se', to: payload[0].from.email,
      subject: mailSubject, body: payload[0].body.pop().body};
    EmailHandler.Outgoing.answer(mail, payload[0].ticketID);
  }
}

export default new MailSender();
