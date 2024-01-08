import { useQuery } from "@tanstack/react-query";
import { getCabin } from "../../services/apiCabins";

export default function useCabin(id) {
  const { data: cabin, isLoading } = useQuery({
    queryKey: ["cabin", id],
    queryFn: () => getCabin(id),
  });

  return { cabin, isLoading };
}
