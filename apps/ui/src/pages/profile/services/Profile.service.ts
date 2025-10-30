import { Profile } from "@occasions/types";
import Api from "../../../services/Api";

const route = "/profile";

console.log('inside profile service..');

const getProfile = async () => {
  const resp = Api();
  console.log({resp});
  const response = await Api().get(route);
  console.log( { response })
  return response.data;
};

const editProfile = async (payload: Profile) => {
  const response = await Api().put(route, payload);
  return response.data;
};

export default {
  getProfile,
  editProfile,
};
