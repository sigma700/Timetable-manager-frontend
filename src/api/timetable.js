// api/timetable.js

export async function getTimetable(id) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/getTable/${id}`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch timetable");
  }

  const json = await response.json();

  return json.data;
}
