"use client";
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { VacationApiProps } from "@/types/models/vacation";
import { IoMdPin } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function CardVacation(vacation: VacationApiProps) {
  const router = useRouter();
  return (
    <Card className="text-foreground col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 h-[500px]">
      <CardHeader className="pb-0 pt-2 px-4 flex justify-between items-start min-h-12">
        <span className="uppercase font-bold">{vacation.title}</span>
      </CardHeader>
      <CardBody className="flex justify-between flex-col">
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-[200px] object-cover"
          src={vacation.photo}
        />

        <CardFooter className="bg-white border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large top-[180px] w-[calc(100%_-_24px)] shadow-small ml-auto z-10">
          <IoMdPin className="text-main text-xl" />
          <h4 className="text-main ml-2">{vacation.location}</h4>
        </CardFooter>

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
        <Divider />
      </CardBody>
      <CardFooter className="overflow-hidden flex justify-between py-2 rounded-large w-[calc(100%_-_8px)]">
        <Tooltip
          content="Edit"
          placement="bottom-end"
          className="text-white"
          color="default"
        >
          <Button
            isIconOnly
            color="default"
            className="rounded-full text-white"
            onClick={() => router.push(`/vacation/${vacation.id}`)}
          >
            <FaPencil size={12} />
          </Button>
        </Tooltip>
        <Tooltip
          content="Delete"
          placement="bottom-end"
          className="text-white"
          color="default"
        >
          <Button
            isIconOnly
            color="default"
            className="rounded-full text-white"
            // onClick={() => router.push(`/${path}/new`)}
          >
            <FaTrash size={12} />
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
