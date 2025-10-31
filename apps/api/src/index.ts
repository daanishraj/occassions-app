import { initAppServer } from "./app";
import { config } from "./utils/config";
import { logger } from "./utils/logger";

let host = "";
const dbUrl = process.env.DATABASE_URL;
try {
  if (dbUrl) {
    host = new URL(dbUrl).host;
  } else {
    logger.info("DATABASE_URL is not set");
  }
} catch {
  logger.info("Invalid DATABASE_URL; could not parse host");
}

const app = initAppServer();

app.listen(config.PORT, () => {
  logger.info(`Database host: ${host}`);
  logger.info(`Server running on port ${config.PORT}`);
});
