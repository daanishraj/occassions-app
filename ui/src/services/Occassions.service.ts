import { AxiosResponse } from "axios";
import { AddOccasion, Occasion } from "../../../api/src/controllers/occasions.controller";
import Api from "./Api";

const route = "/occasions";

const getOccasions = async (userId: string): Promise<Occasion[]> => {
  const response = await Api().get(route, {
    headers: {
      Authorization: `Bearer ${userId}`
    }
  });
  return response.data;
};
const addOccasion = async (occassion: AddOccasion): Promise<Occasion> => {
  const response = await Api().post(route, occassion);
  return response.data;
};

const deleteOccasion = async (id: string): Promise<AxiosResponse> => {
  const response = await Api().delete(`${route}/${id}`);
  return response;
};

export default {
  getOccasions,
  addOccasion,
  deleteOccasion,
};
