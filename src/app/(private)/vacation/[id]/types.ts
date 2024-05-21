import { VacationApiProps } from "@/types/models/vacation";
import { DateValue } from "@nextui-org/calendar";

export type FormVacationProps = Omit<VacationApiProps, "dates" | "photo"> & {
  userIds: string[];
  dates: { start: DateValue; end: DateValue };
  photo: File;
};

export type FormSendVacationProps = Omit<
  VacationApiProps,
  "userIds" | "dates"
> & {
  userIds: number[];
  dates: string[];
};
