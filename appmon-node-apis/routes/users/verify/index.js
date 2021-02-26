import express from "express";
import helpers from "../../../lib/helpers.js";
import mailUser from "../../../lib/mailUser.js";
import { body, validationResult } from "express-validator";
import config from '../../../config.js';

const router = express.Router();

import auth from '../../../middlewares/auth.js';

// import schemas
import Individual from "../../../models/users/Individual.js";
import Organization from "../../../models/users/Organization.js";

router.get("/:emailToken", async (req, res) => {
  try {
    const { emailToken } = req.params;
    const individualData = await Individual.findOne({ emailToken: emailToken });

    if (individualData) {
      individualData.isEmailVerified = true;
      individualData.emailToken = "";
      await individualData.save();

      //Send an Email to the user with the email token
      mailUser({
        firstName: individualData.firstName,
        email: individualData.email,
        subject: "Welcome Email",
        html: "welcomeEmail",
        uriToken: `http://www.appmon.online/login`,
      });
      return res.render("welcome");
    }

    const organizationData = await Organization.findOne({
      emailToken: emailToken,
    });
    if (organizationData) {
      organizationData.isEmailVerified = true;
      organizationData.emailToken = "";
      await organizationData.save();

      //Send an Email to the user with the email token
      mailUser({
        firstName: organizationData.firstName,
        email: organizationData.email,
        subject: "Welcome Email",
        html: "welcomeEmail",
        uriToken: `http://www.appmon.online/login`,
      });
      return res.render("welcome");
    }

    return res.render("error");
  } catch (err) {
    console.error(err);
    res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ message: "Unable to process the request" });
  }
});

router.get('/otp/send-otp', auth, async (req, res) => {
  try {
    if (!(req.individual || req.Organization)) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Individual User exists with this token."
      });
    }

    const otp = helpers.generateOTP();
    const otpMsg = "You AppMon Verification Code is: " + otp.token;

    if (req.individual) {
      const individualData = await Individual.findById(req.individual.individual);
      if (!individualData) {
        return res.status(helpers.statusCodes.NOT_FOUND).json({
          message: "User not found."
        });
      }

      if (individualData.isPhoneVerified) {
        return res.status(helpers.statusCodes.NOT_MODIFIED).json({
          message: "Phone is already verified."
        });
      }

      individualData.otp = {
        token: otp.token,
        timeStamp: otp.timeStamp
      };

      await individualData.save();

      await helpers.sendTwilioSMS(individualData.phone, otpMsg);

      return res.status(helpers.statusCodes.SUCCESS).json({
        message: "OTP Sent."
      });
    }
    else {
      const organizationData = await Organization.findById(req.organization.organization);
      if (!organizationData) {
        return res.status(helpers.statusCodes.NOT_FOUND).json({
          message: "User not found."
        });
      }

      if (organization.isPhoneVerified) {
        return res.status(helpers.statusCodes.NOT_MODIFIED).json({
          message: "Phone is already verified."
        });
      }

      organizationData.otp = {
        token: otp.token,
        timeStamp: otp.timeStamp
      };

      await organizationData.save();

      await helpers.sendTwilioSMS(organizationData.phone, otpMsg);

      return res.status(helpers.statusCodes.SUCCESS).json({
        message: "OTP Sent."
      });
    }

  }
  catch (err) {
    console.log(error);
    res.status(401).json({ err: "Server Error. OTP cant be sent." });
  }
})



router.post('/otp/verify-otp', [
  body('otp', "Please enter a valid number.").isNumeric(),
  auth
], async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(helpers.statusCodes.BAD_REQUEST)
        .json({ message: errors.array() });
    }

    if (!(req.individual || req.Organization)) {
      return res.status(helpers.statusCodes.UNAUTHORIZED).json({
        message: "UnAuthorized. No Individual User exists with this token."
      });
    }

    const { otp } = req.body;

    if (req.individual) {
      const individualData = await Individual.findById(req.individual.individual);
      const otpData = individualData.otp;
      if (!otpData) {
        return res.status(helpers.statusCodes.NOT_FOUND).json({
          message: "OTP has not been generated."
        });
      }
      if (individualData.isPhoneVerified) {
        return res.status(helpers.statusCodes.NOT_MODIFIED).json({
          message: "Phone number is already verified."
        });
      }

      //Check if OTP Expired.
      const otpExpiresIn = config.otpExpiresInSeconds * 1000; //Seconds to Miniseconds
      const currentTimeStamp = Date.now();
      if ((otpData.timeStamp + otpExpiresIn) > currentTimeStamp) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "OTP Expired."
        });
      }

      //Validate OTP
      if (otp !== otpData.token) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "Wrong OTP."
        });
      }

      individualData.isPhoneVerified = true;
      await individualData.save();

      return res.status(helpers.statusCodes.SUCCESS).json({
        message: "Phone number Verified."
      });
    }
    else {
      const organizationData = await Organization.findById(req.organization.organization);
      const otpData = organizationData.otp;
      if (!otpData) {
        return res.status(helpers.statusCodes.NOT_FOUND).json({
          message: "OTP has not been generated."
        });
      }
      if (organizationData.isPhoneVerified) {
        return res.status(helpers.statusCodes.NOT_MODIFIED).json({
          message: "Phone number is already verified."
        });
      }

      //Check if OTP Expired.
      const otpExpiresIn = config.otpExpiresInSeconds * 1000; //Seconds to Miniseconds
      const currentTimeStamp = Date.now();
      if ((otpData.timeStamp + otpExpiresIn) > currentTimeStamp) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "OTP Expired."
        });
      }

      //Validate OTP
      if (otp !== otpData.token) {
        return res.status(helpers.statusCodes.BAD_REQUEST).json({
          message: "Wrong OTP."
        });
      }

      organizationData.isPhoneVerified = true;
      await organizationData.save();

      return res.status(helpers.statusCodes.SUCCESS).json({
        message: "Phone number Verified."
      });
    }

  }
  catch (err) {
    console.log(error);
    res.status(401).json({ err: "Server Error. OTP Cant be verified." });
  }
})

export default router;