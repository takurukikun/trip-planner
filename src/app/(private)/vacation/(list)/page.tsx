"use client";

import { useQuery } from "@tanstack/react-query";
import { getData } from "@/lib/functions.api";
import { VacationApiProps } from "@/types/models/vacation";
import CardVacation from "@/app/(private)/vacation/(list)/components/card.vacation";

export default function User() {
  const { data: dataGetVacation, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<VacationApiProps[]>({
        url: "vacation",
        signal,
        query: "orderBy.createdAt=desc&&include.users=true",
      }),
    queryKey: ["vacation-get"],
  });

  return (
    <div className="max-w-[1200px] gap-6 grid grid-cols-12 grid-rows-2 px-8">
      {loadingGet ? (
        <p>Loading...</p>
      ) : (
        dataGetVacation?.map((vacation) => (
          <CardVacation {...vacation} key={vacation.id} />
        ))
      )}
    </div>
  );
}
