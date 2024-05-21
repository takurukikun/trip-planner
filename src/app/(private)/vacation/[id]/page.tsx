"use client";

import { Row } from "@/components/layout/grid";
import {
  getData,
  postData,
  putData,
  toastErrorsApi,
} from "@/lib/functions.api";
import { PostData, PutData } from "@/types/api";
import { UserApiProps } from "@/types/models/user";
import { VacationApiProps } from "@/types/models/vacation";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DateRangePicker,
  Image,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
  User,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getCities } from "./functions";
import { FormSendVacationProps, FormVacationProps } from "./types";
import { InputFile } from "components/inputFile";
import { fromDate, getLocalTimeZone } from "@internationalized/date";
import { useAsyncList } from "@react-stately/data";
import { CityApiProps } from "@/types/models/city";
import { toast } from "react-toastify";
import { eachDayOfInterval } from "date-fns";
import { convertToBase64 } from "@/lib/utils";

const VacationEdit = () => {
  const { id } = useParams<{ id: string | "new" }>();

  const [citySearch, setCitySearch] = useState<string>("");

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  let list = useAsyncList<CityApiProps["data"]>({
    load: async ({ signal, filterText }) => {
      const data = await getCities({
        signal,
        name: filterText,
      });

      return {
        items: data.data as any,
      };
    },
  });

  const { data: dataGetVacation, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<VacationApiProps>({
        url: "vacation",
        id: parseInt(id, 10),
        query: "include.users=true&&include.dates=true",
        signal,
      }),
    queryKey: ["vacation-get", id],
    enabled: id !== "new",
    select: (vacation) => ({
      ...vacation,
      dates: vacation.dates.map(({ date }) => new Date(date)),
    }),
  });

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<FormSendVacationProps>) =>
      postData<VacationApiProps, FormSendVacationProps>(val),
    mutationKey: ["vacation-post"],
  });

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<FormSendVacationProps>) =>
      putData<VacationApiProps, FormSendVacationProps>(val),
    mutationKey: ["vacation-put"],
  });

  const { handleSubmit, setValue, control, reset } = useForm<
    FormVacationProps,
    "vacations"
  >();

  const onSubmit = async (data: FormVacationProps) => {
    const photoBase64 = data.photo
      ? ((await convertToBase64(data.photo)) as string)
      : undefined;
    const parseData = {
      ...data,
      dates: eachDayOfInterval({
        start: data.dates.start.toDate(getLocalTimeZone()),
        end: data.dates.end.toDate(getLocalTimeZone()),
      }).map((date) => date.toISOString()),
      userIds: data.userIds.map((id) => Number(id)),
      photo: photoBase64,
      location: list.filterText,
    };
    console.log(parseData);
    if (id === "new")
      mutatePost({
        url: "/vacation",
        data: parseData,
      })
        .then(() => {
          toast.success("Vacation registered successfully");
          reset();
        })
        .catch((error: any) => {
          toastErrorsApi(error);
        });
    else
      mutatePut({
        url: "/vacation",
        data: parseData,
        id: parseInt(id, 10),
      })
        .then(() => {
          toast.success("Vacation updated successfully");
        })
        .catch((err) => {
          toastErrorsApi(err);
        });
  };

  const { data: dataGetUser, isLoading: loadingGetUser } = useQuery({
    queryKey: ["user-get"],
    queryFn: ({ signal }) =>
      getData<UserApiProps[]>({
        url: "/user",
        signal,
      }),
  });

  const loading = loadingGet || loadingPost || loadingPut;

  useEffect(() => {
    if (dataGetVacation && id !== "new") {
      setValue("title", dataGetVacation.title);
      setValue("description", dataGetVacation.description);
      setValue("location", dataGetVacation.location);
      setCitySearch(dataGetVacation.location);
      // setValue("photo", dataGetVacation.photo);
      setValue(
        "userIds",
        dataGetVacation.users?.map((user) => String(user.id)),
      );
      setValue("dates", {
        start: fromDate(dataGetVacation.dates[0], getLocalTimeZone()),
        end: fromDate(
          dataGetVacation.dates[dataGetVacation.dates.length - 1],
          getLocalTimeZone(),
        ),
      });
    }
  }, [dataGetVacation, id, setValue]);

  // useEffect(() => {
  //   console.log(citySearch);
  // }, [citySearch]);
  //
  // const setInputCitySearch = useCallback((inputValue: string) => {
  //   const timeoutId = setTimeout(() => {
  //     if (inputValue.length >= 3) {
  //       setCitySearch(inputValue);
  //     }
  //   }, 1000);
  //
  //   return () => clearTimeout(timeoutId);
  // }, []);

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
      id="formVacation"
    >
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: "Field is required" }}
        render={({ field, fieldState: { error } }) => (
          <Skeleton isLoaded={!loading}>
            <Input
              label="Title"
              type="text"
              isClearable
              id={field.name}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              variant="bordered"
              isInvalid={!!error}
              errorMessage={error?.message}
              disabled={loading}
              isRequired
            />
          </Skeleton>
        )}
      />
      <Row>
        <Controller
          name="userIds"
          control={control}
          rules={{ required: "Field is required" }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className="rounded-md" isLoaded={!loading}>
              <Select
                label="Participants"
                id={field.name}
                onSelectionChange={(value) => field.onChange(Array.from(value))}
                name={field.name}
                selectedKeys={
                  Array.isArray(field.value) ? new Set(field.value) : new Set()
                }
                variant="bordered"
                isInvalid={!!error}
                errorMessage={error?.message}
                classNames={{
                  value: "text-foreground",
                  label: "overflow-visible",
                  base: "w-full",
                }}
                isRequired
                isLoading={loadingGetUser}
                items={dataGetUser ?? []}
                selectionMode="multiple"
                isMultiline={(field.value?.length ?? 0) > 0}
                renderValue={(items) => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <div key={item.key}>
                          <Chip
                            isCloseable
                            onClose={() => {
                              setValue(
                                field.name,
                                field.value?.filter(
                                  (a) => a !== item.key?.toString(),
                                ),
                              );
                            }}
                            classNames={{
                              base: "h-full",
                              content: "px-0 pr-0",
                              closeButton:
                                "ml-3 [&>svg]:h-[1.4em] [&>svg]:w-[1.4em]",
                            }}
                          >
                            {item.data?.photo && (
                              <User
                                name={item.data?.name || "No name"}
                                avatarProps={{
                                  name: item.data?.name || "",
                                  showFallback: true,
                                  className: "mr-2 cursor-pointer",
                                  src: item.data?.photo,
                                }}
                                classNames={{
                                  description: "cursor-pointer",
                                  name: "cursor-pointer",
                                  base: "flex",
                                }}
                              />
                            )}
                            {!item.data?.photo && (
                              <span className="ml-2">{item?.data?.name}</span>
                            )}
                          </Chip>
                        </div>
                      ))}
                    </div>
                  );
                }}
              >
                {(item) => (
                  <SelectItem
                    key={item.id}
                    className="capitalize"
                    textValue={String(item.name)}
                  >
                    <div className="flex flex-col gap-2">
                      <User
                        name={item?.name || "No name"}
                        avatarProps={{
                          name: item?.name || "",
                          showFallback: true,
                          className: "mr-2 cursor-pointer",
                          src: item?.photo,
                        }}
                        classNames={{
                          description: "cursor-pointer",
                          name: "cursor-pointer",
                          base: "flex justify-start",
                        }}
                      />
                    </div>
                  </SelectItem>
                )}
              </Select>
            </Skeleton>
          )}
        />
        <Controller
          name="dates"
          control={control}
          rules={{
            required: "Field is required",
          }}
          render={({ field, fieldState: { error } }) => (
            <DateRangePicker
              granularity="day"
              label="Dates"
              variant="bordered"
              isRequired
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!error}
              errorMessage={error?.message}
              isDateUnavailable={(date) => {
                // only dates in 2024 are available
                return date.year !== 2024;
              }}
            />
          )}
        />
      </Row>
      <Row>
        <Controller
          name="location"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Skeleton isLoaded={!loading}>
              <Autocomplete
                label="Location"
                type="text"
                id={field.name}
                name={field.name}
                inputValue={citySearch}
                onInputChange={(value) => {
                  setCitySearch(value);
                  if (timeoutId) {
                    clearTimeout(timeoutId);
                  }
                  setTimeoutId(
                    setTimeout(() => {
                      if (value.length >= 3) {
                        list.setFilterText(value);
                      }
                    }, 1000),
                  );
                }}
                onChange={(e) => {
                  field.onChange(e);
                }}
                value={field.value}
                variant="bordered"
                isLoading={list.isLoading}
                items={list.items}
                isInvalid={!!error}
                errorMessage={error?.message}
                disabled={loading}
              >
                {(item) => (
                  <AutocompleteItem key={item.id} value={item.id}>
                    {`${item.name} - ${item.region}, ${item.country}`}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </Skeleton>
          )}
        />
        {dataGetVacation && dataGetVacation.photo && (
          <Image
            alt="location picture"
            src={dataGetVacation.photo}
            width={200}
            height={200}
          />
        )}
        <Controller
          name="photo"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Skeleton isLoaded={!loading}>
              <InputFile isRequired={false} onChange={field.onChange} />
            </Skeleton>
          )}
        />
      </Row>
      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <Skeleton isLoaded={!loading}>
            <Textarea
              label="Description"
              id={field.name}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              variant="bordered"
              isInvalid={!!error}
              errorMessage={error?.message}
              disabled={loading}
            />
          </Skeleton>
        )}
      />
      <Button
        type="submit"
        variant="flat"
        color="primary"
        className="w-fit"
        isDisabled={loading}
      >
        Submit
      </Button>
    </form>
  );
};

export default VacationEdit;
