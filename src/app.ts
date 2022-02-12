import express, { Express } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import { TYPES } from './types.js'
import { UsersController } from './users/users.controller.js'
import { ExceptionFilter } from './errors/exception.filter.js'
import { ILogger } from './logger/logger.interface.js'
import 'reflect-metadata'

@injectable()
class App {
	app: Express
	server: Server
	port: number
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UsersController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
	) {
		this.app = express()
		this.port = 8000
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router)
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter))
	}

	public async init(): Promise<void> {
		this.useRoutes()
		this.useExceptionFilters()
		this.server = this.app.listen(this.port)
		this.logger.log(`Started on ${this.port}`)
	}
}

export { App }
