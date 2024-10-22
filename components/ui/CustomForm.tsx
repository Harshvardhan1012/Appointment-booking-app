'use client';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import PhoneInput from 'react-phone-number-input';
import { RadioGroup } from './radio-group';
import RadioButton from './RadioButton';
import {
  Calendar as CalendarIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircle,
} from 'lucide-react';
import { Calendar } from './calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './button';
import { format, set } from 'date-fns';
import { cn } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { FormHTMLAttributes, useEffect, useState } from 'react';
import { userAdmin } from '@/lib/action/admin.action';
import { date } from 'zod';
import { PopoverClose } from '@radix-ui/react-popover';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
  PASSWORD = 'password',
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
  readonly?: boolean;
}

const RenderInput = <T extends FieldValues>({
  field,
  props,
}: {
  field: ControllerRenderProps<T>;
  props: CustomProps<T>;
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [admin, setAdmin] = useState<{ id: string; name: string }[]>([]);
  const [calenderOpen, setOpenCalender] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdminUser = async () => {
      setLoading(true);
      const adminUser = await userAdmin();
      if (adminUser && adminUser != null)
        setAdmin(
          adminUser.map((user) => ({ id: user.id, name: user.name as string }))
        );
      setLoading(false);
    };
    fetchAdminUser();
  }, []);
  const disabled =
    field.value === '' || field.value === undefined || field.disabled;

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 w-full">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || 'icon'}
              className="ml-3"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              readOnly={props.readonly}
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
          <RadioGroup
            defaultValue="Male"
            className="grid grid-cols-3 text-white gap-5"
            onValueChange={field.onChange}
            value={field.value}
          >
            <RadioButton value="Male" />
            <RadioButton value="Female" />
            <RadioButton value="Other" />
          </RadioGroup>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500  w-full text-white shad-input">
          <Popover open={calenderOpen} onOpenChange={setOpenCalender}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal border-transparent h-full',
                  !field.value && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 ml-[-3px] " />
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 flex justify-start items-start ml-6"
              align="start"
            >
              <Calendar
                className="text-white bg-dark-300"
                mode="single"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpenCalender(false);
                }}
                disabled={(date) =>
                  date < new Date() || date < new Date('1900-01-01')
                }
                selected={field.value ?? new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case FormFieldType.SELECT:
      return (
        <div className="flex rounded-md bg-dark-400 w-full text-white shad-input h-full">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="text-white shad-select-content">
              {loading && (
                // Show a loading bar or spinner when admin is empty
                <div role="status" className="text-center">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {admin.map((doctor) => (
                <SelectItem value={doctor.id} key={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case FormFieldType.SKELETON:
      return (
        <FormControl>
          <FileUploader files={field.value} onChange={field.onChange} />
        </FormControl>
      );
    case FormFieldType.PASSWORD:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400 w-full">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={20}
              width={24}
              alt={props.iconAlt || 'icon'}
              className="ml-3"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type={showPassword ? FormFieldType.PASSWORD : FormFieldType.INPUT}
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
            <span className="sr-only">
              {showPassword ? 'Hide password' : 'Show password'}
            </span>
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
