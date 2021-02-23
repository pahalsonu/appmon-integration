import express from "express";
const router = express.Router();
import { body, validationResult } from "express-validator";
import helpers from "../../../lib/helpers.js";
import mailUser from "../../../lib/mailUser.js";
import gravatar from "gravatar";
import auth from "../../../middlewares/auth.js";

// import schemas
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";
import IndividualProfile from "../../../models/users/IndividualProfile.js";
import IndividualChecks from "../../../models/checks/Individual.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          Individual:
 *             type: object
 *             required:
 *                - role
 *                - firstName
 *                - lastName
 *                - phone
 *                - email
 *                - password
 *                - confirmPassword
 *                - tos
 *             example:
 *                role: individual
 *                firstName: Andy
 *                lastName: M
 *                phone: 9887788990
 *                email: andy.m@gmail.com
 *                password: Andy@123
 *                confirmPassword: Andy@123
 *                tos: true
 *          IndividualProfile:
 *             type: object
 *             required:
 *                - firstName
 *                - lastName
 *                - email
 *                - phone
 *                - userName
 *                - dateOfBirth
 *                - website
 *                - bio
 *                - address
 *                - social
 *             example:
 *                firstName: Andy
 *                lastName: M
 *                email: andy.m@gmail.com
 *                phone: 9887788990
 *                userName: andy_m
 *                password: Andy@123
 *                dateOfBirth: 2010-01-31
 *                website: andy24.com
 *                bio: Hi I am a web developer
 *                address: { line1: "420/1",line2: "tensilvine",city: "meritaculas",state: "zampa",zipCode: "123123" }
 *                social: { facebook: "facebook14",instagram: "instagram14",twitter: "twitter12",github: "github41",linkedIn: "linked123" }
 *          IndividualChangePassword:
 *             type: object
 *             required:
 *                - currentPassword
 *                - newPassword
 *                - confirmPassword
 *             example:
 *                currentPassword: Andy@123
 *                newPassword: Andy@12345
 *                confirmPassword: Andy@12345
 *          IndividualPassword:
 *             type: object
 *             required:
 *                - password
 *             example:
 *                password: Andy@123
 */

