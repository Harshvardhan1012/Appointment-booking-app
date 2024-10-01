"use client"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Control, ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import PhoneInput from 'react-phone-number-input'
import { RadioGroup } from "./radio-group";
import RadioButton from "./RadioButton";
import { Calendar as CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./button";
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Doctors } from './../../app/constants/index'
import { FileUploader } from "./FileUploader";
import { useState } from "react";
// import loading from "@/app/loading";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
  PASSWORD = "password"
}


interface CustomProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = <T extends FieldValues>({ field, props }: { field: ControllerRenderProps<T>; props: CustomProps<T> }) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled = field.value === '' || field.value === undefined || field.disabled

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 w-full">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-3"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 text-white bg-black"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            value={field.value}
            placeholder={props.placeholder}
            onChange={field.onChange}
            defaultCountry="IN"
            international
            className="input-phone drop-shadow-sm text-cyan-800"
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <RadioGroup defaultValue="Male" className="grid grid-cols-3 text-white gap-5" onValueChange={field.onChange} value={field.value}>
            <RadioButton value="Male" />
            <RadioButton value="Female" />
            <RadioButton value="Other" />
          </RadioGroup>
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 w-full text-white shad-input">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-transparent h-full",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 ml-[-3px] " />
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                className="text-white bg-gray-500 border-inherit"
                mode="single"
                selected={field.value ?? new Date()}
                onSelect={d => field.onChange(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

        </div>
      )

    case FormFieldType.SELECT:
      return (
        <div className="flex rounded-md bg-dark-400 w-full text-white shad-input h-full">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="text-white shad-select-content">
              {
                Doctors.map((doctor) => (

                  <SelectItem value={doctor.name} key={doctor.name} >
                    <div className="flex justify-center items-center gap-3">
                      <Image src={doctor.image} alt={doctor.name} height={34} width={34} />
                      <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>

        </div>
      )
    case FormFieldType.SKELETON:
      return (

        <FormControl>
          <FileUploader files={field.value} onChange={field.onChange} />
        </FormControl>

      )
    case FormFieldType.PASSWORD:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 w-full">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={20}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-3"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type={showPassword?FormFieldType.PASSWORD:FormFieldType.INPUT}
              {...field}
              className="shad-input border-0 text-white bg-black"
            />
          </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-full hover:bg-transparent bg-inherit text-white pt-3 flex justify-center items-center"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
            >
              {showPassword && !disabled ? (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
        </div>
      );
  }
};

const CustomFormField = <T extends FieldValues>(props: CustomProps<T>) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {/* {props.fieldType !== FormFieldType.CHECKBOX && label && ( */}
          <FormLabel className="shad-input-label">{label}</FormLabel>
          {/* )} */}
          <RenderInput field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
