import http from "node:http";
import { envConfig } from "./config/env";
import Server from "./server";
import database from "./config/db";
import { LoggingService } from "./utils/logger";

const startServer = async () => {
  const server = new Server();
  const app = server.getServer().build();

  /**
   * Serve front-end content.
   */
  const httpServer = http.createServer(app);

  process.on("unhandledRejection", (error, promise) => {
    LoggingService.warn({ error, promise, "@": "@process unhandledRejection" });
  });

  if (envConfig.env !== "production") {
    process.on("warning", (warning) => {
      LoggingService.warn(warning);
    });
  }

  // test sequelize connection
  try {
    await database.authenticate();
    LoggingService.info("Database connection Successful");
  } catch (e) {
    LoggingService.error(`Unable to Connect to DB: ${e}`);
  }

  const port = envConfig.port || 9000;
  httpServer.listen(port, () => {
    LoggingService.info(
      `shopRUs service listening for connections on port: ${port}`
    );
  });
};

startServer()
  .then(() => {
    LoggingService.info("Server started");
  })
  .catch((error) => LoggingService.error(error));
