'use client';
import React from 'react';
import Image from 'next/image';

interface ICustomNextImage {
  url: string;
  width: number | 100;
  height: number | 100;
}

export default function CustomNextImage(props: ICustomNextImage) {
  return (
    <Image
      loading="lazy"
      placeholder="empty"
      src={props.url}
      alt="Image"
      width={props.width}
      height={props.height}
    />
  );
}
