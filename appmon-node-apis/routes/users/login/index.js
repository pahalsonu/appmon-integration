import express from "express";
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";

const router = express.Router();

// import schemas
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";
import Admin from "../../../models/users/Admin.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          UserCred:
 *             type: object
 *             required:
 *                - email
 *                - password
 *             properties:
 *                email:
 *                   type: string
 *                   description: email
 *                password:
 *                   type: string
 *                   description: Password
 *             example:
 *                email: andy.m@gmail.com
 *                password: Andy@123
 */

/**
 * @swagger
 *
 * /api/users/login:
 *    post:
 *       tags:
 *          - "Login"
 *       summary: User Login
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: user
 *            description: user login
 *            schema:
 *               $ref: '#/components/schemas/UserCred'
 *       responses:
 *          '200':
 *             description: User Login Successfull
 *          '400':
 *             description: Unauthorized
 */
router.post(
  "/",
  [
    body("email", "Please enter valid email").isEmail(),
    body("password", "Please enter valid password")
      .notEmpty()
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      //Check if it is an admin user
      var re = new RegExp("^[A-Za-z0-9._%+-]+@appmon.com$");

      if (re.test(email)) {
        const admin = await Admin.findOne({ email });
        if (admin) {
          const isMatch = await helpers.compareHash(admin.password, password);
          if (!isMatch) {
            return res
              .status(helpers.statusCodes.UNAUTHORIZED)
              .json({ message: "Incorrect Password. Login failed!" });
          }

          // Create JWT access token for admin
          const payload = {
            admin: admin._id,
            role: admin.role
          };
          const token = helpers.genToken(payload);
          const cipherToken = helpers.cipher(token);

          return res
            .status(helpers.statusCodes.SUCCESS)
            .json({ token: cipherToken });
        }
      }

      //Check if user already exist in any of the available collection
      const individual = await Individual.findOne({ email });
      if (individual) {
        const isMatch = await helpers.compareHash(
          individual.password,
          password
        );
        if (!isMatch) {
          return res
            .status(helpers.statusCodes.UNAUTHORIZED)
            .json({ message: "Incorrect Password. Login failed!" });
        }

        // Create JWT access token for individual
        const payload = {
          individual: individual._id,
          role: individual.role
        };
        const token = helpers.genToken(payload);
        const cipherToken = helpers.cipher(token);

        return res
          .status(helpers.statusCodes.SUCCESS)
          .json({ token: cipherToken });
      }

      const organization = await Organization.findOne({ email });
      if (organization) {
        const isMatch = await helpers.compareHash(
          organization.password,
          password
        );
        if (!isMatch) {
          return res
            .status(helpers.statusCodes.UNAUTHORIZED)
            .json({ message: "Incorrect Password. Login failed!" });
        }

        // Create JWT access token for organization
        const payload = {
          organization: organization._id,
          role: organization.role
        };
        const token = helpers.genToken(payload);
        const cipherToken = helpers.cipher(token);

        return res
          .status(helpers.statusCodes.SUCCESS)
          .json({ token: cipherToken });
      }

      res
        .status(helpers.statusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email address. Login failed!" });
    } catch (err) {
      console.log(err);
      res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ message: "Server Error" });
    }
  }
);

export default router;
