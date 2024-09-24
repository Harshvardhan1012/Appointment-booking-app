import { Aladin } from "next/font/google";
import { date, z } from "zod";

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
  physician:z.string(),
  identificationDocument: z.custom<File[]>().optional(),
  InsuranceId: z.string(),
  InsuranceProvider: z.string(),
  Allergies: z.string().optional(),
  CurrentMedications: z.string().optional(),
});

export const appointmentformschema = z.object({
  Doctor: z.string(),
  Reason: z.string(),
  date: z.coerce.date(),
});
