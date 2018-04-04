/**
 * Custom middleware.
 */

 // Import
 import { Request, Response, NextFunction } from 'express';
 import IMAPConnection from './../handlers/email/IMAPConnection';

 class Middleware {
   public updateIMAPCredentials(req: Request, res: Response, next: NextFunction): void {
      IMAPConnection.updateCredentials();
      return next();
   }
 }

 // Exports
 export default new Middleware();
