import https from "https";
import http from "http";
import url from "url";
import helpers from "./lib/helpers.js";
import mailUser from "./lib/mailUser.js";

// import schemas
import IndividualChecks from "./models/checks/Individual.js";
import OrganizationChecks from "./models/checks/Organization.js";

const workers = {};
/**--------------------------------------------------------
 * Gather all Checks
 * 
 * @Validate Check if there are any checks
 * @invokes for every cehck Invokes validateCheckData()
 ----------------------------------------------------------*/
workers.gatherAllChecks = async () => {
  try {
    let individualCheckData = await IndividualChecks.find({}).populate(
      "individual",
      "firstName lastName email phone"
    );
    let organizationCheckData = await OrganizationChecks.find({}).populate(
      "organization",
      "firstName lastName email phone"
    );

    //Combine the result arrays and return the response
    const checks = [...individualCheckData, ...organizationCheckData];

    if (!checks || checks.length === 0) {
      //Take the first exist as per our flow chart
      console.log(
        "There are no checks to perform at this moment " + new Date().toString()
      );
    }
    checks.forEach(originalCheckData => {
      //Now lets pass the originaCheckData to another validation function
      //workers.validateCheckData(originalCheckData);
      workers.performCheck(originalCheckData);
    });
  } catch (err) {
    console.error("Server Error : " + err);
  }
};

/**--------------------------------------------------------
 * Invoke the Service (Check) 
 * Prepare Request URL for the check
 * Invoke function Process the results
 ----------------------------------------------------------*/
workers.performCheck = originalCheckData => {
  //Prepare the initial check outCome
  let checkOutcome = {
    error: false,
    responseCode: false
  };
  //Mark the outcome has not been sent yet
  let outcomeSent = false;

  //Trigger the API - logic
  //Parse the hostname and the path out of the originalCheckData
  let parsedUrl = url.parse(
    originalCheckData.protocol + "://" + originalCheckData.url,
    true
  );
  let hostname = parsedUrl.hostname;
  let path = parsedUrl.path;

  let requestDetails = {
    hostname,
    path,
    protocol: originalCheckData.protocol + ":",
    method: originalCheckData.method.toUpperCase(),
    timeout: originalCheckData.timeoutSeconds * 1000
  };

  //Choose which Protocol to req object
  let _moduleToUse = originalCheckData.protocol === "http" ? http : https;

  const req = _moduleToUse.request(requestDetails, res => {
    //Grab the status code
    let status = res.statusCode;
    //Update the checkoutcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("error", e => {
    //Update the checkOutcome
    checkOutcome.error = {
      error: true,
      value: e
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("timeout", () => {
    //Update the checkOutcome
    checkOutcome.error = {
      error: true,
      value: "timeout"
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });
  req.end();
};

/**--------------------------------------------------------
 * Process response ( post checks invocation )
 * Set the state and check if alert needs to be trigged
 * Invoke function create a Notification message for twilio
 ----------------------------------------------------------*/
workers.processCheckOutcome = async (originalCheckData, checkOutcome) => {
  //Decide if the check is up/down
  try {
    let state =
      !checkOutcome.error &&
      checkOutcome.responseCode &&
      originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
        ? "up"
        : "down";

    let alertWarranted =
      originalCheckData.lastChecked && originalCheckData.state !== state
        ? true
        : false;

    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    //Save the updates into DB
    if (originalCheckData.individual) {
      await IndividualChecks.findOneAndUpdate(
        { _id: originalCheckData._id },
        { state: newCheckData.state, lastChecked: newCheckData.lastChecked }
      );
    } else {
      await OrganizationChecks.findOneAndUpdate(
        { _id: originalCheckData._id },
        { state: newCheckData.state, lastChecked: newCheckData.lastChecked }
      );
    }
    if (!alertWarranted) {
      console.log(
        "Check Outcome has not changed. No need to alert user with sms/email"
      );
    } else workers.alertUserToStatusChange(newCheckData);
  } catch (err) {
    console.log("Error in updating the checks record. Check your APIs once.");
    console.log("Server Error");
  }
};

/**--------------------------------------------------------
 * Trigger an SMS Alert
 * Create a Notification message
 * Invoke function which invokes twilio SMS servicee
 ----------------------------------------------------------*/
workers.alertUserToStatusChange = async newCheckData => {
  try {
    let msg =
      "Alert : Your check for " +
      newCheckData.method.toUpperCase() +
      " " +
      newCheckData.protocol +
      "://" +
      newCheckData.url +
      " is currently " +
      newCheckData.state;

    let phone, firstName, email;
    if (newCheckData.organization) {
      phone = newCheckData.organization.phone;
      firstName = newCheckData.organization.firstName;
      email = newCheckData.organization.email;
    } else {
      phone = newCheckData.individual.phone;
      firstName = newCheckData.individual.firstName;
      email = newCheckData.individual.email;
    }

    await helpers.sendTwilioSMS(phone, msg);
    //Send an Email to the user with the email token
    mailUser({
      firstName: firstName,
      email: email,
      subject: `Notification Email for your Check - ${newCheckData.name}`,
      html: "checks",
      uriToken: msg
    });
  } catch (err) {
    console.error(err);
    console.log("Something wrong with Twilio APIs / Mailing Service");
  }
};

//Timer to execute the worker - process every minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

workers.init = () => {
  //Execute all the checks created by all the users in checks folder
  workers.gatherAllChecks();
  //Set a Interval and call the loop to do the above process
  workers.loop();
};

export default workers;
