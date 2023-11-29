import React from 'react';
import { Select, type SelectProps } from 'antd';
import clsx from 'clsx';
import CustomLabel from '../label/CustomLabel';

interface ICustomSelectProps {
  items: any[];
  status?: SelectProps['status'];
  errorText?: string;
  onChange?: () => void;
  mode?: SelectProps['mode'];
  allowClear?: boolean;
  className?: string;
  renderText: string;
  renderValue: string;
  renderKey: string;
  placeholder?: string;
  value?: string;
  disabledKey?: any[];
  label?: string;
  labelclasses?: string;
}

function CustomSelect(props: ICustomSelectProps) {
  const { Option } = Select;
  return (
    <div className="w-full">
      {props.label && (
        <CustomLabel
          children={props.label}
          classes={clsx(props.labelclasses, 'font-semibold mb-2')}
          variant="text"
        />
      )}
      <Select
        value={props.value}
        placeholder={props.placeholder}
        status={props.status}
        onChange={props.onChange}
        mode={props.mode}
        allowClear={props.allowClear}
        className={props.className}
        // filterOption={(input, option) =>
        //   option.children.toLowerCase().includes(input.toLowerCase())
        // }
      >
        {props.items.map((item) => (
          <Option value={item[props.renderValue]} key={item[props.renderKey]}>
            {item[props.renderText]}
          </Option>
        ))}
      </Select>
      {!!props.errorText && (
        <CustomLabel
          children={props.errorText}
          variant="text"
          classes="text-red-600"
        />
      )}
    </div>
  );
}

export default CustomSelect;
