"use server";

import * as sgMail from "@sendgrid/mail";

export async function SendOtp(email: string, token: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const link = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
  const msg = {
    to: email, // Change to your recipient
    from: "giaco.ruetta@gmail.com", // Change to your verified sender
    subject: "Verify email",
    text: "which contains some text",
    html: `<a href="${link}">Verify your email</a>`,
  };

  try{
    await sgMail.send(msg);
  } catch(err){
    console.log(err);
  }
}

export async function SendResetPassword(email: string, token: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const link = `${process.env.BASE_URL}/auth/new-password?token=${token}`;
  const msg = {
    to: email, // Change to your recipient
    from: "giaco.ruetta@gmail.com", // Change to your verified sender
    subject: "Reset password",
    text: "which contains some text",
    html: `<a href="${link}">Reset your password</a>`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
}

export async function SendTwoFA(email: string, token: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  const msg = {
    to: email, // Change to your recipient
    from: "giaco.ruetta@gmail.com", // Change to your verified sender
    subject: "Two Factor Authentication",
    text: "which contains some text",
    html: `<p>Your two FA code: ${token}</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
}

export async function SendDelteAccount(email: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg = {
    to: email, // Change to your recipient
    from: "giaco.ruetta@gmail.com", // Change to your verified sender
    subject: "Delete account",
    text: "which contains some text",
    html: `<p>Your account has been deleted</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
}