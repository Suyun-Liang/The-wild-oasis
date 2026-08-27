import { useMutation } from "@tanstack/react-query";
import { CreateGetGuest } from "../../services/apiGuests";
import toast from "react-hot-toast";

export default function useCreateGuest() {
  const { mutate: createOrGetGuest, isPending: isCreatingGuest } = useMutation({
    mutationFn: CreateGetGuest,
    onSuccess: (data) => {
      if (!data.isExistGuest) {
        toast.success("New user successfully created");
      }
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  return { createOrGetGuest, isCreatingGuest };
}
