import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Occasion } from "../../../../../api/src/controllers/occasions.controller";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

const useGetOccasion = () => {
  const { user } = useUser()
  const userId = user?.id; //clerk user should be non-null if user is logged in
  const { data, isLoading, isError, error } = useQuery<Occasion[], AxiosError>({
    queryKey: [QueryKeys.OCCASIONS],
    queryFn: () => OccassionsService.getOccasions(userId!),
    enabled: !!userId, 
    retry: false,
  });

  if (!userId) {
    return {
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Unauthorized: User ID is missing", status: 403 } as AxiosError,
    };
  }

  return { data, isLoading, isError, error };
};

export default useGetOccasion;
