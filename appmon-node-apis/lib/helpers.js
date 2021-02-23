import config from "../config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "crypto-js";
import twilio from "twilio";

const { AES, enc } = pkg;

const helpers = {};

/**--------------------------------------------------------
 * Hash the given string using bcrypt
 * 
 * @params       A String
 * @returns      Hashed String
 ----------------------------------------------------------*/
helpers.hash = async str => {
  if (typeof str !== "string" || str.length === 0) {
    return false;
  }
  try {
    const salt = await bcrypt.genSalt(config.saltRounds);
    const hash = await bcrypt.hash(str, salt);
    return hash;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

/**--------------------------------------------------------
 * Compare the string with the hash using bcrypt
 * 
 * @params       A Hashed String, Plain Text String
 * @returns      Boolean Result
 ----------------------------------------------------------*/
helpers.compareHash = async (hashedString, plainTextString) => {
  try {
    const result = await bcrypt.compare(plainTextString, hashedString);
    return result;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

/**--------------------------------------------------------
 * Create a Random String of given Length
 * 
 * @params       Length of the random string
 * @returns      A Random String
 ----------------------------------------------------------*/
helpers.createRandomString = strLength => {
  strLength =
    typeof strLength === "number" && strLength > 0 ? strLength : config.emailTokenLength;

  const possibleCharacters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < strLength; i++) {
    let randomChar = possibleCharacters.charAt(
      Math.floor(Math.random() * possibleCharacters.length)
    );
    str += randomChar;
  }
  return str;
};

/**--------------------------------------------------------
 * Generate the JWTToken
 ----------------------------------------------------------*/
helpers.genToken = payload => {
  return jwt.sign(payload, config.ENCODE_KEY, {
    expiresIn: "1d"
  });
};

helpers.verifyToken = tokenId => jwt.verify(tokenId, config.ENCODE_KEY);

/**
 * Encrypting and Decrypting
 */
helpers.cipher = plainText => {
  const encryptedText = AES.encrypt(plainText, config.ENCODE_KEY).toString();
  return encryptedText;
};

helpers.decipher = encryptedText => {
  const bytes = AES.decrypt(encryptedText, config.ENCODE_KEY);
  const decryptedString = bytes.toString(enc.Utf8);
  return decryptedString;
};

/**--------------------------------------------------------
 * Status Code Description and its id
 ----------------------------------------------------------*/
helpers.statusCodes = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INVALID_METHOD: 405,
  REQUEST_TIMEOUT: 408,
  SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  SERVICE_UNAVAILABLE: 503
};

/**--------------------------------------------------------
 * Method that Prepares Request Object to Notify though SMS
 * 
 * @params       phone, message
 * @returns      Promise : Notification Status
 ----------------------------------------------------------*/
// Method to trigger an SMS
helpers.sendTwilioSMS = async (phone, message) => {
  try {
    const accountSid = config.twilio.accountSid;
    const authToken = config.twilio.authToken;
    const client = twilio(accountSid, authToken);

    console.log(phone);
    const output = await client.messages.create({
      body: message,
      from: config.twilio.fromPhone,
      to: "+91" + phone
    });
    console.log("Message Successfully Sent ", output.sid);
    return output;
  } catch (err) {
    console.error("Message Could not be sent from Twilio", err);
  }
};

helpers.generateOTP = () => {
  //Generate a rondom 6 digit number (1st numbers cant be 0)
  const token = Math.floor(100000 + Math.random() * 900000);
  const timeStamp = Date.now();
  return { token, timeStamp };
}

export default helpers;
