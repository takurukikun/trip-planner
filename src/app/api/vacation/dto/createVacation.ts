export interface CreateVacationDTO {
  title: string;
  description: string;
  userIds: number[];
  dates: string[];
  photo: string;
  location: string;
}
