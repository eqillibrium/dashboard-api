import { IPostRepository } from './post.repository.interface'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { PrismaService } from '../database/prisma.service'
import { PostEntity } from './post.entity'
import { PostModel } from '@prisma/client'

@injectable()
export class PostRepository implements IPostRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async create({ title, description }: PostEntity): Promise<PostModel> {
		return this.prismaService.client.postModel.create({
			data: {
				title,
				description,
			},
		})
	}

	async find(title: string): Promise<PostModel | null> {
		return this.prismaService.client.postModel.findFirst({
			where: {
				title,
			},
		})
	}
}
