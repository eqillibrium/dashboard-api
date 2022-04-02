import { inject, injectable } from 'inversify'
import { IPostService } from './post.service.interface'
import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import { IPostRepository } from './post.repository.interface'
import { PostCreateDto } from './dto/post-create.dto'
import { PostModel } from '@prisma/client'
import { PostEntity } from './post.entity'

@injectable()
export class PostService implements IPostService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PostRepository) private postRepository: IPostRepository,
	) {}
	async createPost({ title, description }: PostCreateDto): Promise<PostModel | null> {
		const newPost = new PostEntity(title, description)
		const isExists = await this.postRepository.find(title)
		if (isExists) {
			return null
		}
		return this.postRepository.create(newPost)
	}
}
