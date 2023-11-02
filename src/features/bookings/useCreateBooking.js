import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createBooking as createBookingApi } from "../../services/apiBookings";

export default function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutate: createBooking, isLoading: isCreatingBooking } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: (data) => {
      toast.success(`Booking ID:${data.id} successfully created`);
      queryClient.invalidateQueries({ refetchType: "active" });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createBooking, isCreatingBooking };
}
