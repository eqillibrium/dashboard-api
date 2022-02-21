import { inject, injectable } from 'inversify'
import { IUserService } from './user.service.inteface'
import { UserRegisterDto } from './dto/user-register.dto'
import { UserEntity } from './user.entity'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserEntity | null> {
		const newUser = new UserEntity(email, name)
		await newUser.setPassword(password)
		return newUser
	}
}
