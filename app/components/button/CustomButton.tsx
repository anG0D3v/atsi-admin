'use client';
import React from 'react';
import { Button } from 'antd';
import clsx from 'clsx';

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  addedClass?: any;
  buttonType?: 'primary' | 'dashed' | 'default' | 'link' | 'text';
  htmlType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

function CustomButton({
  children,
  onClick,
  addedClass,
  buttonType = 'primary',
  htmlType = 'button',
  loading = false,
}: BtnProps) {
  return (
    <Button
      loading={loading}
      htmlType={htmlType}
      type={buttonType}
      onClick={onClick}
      className={clsx(addedClass)}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
