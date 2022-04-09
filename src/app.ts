import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { json } from 'body-parser'
import { TYPES } from './types'
import { ILogger } from './logger/logger.interface'
import { IUsersController } from './users/users.controller.interface'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { IConfigService } from './config/config.service.interface'
import 'reflect-metadata'
import { UsersController } from './users/users.controller'
import { PrismaService } from './database/prisma.service'
import { AuthMiddleware } from './common/auth.middleware'
import { PostsController } from './posts/posts.controller'
import cors from 'cors'

@injectable()
class App {
	app: Express
	server: Server
	port: number
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private readonly ConfigService: IConfigService,
		@inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
		@inject(TYPES.PostsController) private readonly postController: PostsController,
	) {
		this.app = express()
		this.port = 8000
	}

	useMiddleware(): void {
		this.app.use(json())
		const authMiddleware = new AuthMiddleware(this.ConfigService.get('SECRET'))
		this.app.use(authMiddleware.execute.bind(authMiddleware))
		this.app.use(cors({ origin: 'http://localhost:63342' }))
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router)
		this.app.use('/posts', this.postController.router)
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	public async init(): Promise<void> {
		this.useMiddleware()
		this.useRoutes()
		this.useExceptionFilters()
		await this.prismaService.connect()
		this.server = this.app.listen(this.port)
		this.logger.log(`Started on ${this.port}`)
	}

	public close(): void {
		this.server.close()
	}
}

export { App }
