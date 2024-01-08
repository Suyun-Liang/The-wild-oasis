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
  /*   const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function getCountries() {
      try {
        const { data } = await axios.get(COUNTRIES_URL);
        const countries = data.map((country) => country.name.common).sort();
        countries.unshift("");
        setCountries(countries);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getCountries();
  }, []); */
}
