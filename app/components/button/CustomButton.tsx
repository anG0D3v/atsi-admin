'use client';
import React from 'react';
import { Button } from 'antd';
import { type ButtonType } from 'antd/es/button';
import clsx from 'clsx';

interface IBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  classes?: any;
  type?: ButtonType;
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  size?: 'large' | 'small';
  icon?: React.ReactNode;
  danger?: boolean;
  block?: boolean;
}

function CustomButton(props: IBtnProps) {
  return (
    <Button
      {...props}
      block={props.block}
      danger={props.danger}
      size={props.size}
      icon={props.icon}
      loading={props.loading}
      htmlType={props.htmlType}
      type={props.type}
      onClick={props.onClick}
      className={clsx(
        props.classes,
        props.type === 'primary'
          ? 'bg-blue-600 p-5 flex items-center justify-center'
          : '',
      )}
    >
      {props.children}
    </Button>
  );
}

export default CustomButton;
