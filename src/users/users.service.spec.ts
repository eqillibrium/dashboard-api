import 'reflect-metadata'
import { Container } from 'inversify'
import { IConfigService } from '../config/config.service.interface'
import { IUserRepository } from './user.repository.interface'
import { IUserService } from './user.service.inteface'
import { UserService } from './user.service'
import { TYPES } from '../types'
import { UserEntity } from './user.entity'
import { UserModel } from '@prisma/client'

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
}

const UserRepositoryMock: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
}

const container = new Container()

let configService: IConfigService
let userRepository: IUserRepository
let userService: IUserService

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService)
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock)
	container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(UserRepositoryMock)

	configService = container.get<IConfigService>(TYPES.ConfigService)
	userRepository = container.get<IUserRepository>(TYPES.UserRepository)
	userService = container.get<IUserService>(TYPES.UserService)
})

let createdUser: UserModel | null

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1')
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: UserEntity): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		)
		createdUser = await userService.createUser({
			email: 'a@mail.ru',
			name: 'John Doe',
			password: '12345',
		})
		expect(createdUser?.id).toEqual(1)
		expect(createdUser?.password).not.toEqual('12345')
	})

	it('validateUser - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser)
		const result = await userService.validateUser({
			email: 'a@mail.ru',
			password: '12345',
		})
		expect(result).toBeTruthy()
	})

	it('validateUser - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser)
		const result = await userService.validateUser({
			email: 'a@mail.ru',
			password: '1',
		})
		expect(result).toBeFalsy()
	})

	it('validateUser - wrong user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null)
		const result = await userService.validateUser({
			email: 'a@mail.ru',
			password: '1',
		})
		expect(result).toBeFalsy()
	})
})
