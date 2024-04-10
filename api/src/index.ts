import app from "./app"

// const config = require('./utils/config')
// const logger = require('./utils/logger')


// app.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`)
// })
app.listen(5000, () => {
  console.log(`Server running on port 5000`)
})