/**
 * Handles the email events.
 */

/**
 * Handles the email messages.
 */
class MailSender {
  private emailhandler: any;

  constructor(emailhandler: any) {
    this.emailhandler  = emailhandler;
  }

  /**
   * Sends a statusupdate to the customer.
   */
  public sendStatusUpdate(payload: any, doSend: boolean) {
    const mailBody = 'Status för ärende med ärendeID: ' + payload[0].ticketId + ' har ändrats.';
    const mailSubject = 'Kundärende har fått uppdaterad status';
    const mail = {to: payload[0].from.email,
      subject: mailSubject, body: mailBody};

    if (doSend) {
      this.emailhandler.Outgoing.send(mail);
    } else {
      return;
    }
  }

  /**
   * Sends a message to the customer.
   */
  public sendMessageUpdate(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const mailSubject = payload.title;
      const mail = {to: payload.from.email,
        subject: mailSubject, body: payload.body.pop().body};
      this.emailhandler.Outgoing.answer(mail, payload.mailID)
      .then((mailID) => {
        resolve(mailID);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}

// Exports.
export default MailSender;
