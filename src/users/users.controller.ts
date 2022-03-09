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
import { UserRegisterDto } from './dto/user-register.dto'
import { ValidateMiddleware } from '../common/validate.middleware'
import { UserLoginDto } from './dto/user-login.dto'
import { sign } from 'jsonwebtoken'
import { IConfigService } from '../config/config.service.interface'
import { IUserService } from './user.service.inteface'

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService)
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [],
			},
		])
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		super.bindRoutes(routes)
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user)
		this.ok(res, { email: userInfo?.email, id: userInfo?.id })
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body)
		if (!result) {
			return next(new HttpError(422, 'Такой пользователь уже существует'))
		}
		this.ok(res, result)
		return
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body)
		if (!result) {
			next(new HttpError(401, 'auth error', 'login'))
			return
		}
		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'))
		this.ok(res, { jwt })
		return
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err)
					}
					res(token as string)
				},
			)
		})
	}
}
