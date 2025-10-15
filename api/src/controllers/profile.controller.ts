import type { Request, Response } from "express";
import { ProfileSchema, type Profile } from '../validation';

let profileData: Profile = {
  fullName: "James Py",
  email: "awake@srf.org",
  whatsAppNumber: "+4917664099416",
};

// TODO: fix this
// @ts-ignore
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
