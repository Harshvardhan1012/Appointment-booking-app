import { z } from "zod";

export const formSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z
      .string()
      .email("Invalid email address") // Email validation
      .nonempty("Email is required"), // Ensure it's not empty
  
    phone: z
      .string()
      .nonempty("Phone number is required"), // Ensure it's not empty
  });


export const registerformschema=z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z
    .string()
    .email("Invalid email address") // Email validation
    .nonempty("Email is required"), // Ensure it's not empty

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Invalid phone number, must be 10 digits") // Phone validation
    .nonempty("Phone number is required"), // Ensure it's not empty
  gender:z.enum(["Male","Female","Other"]),
  dob:z.string().refine((date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date) && !isNaN(new Date(date).getTime());
  }, {
    message: "Invalid date format or non-existent date. Use YYYY-MM-DD.",
  }),
  Address:z.string(),
  Occupation:z.string(),
});
