import dotenv from "dotenv";

dotenv.config();

export default {
  mongoDB_uri: process.env.MONGODB_URI,
  payment_gateway_key: process.env.PAYMENT_GATEWAY_KEY,
  fb_service_key: process.env.FB_SERVICE_KEY,
  parcel_point_email: process.env.PARCEL_POINT_EMAIL,
  parcel_point_email_pass: process.env.PARCEL_POINT_EMAIL_PASS,
  port: 3000,
};
