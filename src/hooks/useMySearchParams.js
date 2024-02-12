import { useSearchParams } from "react-router-dom";

export function useMySearchParams() {
  const [searchParams] = useSearchParams();
  let search = {};

  for (let param of searchParams) {
    const [key, value] = [param[0], param[1]];
    search[key] = value;
  }

  return { search };
}
