// hooks/useTimetable.js

import {useQuery} from "@tanstack/react-query";

export const useTimetable = (id) => {
  return useQuery({
    queryKey: ["timetable", id],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/getTable/${id}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      return data.data;
    },

    enabled: !!id,

    staleTime: 1000 * 60 * 5,
  });
};
