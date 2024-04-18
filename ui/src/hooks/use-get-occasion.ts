import { useQuery } from "@tanstack/react-query";
import OccassionsService from "../services/Occassions.service";
import { QueryKeys } from "../types";
import { AxiosError } from "axios";
import { Occasion } from "../../../api/src/controllers/occassions.controller";

const useGetOccasion = () => {
  const { data, isLoading, isError, error } = useQuery<Occasion[], AxiosError>({
    queryKey: [QueryKeys.OCCASIONS],
    queryFn: OccassionsService.getOccassions,
  });

  return { data, isLoading, isError, error };
};

export default useGetOccasion;
