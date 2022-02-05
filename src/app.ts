import express, { Express } from 'express'
import { usersRouter } from './users/users.js'
import { Server } from 'http'
import { LoggerService } from './logger/logger.service.js'

class App {
    app: Express
    port: number
    server: Server
    logger: LoggerService

    constructor(port: number, logger: LoggerService) {
        this.app = express()
        this.port = port
        this.logger = logger
    }

    useRoutes() {
        this.app.use('/users', usersRouter)
    }

    public async init() {
        this.useRoutes()
        this.server = this.app.listen(this.port)
        this.logger.log(`Started on ${this.port}`)
    }
}

export { App }
