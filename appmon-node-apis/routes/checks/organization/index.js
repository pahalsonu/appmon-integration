import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";

import auth from "../../../middlewares/auth.js";
import config from "../../../config.js";
// import schemas
import OrganizationChecks from "../../../models/checks/Organization.js";
import Organization from "../../../models/users/Organization.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          OrganizationChecks:
 *             type: object
 *             required:
 *                - name
 *                - url
 *                - successCodes
 *                - timeoutSeconds
 *                - protocol
 *                - method
 *                - location
 *             example:
 *                name: check-1
 *                url: google.com
 *                successCodes: [200,201]
 *                timeoutSeconds: 60
 *                protocol: http
 *                method: get
 *                location: Australia
 *          UpdateOrganizationCheck:
 *             type: object
 *             required:
 *                - id
 *                - name
 *                - url
 *                - successCodes
 *                - timeoutSeconds
 *                - protocol
 *                - method
 *                - location
 *             example:
 *                id: 5ffa87f6e8b8bdb8449a2043
 *                name: check-1
 *                url: google.com
 *                successCodes: [200,201]
 *                timeoutSeconds: 60
 *                protocol: http
 *                method: get
 *                location: Australia
 *          OrganizationCheckID:
 *             type: object
 *             required:
 *                - id
 *             example:
 *                id: 5ffa87f6e8b8bdb8449a2043
 */

/**
 * @swagger
 *
 * /api/checks/organization/check:
 *    post:
 *       tags:
 *          - "OrganizationChecks"
 *       summary: Get Checks by ID
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Organization Check
 *            description: Delete Organization Check Attributes
 *            schema:
 *               $ref: '#/components/schemas/OrganizationCheckID'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '404':
 *             description: Not Found
 *          '500':
 *             description: Server Error
 */