/**
 * @swagger
 *
 * /api/users/individual:
 *    get:
 *       tags:
 *          - "Individual"
 *       summary: Get Individual
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
router.get("/", [auth], async (req, res) => {
  try {
    if (!req.individual) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Individual User exists with this token."
      });
    }
    //Check if org  exists
    const individualData = await Individual.findOne(
      {
        _id: req.individual.individual
      },
      { _id: false, password: false, emailToken: false }
    );
    if (!individualData) {
      return res.status(helpers.statusCodes.BAD_REQUEST).json({
        message: "Individual does not exists."
      });
    }
    res.status(helpers.statusCodes.SUCCESS).json({ individualData });
  } catch (error) {
    console.log(error);
    res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ err: "Individual Could not Be Fetched" });
  }
});

/**
 * @swagger
 *
 * /api/users/individual/register:
 *    post:
 *       tags:
 *          - "Individual"
 *       summary: Individual Registration
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Individual
 *            description: Individual Registration Attributes
 *            schema:
 *               $ref: '#/components/schemas/Individual'
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
      if (value === "individual") {
        return true;
      } else {
        return false;
      }
    }),
    body("password").custom(value => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
      if (!re.test(value)) {
        throw new Error(
          "New Password does not meet standards (Min 1 uppercase letter, Min 1 lowercase letter, \
              Min 1 special character, Min 1 number, Min 8 characters, Max 30 characters.)"
        );
      } else return true;
    }),
    body("phone", "Enter a Valid Phone Number.").isNumeric(),
    body("confirmPassword", "Both Password must be same").custom(
      (value, { req }) => {
        if (value === req.body.password) {
          return true;
        } else {
          return false;
        }
      }
    ),
    body("tos", "Please Accept Terms and Conditions.").custom(value => {
      if (value) {
        return true;
      } else {
        return false;
      }
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }

    try {
      const {
        role,
        firstName,
        lastName,
        password,
        email,
        tos,
        phone
      } = req.body;
      //Check if user already exist
      const individualData = await Individual.findOne({ email });
      if (individualData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "User with this Email already exists." });
      }

      //Check if user already is an Organization
      const organizationData = await Organization.findOne({ email });
      if (organizationData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "An Organzation with this Email already exists." });
      }

      //Hash the password
      const hashedPassword = await helpers.hash(password);

      //Get the email token
      const emailToken = helpers.createRandomString();
      const individualObject = {
        role,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        tos,
        emailToken
      };

      //Save the Data
      const individual = new Individual(individualObject);
      await individual.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "User Registerd Successfully." });

      //Send an Email to the user with the email token
      mailUser({
        firstName: individual.firstName,
        email: individual.email,
        subject: "Verification Email",
        html: "verifyEmail",
        uriToken: `/verify/${emailToken}`
      });
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
 * /api/users/individual/profile:
 *    get:
 *       tags:
 *          - "Individual"
 *       summary: Get Individual Profile
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
router.get("/profile", auth, async (req, res) => {
  try {
    if (!req.individual) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Individual User exists with this token."
      });
    }
    const individualProfileData = await IndividualProfile.findOne(
      { individual: req.individual.individual },
      { _id: false }
    ).populate(
      "individual",
      "-_id -password -tos -emailToken -otp"
    );

    if (!individualProfileData) {
      return res.status(helpers.statusCodes.BAD_REQUEST).json({
        message: "Individual Profile does not exists."
      });
    }

    return res.status(helpers.statusCodes.SUCCESS).json(individualProfileData);
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
 * /api/users/individual/profile:
 *    put:
 *       tags:
 *          - "Individual"
 *       summary: Upload Individual Profile
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: IndividualProfile
 *            description: Individual Profile
 *            schema:
 *               $ref: '#/components/schemas/IndividualProfile'
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
  "/profile",
  [
    body("firstName").custom(value => {
      if (value && (value.length < 2 || !/^[a-zA-Z][a-zA-Z]+$/.test(value))) {
        throw new Error(
          "First Name has to be more than a character and can contain only alphabets"
        );
      } else return true;
    }),
    body("lastName").custom(value => {
      if (value && !/^[a-zA-Z]+$/.test(value)) {
        throw new Error(
          "Last Name has to be more than a character and can contain only alphabets"
        );
      } else return true;
    }),
    body("email").custom(value => {
      if (value) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(value).toLowerCase())) {
          throw new Error("Invalid Email Address. Please retry");
        }
      }
      return true;
    }),
    body("phone").custom(value => {
      if (value) {
        if (!/^([0-9]{6,14})$/.test(value)) {
          throw new Error("Invalid Phone Number. Please retry");
        }
      }
      return true;
    }),
    body("userName").custom(value => {
      if (
        (value && value.length < 2) ||
        !/^[a-zA-Z]+[a-zA-Z0-9\-\_]+$/.test(value)
      ) {
        throw new Error(
          "User Name has to be more than a character and can contain only alphanumeric with / or -"
        );
      } else return true;
    }),
    body("dateOfBirth").custom(value => {
      if (value) {
        const re = /\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
        if (!re.test(value))
          throw new Error("Incorrect Date format [YYYY-MM-DD]");
      }
      return true;
    }),
    body("address").custom(value => {
      if (value && value !== null && typeof value !== "object") {
        throw new Error("Incorrect Address Object Format");
      }
      let validLines = [
        "line1",
        "line2",
        "city",
        "state",
        "country",
        "zipCode"
      ];
      for (let key in value) {
        if (!validLines.includes(key)) {
          throw new Error(`Invalid Address line - ${key}`);
        }
        if (key === "zipCode" && !/^[0-9]+$/.test(value[key])) {
          throw new Error(
            `Invalid Address line - Zip Code should be numeric - ${key}`
          );
        }
      }
      return true;
    }),
    body("website").custom(value => {
      var re = new RegExp(
        "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$",
        "i"
      );
      if (value && !re.test(value)) {
        throw new Error("Incorrect Website");
      }
      return true;
    }),
    body("bio").custom(value => {
      if (value && value.length < 2) {
        throw new Error("Enter a Valid bio");
      } else return true;
    }),
    body("social").custom(value => {
      if (value && value !== null && typeof value !== "object") {
        throw new Error("Incorrect Address Object Format");
      }
      let re = new RegExp("([^/s]+)", "i");
      let validHandles = [
        "facebook",
        "instagram",
        "twitter",
        "linkedIn",
        "github"
      ];
      for (let key in value) {
        if (!re.test(value[key]) || !validHandles.includes(key)) {
          throw new Error(`Incorrect Social Media Handle - ${key}`);
        }
      }
      return true;
    }),
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
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "UnAuthorized. No Individual User exists with this token."
        });
      }
      //Check if Individual Exists
      const individualData = await Individual.findById({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "Individual Does not Exists"
        });
      }

      const individualProfileData = await IndividualProfile.findOne({
        individual: individualData._id
      });

      const individualProfileObj = req.body;
      individualProfileObj.gravatarUrl = gravatar.url(
        individualData.email,
        { s: "100", r: "x", d: "retro" },
        true
      );
      if (!individualProfileData) {
        individualProfileObj.individual = individualData;
        const individualProfile = new IndividualProfile(individualProfileObj);
        await individualProfile.save();
        return res
          .status(helpers.statusCodes.SUCCESS)
          .json({ message: "Individual Profile Created." });
      }

      if (individualProfileObj.userName)
        individualProfileData.userName = individualProfileObj.userName;

      if (individualProfileObj.dateOfBirth)
        individualProfileData.dateOfBirth = individualProfileObj.dateOfBirth;

      if (
        individualProfileObj.address !== null &&
        typeof individualProfileObj.address === "object"
      ) {
        let address = individualProfileObj.address;
        for (const key in address) {
          individualProfileData.address[key] = address[key];
        }
      }

      if (individualProfileObj.website)
        individualProfileData.website = individualProfileObj.website;

      if (individualProfileObj.bio)
        individualProfileData.bio = individualProfileObj.bio;

      if (
        individualProfileObj.social !== null &&
        typeof individualProfileObj.social === "object"
      ) {
        let social = individualProfileObj.social;
        for (const key in social) {
          individualProfileData.social[key] = social[key];
        }
      }

      await individualProfileData.save();

      //Individual Details
      if (individualProfileObj.firstName) {
        individualData.firstName = individualProfileObj.firstName;
      }
      if (individualProfileObj.lastName) {
        individualData.lastName = individualProfileObj.lastName;
      }
      if (individualProfileObj.phone && (individualData.phone !== individualProfileObj.phone)) {
        individualData.phone = individualProfileObj.phone;
        individualData.isPhoneVerified = false;
      }
      if (individualProfileObj.email && (individualData.email !== individualProfileObj.email)) {
        individualData.email = individualProfileObj.email;
        individualData.isEmailVerified = false;
        const emailToken = helpers.createRandomString(8);
        individualData.emailToken = emailToken;
        //Send an Email to the user with the email token
        mailUser({
          firstName: individualData.firstName,
          email: individualData.email,
          subject: "Verification Email",
          html: "verifyEmail",
          uriToken: `/verify/${emailToken}`
        });
      }
      if (
        individualProfileObj.firstName ||
        individualProfileObj.lastName ||
        individualProfileObj.phone ||
        individualProfileObj.email
      ) {
        await individualData.save();
      }

      return res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "Individual Profile Updated." });
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
 * /api/users/individual/profile:
 *    delete:
 *       tags:
 *          - "Individual"
 *       summary: Delete Individual Profile
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
router.delete("/profile", auth, async (req, res) => {
  try {
    if (!req.individual) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Individual User exists with this token."
      });
    }
    //Check if Individual profile exists
    await IndividualProfile.findOneAndDelete({
      individual: req.individual.individual
    });

    res
      .status(helpers.statusCodes.SUCCESS)
      .json({ message: "Individual Profile Deleted." });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Individual Profile Could Not Be Deleted" });
  }
});

/**
 * @swagger
 *
 * /api/users/individual/password:
 *    put:
 *       tags:
 *          - "Individual"
 *       summary: Individual Change Password
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: IndividualChangePassword
 *            description: Individual Change Password Attributes
 *            schema:
 *               $ref: '#/components/schemas/IndividualChangePassword'
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
  "/password",
  [
    [
      body("currentPassword").custom(value => {
        if (!value) {
          throw new Error("Current Password is invalid");
        } else return true;
      }),
      body("newPassword").custom(value => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
        if (!re.test(value)) {
          throw new Error(
            "New Password does not meet standards (Min 1 uppercase letter, Min 1 lowercase letter, \
                Min 1 special character, Min 1 number, Min 8 characters, Max 30 characters.)"
          );
        } else return true;
      }),
      body("confirmPassword").custom((value, { req }) => {
        if (!value || value !== req.body.newPassword) {
          throw new Error("Passwords don't match");
        } else return true;
      })
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
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "UnAuthorized. No Individual User exists with this token."
        });
      }
      //Check if org already exists
      const individualData = await Individual.findById({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Individual does not exists." });
      }

      const { currentPassword, newPassword } = req.body;

      const isMatch = await helpers.compareHash(
        individualData.password,
        currentPassword
      );
      if (!isMatch) {
        return res
          .status(helpers.statusCodes.UNAUTHORIZED)
          .json({ Error: "Current Password is incorrect" });
      }

      const hashedPassword = await helpers.hash(newPassword);
      individualData.password = hashedPassword;
      await individualData.save();

      return res
        .status(helpers.statusCodes.SUCCESS)
        .json({ success: "Password Successfully Updated" });
    } catch (error) {
      console.log(error);
      res.status(401).json({ err: "Individual Password Could Not Be Updated" });
    }
  }
);

/**
 * @swagger
 *
 * /api/users/individual/de-register:
 *    delete:
 *       tags:
 *          - "Individual"
 *       summary: Individual De-Register
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: IndividualPassword
 *            description: Individual Current Password
 *            schema:
 *               $ref: '#/components/schemas/IndividualPassword'
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
  "/de-register",
  [
    [
      body("password").custom(value => {
        if (!value) {
          throw new Error("Password is required");
        } else return true;
      })
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
      if (!req.individual) {
        return res.status(helpers.statusCodes.UNAUTHORIZED).json({
          message: "UnAuthorized. No Individual User exists with this token."
        });
      }
      //Check if org already exists
      const individualData = await Individual.findById({
        _id: req.individual.individual
      });
      if (!individualData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Individual does not exists." });
      }

      const isMatch = await helpers.compareHash(
        individualData.password,
        req.body.password
      );
      if (!isMatch) {
        return res
          .status(helpers.statusCodes.UNAUTHORIZED)
          .json({ Error: "Current Password is incorrect" });
      }

      await IndividualProfile.findOneAndDelete({
        individual: individualData._id
      });

      await IndividualChecks.deleteMany({
        individual: individualData._id
      });

      await individualData.deleteOne({ _id: individualData._id });

      return res
        .status(helpers.statusCodes.SUCCESS)
        .json({ success: "Individual Account Successfully De-Registered" });
    } catch (error) {
      console.log(error);
      res.status(401).json({ err: "Individual Could Not Be De-Registered" });
    }
  }
);

export default router;
