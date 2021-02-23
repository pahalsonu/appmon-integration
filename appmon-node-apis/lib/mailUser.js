import nodemailer from "nodemailer";
import pug from "pug";
import config from "../config.js";
import path from "path";
import { log } from "../middlewares/logger.js";
const __dirname = path.resolve();

/**--------------------------------------------------------
 * EMail Users 
 * 
 * @params       Mailing Attributes
 * @returns      NA
 ----------------------------------------------------------*/
const mailUser = async mailAttr => {
  try {
    let transporter = nodemailer.createTransport(config.mailConfig);
    const subject = `Welcome to Appmon Monitoring Solutions - ${mailAttr.subject}`;
    const html = pug.renderFile(
      path.join(__dirname, `/views/${mailAttr.html}.pug`),
      {
        name: mailAttr.firstName,
        verifyUrl: config.domain + mailAttr.uriToken
      }
    );

    let info = await transporter.sendMail({
      from: config.adminMailer,
      to: mailAttr.email,
      subject: subject,
      html: html
    });

    log("Message Sent %s", info.messageId);
  } catch (err) {
    console.error(err.message);
  }
};

export default mailUser;
