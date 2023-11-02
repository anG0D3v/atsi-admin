'use client';
import { ColorRing } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center min-h-full">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </div>
  );
}
