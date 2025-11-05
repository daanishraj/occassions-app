import { useAuth } from "@clerk/clerk-react";
import { EditOccasion, Occasion } from "@occasions/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

export type RequestEditOccasion = {
    id: string;
    payload: EditOccasion;
}

const useEditOccasion = (onClose: ()=> void) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<Occasion, AxiosError, RequestEditOccasion>(
    {
    mutationFn: async ({id, payload}) => {
      const token = await getToken();
      return OccassionsService.editOccasion(id, payload, token);
    },
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
