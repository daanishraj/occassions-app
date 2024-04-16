import { config } from "./utils/config"
import app from "./app"
import { logger } from "./utils/logger"

// const logger = require('./utils/logger')

console.log({config});


app.listen(config.PORT, () => {
logger.info(`Server running on port ${config.PORT}`)
})