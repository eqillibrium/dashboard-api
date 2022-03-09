import { inject, injectable } from 'inversify'
import { IUserService } from './user.service.inteface'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserEntity } from './user.entity'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import { IUserRepository } from './user.repository.interface'
import { UserModel } from '@prisma/client'
import { UserLoginDto } from './dto/user-login.dto'

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new UserEntity(email, name)
		await newUser.setPassword(password)
		const isExists = await this.userRepository.find(email)
		if (isExists) {
			return null
		}
		return this.userRepository.create(newUser)
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const isExists = await this.userRepository.find(email)
		if (!isExists) {
			return false
		}
		const newUser = new UserEntity(isExists.email, isExists.name, isExists.password)
		return await newUser.comparePassword(password)
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.userRepository.find(email)
	}
}
