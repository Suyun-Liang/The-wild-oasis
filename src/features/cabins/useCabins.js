import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getAvailableCabinIn, getCabins } from "../../services/apiCabins";

export default function useCabins() {
  const { isLoading, data, status } = useQuery({
    queryKey: ["cabins"],
    queryFn: () => getCabins({ limitNum: 8 }),
  });

  let cabins = data?.cabins;

  return { isLoading, cabins, status };
}

export function useCabinsIn({ checkin, checkout }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["cabins", checkin, checkout],
      queryFn: (params) =>
        getAvailableCabinIn({ ...params, checkin, checkout }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const currentCount = allPages.reduce(
          (acc, page) => (acc += page.cabins.length),
          0
        );
        if (currentCount >= lastPage.count) return;
        return allPages.length + 1;
      },
    });

  const cabins = data?.pages.reduce(
    (acc, page) => [...acc, ...page.cabins],
    []
  );

  return { cabins, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
}
