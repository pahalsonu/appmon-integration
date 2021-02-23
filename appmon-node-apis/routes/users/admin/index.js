import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";
import auth from "../../../middlewares/auth.js";

// import schemas
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";
import Admin from "../../../models/users/Admin.js";
import IndividualProfile from "../../../models/users/IndividualProfile.js";
import OrganizationProfile from "../../../models/users/OrganizationProfile.js";
import IndividualChecks from "../../../models/checks/Individual.js";
import OrganizationChecks from "../../../models/checks/Organization.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          Admin:
 *             type: object
 *             required:
 *                - role
 *                - firstName
 *                - lastName
 *                - phone
 *                - email
 *                - password
 *                - confirmPassword
 *             example:
 *                role: admin
 *                firstName: Mark
 *                lastName: Malcolm
 *                phone: 4354254354
 *                email: mark.m@appmon.com
 *                password: Mark@123
 *                confirmPassword: Mark@123
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
 * /api/users/admin/all-users:
 *    get:
 *       tags:
 *          - "Admin"
 *       summary: Get All Users Basic Information
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
router.get("/all-users", auth, async (req, res) => {
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

    const individualData = await Individual.find(
      {},
      { password: false, emailToken: false }
    );
    const organizationData = await Organization.find(
      {},
      { password: false, emailToken: false }
    );

    //Check if users exist in both Individual and Organization collections
    if (!(individualData || organizationData)) {
      return res
        .status(helpers.statusCodes.NOT_FOUND)
        .json({ message: "No Users Found!" });
    }

    //Combine the result arrays and return the response
    const allUsers = [...individualData, ...organizationData];
    return res.status(helpers.statusCodes.SUCCESS).json({ allUsers });
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
 * /api/users/admin/user:
 *    post:
 *       tags:
 *          - "Admin"
 *       summary: Get a User's Basic Information
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
  "/user",
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
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }
      const adminData = await Admin.findOne({
        _id: req.admin.admin
      });
      if (!adminData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      //Verify a user exist with provided id
      const individualData = await Individual.findOne(
        { _id: id },
        { password: false, emailToken: false }
      );
      if (individualData) {
        return res.status(helpers.statusCodes.SUCCESS).json(individualData);
      }

      const organizationData = await Organization.findOne(
        { _id: id },
        { password: false, emailToken: false }
      );
      if (organizationData) {
        return res.status(helpers.statusCodes.SUCCESS).json(organizationData);
      }

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "User does not Exists" });
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
 * /api/users/admin/register:
 *    post:
 *       tags:
 *          - "Admin"
 *       summary: Register an Admin
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Admin
 *            description: Admin's Basic Information
 *            schema:
 *               $ref: '#/components/schemas/Admin'
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
  "/register",
  [
    body("firstName", "Enter a valid First Name")
      .isString()
      .notEmpty(),
    body("lastName", "Enter a valid Last Name").isString(),
    body("email", "Enter a valid email").isEmail(),
    body("role", "The Role must be Individual").custom((value, { req }) => {
      if (value === "admin") {
        return true;
      } else {
        return false;
      }
    }),
    body("password", "Minimum 6 character required").isLength({ min: 6 }),
    body("phone", "Enter a Valid Phone Number.").isNumeric(),
    body("confirmPassword", "Both Password must be same").custom(
      (value, { req }) => {
        if (value === req.body.password) {
          return true;
        } else {
          return false;
        }
      }
    )
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }

    try {
      const { role, firstName, lastName, password, email, phone } = req.body;

      //Check if user already exist in individual collection
      const individualData = await Individual.findOne({ email });
      if (individualData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "User with this Email already Registered as Individual"
        });
      }

      //Check if user already exist in organization collection
      const organizationData = await Organization.findOne({ email });
      if (organizationData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "User with this Email already Registered as Organization"
        });
      }

      //Check if user already exist in admin collection
      const adminData = await Admin.findOne({ email });
      if (adminData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "User with this Email already Registered as Admin"
        });
      }

      //Hash the password
      const hashedPassword = await helpers.hash(password);

      //Get the email token
      const adminObject = {
        role,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone
      };

      //Save the Data
      const admin = new Admin(adminObject);
      await admin.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "Admin Registerd Successfully." });
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
 * /api/users/admin/user/de-register:
 *    delete:
 *       tags:
 *          - "Admin"
 *       summary: Admin De-Register a User
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: User
 *            description: User ID
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
router.delete(
  "/user/de-register",
  [
    [
      body("id", "Enter a valid user id")
        .isString()
        .notEmpty()
    ],
    auth
  ],
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
      const adminData = await Admin.findOne({
        _id: req.admin.admin
      });
      if (!adminData) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "Unauthorised. No Indivdual User available with this token"
        });
      }

      const individualData = await Individual.findById(id);
      if(individualData) {

        await IndividualProfile.findOneAndDelete({
          individual: id
        });
  
        await IndividualChecks.deleteMany({
          individual: id
        });
  
        await individualData.deleteOne({ _id: id });
  
        return res
          .status(helpers.statusCodes.SUCCESS)
          .json({ success: "Individual Account Successfully De-Registered" });
      }

      const organizationData = await Organization.findById(id);
      if(organizationData) {

        await OrganizationProfile.findOneAndDelete({
          organization: id
        });
  
        await OrganizationChecks.deleteMany({
          organization: id
        });
  
        await organizationData.deleteOne({ _id: id });
  
        return res
          .status(helpers.statusCodes.SUCCESS)
          .json({ success: "Organization Account Successfully De-Registered" });
      }

      return res
      .status(helpers.statusCodes.NOT_FOUND)
      .json({ success: "Account does not exists." });
      
    } catch (error) {
      console.log(error);
      res.status(401).json({ err: "Account Could Not Be De-Registered" });
    }
  }
);

export default router;