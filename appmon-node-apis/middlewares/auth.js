import helpers from "../lib/helpers.js";

const auth = async (req, res, next) => {
  //Get the auth token from request header
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(helpers.statusCodes.UNAUTHORIZED)
      .json({ Error: "Unauthorized! No access token in header" });
  }
  try {
    // Decrypt auth token to verify the login
    const decryptedToken = helpers.decipher(token);
    const decodedToken = helpers.verifyToken(decryptedToken);
    if (decodedToken.role === "individual") {
      req.individual = decodedToken;
    } else if (decodedToken.role === "admin") {
      req.admin = decodedToken;
    } else {
      req.organization = decodedToken;
    }

    next();
  } catch (err) {
    console.log(err.message);
    return res
      .status(helpers.statusCodes.SERVER_ERROR)
      .json({ Error: "Token expired. Login again!" });
  }
};

export default auth;
