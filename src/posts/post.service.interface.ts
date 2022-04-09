import { PostCreateDto } from './dto/post-create.dto'
import { PostModel } from '@prisma/client'

export interface IPostService {
	createPost: (dto: PostCreateDto) => Promise<PostModel | null>
	findPost: (title: string) => Promise<PostModel | null>
}
