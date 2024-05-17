"use client";

import { Row } from "@/components/layout/grid";
import { getData, postData, putData } from "@/lib/functions.api";
import { PostData, PutData } from "@/types/api";
import { UserApiProps } from "@/types/models/user";
import { VacationApiProps } from "@/types/models/vacation";
import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  Skeleton,
  Textarea,
  User,
  cn,
} from "@nextui-org/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import { getCities } from "./functions";
import { FormVacationProps } from "./types";

const VacationEdit = () => {
  const { id } = useParams<{ id: string | "new" }>();

  const [image, setImage] = useState<File>();

  const { data: dataGetVacation, isLoading: loadingGet } = useQuery({
    queryFn: ({ signal }) =>
      getData<VacationApiProps>({
        url: "vacation",
        id: parseInt(id, 10),
        signal,
      }),
    queryKey: ["vacation-get", id],
    enabled: id !== "new",
  });

  const { mutateAsync: mutatePost, isPending: loadingPost } = useMutation({
    mutationFn: async (val: PostData<VacationApiProps>) =>
      postData<VacationApiProps, VacationApiProps>(val),
    mutationKey: ["vacation-post"],
  });

  const { mutateAsync: mutatePut, isPending: loadingPut } = useMutation({
    mutationFn: (val: PutData<VacationApiProps>) =>
      putData<VacationApiProps, VacationApiProps>(val),
    mutationKey: ["vacation-put"],
  });

  const { handleSubmit, setValue, control, reset, watch } = useForm<
    FormVacationProps,
    "vacations"
  >();

  const onSubmit = async (data: FormVacationProps) => {
    // if (id === "new")
    //   mutatePost({
    //     url: "/vacation",
    //     data: data,
    //   })
    //     .then(() => {
    //       toast.success("Vacation registered successfully");
    //       reset();
    //     })
    //     .catch((error: any) => {
    //       toastErrorsApi(error);
    //     });
    // else
    //   mutatePut({
    //     url: "/vacation",
    //     data: data,
    //     id: parseInt(id, 10),
    //   })
    //     .then((dataVacation) => {
    //       toast.success("Vacation updated successfully");
    //     })
    //     .catch((err) => {
    //       toastErrorsApi(err);
    //     });
  };

  const { data: dataGetUser, isLoading: loadingGetUser } = useQuery({
    queryKey: ["user-get"],
    queryFn: ({ signal }) =>
      getData<UserApiProps[]>({
        url: "/user",
        signal,
      }),
  });

  const { data: dataGetCity, isLoading: loadingGetCity } = useQuery({
    queryKey: ["city-get"],
    queryFn: ({ signal }) =>
      getCities({
        signal,
      }),
  });

  const loading = loadingGet || loadingPost || loadingPut;

  useEffect(() => {
    if (dataGetVacation && id !== "new") {
      setValue("title", dataGetVacation.title);
      setValue("description", dataGetVacation.description);
      // setValue("dates", dataGetVacation.dates);
    }
  }, [dataGetVacation, id, setValue]);

  return (
    <form
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      className='flex w-full flex-col gap-4'
      id='formVacation'
    >
      <Controller
        name='title'
        control={control}
        defaultValue=''
        rules={{ required: "Field is required" }}
        render={({ field, fieldState: { error } }) => (
          <Skeleton isLoaded={!loading}>
            <Input
              label='Title'
              type='text'
              id={field.name}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              variant='bordered'
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
          name='userIds'
          control={control}
          rules={{ required: "Field is required" }}
          render={({ field, fieldState: { error } }) => (
            <Skeleton className='rounded-md' isLoaded={!loading}>
              <Select
                label='Participants'
                id={field.name}
                onSelectionChange={(value) => field.onChange(Array.from(value))}
                name={field.name}
                selectedKeys={
                  Array.isArray(field.value) ? new Set(field.value) : new Set()
                }
                variant='bordered'
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
                selectionMode='multiple'
                isMultiline={(field.value?.length ?? 0) > 0}
                renderValue={(items) => {
                  return (
                    <div className='flex flex-wrap gap-2'>
                      {items.map((item) => (
                        <div key={item.key}>
                          <Chip
                            isCloseable
                            onClose={() => {
                              setValue(
                                field.name,
                                field.value?.filter(
                                  (a) => a !== item.key?.toString()
                                )
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
                              <span className='ml-2'>{item?.data?.name}</span>
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
                    className='capitalize'
                    textValue={String(item.name)}
                  >
                    <div className='flex flex-col gap-2'>
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
          name='dates'
          control={control}
          rules={{ required: "Field is required" }}
          render={({ field, fieldState: { error } }) => (
            <DateRangePicker
              label='Dates'
              variant='bordered'
              isRequired
              id={field.name}
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!error}
              errorMessage={error?.message}
            />
          )}
        />
      </Row>
      <Row>
        <Controller
          name='location'
          control={control}
          defaultValue=''
          render={({ field, fieldState: { error } }) => (
            <Skeleton isLoaded={!loading}>
              <Autocomplete
                label='Location'
                type='text'
                id={field.name}
                name={field.name}
                onChange={field.onChange}
                value={field.value}
                variant='bordered'
                items={dataGetCity?.data ?? []}
                isInvalid={!!error}
                errorMessage={error?.message}
                disabled={loading}
              >
                {(item) => (
                  <AutocompleteItem key={item.id} value={item.id}>
                    {item.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </Skeleton>
          )}
        />
        <label
          className={cn(
            "relative px-3 w-full flex-row shadow-sm outline-none tap-highlight-transparent",
            "border-medium border-default-200 hover:border-default-400 rounded-medium",
            "items-center gap-0 transition-colors motion-reduce:transition-none",
            "h-14 min-h-14 py-2 flex justify-between cursor-pointer",
            "data-[open=true]:border-default-foreground data-[focus=true]:border-default-foreground"
          )}
        >
          <span>Photo</span>
          <input
            type='file'
            className='hidden'
            accept='image/*'
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
          />
          <FaUpload className='text-xl' />
        </label>
      </Row>
      <Controller
        name='description'
        control={control}
        defaultValue=''
        render={({ field, fieldState: { error } }) => (
          <Skeleton isLoaded={!loading}>
            <Textarea
              label='Description'
              id={field.name}
              name={field.name}
              onChange={field.onChange}
              value={field.value}
              variant='bordered'
              isInvalid={!!error}
              errorMessage={error?.message}
              disabled={loading}
            />
          </Skeleton>
        )}
      />
    </form>
  );
};

export default VacationEdit;
