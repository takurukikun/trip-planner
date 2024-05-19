import { VacationApiProps } from "@/types/models/vacation";
import { DateValue } from "@nextui-org/calendar";

export type FormVacationProps = Omit<VacationApiProps, "dates" | "photo"> & {
  userIds: string[];
  dates: { start: DateValue; end: DateValue };
  photo: File;
};
