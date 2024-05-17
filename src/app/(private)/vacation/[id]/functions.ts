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
