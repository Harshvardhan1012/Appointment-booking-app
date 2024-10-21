import { z } from 'zod';

//form schema
export const formSchema = z.object({
  password: z
    .string()
    .min(2, 'min 2 char required')
    .max(10, 'max 10 char allowed'),
  email: z.string().email('Invalid email address'), // Email validation

  phone: z.string().nonempty('Phone number is required'), // Ensure it's not empty
});

//login form schema
export const loginformschema = z.object({
  email: z.string().email('Invalid email address'), // Email validation
});
export const doctorRegisterSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
});

//register form schema
export const registerformschema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email address'), // Email validation

  phone: z.string().nonempty('Phone number is required'), // Ensure it's not empty
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.coerce.date(),
  Address: z.string(),
  Occupation: z.string(),
  // identificationDocument: z.custom<File[]>().optional(),
  InsuranceId: z.string(),
  InsuranceProvider: z.string(),
  Allergies: z.string().optional(),
  CurrentMedications: z.string().optional(),
});

//appointment form schema
export const appointmentformschema = z.object({
  physician: z.string().nonempty('Please select a physician'),
  Reason: z.string().nonempty('Reason is required'),
  Date: z.coerce.date(),
});

export const scheduleFormSchema = z.object({
  physician: z.string().nonempty('Please select a physician'),
  Remarks: z.string().nonempty('Reason is required'),
  ExpectedDate: z.coerce.date(),
});

export const cancellationformschema = z.object({
  CancellationReason: z.string().nonempty('Reason is required'),
});
