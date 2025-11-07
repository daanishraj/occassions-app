import { useMutation, useQueryClient } from "@tanstack/react-query";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

const useDeleteOccasion = () => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) => 
      OccassionsService.deleteOccasion(id, userId),
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
