import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@nextui-org/react";
import { VacationApiProps } from "@/types/models/vacation";
import { IoMdPin } from "react-icons/io";
import { format } from "date-fns";

export default function CardVacation(vacation: VacationApiProps) {
  return (
    <Card className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 h-[500px] cursor-pointer hover:scale-[1.02] transition">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start text-wrap h-12">
        <span className="uppercase font-bold">{vacation.title}</span>
      </CardHeader>
      <CardBody className="flex justify-between flex-col">
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-[200px] object-cover"
          src={vacation.photo}
        />

        <span className="text-sm text-foreground-800 mt-2">
          {vacation.description}
        </span>
        {/*<div className="flex items-center justify-between px-4 py-2">*/}
        {/*  <p className="text-small text-main">{format(new Date(), "dd")}</p>*/}
        {/*  <p className="text-small text-main">{format(new Date(), "dd")}</p>*/}
        {/*</div>*/}
        <AvatarGroup className="justify-start">
          {vacation.users?.map((user) => (
            <Avatar
              title={user.name}
              name={user.name}
              key={user.id}
              src={user.photo}
            />
          ))}
        </AvatarGroup>
        <div className="flex w-full justify-between"></div>
      </CardBody>
      {/*<CardFooter className="absolute z-10 top-1 flex-col !items-start">*/}

      {/*</CardFooter>*/}
      <CardFooter className="bg-white border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        {/*<div className="rounded-full bg-white px-4 py-2 flex items-baseline text-nowrap">*/}
        <IoMdPin className="text-main text-xl" />
        <h4 className="text-main ml-2">{vacation.location}</h4>
        {/*</div>*/}
      </CardFooter>
    </Card>
  );
}
