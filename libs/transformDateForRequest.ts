import { getTime, millisecondsToSeconds, endOfDay, startOfDay } from "date-fns";

export function transformDateForRequest(
  date: Date | null,
  type: "date_start" | "date_end"
): number {
  const today = new Date();

  if (type === "date_end") {
    return millisecondsToSeconds(getTime(endOfDay(date || today)));
  }

  return millisecondsToSeconds(getTime(startOfDay(date || today)));
}
