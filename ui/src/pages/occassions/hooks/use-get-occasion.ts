import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Occasion } from "../../../../../api/src/controllers/occassions.controller";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

const useGetOccasion = () => {
  const { data, isLoading, isError, error } = useQuery<Occasion[], AxiosError>({
    queryKey: [QueryKeys.OCCASIONS],
    queryFn: OccassionsService.getOccassions,
  });

  return { data, isLoading, isError, error };
};

export default useGetOccasion;
