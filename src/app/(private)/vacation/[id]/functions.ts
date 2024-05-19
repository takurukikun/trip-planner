import { CityApiProps } from "@/types/models/city";
import axios from "axios";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

export function getDaysOfMonth(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => ({
    value: format(day, "dd"),
    label: format(day, "dd '-' EEEE"),
  }));
}

export async function getCities({
  name,
  signal,
}: {
  signal: AbortSignal;
  name?: string;
}) {
  const { data } = await axios.get<CityApiProps>(
    `http://geodb-free-service.wirefreethought.com/v1/geo/cities${name ? `?namePrefix=${name}` : ""}`,
    {
      signal,
    }
  );
  return data;
}
