import { UserEntity } from './user.entity'
import { UserRegisterDto } from './dto/user-register.dto'

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserEntity | null>
}
