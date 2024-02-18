import { useSearchParams } from "react-router-dom";

export function useMySearchParams() {
  const [searchParams] = useSearchParams();
  const search = {};

  searchParams.forEach((val, param) => {
    if (Object.prototype.hasOwnProperty.call(search, param)) {
      search[param] += `,${val}`;
    } else {
      search[param] = val;
    }
  });

  return { search };
}
