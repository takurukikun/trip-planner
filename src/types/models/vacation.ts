import { UserApiProps } from "./user";
import { DefaultApiProps } from "@/types";
import { DateVacationApiProps } from "@/types/models/dateVacation";

export interface VacationApiProps extends DefaultApiProps {
  title: string;
  users: UserApiProps[];
  dates: DateVacationApiProps[];
  location: string;
  photo?: string;
  description?: string;
}
