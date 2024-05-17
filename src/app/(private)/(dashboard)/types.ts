import { DateVacationApiProps } from "@/types/models/dateVacation";
import { VacationApiProps } from "@/types/models/vacation";

export interface DashboardHookProps {
  loadingGetVacation: boolean;
  setLoadingGetVacation: (loading: boolean) => void;
  dateField?: Record<number, DateCalendarProps[]>;
  setDateField: (dateField: Record<number, DateCalendarProps[]>) => void;
  dataGetVacation?: VacationWithDatesApiProps[];
  setDataGetVacation: (data: VacationWithDatesApiProps[]) => void;
}

export interface DashboardProps {
  month: number;
  data?: VacationWithDatesApiProps[];
  loading?: boolean;
  theme?: "light" | "dark";
  daysSelected?: { month: number; days: Date[] };
}

export type FormVacationProps = VacationApiProps & {
  userIds: string[];
  dates: string[];
};

export type DateCalendarProps = {
  id: number;
  date: Date;
};

export type VacationWithDatesApiProps = Omit<VacationApiProps, "dates"> & {
  dates: DateVacationApiProps[];
};
