import { NextFunction, Request, Response } from 'express'
import { IControllerRoute } from '../common/route.interface'
import { BaseController } from '../common/base.controller'
import { HttpError } from '../errors/http-error.class'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import 'reflect-metadata'
import { IUsersController } from './users.controller.interface'
import { UserEntity } from './user.entity'
import { UserService } from './user.service'
import { UserRegisterDto } from './dto/user-register.dto'
import { ValidateMiddleware } from '../common/validate.middleware'

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService)
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		])
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		super.bindRoutes(routes)
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body)
		this.ok(res, result)
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login1')
	}
}
