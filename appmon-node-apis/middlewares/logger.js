import fs from "fs";
import path from "path";
import util from "util";

const appendFile = util.promisify(fs.appendFile);

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const getFormattedDate = () => {
  const current_dt = new Date();
  const formatted_dt = `${current_dt.getFullYear()}-${
    current_dt.getMonth() + 1
  }-${current_dt.getDate()} ${current_dt.getHours()}:${current_dt.getMinutes()}:${current_dt.getSeconds()}`;
  return formatted_dt;
};

const getLogFileName = () => {
  const current_dt = new Date();
  const fileName = `${current_dt.getFullYear()}-${
    current_dt.getMonth() + 1
  }-${current_dt.getDate()}_${process.env.LOG_FILE_NAME}`;
  return fileName;
};

export const log = async (str) => {
  try {
    const formatted_dt = getFormattedDate();
    const logStr = `[${formatted_dt}] : ${str}\n`;

    const filePath = process.env.LOG_PATH;
    const fileName = getLogFileName();
    await appendFile(path.join(filePath, fileName), logStr);
  } catch (err) {
    console.log(err.message);
  }
};

export const logger = (req, res, next) => {
  const start = process.hrtime();
  next();

  //Getting Request Data
  const method = req.method;
  const url = req.url;
  let status = res.statusCode;

  const ip =
    (typeof req.headers["x-forwarded-for"] === "string" &&
      req.headers["x-forwarded-for"].split(",").shift()) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  //Get time taken to complete the request
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);

  //Construct log string
  const logStr = `[${ip}] : ${method} : ${url} ${status} ${durationInMilliseconds} ms --`;
  log(logStr);
};
