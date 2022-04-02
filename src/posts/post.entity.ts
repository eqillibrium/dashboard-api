export class PostEntity {
	constructor(public _title: string, public _description: string) {}

	get description(): string {
		return this._description
	}

	set description(value: string) {
		this._description = value
	}

	get title(): string {
		return this._title
	}

	set title(value: string) {
		this._title = value
	}
}
