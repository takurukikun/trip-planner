import { VacationApiProps } from "@/types/models/vacation";
import { DateValue } from "@nextui-org/calendar";

export type FormVacationProps = Omit<VacationApiProps, "dates"> & {
  userIds: string[];
  dates: { start: DateValue; end: DateValue };
};
