/**
 * Interacts with the customer-model.
 */

// Imports
import DBInteractor from './DBInteractor';
import Ticket from './../models/Ticket';
import { ITicketModel } from './../models/Ticket';
import { DBCreationError} from './../../../config/errors';
import IReceivedAnswer from './../../email/interfaces/IReceivedAnswer';

/**
 * Declares class.
 */
class AnswerInteractor extends DBInteractor {

  /**
   * Updates the ticket in the database that matches the conditions
   * with the given answer to the messages-thread. If no matching tickets are found,
   * throws database error.
   */
  public addOrUpdate(info: IReceivedAnswer, conditions: object): Promise<ITicketModel[]> {
    return new Promise((resolve, reject) => {
      const options = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      };

      this.createNewAnswer(conditions, info as IReceivedAnswer, options)
          .then((saved) => {
            return Ticket.findOne(saved)
                   .populate('from')
                   .populate('assignee');
          })
          .then((populated) => {
            if (!Array.isArray(populated)) {
              resolve([populated]);
            } else {
              resolve(populated);
            }
          })
          .catch((error) => {
            reject(error);
          });
    });
  }

  /**
   * Adds to the answer-thread.
   */
  private createNewAnswer(conditions: object, info: IReceivedAnswer, options: object) {
    return new Promise((resolve, reject) => {
      Ticket.findOne(conditions)
      .then((found) => {
        if (found) {
          const bodies = found.body.concat(super.createNewMails(info));
          found.body = bodies;

          const replyIDs = found.replyId;
          replyIDs.push('<' + info.mailId + '>');
          found.replyId = replyIDs;
          return found.save();
        } else {
          reject(new DBCreationError('Could not add answer to thread in database.'));
        }
      })
      .then((saved) => {
        resolve(saved);
      })
      .catch((err) => {
        reject(err);
      });
    });
  }
}

// Exports
export default AnswerInteractor;
