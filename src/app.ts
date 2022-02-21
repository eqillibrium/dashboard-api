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
	) {
		this.app = express()
		this.port = 8000
	}

	useMiddleware(): void {
		this.app.use(json())
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router)
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	public async init(): Promise<void> {
		this.useMiddleware()
		this.useRoutes()
		this.useExceptionFilters()
		this.server = this.app.listen(this.port)
		this.logger.log(`Started on ${this.port}`)
	}
}

export { App }
