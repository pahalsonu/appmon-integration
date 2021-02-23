/**
 * The Root File to spin off the application
 *
 * @invokes server.init() to create and register user and checks
 * @invokes workers.init() to monitor user checks
 *
 */
import app from "./app.js";
import workers from "./workers.js";

const server = {};

server.init = () => {
  //Start the Server to Process User data and Checks
  app.init();

  //Start the Server background service workers
  workers.init();
};

// process.on("SIGTERM", shutDown);
// process.on("SIGINT", shutDown);

// function shutDown() {
//   server.app.close(() => {
//     log(`Application Stopped.. Freeing PORT:${PORT}`);
//   });
// }

server.init();
