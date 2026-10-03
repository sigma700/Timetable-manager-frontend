// hooks/useTimetable.js
import { useQuery } from "@tanstack/react-query";

export const useTimetable = (id) => {
  const query = useQuery({
    queryKey: ["timetable", id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/getTable/${id}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch timetable: ${res.status}`);
      }

      const data = await res.json();
      return data.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    // React Query v4 keeps `isLoading: true` on disabled queries.
    // Only treat it as loading when there's an actual id being fetched.
    isLoading: !!id && query.isLoading,
  };
};