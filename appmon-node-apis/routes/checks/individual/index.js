import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";
import auth from "../../../middlewares/auth.js";

// import schemas
import Individual from "../../../models/users/Individual.js";
import IndividualChecks from "../../../models/checks/Individual.js";
import config from "../../../config.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          registerCheck:
 *             type: object
 *             required:
 *                - name
 *                - url
 *                - successCodes
 *                - timeoutSeconds
 *                - protocol
 *                - method
 *             example:
 *                name: "check1"
 *                url: "https://google.com"
 *                successCodes: [200, 201]
 *                timeoutSeconds: 120
 *                protocol: "http"
 *                method: "get"
 *          getCheck:
 *             type: object
 *             required:
 *                - id
 *             example:
 *                id: "5ffd5b3c5cbca32636bfa13b"
 *          deleteCheck:
 *             type: object
 *             required:
 *                - id
 *             example:
 *                id: "5ffd5b3c5cbca32636bfa13b"
 *          updateCheck:
 *             type: object
 *             required:
 *                - id
 *                - name
 *                - url
 *                - successCodes
 *                - timeoutSeconds
 *                - protocol
 *                - method
 *             example:
 *                id: "5ffd5b3c5cbca32636bfa13b"
 *                name: "check1_new"
 *                url: "https://google.com"
 *                successCodes: [200, 201, 203]
 *                timeoutSeconds: 120
 *                protocol: "http"
 *                method: "get"
 */

/**
 * @swagger
 *
 * /api/checks/individual/check:
 *    post:
 *       tags:
 *          - "IndividualChecks"
 *       summary: Get specific Check details for Individual User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Check Id
 *            description: individual check id
 *            schema:
 *               $ref: '#/components/schemas/getCheck'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '500':
 *             description: Server Error
 */

router.post(
  "/check",
  [
    body("id", "Enter a valid Check Id")
      .isString()
      .notEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      const { id } = req.body;

      //Verify if a individual user exist with the token provided
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }
      const individualData = await Individual.findOne({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      //Get the Individual Check data for the given id
      const individualCheckData = await IndividualChecks.findOne({ _id: id });
      if (!individualCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      res.status(helpers.statusCodes.SUCCESS).json({ individualCheckData });
    } catch (err) {
      console.error(err.message);
      return res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ message: "Server Error!" });
    }
  }
);

/**
 * @swagger
 *
 * /api/checks/individual/all:
 *    get:
 *       tags:
 *          - IndividualChecks
 *       summary: Get all Checks details for Individual User
 *       security:
 *          - Bearer: [auth-token]
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '500':
 *             description: Server Error
 */

router.get("/all", auth, async (req, res) => {
  try {
    //Verify if a individual user exist with the token provided
    if (!req.individual) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised. No Indivdual User available with this token"
      });
    }
    const individualData = await Individual.findOne({
      _id: req.individual.individual
    });
    if (!individualData) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised. No Indivdual User available with this token"
      });
    }

    //Check if there are any checks available for this user
    const checks = individualData.checks;
    if (checks.length <= 0) {
      return res
        .status(helpers.statusCodes.NOT_FOUND)
        .json({ message: "There are no checks available for this user" });
    }

    //Get all individual checks details
    var allChecks = [];
    for (let i = 0; i < checks.length; i++) {
      let res = await IndividualChecks.findOne({ _id: checks[i] });
      allChecks.push(res);
    }
    res.status(helpers.statusCodes.SUCCESS).json({ allChecks });
  } catch (err) {
    console.error(err.message);
    return res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ message: "Server Error!" });
  }
});

/**
 * @swagger
 *
 * /api/checks/individual:
 *    post:
 *       tags:
 *          - IndividualChecks
 *       summary: Add a new Check for Individual User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Individual Check
 *            description: Add new individual check attributes
 *            schema:
 *               $ref: '#/components/schemas/registerCheck'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '500':
 *             description: Server Error
 */

router.post(
  "/",
  [
    body("name", "Enter a valid Check Name")
      .isString()
      .notEmpty(),
    body("url", "Enter a valid URL").isString(),
    body("successCodes", "Enter a valid Success Code").isArray(),
    body(
      "timeoutSeconds",
      "Enter a valid Timeout. It should be between 1-60"
    ).custom((value) => {
      if (
        typeof value === "number" &&
        value % 1 === 0 &&
        value >= 1 &&
        value <= 60
      ) {
        return true;
      }
      return false;
    }),
    body("protocol", "Enter a valid Protocol").isString(),
    body("method", "Enter a valid Method").isString()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      const {
        name,
        url,
        successCodes,
        timeoutSeconds,
        protocol,
        method
      } = req.body;

      //Verify if a individual user exist with the token provided
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }
      const individualData = await Individual.findOne({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      //Verify if check with same name already exist
      const individualCheckData = await IndividualChecks.findOne({
        name,
        individual: individualData._id,
      });
      if (individualCheckData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "Check with same name already exists for this user!"
        });
      }

      //Get total number of existing checks
      const totalExistingChecks =
        typeof individualData.checks === "object" &&
        individualData.checks instanceof Array
          ? individualData.checks
          : [];

      //Check maxchecks count
      if (totalExistingChecks.length >= config.maxChecks) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: `User already exhausted maximum number of Checks. The limit is ${config.maxChecks}`
        });
      }

      //Create check object and save
      const checkObject = {
        name,
        url,
        successCodes,
        timeoutSeconds,
        protocol,
        method,
        individual: individualData._id
      };
      const newIndividualCheck = new IndividualChecks(checkObject);
      await newIndividualCheck.save();

      //Add new check to Individual collection
      individualData.checks = totalExistingChecks;
      individualData.checks.push(newIndividualCheck._id);
      await individualData.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "New Check Created Successfuly" });
    } catch (err) {
      console.error(err.message);
      return res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ message: "Server Error!" });
    }
  }
);

