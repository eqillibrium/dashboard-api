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
import { UsersRepository } from './users/usersRepository'
import { IPostsController } from './posts/posts.controller.interface'
import { PostsController } from './posts/posts.controller'
import { IPostRepository } from './posts/post.repository.interface'
import { PostRepository } from './posts/post.repository'
import { IPostService } from './posts/post.service.interface'
import { PostService } from './posts/post.service'

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
	bind<IUserRepository>(TYPES.UserRepository).to(UsersRepository).inSingletonScope()
	bind<IPostsController>(TYPES.PostsController).to(PostsController)
	bind<IPostRepository>(TYPES.PostRepository).to(PostRepository)
	bind<IPostService>(TYPES.PostService).to(PostService)
	bind<App>(TYPES.Application).to(App)
})

async function bootstrap(): Promise<IBootstrap> {
	const appContainer = new Container()
	appContainer.load(appBindings)
	const app = appContainer.get<App>(TYPES.Application)
	await app.init()
	return { appContainer, app }
}

export const boot = bootstrap()
