import cors from "cors";
import express from "express";
import "express-async-errors";
import routes from "./routes";
import { NotificationScheduler } from "./services/NotificationScheduler";
import { logger } from "./utils/logger";

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json())

// General Health check
app.get("/", (req, res) => {
    res.send("✅ Server is running");
  });

  //Scheduler Status Check
  let notificationScheduler: NotificationScheduler | null = null;
  app.get("/scheduler/status", (_req, res) => {
    if (!notificationScheduler) {
      return res.status(503).json({ error: "Scheduler not initialized" });
    }
  
    res.json({
      scheduler: notificationScheduler.getStatus(),
      serverTime: new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Berlin',
        timeZoneName: 'short'
      })
    });
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

// Graceful shutdown of scheduler
const setupGracefulShutdown = (scheduler: NotificationScheduler) => {
  const shutdown = (signal: NodeJS.Signals) => {
    logger.info(`${signal} received — stopping scheduler...`);
    scheduler.stop();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

export const initAppServer = () => {
  logger.info("Starting Notification Scheduler...");
  notificationScheduler = new NotificationScheduler();
  notificationScheduler.start();
  setupGracefulShutdown(notificationScheduler);
  return app;
}

export default app;