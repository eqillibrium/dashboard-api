import { IsString } from 'class-validator'

export class PostCreateDto {
	@IsString({ message: 'Не указан заголовок' })
	title: string

	@IsString({ message: 'Не указан текст статьи' })
	description: string
}
