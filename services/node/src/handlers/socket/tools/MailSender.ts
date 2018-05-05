/**
 * Handles the email events.
 */

// Imports.
import EmailHandler from '../../email/EmailHandler';

/**
 * Handles the email messages.
 */
class MailSender {

  public sendAssigneeUpdate(payload: any) {
    const mailBody = payload[0].assignee + ' har tilldelats ärende med ärendeID: ' + payload[0].ticketId + '.';
    const mailSubject = 'Kundärende har blivit tilldelat';
    // todo: change to: assigne.email stored in db
    const mail = {from: 'dev@futurumdigital.se', to: 'dev@futurumdigital.se',
      subject: mailSubject, body: mailBody};
    EmailHandler.Outgoing.send(mail);
  }

  public sendStatusUpdate(payload: any) {
    const mailBody = 'Status för ärende med ärendeID: ' + payload[0].ticketId + ' har ändrats.';
    const mailSubject = 'Kundärende har fått uppdaterad status';
    // todo: change to: assigne.email stored in db
    const mail = {from: 'dev@futurumdigital.se', to: 'dev@futurumdigital.se',
      subject: mailSubject, body: mailBody};
    EmailHandler.Outgoing.send(mail);
  }

  public sendMessageUpdate(payload: any) {
    const mailSubject = 'RE: ' + payload[0].title;
    const mail = {from: 'dev@futurumdigital.se', to: payload[0].from,
      subject: mailSubject, body: payload.body[payload.body.length].body};
    EmailHandler.Outgoing.answer(mail, payload[0].ticketID);
  }
}

export default new MailSender();
