import type { Request, Response } from "express";
import { z } from "zod";

const whatsAppRegex = /^\+[1-9]\d{9,14}$/;

const ProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  whatsAppNumber: z
    .string()
    .regex(whatsAppRegex, {
      message: "Number should begin with a +, have country code and the correct number of digits",
    })
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

let profileData: Profile = {
  fullName: "James Py",
  email: "awake@srf.org",
  whatsAppNumber: "+4917664099416",
};

const getProfile = async (req: Request, res: Response) => {
  console.log("get profile");
  res.send(ProfileSchema.parse(profileData));
};

const editProfile = async (req: Request, res: Response) => {
  console.log("edit profile");
  const payload = ProfileSchema.parse(req.body);
  profileData = {
    ...payload,
  };
  res.json(payload);
};

export const profileController = {
  getProfile,
  editProfile,
};
