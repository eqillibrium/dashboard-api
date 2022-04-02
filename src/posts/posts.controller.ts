import { BaseController } from '../common/base.controller'
import { IPostsController } from './posts.controller.interface'
import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { ILogger } from '../logger/logger.interface'
import { ValidateMiddleware } from '../common/validate.middleware'
import { PostCreateDto } from './dto/post-create.dto'
import { NextFunction, Request, Response } from 'express'
import { IPostService } from './post.service.interface'
import { IControllerRoute } from '../common/route.interface'

@injectable()
export class PostsController extends BaseController implements IPostsController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.PostService) private postService: IPostService,
	) {
		super(loggerService)
		this.bindRoutes([
			{
				path: '/create',
				method: 'post',
				func: this.createPost,
				middlewares: [new ValidateMiddleware(PostCreateDto)],
			},
		])
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		super.bindRoutes(routes)
	}

	async createPost(
		{ body }: Request<{}, {}, PostCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.postService.createPost(body)
		this.ok(res, result)
		return
	}
}
