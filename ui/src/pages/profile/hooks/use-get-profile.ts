import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Profile } from "../../../../../api/src/validation";
import { QueryKeys } from "../../../types";
import ProfileService from "../services/Profile.service";

const useGetProfile = () => {
  console.log('inside useGetProfile..');
  const { data, isLoading, isError, error } = useQuery<Profile, AxiosError>({
    queryKey: [QueryKeys.PROFILE],
    queryFn: ProfileService.getProfile,
  });

  return { data, isLoading, isError, error };
};

export default useGetProfile;
