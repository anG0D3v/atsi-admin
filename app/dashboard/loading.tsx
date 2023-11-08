'use client';
import { ColorRing } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div className="flex flex-1 justify-center items-center h-[80vh]">
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