/**
 * @swagger
 *
 * /api/checks/individual:
 *    put:
 *       tags:
 *          - IndividualChecks
 *       summary: Update specific Check for Individual User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Update Check Attributes
 *            description: Update Existing Check. check Id is required, other params are optional
 *            schema:
 *               $ref: '#/components/schemas/updateCheck'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '500':
 *             description: Server Error
 */

router.put(
  "/",
  [
    body("id", "Enter a valid Check Id")
      .isString()
      .notEmpty(),
    body("name").custom(value => {
      if (value && typeof value !== "string") {
        throw new Error("Invalid Check Name");
      } else return true;
    }),
    body("url").custom(value => {
      if (value && typeof value !== "string") {
        throw new Error("Invalid URL");
      } else return true;
    }),
    body("successCodes").custom(value => {
      if (value && typeof value !== "object") {
        throw new Error("Invalid Success codes");
      } else return true;
    }),
    body("timeoutSeconds").custom(value => {
      if (value && typeof value !== "number") {
        throw new Error("Invalid Timeout");
      } else return true;
    }),
    body("protocol").custom(value => {
      if (value && typeof value !== "string") {
        throw new Error("Invalid Protocol");
      } else return true;
    }),
    body("method").custom(value => {
      if (value && typeof value !== "string") {
        throw new Error("Invalid Protocol");
      } else return true;
    })
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      let {
        name,
        url,
        successCodes,
        timeoutSeconds,
        protocol,
        method,
        id
      } = req.body;

      //Verify if a individual user exist with the token provided
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }
      const individualData = await Individual.findOne({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      //Get optional fields from request payload
      name =
        typeof name === "string" && name.trim().length > 0
          ? name.trim()
          : false;
      protocol =
        typeof protocol === "string" && ["http", "https"].indexOf(protocol) > -1
          ? protocol
          : false;
      url =
        typeof url === "string" && url.trim().length > 0 ? url.trim() : false;
      method =
        typeof method === "string" &&
        ["post", "get", "put", "delete"].indexOf(method) > -1
          ? method
          : false;
      successCodes =
        typeof successCodes === "object" &&
        successCodes instanceof Array &&
        successCodes.length > 0
          ? successCodes
          : false;
      timeoutSeconds =
        typeof timeoutSeconds === "number" &&
        timeoutSeconds % 1 === 0 &&
        timeoutSeconds >= 1 &&
        timeoutSeconds <= 60
          ? timeoutSeconds
          : false;
      if (
        !id &&
        !(protocol || url || method || successCodes || timeoutSeconds)
      ) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Validation failed/Missing fields" });
      }

      //Get Individual Check data for the given id
      let individualCheckData = await IndividualChecks.findOne({ _id: id });
      if (!individualCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      //Update the Check data with new values
      if (name) {
        individualCheckData.name = name;
      }
      if (protocol) {
        individualCheckData.protocol = protocol;
      }
      if (url) {
        individualCheckData.url = url;
      }
      if (method) {
        individualCheckData.method = method;
      }
      if (successCodes) {
        individualCheckData.successCodes = successCodes;
      }
      if (timeoutSeconds) {
        individualCheckData.timeoutSeconds = timeoutSeconds;
      }
      await individualCheckData.save();
      res.status(helpers.statusCodes.SUCCESS).json({ individualCheckData });
    } catch (err) {
      console.error(err.message);
      return res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ message: "Server Error!" });
    }
  }
);

/**
 * @swagger
 *
 * /api/checks/individual:
 *    delete:
 *       tags:
 *          - IndividualChecks
 *       summary: Delete specific Check for Individual User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Delete Check
 *            description: Delete existing check. check Id is required
 *            schema:
 *               $ref: '#/components/schemas/deleteCheck'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '500':
 *             description: Server Error
 */

router.delete(
  "/",
  [
    body("id", "Enter a valid Check Id")
      .isString()
      .notEmpty()
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      const { id } = req.body;

      //Verify if a individual user exist with the token provided
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }
      const individualData = await Individual.findOne({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      //Get Individual Check data for the given id
      const individualCheckData = await IndividualChecks.findOne({ _id: id });
      if (!individualCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      //Delete check data from Individual Check collection
      await IndividualChecks.deleteOne({ _id: id });

      //Delete check data from Individual collection
      individualData.checks.splice(individualData.checks.indexOf(id), 1);
      await individualData.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "Check deleted successfully" });
    } catch (err) {
      console.error(err.message);
      return res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ message: "Server Error!" });
    }
  }
);

export default router;
