/**
 * Custom middleware.
 */

// Import
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'express-jwt';
import IMAPConnection from './../handlers/email/IMAPConnection';
import IMAPHandler from './../handlers/email/IMAPHandler';

class Middleware {
  private static IMAPaccessToken: string;
  private static IMAPrefreshToken: string;
  private static latestIMAPUpdateSecondsSinceEpoch: number;
  private static authPaths  = [
    '/node/auth/google',
    '/node/auth/google/callback',
    '/node/auth/google/callback/redirect',
    '/auth/google',
    '/auth/google/callback',
    '/auth/google/callback/redirect',
    '/node/connection',
    '/connection'
  ];

/**
 * Checks that the server has been authorized to make requests against the email
 */
  public checkConnection(): ((req: Request, res: Response, next: NextFunction) => void) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const connectionStatus = process.env.IMAP_ACCESS_TOKEN && process.env.IMAP_REFRESH_TOKEN;

      if (Middleware.authPaths.indexOf(req.path) > -1) {
        const status = connectionStatus ? 'up' : 'down';
        res.header('connection-status', status);
        return next();
      }

      if (!connectionStatus) {
        res.header('connection-status', 'down');
        res.redirect('/node/auth/google');
      }
    };
  }

/**
 * Checks if there are access and refresh tokens or if they have changed,
 * and in that case updates the IMAP connection.
 */
  public updateIMAPConnection(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
      const variablesExist = process.env.IMAP_ACCESS_TOKEN && process.env.IMAP_REFRESH_TOKEN;
      const variablesChanged = (process.env.IMAP_ACCESS_TOKEN !== Middleware.IMAPaccessToken)
                              || process.env.IMAP_REFRESH_TOKEN !== Middleware.IMAPrefreshToken;
      const secondsSinceUpdate = (new Date().getTime() / 1000) - Middleware.latestIMAPUpdateSecondsSinceEpoch;

      if ((variablesExist && variablesChanged) || secondsSinceUpdate > 3500) {
        Middleware.IMAPaccessToken = process.env.IMAP_ACCESS_TOKEN;
        Middleware.IMAPrefreshToken = process.env.IMAP_REFRESH_TOKEN;
        IMAPHandler.connect(IMAPConnection);
        Middleware.latestIMAPUpdateSecondsSinceEpoch = (new Date().getTime() / 1000);
      }
      return next();
    };
  }
}

// Exports
export default new Middleware();
