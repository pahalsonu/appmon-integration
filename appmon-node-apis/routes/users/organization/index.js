import express from "express";
import { body, validationResult } from "express-validator";
import gravatar from "gravatar";

import helpers from "../../../lib/helpers.js";
import mailUser from "../../../lib/mailUser.js";
import authUser from "../../../middlewares/auth.js";

const router = express.Router();

// import schemas
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";
import OrganizationProfile from "../../../models/users/OrganizationProfile.js";
import OrganizationChecks from "../../../models/checks/Organization.js";

/**
 * @swagger
 *    components:
 *       schemas:
 *          Organization:
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
 *                role: organization
 *                firstName: Andy
 *                lastName: M
 *                phone: 9887788990
 *                email: andy.m@gmail.com
 *                password: Andy@123
 *                confirmPassword: Andy@123
 *                tos: true
 *          OrganizationProfile:
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
 *          OrganizationChangePassword:
 *             type: object
 *             required:
 *                - currentPassword
 *                - newPassword
 *                - confirmPassword
 *             example:
 *                currentPassword: Andy@123
 *                newPassword: Andy@12345
 *                confirmPassword: Andy@12345
 *          OrganizationPassword:
 *             type: object
 *             required:
 *                - password
 *             example:
 *                password: Andy@123
 */

