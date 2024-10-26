import { PrismaClient } from '@prisma/client';
import type { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
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
  ANNIVERSARY= "Anniversary",
}

// Define schemas here for validation
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

export type Occasion = z.infer<typeof OccasionSchema>;
export type AddOccasion = z.infer<typeof AddOccasionSchema>;

let data: Occasion[] = [
  {
    id: uuidV4(),
    userId: uuidV4(),
    name: "PY",
    occasionType: OccasionType.BIRTHDAY,
    day: 5,
    month: Month.JANUARY,
  },
  {
    id: uuidV4(),
    userId: uuidV4(),
    name: "Sri Yukteswar",
    occasionType: OccasionType.BIRTHDAY,
    month: Month.MAY,
    day: 10,
  },
]

const prisma = new PrismaClient()

// TODO: fix this
// @ts-ignore
const getOccasions = async (req: Request, res: Response) => {
  console.log('backend - making  a GET request');
  console.log(req.body);
  const occasions = await prisma.occasion.findMany()
  res.status(200).send(occasions);
};

const addOccasion = async (req: Request, res: Response) => {
  console.log('body: ', req.body);
  const parseResult = AddOccasionSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    console.log("Invalid payload - missing or incorrect fields!");
    return res.status(400).json({ error: "some fields are missing or incorrect", details: parseResult.error.errors });
  }
  const { userId, name, occasionType, month, day } = req.body;
  const newOccasion = await prisma.occasion.create({
    data: {
      userId,
      name,
      occasionType,
      month,
      day
    },
  })
  res.json(newOccasion);
};

const deleteOccasion = async (req: Request, res: Response) => {
  data = data.filter((occasion: Occasion) => occasion.id !== req.params.id);
  res.status(204).send();
};

export const occasionsController = {
  getOccasions,
  deleteOccasion,
  addOccasion,
};
