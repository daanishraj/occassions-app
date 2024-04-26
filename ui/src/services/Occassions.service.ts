import { AxiosResponse } from "axios";
import { AddOccasion, Occasion } from "../../../api/src/controllers/occassions.controller";
import Api from "./Api";

const route = "/occassions";

const getOccassions = async (): Promise<Occasion[]> => {
  const response = await Api().get(route);
  return response.data;
};
const addOccassion = async (occassion: AddOccasion): Promise<Occasion> => {
  const response = await Api().post(route, occassion);
  return response.data;
};

const deleteOccassion = async (id: string): Promise<AxiosResponse> => {
  const response = await Api().delete(`${route}/${id}`);
  return response;
};

export default {
  getOccassions,
  addOccassion,
  deleteOccassion,
};