router.post(
  "/check",
  [body("id", "Enter a valid Check Id").isString().notEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      if (!req.organization) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "UnAuthorized. No Organization User exists with this token.",
        });
      }
      const { id } = req.body;

      //Verify if a organization user exist with the token provided
      if (!req.organization) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
        });
      }
      const organizationData = await Organization.findOne({
        _id: req.organization.organization,
      });
      if (!organizationData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message:
            "Unauthorised. No Organization User available with this token",
        });
      }

      //Get the organization Check data for the given id
      const organizationCheckData = await OrganizationChecks.findOne({
        _id: id,
      });
      if (!organizationCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      res.status(helpers.statusCodes.SUCCESS).json({ organizationCheckData });
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
 * /api/checks/organization/all:
 *    get:
 *       tags:
 *          - "OrganizationChecks"
 *       summary: Get All Checks of an Organization
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '404':
 *             description: Not Found
 *          '500':
 *             description: Server Error
 */
router.get("/all", auth, async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token.",
      });
    }
    //Verify if a organization user exist with the token provided
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised. No organization User available with this token",
      });
    }
    const organizationData = await Organization.findOne({
      _id: req.organization.organization,
    });
    if (!organizationData) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised. No organization User available with this token",
      });
    }

    //Check if there are any checks available for this user
    const checks = organizationData.checks;
    if (checks.length <= 0) {
      return res
        .status(helpers.statusCodes.NOT_FOUND)
        .json({ message: "There are no checks available for this user" });
    }

    //Get all organization checks details
    var allChecks = [];
    for (let i = 0; i < checks.length; i++) {
      let res = await OrganizationChecks.findOne({ _id: checks[i] });
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
 * /api/checks/organization:
 *    post:
 *       tags:
 *          - "OrganizationChecks"
 *       summary: Create Organization Checks
 *       consumes:
 *          - application/json
 *       security:
 *          - Bearer: [auth-token]
 *       parameters:
 *          - in: body
 *            name: Organization Checks
 *            description: Create new Check for Organization
 *            schema:
 *               $ref: '#/components/schemas/OrganizationChecks'
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
    body("name", "Enter a valid Check Name").isString().notEmpty(),
    body("url", "Enter a valid URL").isString(),
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
    body("timeoutSeconds", "Enter a valid Timeout").isNumeric(),
    body("protocol", "Enter a valid Protocol").isString(),
    body("method", "Enter a valid Method").isString(),
    body("location", "Enter a valid Location").isString(),
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
      //Verify if a organization user exist with the token provided
      if (!req.organization) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "UnAuthorized. No Organization User exists with this token.",
        });
      }
      const {
        name,
        url,
        successCodes,
        timeoutSeconds,
        protocol,
        method,
        location,
      } = req.body;

      const organizationData = await Organization.findOne({
        _id: req.organization.organization,
      });
      if (!organizationData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
        });
      }

      //Verify if check with same name already exist
      const organizationCheckData = await OrganizationChecks.findOne({
        name,
        organization: organizationData._id,
      });
      if (organizationCheckData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "Check with same name already exists for this user!",
        });
      }

      //Get total number of existing checks
      const totalExistingChecks =
        typeof organizationData.checks === "object" &&
        organizationData.checks instanceof Array
          ? organizationData.checks
          : [];

      //Check maxchecks count
      if (totalExistingChecks.length >= config.maxChecks) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: `User already exhausted maximum number of Checks. The limit is ${config.maxChecks}`,
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
        organization: organizationData._id,
        location,
      };
      const neworganizationCheck = new OrganizationChecks(checkObject);
      await neworganizationCheck.save();

      //Add new check to organization collection
      organizationData.checks = totalExistingChecks;
      organizationData.checks.push(neworganizationCheck._id);
      await organizationData.save();

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
 * /api/checks/organization:
 *    put:
 *       tags:
 *          - "OrganizationChecks"
 *       summary: Update Organization Check
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Organization Check
 *            description: Update Organization Check Attributes
 *            schema:
 *               $ref: '#/components/schemas/UpdateOrganizationCheck'
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
    body("id", "Enter a valid Check Id").isString().notEmpty(),
    body("name", "Enter a valid Check Name").custom((value) => {
      if (value && typeof value !== "string") {
        return false;
      }
      return true;
    }),
    body("url", "Enter a valid URL")
      .isString()
      .custom((value) => {
        if (value && typeof value !== "string") {
          return false;
        }
        return true;
      }),
    body("successCodes", "Enter a valid Success Code").custom((value) => {
      if (value && typeof value !== "object") {
        return false;
      }
      return true;
    }),
    body("timeoutSeconds", "Enter a valid Timeout").custom((value) => {
      if (value && typeof value !== "number") {
        return false;
      }
      return true;
    }),
    body("protocol", "Enter a valid Protocol").custom((value) => {
      if (value && typeof value !== "string") {
        return false;
      }
      return true;
    }),
    body("method", "Enter a valid Method").custom((value) => {
      if (value && typeof value !== "string") {
        return false;
      }
      return true;
    }),
    body("location", "Enter a valid Location").custom((value) => {
      if (value && typeof value !== "string") {
        return false;
      }
      return true;
    }),
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
      //Verify if a organization user exist with the token provided
      if (!req.organization) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
        });
      }
      let {
        name,
        url,
        successCodes,
        timeoutSeconds,
        protocol,
        method,
        id,
        location,
      } = req.body;

      const organizationData = await Organization.findOne({
        _id: req.organization.organization,
      });
      if (!organizationData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
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
        timeoutSeconds <= 5
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

      //Get organization Check data for the given id
      let organizationCheckData = await OrganizationChecks.findOne({ _id: id });
      if (!organizationCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      //Update the Check data with new values
      if (name) {
        organizationCheckData.name = name;
      }
      if (protocol) {
        organizationCheckData.protocol = protocol;
      }
      if (url) {
        organizationCheckData.url = url;
      }
      if (method) {
        organizationCheckData.method = method;
      }
      if (successCodes) {
        organizationCheckData.successCodes = successCodes;
      }
      if (timeoutSeconds) {
        organizationCheckData.timeoutSeconds = timeoutSeconds;
      }
      if (location) {
        organizationCheckData.location = location;
      }
      await organizationCheckData.save();
      res.status(helpers.statusCodes.SUCCESS).json({ organizationCheckData });
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
 * /api/checks/organization:
 *    delete:
 *       tags:
 *          - "OrganizationChecks"
 *       summary: Delete Organization Check
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Organization Check
 *            description: Delete Organization Check Attributes
 *            schema:
 *               $ref: '#/components/schemas/OrganizationCheckID'
 *       responses:
 *          '200':
 *             description: Success
 *          '400':
 *             description: Bad Request
 *          '401':
 *             description: UnAuthorized
 *          '404':
 *             description: Not Found
 *          '500':
 *             description: Server Error
 */
router.delete(
  "/",
  [body("id", "Enter a valid Check Id").isString().notEmpty()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      //Verify if a organization user exist with the token provided
      if (!req.organization) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
        });
      }
      const { id } = req.body;

      const organizationData = await Organization.findOne({
        _id: req.organization.organization,
      });
      if (!organizationData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token",
        });
      }

      //Get organization Check data for the given id
      const organizationCheckData = await OrganizationChecks.findOne({
        _id: id,
      });
      if (!organizationCheckData) {
        return res
          .status(helpers.statusCodes.NOT_FOUND)
          .json({ message: "Check id doesn't exist" });
      }

      //Delete check data from organization Check collection
      await OrganizationChecks.deleteOne({ _id: id });

      //Delete check data from organization collection
      organizationData.checks.splice(organizationData.checks.indexOf(id), 1);
      await organizationData.save();

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
