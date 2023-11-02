import { useMutation } from "@tanstack/react-query";

import { deleteGuest as deleteGuestApi } from "../../services/apiGuests";
import toast from "react-hot-toast";

export default function useDeleteGuest() {
  const { mutate: deleteGuest, isLoading: isDeletingGuest } = useMutation({
    mutationFn: deleteGuestApi,
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { deleteGuest, isDeletingGuest };
}
