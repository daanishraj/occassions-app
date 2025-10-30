import { ProfileSchema, type Profile } from '@occassions/types';
import type { Request, Response } from "express";

let profileData: Profile = {
  firstName: "James",
  lastName: "Py",
  email: "awake@srf.org",
  phoneNumber: "+4917664099416",
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
