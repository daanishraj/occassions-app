import { z } from 'zod';

export enum Month {
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
}

export enum OccasionType {
  BIRTHDAY = "Birthday",
  ANNIVERSARY = "Anniversary",
}

export const OccasionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31),
});

export const AddOccasionSchema = z.object({
  // userId is no longer required - it comes from authenticated session
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31),
});

export const EditOccasionSchema = z.object({
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31),
});

export type Occasion = z.infer<typeof OccasionSchema>;
export type AddOccasion = z.infer<typeof AddOccasionSchema>;
export type EditOccasion = z.infer<typeof EditOccasionSchema>;

// used for Profile
const phoneRegex = /^\+[1-9]\d{9,14}$/;

export const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, {
      message: "Number should begin with a +, have country code and the correct number of digits",
    })
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
