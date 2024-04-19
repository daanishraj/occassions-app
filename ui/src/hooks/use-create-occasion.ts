import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewOccasion } from "../components/add-occassion-dialog";
import OccassionsService from "../services/Occassions.service";
import { QueryKeys } from "../types";

type TProps = {
  setNewOccasion: (defaultOccassion: NewOccasion) => void;
  onClose: () => void;
};

const useCreateOccasion = ({ setNewOccasion, onClose }: TProps) => {
  const queryClient = useQueryClient();

  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: OccassionsService.addOccassion,
    onSuccess: () => {
      setNewOccasion({ name: "" });
      onClose();
      queryClient.invalidateQueries({ queryKey: [QueryKeys.OCCASIONS] });
    },
  });

  return { isAdding: isPending, isAdded: isSuccess, errorAdding: isError, addOccasion: mutate };
};

export default useCreateOccasion;
