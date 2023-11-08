'use client';
import React from 'react';
import { Tag } from 'antd';
import {
  type PresetColorType,
  type PresetStatusColorType,
} from 'antd/es/_util/colors';
import { type LiteralUnion } from 'antd/es/_util/type';

interface ICustomTag {
  children: React.ReactNode;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>;
  icon?: React.ReactNode;
  bordered?: boolean;
}

export default function CustomTag(props: ICustomTag) {
  return (
    <Tag color={props.color} icon={props.icon} bordered={props.bordered}>
      {props.children}
    </Tag>
  );
}
