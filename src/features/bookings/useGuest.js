import { useQuery } from "@tanstack/react-query";
import { getGuest } from "../../services/apiGuests";
import { useEffect } from "react";
import toast from "react-hot-toast";

function useGuest(guestObj) {
  const { data, isLoading, error, isSuccess, isError } = useQuery({
    queryKey: ["guest"],
    queryFn: () => getGuest(guestObj),
  });

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
    if (isError) {
      console.log(error.message);
    }
  }, [isSuccess, data, error, isError]);

  return { data, isLoading };
}

export default useGuest;
