import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSerchparams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";
  function handleChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSerchparams(searchParams);
  }
  return (
    <Select
      $type="white"
      options={options}
      value={sortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;
