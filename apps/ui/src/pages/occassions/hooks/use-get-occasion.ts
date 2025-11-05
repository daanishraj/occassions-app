import { useAuth } from "@clerk/clerk-react";
import { Occasion } from "@occasions/types";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import OccassionsService from "../../../services/Occassions.service";
import { QueryKeys } from "../../../types";

const useGetOccasion = () => {
  const { getToken, isLoaded } = useAuth();
  const [token, setToken] = useState<string | null>(null);

  // Get the session token from Clerk
  useEffect(() => {
    const fetchToken = async () => {
      if (isLoaded) {
        try {
          const sessionToken = await getToken();
          setToken(sessionToken);
        } catch (error) {
          console.error("Failed to get session token:", error);
          setToken(null);
        }
      }
    };
    fetchToken();
  }, [getToken, isLoaded]);

  const { data, isLoading, isError, error } = useQuery<Occasion[], AxiosError>({
    queryKey: [QueryKeys.OCCASIONS, token],
    queryFn: () => OccassionsService.getOccasions(token),
    enabled: !!token && isLoaded,
    retry: false,
  });

  if (!isLoaded) {
    return {
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    };
  }

  if (!token) {
    return {
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Unauthorized: Session token is missing", status: 401 } as AxiosError,
    };
  }

  return { data, isLoading, isError, error };
};

export default useGetOccasion;
