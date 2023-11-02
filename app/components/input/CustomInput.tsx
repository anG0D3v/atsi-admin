import React, { forwardRef, memo, type ChangeEvent } from 'react';
import { Input } from 'antd';
import clsx from 'clsx';
import { CustomLabel } from '..';

interface CustomInputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: 'large' | 'small';
  prefix?: any;
  label?: string;
  error?: string;
  addedClass?: string;
  labelClass?: string;
  value?: string | undefined;
}

// Define a type for the ref that is compatible with forwardRef
type InputRef = React.RefAttributes<typeof Input> | any;

const CustomInput = forwardRef<InputRef, CustomInputProps>(
  ({ ...props }, ref) => {
    return (
      <div className="w-full">
        {props.label && (
          <CustomLabel
            children={props.label}
            addedClass={clsx(props.labelClass, 'font-semibold')}
            variant="text"
          />
        )}
        {props.type !== 'password' ? (
          <Input
            {...props}
            ref={ref}
            className={clsx(props.addedClass)}
            prefix={props.prefix}
            onChange={props.onChange}
            name={props.name}
            value={props.value}
          />
        ) : (
          <Input.Password
            {...props}
            ref={ref}
            className={clsx(props.addedClass)}
            prefix={props.prefix}
            onChange={props.onChange}
            name={props.name}
            value={props.value}
          />
        )}
        {props.error && <p className="text-red-500">{props.error}</p>}
      </div>
    );
  },
);

CustomInput.displayName = 'Input';

export default memo(CustomInput);
