import { NextFunction, Request, Response } from 'express'
import { IControllerRoute } from '../common/route.interface'
import { LoggerService } from '../logger/logger.service'
import { BaseController } from '../common/base.controller.js'

export class UsersController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login }
        ])
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        super.bindRoutes(routes);
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register')
    }

    login(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'login')
    }
}
