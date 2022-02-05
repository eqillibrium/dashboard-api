import { Response, Router } from 'express'
import { IControllerRoute } from './route.interface.js'
import { LoggerService } from '../logger/logger.service.js'

export abstract class BaseController {
    private readonly _router: Router

    protected constructor(private logger: LoggerService) {
        this._router = Router()
    }

    get router() {
        return this._router
    }

    public created(res: Response) {
        res.sendStatus(201)
    }

    public send<T>(res: Response, code: number, message: T): Response {
        res.type('application/json')
        return res.status(code).json(message)
    }

    public ok<T>(res: Response, message: T): Response {
        return this.send<T>(res, 200, message)
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        routes.forEach((route) => {
            this.logger.log(`[${route.method}] ${route.path}`)
            const handler = route.func.bind(this)
            this.router[route.method](route.path, handler)
        })
    }
}
