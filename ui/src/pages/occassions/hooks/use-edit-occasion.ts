import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EditOccasion, Occasion } from "../../../../../api/src/validation";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

export type RequestEditOccasion = {
    id: string;
    userId: string;
    payload:  EditOccasion
}

const useEditOccasion = (onClose: ()=> void) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Occasion, AxiosError,RequestEditOccasion>(
    {
    mutationFn: ({id, userId, payload}) => OccassionsService.editOccasion(id, userId, payload),
    onSuccess: (updatedOccasion, { id }) => {
      queryClient.setQueryData<Occasion[]>([QueryKeys.OCCASIONS], (occasions) => {
        if (!occasions) return [];
        return occasions.map((occasion) =>
          occasion.id === id ? updatedOccasion : occasion
        );
      });
      onClose();
    },
    onError : async (error, {id, payload}) => {
      //TODO: implement a toast
      console.log('error updating', `id: ${id}, payload: ${payload}`)
      console.log({error})
    }
  });

  return {
    isEditingOccasion: isPending,
    editOccasion: mutate,
  };
};

export default useEditOccasion;
