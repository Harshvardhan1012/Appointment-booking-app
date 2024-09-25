import { z } from "zod";


//form schema
export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .email("Invalid email address") // Email validation
    .nonempty("Email is required"), // Ensure it's not empty

  phone: z.string().nonempty("Phone number is required"), // Ensure it's not empty
});


//register form schema
export const registerformschema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .email("Invalid email address") // Email validation
    .nonempty("Email is required"), // Ensure it's not empty

  phone: z.string().nonempty("Phone number is required"), // Ensure it's not empty
  gender: z.enum(["Male", "Female", "Other"]),
  dob: z.coerce.date(),
  Address: z.string(),
  Occupation: z.string(),
  identificationDocument: z.custom<File[]>().optional(),
  InsuranceId: z.string(),
  InsuranceProvider: z.string(),
  Allergies: z.string().optional(),
  CurrentMedications: z.string().optional(),
});


//appointment form schema
export const appointmentformschema = z.object({
  physician: z.string(),
  Reason: z.string(),
  Date: z.coerce.date(),
});
