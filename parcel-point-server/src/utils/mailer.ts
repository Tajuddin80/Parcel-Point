import config from "../config";
const nodemailer = require("nodemailer");


export const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.parcel_point_email,
    pass: config.parcel_point_email_pass,
  },
});