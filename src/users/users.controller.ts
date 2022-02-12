import { NextFunction, Request, Response } from 'express'
import { IControllerRoute } from '../common/route.interface'
import { BaseController } from '../common/base.controller.js'
import { HttpError } from '../errors/http-error.class.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types.js'
import { ILogger } from '../logger/logger.interface.js'
import 'reflect-metadata'
import { IUsersController } from './users.controller.interface'

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService)
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		])
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		super.bindRoutes(routes)
	}

	register(req: Request, res: Response, next: NextFunction): void {
		next(new HttpError(401, 'authorize error'))
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login')
	}
}
