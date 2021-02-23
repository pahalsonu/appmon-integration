//Imports
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
const __dirname = path.resolve();
import dbConnect from "./dbConnect.js";
import helpers from "./lib/helpers.js";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { logger, log } from "./middlewares/logger.js";
import individualRouter from "./routes/users/individual/index.js";
import organizationRouter from "./routes/users/organization/index.js";
import verifyRouter from "./routes/users/verify/index.js";
import loginRouter from "./routes/users/login/index.js";
import individualCheckRouter from "./routes/checks/individual/index.js";
import organizationCheckRouter from "./routes/checks/organization/index.js";
import adminRouter from "./routes/users/admin/index.js";
import adminCheckRouter from "./routes/checks/admin/index.js";

const app = express();
const PORT = process.env.PORT;
dbConnect();

// Extended: https://swagger.io/specification/#infoObject
const SERVER = `http://${process.env.IP}:${process.env.PORT}`;
const swaggerOptions = {
  swaggerDefinition: {
    components: {},
    info: {
      title: "Appmon API's",
      version: "1.0.0",
      description:
        "This is Rest API application Made with Express to manage users and their checks",
      contact: { name: "appmon@gmail.com" },
      servers: [{ url: SERVER, description: "Development Server" }]
    },
    tags: {
      name: "Login",
      name: "Organization",
      name: "Individual",
      name: "Checks",
      name: "OrganizationChecks"
    },
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        name: "auth-token"
      }
    }
  },
  apis: [
    "./routes/users/admin/*.js",
    "./routes/users/individual/*.js",
    "./routes/users/organization/*.js",
    "./routes/users/login/index.js",
    "./routes/checks/admin/*.js",
    "./routes/checks/individual/*.js",
    "./routes/checks/organization/*.js"
  ]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Middlewares
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger);
app.use(express.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//User Routes
app.use("/api/users/individual", individualRouter);
app.use("/api/users/organization", organizationRouter);
app.use("/api/users/login", loginRouter);
app.use("/verify", verifyRouter);

//Check Routes
app.use("/api/checks/individual", individualCheckRouter);
app.use("/api/checks/organization", organizationCheckRouter);

//Admin Routes
app.use("/api/users/admin", adminRouter);
app.use("/api/checks/admin", adminCheckRouter);

app.use("*", (req, res) => {
  res
    .status(helpers.statusCodes.NOT_FOUND)
    .json({ message: "Route is Invalid" });
});

//Server init
export default {
  init: () => {
    //Listen
    app.listen(PORT, () => {

      console.log(`Application started at PORT: ${PORT}`);
    });
  }
};
