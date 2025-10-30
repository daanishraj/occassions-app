import { useMutation } from "@tanstack/react-query";
import ProfileService from "../services/Profile.service";

const useEditProfile = () => {
  const { mutate, isError, isPending, isSuccess } = useMutation({
    mutationFn: ProfileService.editProfile,
  });

  return { isEditingProfile: isPending, isEdited: isSuccess, errorEditingProfile: isError, editProfile: mutate };
};

export default useEditProfile;
