export default {
  mongoDB: "appmon",
  mongoUser: "appmon",
  mongoPassword: "cohort@ths",
  ENCODE_KEY: "MyJWTTokenKey",
  saltRounds: 12,
  emailTokenLength: 8,
  mailConfig: {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "appmon.tc39@gmail.com",
      pass: "ghykqsgzptzetlil"
    }
  },
  adminMailer: '"Appmon Monitoring Solutions" <appmon.tc39@gmail.com>',
  domain: "http://localhost:5000",
  maxChecks: 5,
  twilio: {
    fromPhone: "+12675891882",
    accountSid: "AC7643a090d3865ca42869ef0df5ecda8d",
    authToken: "3ceacd4daa96aa548c2cdf7b254147d1"
  },
  otpExpiresInSeconds: 300
};
