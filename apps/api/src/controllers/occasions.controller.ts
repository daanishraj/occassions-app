import { logger } from '@/utils/logger';
import { AddOccasionSchema, EditOccasionSchema } from '@occasions/types';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Request, Response } from "express";

const prisma = new PrismaClient()

const getOccasions = async (req: Request, res: Response) => {
  const userId = req.headers.authorization?.split(" ")[1];
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
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: userId is missing" });
  }
  const parseResult = AddOccasionSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    logger.error("Invalid payload - missing or incorrect fields!");
    return res.status(400).json({ error: "some fields are missing or incorrect", details: parseResult.error.errors });
  }
  const { name, occasionType, month, day } = req.body;
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
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: userId is missing" });
  }
  
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

    // Verify that the occasion belongs to the userId from the authorization header
    if (existingOccasion.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only edit your own occasions" });
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
    logger.error("Error updating occasion:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const deleteOccasion = async (req: Request, res: Response) => {
  const userId = req.headers.authorization?.split(" ")[1];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: userId is missing" });
  }
  try {
    const id = req.params.id;
    
    // First, verify that the occasion exists and belongs to the userId
    const existingOccasion = await prisma.occasion.findUnique({
      where: { id: String(id) },
    });
    
    if (!existingOccasion) {
      return res.status(404).json({ error: 'Occasion not found' });
    }

    if (existingOccasion.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own occasions" });
    }

    const deletedOccasion = await prisma.occasion.delete({
      where: {
        id: String(id)
      }
    })
    res.json(deletedOccasion);

  } catch (error: unknown) {
    logger.error('Error deleting occasion:', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
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
