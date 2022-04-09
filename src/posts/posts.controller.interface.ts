import { NextFunction, Request, Response } from 'express'
import { PostCreateDto } from './dto/post-create.dto'

export interface IPostsController {
	createPost: (req: Request<{}, {}, PostCreateDto>, res: Response, next: NextFunction) => void
	// findPost: (req: Request, res: Response, next: NextFunction) => void
}
