import { AddOccasion, EditOccasion, Occasion } from "@occasions/types";
import { AxiosResponse } from "axios";
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

const editOccasion = async (id:string, userId: string, payload: EditOccasion): Promise<Occasion> => {
  const response = await Api().put(`${route}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${userId}`
    }
  })
  return response.data;
};

const deleteOccasion = async (id: string): Promise<AxiosResponse> => {
  const response = await Api().delete(`${route}/${id}`);
  return response;
};

export default {
  getOccasions,
  addOccasion,
  editOccasion,
  deleteOccasion,
};
