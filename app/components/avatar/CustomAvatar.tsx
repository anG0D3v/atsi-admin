import React from 'react';
import { Avatar } from 'antd';
import type { AvatarSize } from 'antd/es/avatar/AvatarContext';
import clsx from 'clsx';

interface IAvatarProps {
  size?: AvatarSize;
  url?: string;
  icon?: React.ReactNode;
  alt: string;
  children?: any;
  classes?: any;
  shape?:'circle' | 'square';
}

export default function CustomAvatar(props: IAvatarProps) {
  return (
    <Avatar
      className={clsx(props.classes)}
      size={props.size}
      src={props.url}
      srcSet={props.url}
      icon={props.icon}
      shape={props.shape}
      alt={props.alt}
      {...props}
    />
  );
}
