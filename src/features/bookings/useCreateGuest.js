import { useMutation } from "@tanstack/react-query";
import { CreateGetGuest } from "../../services/apiGuests";

export default function useCreateGuest() {
  const { mutate: createOrGetGuest, isLoading: isCreatingGuest } = useMutation({
    mutationFn: CreateGetGuest,
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  return { createOrGetGuest, isCreatingGuest };
}
