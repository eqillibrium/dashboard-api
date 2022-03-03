import { Container, ContainerModule, interfaces } from 'inversify'
import { TYPES } from './types'
import { App } from './app'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { UsersController } from './users/users.controller'
import { ExceptionFilter } from './errors/exception.filter'
import { IExceptionFilter } from './errors/exception.filter.interface'
import { IUsersController } from './users/users.controller.interface'
import { IUserService } from './users/user.service.inteface'
import { UserService } from './users/user.service'
import { IConfigService } from './config/config.service.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/prisma.service'
import { IUserRepository } from './users/user.repository.interface'
import { UsersRepositiry } from './users/users.repositiry'

export interface IBootstrap {
	appContainer: Container
	app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter)
	bind<IUsersController>(TYPES.UserController).to(UsersController)
	bind<IUserService>(TYPES.UserService).to(UserService)
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
	bind<IUserRepository>(TYPES.UserRepository).to(UsersRepositiry).inSingletonScope()
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
