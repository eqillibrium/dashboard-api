import { PostModel, UserModel } from '@prisma/client'
import { PostEntity } from './post.entity'

export interface IPostRepository {
	create: (post: PostEntity) => Promise<PostModel>
	find: (title: string) => Promise<PostModel | null>
}
