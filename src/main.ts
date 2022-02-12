import { Container, ContainerModule, interfaces } from 'inversify'
import { TYPES } from './types.js'
import { App } from './app.js'
import { ILogger } from './logger/logger.interface.js'
import { LoggerService } from './logger/logger.service.js'
import { UsersController } from './users/users.controller.js'
import { ExceptionFilter } from './errors/exception.filter.js'
import { IExceptionFilter } from './errors/exception.filter.interface.js'

export interface IBootstrap {
	appContainer: Container
	app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService)
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<UsersController>(TYPES.UserController).to(UsersController)
	bind<App>(TYPES.Application).to(App)
})

function bootstrap(): IBootstrap {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	app.init()
	return { appContainer, app }
}

export const { appContainer, app } = bootstrap()
