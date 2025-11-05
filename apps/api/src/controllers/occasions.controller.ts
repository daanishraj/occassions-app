import { logger } from '@/utils/logger';
import { AddOccasionSchema, EditOccasionSchema } from '@occasions/types';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Request, Response } from "express";

const prisma = new PrismaClient()

const getOccasions = async (req: Request, res: Response) => {
  // userId is now guaranteed to exist due to requireAuth middleware
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Authentication required" });
  }
  
  const occasions = await prisma.occasion.findMany({
    where: {
      userId
    }
  })
  res.status(200).send(occasions);
};

const addOccasion = async (req: Request, res: Response) => {
  // userId is now guaranteed to exist due to requireAuth middleware
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Authentication required" });
  }

  const parseResult = AddOccasionSchema.safeParse(req.body);
  
  if (!parseResult.success) {
    logger.error("Invalid payload - missing or incorrect fields!");
    return res.status(400).json({ error: "some fields are missing or incorrect", details: parseResult.error.errors });
  }
  
  // Extract fields from body (userId is now from auth, not body)
  const { name, occasionType, month, day } = req.body;
  
  const newOccasion = await prisma.occasion.create({
    data: {
      userId, // Use authenticated user ID from middleware
      name,
      occasionType,
      month,
      day
    },
  })
  res.json(newOccasion);
};

const editOccasion = async (req: Request, res: Response) => {
  // userId is now guaranteed to exist due to requireAuth middleware
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Authentication required" });
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

    // Verify that the occasion belongs to the authenticated user
    if (existingOccasion.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You don't have permission to edit this occasion" });
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
  // userId is now guaranteed to exist due to requireAuth middleware
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Authentication required" });
  }

  try {
    const id = req.params.id;
    
    // First check if the occasion exists and belongs to the user
    const existingOccasion = await prisma.occasion.findUnique({
      where: { id: String(id) },
    });
    
    if (!existingOccasion) {
      return res.status(404).json({ error: 'Occasion not found' });
    }

    // Verify that the occasion belongs to the authenticated user
    if (existingOccasion.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You don't have permission to delete this occasion" });
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
