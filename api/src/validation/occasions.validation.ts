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

const OccasionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31), 
});

const AddOccasionSchema = z.object({
  userId: z.string(),
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31), 
});

const EditOccasionSchema = z.object({
  name: z.string(),
  occasionType: z.nativeEnum(OccasionType),
  month: z.nativeEnum(Month),
  day: z.number().int().min(1).max(31), 
});

export type Occasion = z.infer<typeof OccasionSchema>;
export type AddOccasion = z.infer<typeof AddOccasionSchema>;
export type EditOccasion = z.infer<typeof EditOccasionSchema>;

export { AddOccasionSchema, EditOccasionSchema, OccasionSchema };

