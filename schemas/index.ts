import * as z from "zod";

export const FormSchemaLogin = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string(),
});

export const FormSchemaRegister = z.object({
  name: z.string().min(3, {
    message: "Insert a valid name",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(6, {
    message: "Insert a valid password with min 6 characters",
  }),
});

export const FormSchemaVerifyOtp = z.object({
  code: z.string().length(6, {
    message: "Insert a valid code",
  }),
});

export const FormSchemaResetPassword = z.object({
  email: z.string().email({
    message: "Please insert a valid email"
  })
})

export const FormSchemaNewPassword = z.object({
  password: z.string().min(6, {
    message: "Insert a valid password with min 6 characters",
  }),
  confirmPassword: z.string().min(6, {
    message: "Insert a valid password with min 6 characters",
  }),
});