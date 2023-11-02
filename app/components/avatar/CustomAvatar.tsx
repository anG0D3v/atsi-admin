import React from 'react';
import { Avatar } from 'antd';
import type { AvatarSize } from 'antd/es/avatar/AvatarContext';

interface IAvatarProps {
  size?: AvatarSize;
  url?: string;
  icon?: React.ReactNode;
  alt: string;
  children?: any;
}

export default function CustomAvatar(props: IAvatarProps) {
  return (
    <Avatar
      size={props.size}
      src={props.url}
      icon={props.icon}
      alt={props.alt}
      {...props}
    >
      {props.children}
    </Avatar>
  );
}
