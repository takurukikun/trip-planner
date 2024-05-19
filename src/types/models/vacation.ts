import { UserApiProps } from "./user";
import { DefaultApiProps } from "@/types";

export interface VacationApiProps extends DefaultApiProps {
  title: string;
  users: UserApiProps[];
  dates: string[];
  location: string;
  photo?: string;
  description?: string;
}
