import { EventEmitter } from "node:events";
 import { emailsubject, sendEmail } from "../email/email.utils.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailsubject.confirmEmail,
    text: "kjopojg",
    html: "<h2>Let's confirm your email</h2>",
  }).catch((error) => {
    console.log("Failed to confirm email");
    console.error(error);
  });
});


eventEmitter.on("forgetPassword", async (data) => {
  await sendEmail({
    to: data.to,
    subject: emailsubject.resetPass,
    html: template(data.otp,data.firstname,emailsubject.resetPass),
  }).catch((error) => {
    console.log("Failed to confirm email");
    console.error(error);
  });
});