/**
 * @swagger
 *
 * /api/users/organization:
 *    get:
 *       tags:
 *          - "Organization"
 *       summary: Get Organization
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
router.get("/", [authUser], async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token."
      });
    }
    //Check if org  exists
    const organizationData = await Organization.findOne(
      {
        _id: req.organization.organization
      },
      { _id: false, password: false, emailToken: false }
    );
    if (!organizationData) {
      return res.status(helpers.statusCodes.BAD_REQUEST).json({
        message: "Organization does not exists."
      });
    }
    res.status(helpers.statusCodes.SUCCESS).json({ organizationData });
  } catch (error) {
    console.log(error);
    res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ err: "Organization Could not Be Fetched" });
  }
});

/**
 * @swagger
 *
 * /api/users/organization/register:
 *    post:
 *       tags:
 *          - "Organization"
 *       summary: Organization Registration
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: Oragnization
 *            description: Organization Registration Attributes
 *            schema:
 *               $ref: '#/components/schemas/Organization'
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
    body("role", "A Role must be selected")
      .isString()
      .notEmpty(),
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
      let { firstName, lastName, email, password, role, phone, tos } = req.body;

      //Check if org already exist
      const organizationData = await Organization.findOne({ email });
      if (organizationData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Organization with this Email already exists." });
      }

      //Check if org already is an Individual
      const individualData = await Individual.findOne({ email });
      if (individualData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "An Individual with this Email already exists." });
      }

      //Hash the password
      const hashedPassword = await helpers.hash(password);

      //Get the email token
      const emailToken = helpers.createRandomString(8);
      const organizationObject = {
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
      const organization = new Organization(organizationObject);
      await organization.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "User Registered Successfully" });

      //Send an Email to the user with the email token
      mailUser({
        firstName: organization.firstName,
        email: organization.email,
        subject: "Verification Email",
        html: "verifyEmail",
        uriToken: `/verify/${emailToken}`
      });
    } catch (error) {
      console.error(error.message);
      res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ err: "Server Error" });
    }
  }
);

/**
 * @swagger
 *
 * /api/users/organization/profile:
 *    get:
 *       tags:
 *          - "Organization"
 *       summary: Get Organization Profile
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
router.get("/profile", [authUser], async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token."
      });
    }
    //Check if org profile exists
    const organizationProfileData = await OrganizationProfile.findOne(
      {
        organization: req.organization.organization
      },
      { _id: false }
    ).populate(
      "organization",
      "-_id -password -tos -emailToken -otp"
    );
    if (!organizationProfileData) {
      return res.status(helpers.statusCodes.BAD_REQUEST).json({
        message: "Organization Profile does not exists."
      });
    }
    res.status(helpers.statusCodes.SUCCESS).json({ organizationProfileData });
  } catch (error) {
    console.log(error);
    res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ err: "Organization Profile Could Not Be Created" });
  }
});

/**
 * @swagger
 *
 * /api/users/organization/profile:
 *    put:
 *       tags:
 *          - "Organization"
 *       summary: Upload Organization Profile
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: OrganizationProfile
 *            description: Organization Profile
 *            schema:
 *               $ref: '#/components/schemas/OrganizationProfile'
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
            throw new Error("Please pass a valid Email Address.");
          }
        }
        return true;
      }),
      body("phone").custom(value => {
        if (value) {
          if (!/^([0-9]{6,14})$/.test(value)) {
            throw new Error("Please pass a valid Phone Number.");
          }
        }
        return true;
      }),
      body("userName").custom(value => {
        if (value.length < 2 || !/^[a-zA-Z]+[a-zA-Z0-9\-\_]+$/.test(value)) {
          throw new Error(
            "User Name has to be more than a character and can contain only alphanumeric with / or -"
          );
        } else return true;
      }),
      body("dateOfBirth").custom(value => {
        if (value) {
          const re = /\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])/;
          if (!re.test(value))
            throw new Error("Please pass a valid Date format [YYYY-MM-DD]");
        }
        return true;
      }),
      body("address").custom(value => {
        if (value && value !== null && typeof value !== "object") {
          throw new Error("Please pass a valid Object Format for address");
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
            throw new Error(
              `Please pass a valid Address attribute for - ${key}`
            );
          }
          if (key === "zipCode" && !/^[0-9]+$/.test(value[key])) {
            throw new Error(`Please pass a valid Address value for - ${key}`);
          }
        }
        return true;
      }),
      body("website").custom(value => {
        var re = new RegExp(
          "^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$",
          "i"
        );
        if (!re.test(value)) {
          throw new Error("Please pass a valid Website url");
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
          throw new Error("Please pass a valid social object");
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
            throw new Error(
              `Please pass a valid Social Media Handle for - ${key}`
            );
          }
        }
        return true;
      })
    ],
    authUser
  ],
  async (req, res) => {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token."
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      //Check if org already exists
      const organizationData = await Organization.findById({
        _id: req.organization.organization
      });
      if (!organizationData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Organization does not exists." });
      }

      const {
        firstName,
        lastName,
        email,
        phone,
        userName,
        dateOfBirth,
        address,
        website,
        bio,
        social
      } = req.body;

      // -- Organization Collection Changes --
      if (firstName || lastName || email || phone) {
        if (firstName && organizationData.firstName !== firstName)
          organizationData.firstName = firstName;

        if (lastName && organizationData.lastName !== lastName)
          organizationData.lastName = lastName;

        if (email && organizationData.email !== email) {
          organizationData.isEmailVerified = false;
          organizationData.email = email;
          const emailToken = helpers.createRandomString(8);
          organizationData.emailToken = emailToken;
          //Send an Email to the user with the email token
          mailUser({
            firstName: organizationData.firstName,
            email: organizationData.email,
            subject: "Verification Email",
            html: "verifyEmail",
            uriToken: `/verify/${emailToken}`
          });
        }
        if (phone && organizationData.phone !== phone) {
          organizationData.isPhoneVerified = false;
          organizationData.phone = phone;
          //const phoneToken = helpers.createRandomNumber(4);
          //Send an sms to the user with the phone token
        }
        const organization = new Organization(organizationData);
        await organization.save();
      }

      // -- OrganizationProfile Collection Changes
      let organizationProfileData = await OrganizationProfile.findOne({
        organization: organizationData._id
      });

      if (!organizationProfileData) {
        organizationProfileData = new OrganizationProfile();
        organizationProfileData.organization = organizationData._id;
        organizationProfileData.gravatarUrl = gravatar.url(
          organizationData.email,
          { s: "100", r: "x", d: "retro" },
          true
        );
      }

      if (
        userName &&
        (organizationProfileData.userName
          ? userName !== organizationProfileData.userName
          : true)
      )
        organizationProfileData.userName = userName;

      if (
        dateOfBirth &&
        (organizationProfileData.dateOfBirth
          ? dateOfBirth !== organizationProfileData.dateOfBirth
          : true)
      )
        organizationProfileData.dateOfBirth = dateOfBirth;

      if (address !== null && typeof address === "object") {
        //organizationProfileData.address = address;
        if (organizationProfileData.address === null) {
          organizationProfileData.address = address;
        } else {
          for (let key in address) {
            if (organizationProfileData.address[key] !== address[key])
              organizationProfileData.address[key] = address[key];
          }
        }
      }

      if (
        website &&
        (organizationProfileData.website
          ? website !== organizationProfileData.website
          : true)
      )
        organizationProfileData.website = website;

      if (
        bio &&
        (organizationProfileData.bio
          ? bio !== organizationProfileData.bio
          : true)
      )
        organizationProfileData.bio = bio;

      if (social !== null && typeof social === "object") {
        // organizationProfileData.social = social;
        if (organizationProfileData.address === null) {
          organizationProfileData.address = address;
        } else {
          for (let key in social) {
            if (organizationProfileData.social[key] !== social[key])
              organizationProfileData.social[key] = social[key];
          }
        }
      }

      await organizationProfileData.save();

      res
        .status(helpers.statusCodes.SUCCESS)
        .json({ message: "Organization Profile Updated." });
    } catch (error) {
      console.error(error.message);
      res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ err: "Organization Profile Could Not Be Updated" });
    }
  }
);

/**
 * @swagger
 *
 * /api/users/organization/profile:
 *    delete:
 *       tags:
 *          - "Organization"
 *       summary: Delete Organization Profile
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
router.delete("/profile", [authUser], async (req, res) => {
  try {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token."
      });
    }
    //Check if org profile exists
    const organizationProfileData = await OrganizationProfile.findOneAndDelete({
      organization: req.organization.organization
    });
    if (!organizationProfileData) {
      return res.status(helpers.statusCodes.BAD_REQUEST).json({
        message: "Organization Profile does not exists."
      });
    }
    res
      .status(helpers.statusCodes.SUCCESS)
      .json({ message: "Organization Profile Deleted." });
  } catch (error) {
    console.error(error.message);
    res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ err: "Organization Profile Could Not Be Deleted" });
  }
});

/**
 * @swagger
 *
 * /api/users/organization/password:
 *    put:
 *       tags:
 *          - "Organization"
 *       summary: Organization Change Password
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: OrganizationChangePassword
 *            description: Organization Change Password Attributes
 *            schema:
 *               $ref: '#/components/schemas/OrganizationChangePassword'
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
    authUser
  ],
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
          message: "UnAuthorized. No Organization User exists with this token."
        });
      }
      //Check if org already exists
      const organizationData = await Organization.findById({
        _id: req.organization.organization
      });
      if (!organizationData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Organization does not exists." });
      }

      const { currentPassword, newPassword } = req.body;

      const isMatch = await helpers.compareHash(
        organizationData.password,
        currentPassword
      );
      if (!isMatch) {
        return res
          .status(helpers.statusCodes.UNAUTHORIZED)
          .json({ Error: "Current Password is incorrect" });
      }

      const hashedPassword = await helpers.hash(newPassword);
      organizationData.password = hashedPassword;
      await organizationData.save();

      return res
        .status(helpers.statusCodes.SUCCESS)
        .json({ success: "Password Successfully Updated" });
    } catch (error) {
      console.error(error.message);
      res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ err: "Organization Password Could Not Be Updated" });
    }
  }
);

/**
 * @swagger
 *
 * /api/users/organization/de-register:
 *    delete:
 *       tags:
 *          - "Organization"
 *       summary: Organization De-Register
 *       security:
 *          - Bearer: [auth-token]
 *       consumes:
 *          - application/json
 *       parameters:
 *          - in: body
 *            name: OrganizationPassword
 *            description: Organization Current Password
 *            schema:
 *               $ref: '#/components/schemas/OrganizationPassword'
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
    authUser
  ],
  async (req, res) => {
    if (!req.organization) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Organization User exists with this token."
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }
    try {
      //Check if org already exists
      const organizationData = await Organization.findById({
        _id: req.organization.organization
      });
      if (!organizationData) {
        return res
          .status(helpers.statusCodes.BAD_REQUEST)
          .json({ message: "Organization does not exists." });
      }

      const isMatch = await helpers.compareHash(
        organizationData.password,
        req.body.password
      );
      if (!isMatch) {
        return res
          .status(helpers.statusCodes.UNAUTHORIZED)
          .json({ Error: "Current Password is incorrect" });
      }

      await OrganizationChecks.deleteMany({
        organization: organizationData._id
      });

      await OrganizationProfile.findOneAndDelete({
        organization: organizationData._id
      });

      await organizationData.deleteOne({ _id: organizationData._id });

      return res
        .status(helpers.statusCodes.SUCCESS)
        .json({ success: "Organization Account Successfully De-Registered" });
    } catch (error) {
      console.error(error.message);
      res
        .status(helpers.statusCodes.SERVER_ERROR)
        .json({ err: "Organization Could Not Be De-Registered" });
    }
  }
);

export default router;
