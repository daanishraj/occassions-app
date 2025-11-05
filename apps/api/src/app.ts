import cors from "cors";
import express from "express";
import "express-async-errors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json())

// General Health check
app.get("/", (req, res) => {
    res.send("✅ Server is running");
  });

  // Routes
  app.use('/', routes)

  /** 
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test'){
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
*/

export const initAppServer = () => {
  return app;
}

export default app;