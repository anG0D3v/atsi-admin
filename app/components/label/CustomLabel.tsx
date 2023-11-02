import React from 'react';
import { Typography } from 'antd';
import clsx from 'clsx';

interface labelProps {
  children: React.ReactNode;
  variant: 'text' | 'title';
  titleLevel?: 1 | 2 | 3 | 4 | 5;
  disabled?: boolean;
  textType?: 'secondary' | 'success' | 'warning' | 'danger';
  addedClass?: string;
}

const { Title, Text } = Typography;
export default function CustomLabel({
  children,
  variant = 'text',
  titleLevel,
  disabled,
  textType,
  addedClass,
}: labelProps) {
  return variant === 'text' ? (
    <Text className={clsx(addedClass)} type={textType}>
      {children}
    </Text>
  ) : (
    <Title level={titleLevel} className={clsx(addedClass)} disabled={disabled}>
      {children}
    </Title>
  );
}
