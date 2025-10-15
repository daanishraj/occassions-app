import { Prisma, PrismaClient } from '@prisma/client';
import type { Request, Response } from "express";
import {
  AddOccasionSchema,
  EditOccasionSchema
} from '../validation';

const prisma = new PrismaClient()

// TODO: fix this
// @ts-ignore
const getOccasions = async (req: Request, res: Response) => {
  console.log('backend - making  a GET request');
  const userId = req.headers.authorization?.split(" ")[1];
  console.log('userId: ', userId); // Extract userId from Authorization header
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: userId is missing" });
  }
  const occasions = await prisma.occasion.findMany({
    where: {
      userId
    }
  })
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

const editOccasion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parseResult = EditOccasionSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    return res.status(400).json({ error: "Some fields are missing or incorrect", details: parseResult.error.errors });
  }

  const { name, occasionType, month, day } = parseResult.data;

  try {
    const existingOccasion = await prisma.occasion.findUnique({
      where: { id },
    });
    
    if (!existingOccasion) {
      return res.status(404).json({ error: "Occasion not found" });
    }

    const updatedOccasion = await prisma.occasion.update({
      where: { id },
      data: {
        name,
        occasionType,
        month,
        day,
      },
    });

    res.json(updatedOccasion);
  } catch (error) {
    console.error("Error updating occasion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteOccasion = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    const deletedOccasion = await prisma.occasion.delete({
      where: {
        id: String(id)
      }
    })
    res.json(deletedOccasion);

  } catch (error) {
    console.error('Error deleting occasion:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      res.status(404).json({ error: 'Occasion not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }

  }
 
};

export const occasionsController = {
  getOccasions,
  addOccasion,
  editOccasion,
  deleteOccasion,
};
