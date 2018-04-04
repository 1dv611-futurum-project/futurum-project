/**
 * Custom middleware.
 */

 // Import
 import { Request, Response, NextFunction } from 'express';
 import IMAPConnection from './../handlers/email/IMAPConnection';
 import IMAPHandler from './../handlers/email/IMAPHandler';

 class Middleware {
   static IMAPaccessToken: string;
   static IMAPrefreshToken: string;

   /**
    * Checks if there are access and refresh tokens or if they have changed, and tn that case updates the IMAP connection.
    */
   public updateIMAPConnection (req: Request, res: Response, next: NextFunction): void {
    if ((process.env.IMAP_ACCESS_TOKEN && process.env.IMAP_REFRESH_TOKEN) && (process.env.IMAP_ACCESS_TOKEN !== Middleware.IMAPaccessToken || process.env.IMAP_REFRESH_TOKEN !== Middleware.IMAPrefreshToken)) {
      Middleware.IMAPaccessToken = process.env.IMAP_ACCESS_TOKEN;
      Middleware.IMAPrefreshToken = process.env.IMAP_REFRESH_TOKEN;
      IMAPHandler.connect(IMAPConnection);
    }
      return next();
   }
 }

 // Exports
 export default new Middleware();
