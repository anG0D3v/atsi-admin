import React, { forwardRef, memo, type ChangeEvent } from 'react';
import { Input } from 'antd';
import clsx from 'clsx';
import { CustomLabel } from '..';

interface ICustomTextAreaProps {
  type?: string;
  name?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  size?: 'large' | 'small';
  prefix?: any;
  label?: string;
  error?: string;
  classes?: string;
  labelClass?: string;
  value?: string | undefined;
}

// Define a type for the ref that is compatible with forwardRef
type InputRef = React.RefAttributes<typeof Input> | any;

const CustomTextArea = forwardRef<InputRef, ICustomTextAreaProps>(
  ({ ...props }, ref) => {
    return (
      <div className="w-full">
        {props.label && (
          <CustomLabel
            children={props.label}
            classes={clsx(props.labelClass, 'font-semibold mb-2')}
            variant="text"
          />
        )}
        <Input.TextArea
          name={props.name}
          onChange={props.onChange}
          rows={8}
          placeholder={props.placeholder}
          value={props.value}
        />
        {props.error && <p className="text-red-500">{props.error}</p>}
      </div>
    );
  },
);

CustomTextArea.displayName = 'TextArea';

export default memo(CustomTextArea);
