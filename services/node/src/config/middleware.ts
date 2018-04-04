/**
 * Custom middleware.
 */

 // Import
 import { Request, Response, NextFunction } from 'express';
 import IMAPConnection from './../handlers/email/IMAPConnection';
 import IMAPHandler from './../handlers/email/IMAPHandler';

 class Middleware {
   static accessToken: string;
   static refreshToken: string;

   public updateIMAPConnection (req: Request, res: Response, next: NextFunction): void {
    if ((process.env.IMAP_ACCESS_TOKEN && process.env.IMAP_REFRESH_TOKEN) && (process.env.IMAP_ACCESS_TOKEN !== Middleware.accessToken || process.env.IMAP_REFRESH_TOKEN !== Middleware.refreshToken)) {
      Middleware.accessToken = process.env.IMAP_ACCESS_TOKEN;
      Middleware.refreshToken = process.env.IMAP_REFRESH_TOKEN;
      IMAPHandler.connect(IMAPConnection);
    }
      return next();
   }
 }

 // Exports
 export default new Middleware();
