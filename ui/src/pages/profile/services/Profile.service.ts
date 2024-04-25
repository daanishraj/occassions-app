import { Profile } from "../../../../../api/src/controllers/profile.controller";
import Api from "../../../services/Api";

const route = "/profile";

const getProfile = async () => {
  const response = await Api().get(route);
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
