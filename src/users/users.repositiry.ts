import { IUserRepository } from './user.repository.interface'
import { UserEntity } from './user.entity'
import { UserModel } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { PrismaService } from '../database/prisma.service'
import { TYPES } from '../types'

@injectable()
export class UsersRepositiry implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ email, password, name }: UserEntity): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		})
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		})
	}
}
