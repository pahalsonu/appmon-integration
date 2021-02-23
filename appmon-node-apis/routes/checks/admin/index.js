import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";
import auth from "../../../middlewares/auth.js";

// import schemas
import IndividualChecks from "../../../models/checks/Individual.js";
import OrganizationChecks from "../../../models/checks/Organization.js";
import Admin from "../../../models/users/Admin.js";
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          User:
 *             type: object
 *             required:
 *                - id
 *             example:
 *                id: ObjectID1234567890
 */

/**
 * @swagger
 *
 * /api/checks/admin/user-checks:
 *    post:
 *       tags:
 *          - "Admin"
 *       summary: Get all Checks for a Particular User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: User
 *            description: User Id
 *            schema:
 *               $ref: '#/components/schemas/User'
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
  "/user-checks",
  [
    body("id", "Enter a valid user id")
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

      //Verify if an admin exist with the token provided
      if (!req.admin) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised."
        });
      }
      const adminData = await Admin.findOne({
        _id: req.admin.admin
      });
      if (!adminData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised."
        });
      }

      //Verify a user exist with provided id
      const individualData = await Individual.findOne({ _id: id }).populate(
        "checks"
      );
      if (individualData) {
        return res
          .status(helpers.statusCodes.SUCCESS)
          .json(individualData.checks);
      }

      const organizationData = await Organization.findOne({ _id: id }).populate(
        "checks"
      );
      if (organizationData) {
        return res
          .status(helpers.statusCodes.SUCCESS)
          .json(organizationData.checks);
      }

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "User does not have any checks" });
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
 * /api/checks/admin/all-checks:
 *    get:
 *       tags:
 *          - "Admin"
 *       summary: Get Checks for all the users
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
 *          '500':
 *             description: Server Error
 */
/**--------------------------------------------------------
 * Get All Checks Information
 * 
 * @method       GET
 * @path         /api/checks/admin/allChecks
 * @params       none
 * @required     none
 * @optional     none
 * @privateRoute yes
 ----------------------------------------------------------*/
router.get("/all-checks", auth, async (req, res) => {
  try {
    //Verify if an admin exist with the token provided
    if (!req.admin) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised."
      });
    }

    const adminData = await Admin.findOne({
      _id: req.admin.admin
    });
    if (!adminData) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "Unauthorised."
      });
    }

    let individualCheckData = await IndividualChecks.find({}).populate(
      "individual",
      "firstName lastName email"
    );
    let organizationCheckData = await OrganizationChecks.find({}).populate(
      "organization",
      "firstName lastName email"
    );

    //Verify if checks exist in both Individual and Organization Checks collections
    if (!(individualCheckData || organizationCheckData)) {
      return res
        .status(helpers.statusCodes.NOT_FOUND)
        .json({ message: "No Users Found!" });
    }

    //Combine the result arrays and return the response
    const allChecks = [...individualCheckData, ...organizationCheckData];
    return res.status(helpers.statusCodes.SUCCESS).json({ allChecks });
  } catch (err) {
    console.error(err.message);
    return res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ message: "Server Error!" });
  }
});

export default router;
