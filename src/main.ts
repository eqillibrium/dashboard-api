import { App } from './app.js'
import { LoggerService } from './logger/logger.service.js'

async function bootstrap() {
    const app = new App(8000, new LoggerService())
    await app.init()
}

await bootstrap()
