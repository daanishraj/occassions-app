import { AddOccasion, EditOccasion, Occasion } from "@occasions/types";
import { AxiosResponse } from "axios";
import Api from "./Api";

const route = "/occasions";

/**
 * Get all occasions for the authenticated user
 * @param token - Clerk session token from useAuth().getToken()
 */
const getOccasions = async (token: string | null): Promise<Occasion[]> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  
  const response = await Api().get(route, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Add a new occasion
 * @param occasion - Occasion data (without userId - comes from auth)
 * @param token - Clerk session token from useAuth().getToken()
 */
const addOccasion = async (occasion: AddOccasion, token: string | null): Promise<Occasion> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  
  const response = await Api().post(route, occasion, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Edit an existing occasion
 * @param id - Occasion ID
 * @param payload - Updated occasion data
 * @param token - Clerk session token from useAuth().getToken()
 */
const editOccasion = async (id: string, payload: EditOccasion, token: string | null): Promise<Occasion> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  
  const response = await Api().put(`${route}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

/**
 * Delete an occasion
 * @param id - Occasion ID
 * @param token - Clerk session token from useAuth().getToken()
 */
const deleteOccasion = async (id: string, token: string | null): Promise<AxiosResponse> => {
  if (!token) {
    throw new Error("Authentication token is required");
  }
  
  const response = await Api().delete(`${route}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response;
};

export default {
  getOccasions,
  addOccasion,
  editOccasion,
  deleteOccasion,
};
