import * as express from 'express';
import { Application, Router, Request, Response, NextFunction, Error } from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';

class App {

	private static PUBLIC_DIR = './../src/public/dist';
	private static RESOURCE_DIR = './../node_modules/';
	private static SERVER_URL = 'http://127.0.0.1:8080/node';
	public express: Application;

	constructor() {
		this.express = express();
		this.middleware();
		this.mountRoutes();
	}

	private middleware(): void {
		this.express.use(bodyParser.json());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(express.static(path.resolve(__dirname, App.PUBLIC_DIR)));
		this.express.use('/scripts', express.static(path.resolve(__dirname + App.RESOURCE_DIR)));
		this.express.use(cookieParser());
		this.express.use(this.authorize);
		this.express.use(this.checkServerStatus);
		this.express.use(this.errorHandler);
	}

	private mountRoutes(): void {
		this.express.use('*', this.route);
	}

	private route(req: Request, res: Response): void {
		res.sendFile(path.resolve(__dirname, '../src/index.html'));
	}

	private authorize(req: Request, res: Response, next: NextFunction): void {
		jwt.verify(req.cookies.jwt, 'secret', (err, decoded) => {
			if (err) {
				return res.redirect(App.SERVER_URL);
			}
			next();
		});
	}

	private checkServerStatus(req: Request, res: Response, next: NextFunction): void {
		axios({
			url: 'http://node:3000/node/connection',
			headers: {
				Cookie: req.headers.cookie
			}
		})
		.then((response) => {
			if (response.headers['connection-status'] === 'up') {
				return next();
			} else {
				return res.redirect(App.SERVER_URL);
			}
		})
		.catch((err) => {
			return next(err);
		});
	}

	private errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
		res.status(500).send({
			cess: false,
			sage: err.stack
		});
	}
}

export default new App().express;
