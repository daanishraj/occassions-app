import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

const useDeleteOccasion = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      return OccassionsService.deleteOccasion(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OCCASIONS] });
    },
  });

  return {
    isDeletingOccasion: isPending,
    isDeletedOccasion: isSuccess,
    errorDeletingOccasion: isError,
    deleteOccasion: mutate,
  };
};

export default useDeleteOccasion;
