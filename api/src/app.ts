import cors from "cors";
import express from "express";
import routes from "./routes"

// const config = require('./utils/config')
// require('express-async-errors')
const app = express()
// const middleware = require('./utils/middleware')
// const logger = require('./utils/logger')




app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use('/', routes)
// app.use('/api/users', userRouter)
// app.use('/api/login', loginRouter)

// if (process.env.NODE_ENV === 'test'){
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)


export default app