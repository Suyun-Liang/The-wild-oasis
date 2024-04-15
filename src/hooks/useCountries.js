import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../services/apiCountries";

export function useCountries() {
  const { data: countries, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    onError: (err) => {
      console.error(err.message);
    },
  });
  return { countries, isLoading };
}
